import { WebSocket } from "ws";

type ActivityType = 0 | 1 | 2 | 3 | 4 | 5;

export type PresenceActivity = {
  id: string;
  name: string;
  type: ActivityType;
  state?: string;
  details?: string;
  application_id?: string;
  timestamps?: { start?: number; end?: number };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
  buttons?: string[];
  url?: string;
};

export type PresenceData = {
  discord_user: {
    id: string;
    username: string;
    global_name?: string;
    avatar?: string | null;
  };
  discord_status: "online" | "idle" | "dnd" | "offline";
  activities: PresenceActivity[];
  activity_images?: { large_image?: string; small_image?: string };
};

type GatewayPayload = { op: number; d?: unknown; s?: number; t?: string };

type ReadyData = {
  guilds: { id: string }[];
};

type GuildCreateData = {
  id: string;
  presences?: Array<{
    user?: {
      id: string;
      username: string;
      global_name?: string;
      avatar?: string | null;
    };
    status: "online" | "idle" | "dnd" | "offline";
    activities?: PresenceActivity[];
  }>;
};

type GuildMembersChunkData = {
  members: Array<{
    user: {
      id: string;
      username: string;
      global_name?: string;
      avatar?: string | null;
    };
    presence?: {
      status: "online" | "idle" | "dnd" | "offline";
      activities?: PresenceActivity[];
    };
  }>;
};

type PresenceUpdateData = {
  user: {
    id: string;
    username: string;
    global_name?: string;
    avatar?: string | null;
  };
  status: "online" | "idle" | "dnd" | "offline";
  activities?: PresenceActivity[];
};

type HelloData = {
  heartbeat_interval: number;
};

function isHelloData(data: unknown): data is HelloData {
  return (
    typeof data === "object" &&
    data !== null &&
    "heartbeat_interval" in data &&
    typeof (data as Record<string, unknown>).heartbeat_interval === "number"
  );
}

function isReadyData(data: unknown): data is ReadyData {
  return (
    typeof data === "object" &&
    data !== null &&
    "guilds" in data &&
    Array.isArray((data as Record<string, unknown>).guilds)
  );
}

function isGuildCreateData(data: unknown): data is GuildCreateData {
  return (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    typeof (data as Record<string, unknown>).id === "string"
  );
}

function isUserUpdateData(data: unknown): data is {
  user: {
    id: string;
    username: string;
    global_name?: string;
    avatar?: string | null;
  };
} {
  return (
    typeof data === "object" &&
    data !== null &&
    "user" in data &&
    typeof (data as Record<string, unknown>).user === "object" &&
    (data as Record<string, unknown>).user !== null &&
    "id" in (data as { user: Record<string, unknown> }).user &&
    typeof (data as { user: Record<string, unknown> }).user.id === "string" &&
    "username" in (data as { user: Record<string, unknown> }).user &&
    typeof (data as { user: Record<string, unknown> }).user.username === "string"
  );
}

function isGuildMembersChunkData(data: unknown): data is GuildMembersChunkData {
  return (
    typeof data === "object" &&
    data !== null &&
    "members" in data &&
    Array.isArray((data as Record<string, unknown>).members)
  );
}

function isPresenceUpdateData(data: unknown): data is PresenceUpdateData {
  return (
    typeof data === "object" &&
    data !== null &&
    "user" in data &&
    "status" in data
  );
}

export class PresenceHub {
  private ws: WebSocket | null = null;
  private heartbeat: NodeJS.Timeout | null = null;
  private sequence: number | null = null;
  private listeners: Set<(p: PresenceData) => void> = new Set();
  private cache: Map<string, PresenceData> = new Map();
  private connecting = false;
  private guildIds: Set<string> = new Set();

