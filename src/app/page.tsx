"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import ProfileCard, { type DiscordProfile } from "@/components/ProfileCard";
import { subscribePresence, type PresenceData } from "@/lib/presence";
import Image from "next/image";

const connectionIconMap: Record<string, string> = {
  roblox:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Roblox_Corporation_2025_logo.svg/2048px-Roblox_Corporation_2025_logo.svg.png",
  steam:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/2048px-Steam_icon_logo.svg.png",
  spotify:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/512px-Spotify_icon.svg.png?20220821125323",
  youtube:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/512px-YouTube_full-color_icon_%282017%29.svg.png?20240107144800",
  twitch: "https://www.vectorlogo.zone/logos/twitch/twitch-tile.svg",
  github:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScfGAZaK1UapejlsFxp9IHSRn5zA5F5fC76biETiGI7bJvI06XdqRKc7wup8lMzSRvzJg&usqp=CAU",
  instagram:
    "https://img.freepik.com/vetores-gratis/instagram-logo_1199-122.jpg",
  facebook:
    "https://static.vecteezy.com/ti/vetor-gratis/p1/2000431-facebook-logo-icone-vetorial-gratis-vector.jpg",
  tiktok:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7wIlVFnJuESp4wirO8T5Zv49mjumK15aRNaXdNX-MdxkdttemDucJUOjUdm5lpZEJ9b0&usqp=CAU",
  epicgames:
    "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/i/bde3849f-8b50-46e6-92fa-06b89b73054a/dc46lkq-0901a30c-e2bb-48f6-a907-692da50cd104.png/v1/fill/w_256,h_256,q_80,strp/epic_games_launcher___token_icon_light_by_flexo013_dc46lkq-fullview.jpg",
  xbox: "https://cms-assets.xboxservices.com/assets/be/ba/bebae3aa-b1d4-4574-bda7-e29e0da79acc.jpg?n=Xbox-on-TVs_Sharing_200x200.jpg",
  playstation:
    "https://i.pinimg.com/736x/28/68/9a/28689a40d979ebb1d751814d4ce6a0e1.jpg",
  x: "https://abs.twimg.com/favicons/twitter.3.ico",
};

function getConnectionIcon(type: string, icon?: string): string {
  if (icon) return icon;
  return (
    connectionIconMap[type.toLowerCase()] ||
    "https://static.vecteezy.com/system/resources/previews/023/741/147/non_2x/discord-logo-icon-social-media-icon-free-png.png"
  );
}

