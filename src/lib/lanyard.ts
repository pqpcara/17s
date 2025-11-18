"use client";

export type LanyardActivity = {
  url: string;
  buttons?: string[];
  timestamps?: {
    start?: number;
    end?: number;
  }
  id: string;
  name: string;
  type: number;
  state?: string;
  details?: string;
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
  application_id?: string;
};

export type LanyardPresence = {
  discord_user: {
    id: string;
    username: string;
    global_name?: string;
    avatar?: string | null;
    avatar_decoration_data?: { asset?: string | null } | null;
  };
  discord_status: "online" | "idle" | "dnd" | "offline";
  listening_to_spotify: boolean;
  spotify?: {
    song: string;
    artist: string;
    album_art_url: string;
  };
  activities: LanyardActivity[];
};

type Message = { op: number; t?: string; d?: unknown };

type Listener = (presence: LanyardPresence) => void;

class LanyardClient {
  private ws: WebSocket | null = null;
  private heartbeat: number | null = null;
  private subscribedIds = new Set<string>();
  private listeners = new Set<Listener>();

  subscribe(ids: string[], listener: Listener) {
    ids.forEach((id) => this.subscribedIds.add(id));
    this.listeners.add(listener);
    this.ensureConnected();
    this.sendSubscribe();

    return () => {
      this.listeners.delete(listener);
      ids.forEach((id) => this.subscribedIds.delete(id));
      this.sendUnsubscribe(ids);
      if (!this.listeners.size) this.teardown();
    };
  }

  private ensureConnected() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) return;

    this.ws = new WebSocket("wss://lanyard.cnrad.dev/socket");

    this.ws.onopen = () => {
      this.sendSubscribe();
    };

    this.ws.onmessage = (ev) => {
      const msg: Message = JSON.parse(ev.data);

      if (msg.op === 1 && msg.d && typeof msg.d === "object" && "heartbeat_interval" in msg.d) {
        const data = msg.d as { heartbeat_interval: number };
        const interval = data.heartbeat_interval ?? 30000;

        if (this.heartbeat) window.clearInterval(this.heartbeat);

        this.heartbeat = window.setInterval(() => {
          this.ws?.send(JSON.stringify({ op: 3 }));
        }, interval);

        this.sendSubscribe();
        return;
      }

      if (msg.t === "INIT_STATE" && msg.d && typeof msg.d === "object") {
        const records = msg.d as Record<string, LanyardPresence>;
        Object.values(records).forEach((p) => this.emit(p));
        return;
      }

      if (msg.t === "PRESENCE_UPDATE" && msg.d && typeof msg.d === "object") {
        this.emit(msg.d as LanyardPresence);
        return;
      }
    };

    this.ws.onclose = () => {
      if (this.heartbeat) window.clearInterval(this.heartbeat);
      this.heartbeat = null;
      setTimeout(() => this.ensureConnected(), 1000);
    };
  }

  private emit(p: LanyardPresence) {
    if (!this.subscribedIds.has(p.discord_user.id)) return;
    this.listeners.forEach((l) => l(p));
  }

  private sendSubscribe() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    if (!this.subscribedIds.size) return;
    this.ws.send(
      JSON.stringify({ op: 2, d: { subscribe_to_ids: Array.from(this.subscribedIds) } })
    );
  }

  private sendUnsubscribe(ids: string[]) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    if (!ids.length) return;
    this.ws.send(JSON.stringify({ op: 4, d: { unsubscribe_from_ids: ids } }));
  }

  private teardown() {
    if (this.heartbeat) window.clearInterval(this.heartbeat);
    this.heartbeat = null;
    if (this.ws) this.ws.close();
    this.ws = null;
  }
}

const singleton = new LanyardClient();

export function subscribeLanyard(ids: string[], onPresence: (presence: LanyardPresence) => void) {
  return singleton.subscribe(ids, onPresence);
}