  start() {
    if (this.ws || this.connecting) return;
    const token = process.env.botToken;
    if (!token) {
      console.error("[presenceHub] Missing botToken in environment variables");
      return;
    }

    this.connecting = true;
    const url = "wss://gateway.discord.gg/?v=9&encoding=json";
    this.ws = new WebSocket(url);

    this.ws.on("open", () => {
      this.connecting = false;
      console.log("[presenceHub] Connected to Discord gateway");
    });

    this.ws.on("message", (data: WebSocket.Data) => {
      const payload = JSON.parse(data.toString()) as GatewayPayload;
      if (payload.s) this.sequence = payload.s;

      switch (payload.op) {
        case 10: {
          if (!isHelloData(payload.d)) return;
          const interval = payload.d.heartbeat_interval;
          if (this.heartbeat) clearInterval(this.heartbeat);
          this.heartbeat = setInterval(() => {
            this.send({ op: 1, d: this.sequence });
          }, interval);

          this.send({
            op: 2,
            d: {
              token,
              properties: {
                os: "linux",
                browser: "chrome",
                device: "",
              },
              compress: false,
              intents: (1 << 0) | (1 << 8),
            },
          });
          break;
        }

        case 0: {
          switch (payload.t) {
            case "READY": {
              if (!isReadyData(payload.d)) return;
              const guilds = payload.d.guilds;
              for (const g of guilds) {
                this.guildIds.add(g.id);
                this.send({
                  op: 8,
                  d: { guild_id: g.id, query: "", limit: 0, presences: true },
                });
              }
              break;
            }

            case "GUILD_CREATE": {
              if (!isGuildCreateData(payload.d)) return;
              const g = payload.d;
              if (Array.isArray(g.presences)) {
                for (const pr of g.presences) {
                  const user = pr.user;
                  if (!user) continue;
                  const p: PresenceData = {
                    discord_user: {
                      id: user.id,
                      username: user.username,
                      global_name: user.global_name,
                      avatar: user.avatar,
                    },
                    discord_status: pr.status,
                    activities: pr.activities ?? [],
                  };

                  if (pr.activities) {
                    const activityImages = pr.activities.map((activity) => ({
                      large_image: activity.assets?.large_image,
                      small_image: activity.assets?.small_image,
                    }));
                    p.activity_images = activityImages[0];
                  }

                  this.cache.set(user.id, p);
                  this.listeners.forEach((fn) => fn(p));
                }
              }

              this.send({
                op: 8,
                d: { guild_id: g.id, query: "", limit: 0, presences: true },
              });
              break;
            }

            case "USER_UPDATE": {
              if (!isUserUpdateData(payload.d)) return;
              const user = payload.d.user;
              const p: PresenceData = {
                discord_status: this.cache.get(user.id)?.discord_status ?? "offline",
                activities: this.cache.get(user.id)?.activities ?? [],
                discord_user: {
                  id: user.id,
                  username: user.username,
                  global_name: user.global_name,
                  avatar: user.avatar,
                },
              };
              this.cache.set(user.id, p);
              this.listeners.forEach((fn) => fn(p));
              break;
            }

            case "GUILD_MEMBERS_CHUNK": {
              if (!isGuildMembersChunkData(payload.d)) return;
              const members = payload.d.members;
              for (const m of members) {
                const user = m.user;
                const presence = m.presence;
                if (!user || !presence) continue;
                const p: PresenceData = {
                  discord_user: {
                    id: user.id,
                    username: user.username,
                    global_name: user.global_name,
                    avatar: user.avatar,
                  },
                  discord_status: presence.status,
                  activities: presence.activities ?? [],
                };

                if (presence.activities) {
                  const activityImages = presence.activities.map(
                    (activity) => ({
                      large_image: activity.assets?.large_image,
                      small_image: activity.assets?.small_image,
                    }),
                  );
                  p.activity_images = activityImages[0];
                }

                this.cache.set(user.id, p);
                this.listeners.forEach((fn) => fn(p));
              }
              break;
            }

            case "PRESENCE_UPDATE": {
              if (!isPresenceUpdateData(payload.d)) return;
              const d = payload.d;
              const user = d.user;
              const p: PresenceData = {
                discord_user: {
                  id: user.id,
                  username: user.username,
                  global_name: user.global_name,
                  avatar: user.avatar,
                },
                discord_status: d.status,
                activities: d.activities ?? [],
              };

              if (d.activities) {
                const activityImages = d.activities.map((activity) => ({
                  large_image: activity.assets?.large_image,
                  small_image: activity.assets?.small_image,
                }));
                p.activity_images = activityImages[0];
              }

              this.cache.set(user.id, p);
              this.listeners.forEach((fn) => fn(p));
              break;
            }

            default:
              break;
          }
          break;
        }

        default:
          break;
      }
    });

    this.ws.on("close", () => {
      if (this.heartbeat) clearInterval(this.heartbeat);
      this.ws = null;
      this.sequence = null;
      setTimeout(() => this.start(), 2000);
    });

    this.ws.on("error", (err: Error) => {
      console.error("[presenceHub] WebSocket error:", err);
    });
  }

  private send(payload: GatewayPayload) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    }
  }

  onPresence(listener: (p: PresenceData) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getSnapshot(ids: string[]) {
    return ids
      .map((id) => this.cache.get(id))
      .filter(Boolean) as PresenceData[];
  }

  requestPresencesFor(userIds: string[]) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    for (const gid of this.guildIds) {
      this.send({
        op: 8,
        d: { guild_id: gid, user_ids: userIds, presences: true },
      });
    }
  }
}

export const presenceHub = new PresenceHub();
presenceHub.start();