export default function Home() {
  const ids = useMemo(() => ["1186286786738147419", "1212042152402755585", "1051989185659154442", "1408350346039918634", "1424752743901564938"], []);
  const [entered, setEntered] = useState(false);
  const [profiles, setProfiles] = useState<Record<string, DiscordProfile>>({});
  const [presence, setPresence] = useState<Record<string, PresenceData>>({});
  const [modal, setModal] = useState<{
    activities: PresenceData["activities"];
    connections?: {
      type: string;
      id: string;
      name?: string;
      verified?: boolean;
      icon?: string;
    }[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [volume, setVolume] = useState(35);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const trackMeta = {
    title: "Midnight Slowed",
    subtitle: "17s Spotify",
  };

  const ensureAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/midnight.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = volume / 100;
    }
    return audioRef.current;
  };

  const handleEnter = () => {
    ensureAudio()
      .play()
      .then(() => setMusicEnabled(true))
      .catch(() => setMusicEnabled(false));
    setEntered(true);
  };

  useEffect(() => {
    if (!entered) return;
    const run = async () => {
      try {
        const results = await Promise.all(
          ids.map(async (id) => {
            const res = await fetch(`/api/discord/user/${id}`, {
              headers: { Accept: "application/json" },
            });
            if (res.status === 403) {
              const body = await res.text().catch(() => "");
              const msg = `Discord API 403. Check BOT_TOKEN and required permissions on the server. Response: ${body || res.statusText}`;
              throw new Error(msg);
            }
            if (!res.ok) {
              const body = await res.text().catch(() => "");
              throw new Error(
                `Failed to fetch user ${id}: ${res.status} ${body || res.statusText}`,
              );
            }
            return [id, (await res.json()) as DiscordProfile] as const;
          }),
        );
        setProfiles(Object.fromEntries(results));
      } catch (e: unknown) {
        const message = typeof e === "string" ? e : (e as Error).message;
        setError(message);
        console.error("[page] fetch profiles error:", message);
      }
    };
    run();
  }, [entered, ids]);

  useEffect(() => {
    if (!entered) return;
    const unsubscribe = subscribePresence(ids, (p) => {
      setPresence((prev) => ({ ...prev, [p.discord_user.id]: p }));
    });
    return () => unsubscribe();
  }, [entered, ids]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!entered) return;
    const audio = ensureAudio();
    if (musicEnabled) {
      audio.play().catch(() => setMusicEnabled(false));
    } else {
      audio.pause();
    }
  }, [entered, musicEnabled]);

  useEffect(() => {
    if (!entered) return;
    const audio = ensureAudio();
    audio.volume = volume / 100;
  }, [entered, volume]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#04030c] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-purple-600/25 blur-[140px]" />
        <div className="absolute -right-20 bottom-0 h-[420px] w-[420px] rounded-full bg-indigo-500/20 blur-[180px]" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)",
            backgroundSize: "140px 140px",
          }}
        />
      </div>

      {!entered ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 px-6 backdrop-blur">
          <button
            onClick={handleEnter}
            className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-black text-white text-sm sm:text-base font-medium shadow-lg hover:bg-purple-500 transition"
          >
            Enter
          </button>
        </div>
      ) : null}

      <div
        className={`relative z-10 flex w-full flex-col gap-6 pb-10 pt-8 transition-opacity duration-700 ${entered ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        {entered ? (
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_20px_45px_rgba(0,0,0,0.4)] backdrop-blur">
              <button
                onClick={() => setMusicEnabled((prev) => !prev)}
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-white/20 bg-black/40 text-lg text-white shadow-lg transition hover:scale-105"
                aria-label={musicEnabled ? "Pause music" : "Play music"}
              >
                {musicEnabled ? "⏸" : "▶"}
              </button>
              <div className="min-w-[160px]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">
                  Ambient track
                </p>
                <p className="text-sm font-medium text-white">{trackMeta.title}</p>
                <p className="text-[11px] text-white/60">
                  {musicEnabled ? "Playing" : "Paused"} · {trackMeta.subtitle}
                </p>
              </div>
              <div className="flex flex-1 items-center gap-3">
                <span className="text-[11px] uppercase tracking-wide text-white/60">
                  Volume
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={volume}
                  onChange={(event) => setVolume(Number(event.target.value))}
                  className="flex-1 accent-fuchsia-400"
                  aria-label="Controle de volume"
                />
                <span className="w-10 text-right text-xs font-semibold text-white">
                  {volume}%
                </span>
              </div>
            </div>
          </div>
        ) : null}
        {error ? (
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100 shadow-lg">
              {error}
            </div>
          </div>
        ) : null}

        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-2 xl:grid-cols-4 lg:px-8">
          {ids.map((id) => {
            const p = profiles[id];
            if (!p) {
              return (
                <div
                  key={id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur-xl"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="h-14 w-14 rounded-full bg-white/10 sm:h-[72px] sm:w-[72px]" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-32 rounded bg-white/10 sm:w-40" />
                      <div className="h-3 w-24 rounded bg-white/10 sm:w-28" />
                    </div>
                  </div>
                  <div className="mt-4 h-9 rounded bg-white/5" />
                </div>
              );
            }
            return (
              <ProfileCard
                key={id}
                profile={p}
                presence={presence[id]}
                onOpenModal={(data) => setModal(data)}
              />
            );
          })}
        </div>

        {modal ? (
          <div
            className="fixed inset-0 z-30 flex items-center justify-center bg-black/70 p-4 backdrop-blur"
            onClick={() => setModal(null)}
          >
            <div
              className="w-full max-w-md rounded-2xl border border-white/10 bg-black/80 p-4 sm:p-5 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-semibold text-white">Activities</h3>
                <button
                  className="text-sm text-zinc-300 transition hover:text-white"
                  onClick={() => setModal(null)}
                >
                  Close
                </button>
              </div>
              <div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto">
                {modal.activities.map((a) => (
                  <div
                    key={a.id}
                    className="rounded-xl border border-white/10 bg-white/5 p-3"
                  >
                    <div className="text-sm font-medium text-white">{a.name}</div>
                    <div className="text-[11px] text-zinc-300">
                      {a.details || a.state || "Activity"}
                    </div>
                    {a.assets?.large_image ? (
                      <div className="mt-2 text-[11px] text-zinc-400">
                        {a.assets.large_text}
                      </div>
                    ) : null}
                    {a.buttons?.length ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {a.buttons.map((b, i) => (
                          <span
                            key={i}
                            className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] text-zinc-100"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
                {modal.connections?.length ? (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="mb-2 text-sm font-medium text-white">Connections</div>
                    <div className="space-y-2">
                      {modal.connections.map((c) => (
                        <div key={`${c.type}:${c.id}`} className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded bg-white/10">
                            <Image
                              src={getConnectionIcon(c.type, c.icon)}
                              alt={c.type}
                              width={32}
                              height={32}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs text-white">{c.name || c.id}</div>
                            <div className="text-[10px] text-zinc-400">{c.type}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
