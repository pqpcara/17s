"use client";

import type { LanyardActivity, LanyardPresence } from "@/lib/lanyard";

export type ActivityType = 0 | 1 | 2 | 3 | 4 | 5;

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

export type AvatarDecorationData = {
  asset?: string | null;
  sku_id?: string;
  expires_at?: string | null;
};

export type PresenceData = {
  discord_user: {
    id: string;
    username: string;
    global_name?: string;
    avatar?: string | null;
    avatar_decoration_data?: AvatarDecorationData | null;
  };
  discord_status: "online" | "idle" | "dnd" | "offline";
  activities: PresenceActivity[];
  listening_to_spotify: boolean;
  spotify?: { song: string; artist: string; album_art_url: string };
};

export function subscribePresence(
  ids: string[],
  onPresence: (presence: PresenceData) => void,
) {
  let es: EventSource | null = null;
  let closed = false;
  let retry = 0;

  const open = () => {
    if (closed) return;
    if (es) es.close();
    es = new EventSource(
      `/api/presence/stream?ids=${encodeURIComponent(ids.join(","))}`,
    );
    es.addEventListener("snapshot", (e) => {
      const list = JSON.parse((e as MessageEvent).data) as PresenceData[];
      list.forEach(onPresence);
    });
    es.addEventListener("update", (e) => {
      const p = JSON.parse((e as MessageEvent).data) as PresenceData;
      onPresence(p);
    });
    es.addEventListener("error", () => {
      if (closed) return;
      retry = Math.min(retry + 1, 6);
      const delayMs = 300 * Math.pow(2, retry);
      setTimeout(() => open(), delayMs);
    });
  };
  open();

  let stopLanyard: (() => void) | null = null;
  const lastSerializedByUser = new Map<string, string>();
  try {
    import("@/lib/lanyard").then(({ subscribeLanyard }) => {
      stopLanyard = subscribeLanyard(ids, (lp) => {
        const mapped = mapLanyardPresenceToPresenceData(lp);
        const key = mapped.discord_user.id;
        const ser = JSON.stringify({
          s: mapped.discord_status,
          a: mapped.activities,
        });
        if (lastSerializedByUser.get(key) === ser) return;
        lastSerializedByUser.set(key, ser);
        onPresence(mapped);
      });
    });
  } catch {}

  return () => {
    closed = true;
    if (es) es.close();
    if (stopLanyard) stopLanyard();
  };
}

function mapLanyardPresenceToPresenceData(lp: LanyardPresence): PresenceData {
  return {
    discord_user: {
      id: lp.discord_user.id,
      username: lp.discord_user.username,
      global_name: lp.discord_user.global_name,
      avatar: lp.discord_user.avatar ?? null,
      avatar_decoration_data: lp.discord_user.avatar_decoration_data ?? null,
    },
    discord_status: lp.discord_status,
    activities: (lp.activities || []).map((a: LanyardActivity) => ({
      id: String(a.id ?? `${a.name}-${a.type}`),
      name: a.name,
      type: a.type as ActivityType,
      state: a.state,
      details: a.details,
      application_id: a.application_id,
      timestamps: a.timestamps,
      assets: a.assets,
      buttons: a.buttons,
      url: a.url,
    })),
    listening_to_spotify: Boolean(lp.listening_to_spotify),
    spotify: lp.spotify
      ? {
          song: lp.spotify.song,
          artist: lp.spotify.artist,
          album_art_url: lp.spotify.album_art_url,
        }
      : undefined,
  };
}

export function getActivityIcon(a: PresenceActivity): string {
  switch (a.type) {
    case 2:
      return "🎧";
    case 1:
      return "📺";
    case 3:
      return "👀";
    case 4:
      return "💬";
    default:
      return "🎮";
  }
}
