"use client";
import { useEffect, useMemo, useState } from "react";
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
  x: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStLVUTyhzUJjfZZmRuxdiRr0twncA4eM_NAFxTcLw3JfsRIZf5Inx5CjyOOkLNf7MVscg&usqp=CAU",
};

function getConnectionIcon(type: string): string {
  return (
    connectionIconMap[type.toLowerCase()] ||
    "https://static.vecteezy.com/system/resources/previews/023/741/147/non_2x/discord-logo-icon-social-media-icon-free-png.png"
  );
}

export default function Home() {
  const ids = useMemo(() => ["1212042152402755585", "1051989185659154442", "1408350346039918634", "1424752743901564938"], []);
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
    }[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

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
              const msg = `Discord API 403. Verifique token no servidor (BOT_TOKEN) e permissões. Resposta: ${body || res.statusText}`;
              throw new Error(msg);
            }
            if (!res.ok) {
              const body = await res.text().catch(() => "");
              throw new Error(
                `Erro ao buscar usuário ${id}: ${res.status} ${body || res.statusText}`,
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

  return (
    <div className="min-h-screen w-full bg-black/90 flex items-center justify-center p-6 relative overflow-hidden">
      {!entered ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={() => setEntered(true)}
            className="px-6 py-3 rounded-xl bg-black text-white font-medium shadow-lg hover:bg-purple-500 transition"
          >
            Clique para entrar
          </button>
        </div>
      ) : null}

      <div
        className={`w-full max-w-4xl transition-opacity ${entered ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        {error ? (
          <div className="text-red-400 text-sm break-all mb-4">{error}</div>
        ) : null}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-start justify-center gap-4">
          {ids.map((id) => {
            const p = profiles[id];
            if (!p) {
              return (
                <div
                  key={id}
                  className="glass rounded-xl p-5 w-full sm:w-[420px] border border-white/10 animate-pulse"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-[72px] w-[72px] rounded-full bg-zinc-800" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-40 bg-zinc-800 rounded" />
                      <div className="h-3 w-24 bg-zinc-800 rounded" />
                    </div>
                  </div>
                  <div className="mt-4 h-8 bg-zinc-900/50 rounded" />
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
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4"
            onClick={() => setModal(null)}
          >
            <div
              className="glass rounded-xl p-5 w-full max-w-md border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold">Atividades</h3>
                <button
                  className="text-zinc-300 hover:text-white"
                  onClick={() => setModal(null)}
                >
                  Fechar
                </button>
              </div>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {modal.activities.map((a) => (
                  <div
                    key={a.id}
                    className="rounded-lg border border-white/10 bg-white/5 p-3"
                  >
                    <div className="text-sm text-white">{a.name}</div>
                    <div className="text-xs text-zinc-300/80">
                      {a.details || a.state || "Atividade"}
                    </div>
                    {a.assets?.large_image ? (
                      <div className="mt-2 text-xs text-zinc-400">
                        {a.assets.large_text}
                      </div>
                    ) : null}
                    {a.buttons?.length ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {a.buttons.map((b, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2 py-1 rounded bg-zinc-800/70 text-zinc-200"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
                {modal.connections?.length ? (
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <div className="text-sm text-white mb-2">Conexões</div>
                    <div className="space-y-2">
                      {modal.connections.map((c) => (
                        <div
                          key={`${c.type}:${c.id}`}
                          className="flex items-center gap-3"
                        >
                          <div className="h-8 w-8 rounded bg-zinc-800/60 flex items-center justify-center overflow-hidden">
                            <Image
                              src={getConnectionIcon(c.type)}
                              alt={c.type}
                              width={32}
                              height={32}
                              className="block w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs text-white truncate">
                              {c.name || c.id}
                            </div>
                            <div className="text-[11px] text-zinc-300/80 truncate">
                              {c.type}
                            </div>
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
