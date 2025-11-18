import Image from "next/image";
import Badge from "@/components/Badge";
import StatusIndicator from "@/components/StatusIndicator";
import { type PresenceData, type AvatarDecorationData } from "@/lib/presence";
import { getActivityIconAsset } from "@/lib/activityIcons";
import { ReactNode } from "react";

type DecorationLike =
  | AvatarDecorationData
  | {
      asset?: string | null;
    }
  | null
  | undefined;

function resolveActivityAssetUrl(
  activity: PresenceData["activities"][number],
): string | null {
  const assetRef =
    activity.assets?.large_image || activity.assets?.small_image || null;
  if (!assetRef) return null;

  const directUrl = normalizeAssetReference(assetRef, activity.application_id);
  if (directUrl) return directUrl;

  return null;
}

function getAvatarDecorationUrl(decoration: DecorationLike): string | null {
  const assetId = decoration?.asset;
  if (!assetId) return null;
  return `https://cdn.discordapp.com/avatar-decoration-presets/${assetId}.png?size=320`;
}

function normalizeAssetReference(
  raw: string,
  applicationId?: string,
): string | null {
  if (!raw) return null;

  if (raw.startsWith("spotify:")) {
    const [, imageId] = raw.split(":");
    if (imageId) return `https://i.scdn.co/image/${imageId}`;
  }

  if (/^https?:\/\//i.test(raw)) return raw;

  if (raw.startsWith("mp:")) {
    const httpsIndex = raw.indexOf("https/");
    if (httpsIndex !== -1) {
      return "https://" + raw.slice(httpsIndex + "https/".length);
    }

    const assetsMatch = raw.match(/^mp:assets-(\d+)\/(.+)$/i);
    if (assetsMatch) {
      const [, embeddedAppId, assetId] = assetsMatch;
      return buildAppAssetUrl(embeddedAppId, assetId);
    }
  }

  if (applicationId) {
    return buildAppAssetUrl(applicationId, raw.replace(/^mp:/, ""));
  }

  return null;
}

function buildAppAssetUrl(appId: string, assetId: string): string {
  const normalizedAsset = assetId.includes(".")
    ? assetId
    : `${assetId}.png`;
  return `https://cdn.discordapp.com/app-assets/${appId}/${normalizedAsset}`;
}

type DiscordBadge = { id: string; description?: string };

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
  twitter:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/1245px-Logo_of_Twitter.svg.png",
  github:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScfGAZaK1UapejlsFxp9IHSRn5zA5F5fC76biETiGI7bJvI06XdqRKc7wup8lMzSRvzJg&usqp=CAU",
  reddit: "https://cdn.discordapp.com/app-assets/reddit/reddit.png",
  instagram:
    "https://img.freepik.com/vetores-gratis/instagram-logo_1199-122.jpg",
  facebook:
    "https://static.vecteezy.com/ti/vetor-gratis/p1/2000431-facebook-logo-icone-vetorial-gratis-vector.jpg",
  snapchat:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7wIlVFnJuESp4wirO8T5Zv49mjumK15aRNaXdNX-MdxkdttemDucJUOjUdm5lpZEJ9b0&usqp=CAU",
  tiktok:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7wIlVFnJuESp4wirO8T5Zv49mjumK15aRNaXdNX-MdxkdttemDucJUOjUdm5lpZEJ9b0&usqp=CAU",
  linkedin:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7wIlVFnJuESp4wirO8T5Zv49mjumK15aRNaXdNX-MdxkdttemDucJUOjUdm5lpZEJ9b0&usqp=CAU",
  epicgames:
    "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/i/bde3849f-8b50-46e6-92fa-06b89b73054a/dc46lkq-0901a30c-e2bb-48f6-a907-692da50cd104.png/v1/fill/w_256,h_256,q_80,strp/epic_games_launcher___token_icon_light_by_flexo013_dc46lkq-fullview.jpg",
  xbox: "https://cms-assets.xboxservices.com/assets/be/ba/bebae3aa-b1d4-4574-bda7-e29e0da79acc.jpg?n=Xbox-on-TVs_Sharing_200x200.jpg",
  playstation:
    "https://i.pinimg.com/736x/28/68/9a/28689a40d979ebb1d751814d4ce6a0e1.jpg",
  battle_net: "https://cdn.discordapp.com/app-assets/battlenet/battlenet.png",
  riot: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7wIlVFnJuESp4wirO8T5Zv49mjumK15aRNaXdNX-MdxkdttemDucJUOjUdm5lpZEJ9b0&usqp=CAU",
  ubisoft:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7wIlVFnJuESp4wirO8T5Zv49mjumK15aRNaXdNX-MdxkdttemDucJUOjUdm5lpZEJ9b0&usqp=CAU",
  ea: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7wIlVFnJuESp4wirO8T5Zv49mjumK15aRNaXdNX-MdxkdttemDucJUOjUdm5lpZEJ9b0&usqp=CAU",
};

function getConnectionIcon(type: string, icon?: string): string {
  if (icon) return icon;
  return connectionIconMap[type.toLowerCase()] || "/window.svg";
}

function processBioText(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const emojiRegex = /<(a?):(\w+):(\d+)>/g;
  
  type MatchData = {
    type: 'emoji' | 'url';
    start: number;
    end: number;
    data: {
      animated?: boolean;
      name?: string;
      id?: string;
      fullMatch?: string;
      url?: string;
    };
  };
  
  const allMatches: MatchData[] = [];
  
  let match: RegExpExecArray | null;
  while ((match = emojiRegex.exec(text)) !== null) {
    allMatches.push({
      type: 'emoji',
      start: match.index,
      end: match.index + match[0].length,
      data: {
        animated: match[1] === 'a',
        name: match[2],
        id: match[3],
        fullMatch: match[0]
      }
    });
  }
  
  urlRegex.lastIndex = 0;
  while ((match = urlRegex.exec(text)) !== null) {
    const matchIndex = match.index;
    const matchLength = match[0].length;
    const isInsideEmoji = allMatches.some(m => 
      m.type === 'emoji' && matchIndex >= m.start && matchIndex < m.end
    );
    const overlapsMatch = allMatches.some(m => 
      (matchIndex >= m.start && matchIndex < m.end) ||
      (m.start >= matchIndex && m.start < matchIndex + matchLength)
    );
    if (!isInsideEmoji && !overlapsMatch) {
      allMatches.push({
        type: 'url',
        start: matchIndex,
        end: matchIndex + matchLength,
        data: { url: match[0] }
      });
    }
  }
  
  allMatches.sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    return a.type === 'emoji' ? -1 : 1;
  });
  
  const filteredMatches: MatchData[] = [];
  for (const match of allMatches) {
    const isInsideOther = filteredMatches.some(m => 
      match.start >= m.start && match.end <= m.end &&
      !(match.start === m.start && match.end === m.end)
    );
    if (!isInsideOther) {
      filteredMatches.push(match);
    }
  }
  
  let currentIndex = 0;
  
  for (const item of filteredMatches) {
    if (item.start > currentIndex) {
      const beforeText = text.slice(currentIndex, item.start);
      if (beforeText) {
        parts.push(<span key={`text-${currentIndex}`}>{beforeText}</span>);
      }
    }
    
    if (item.type === 'emoji') {
      const emojiUrl = item.data.animated
        ? `https://cdn.discordapp.com/emojis/${item.data.id}.gif`
        : `https://cdn.discordapp.com/emojis/${item.data.id}.png`;
      parts.push(
        <Image
          key={`emoji-${item.start}`}
          src={emojiUrl}
          alt={item.data.name || "emoji"}
          width={18}
          height={18}
          className="inline-block align-middle mx-0.5"
          unoptimized
        />
      );
    } else if (item.type === 'url') {
      parts.push(
        <a
          key={`url-${item.start}`}
          href={item.data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-400 underline break-all"
        >
          {item.data.url}
        </a>
      );
    }
    
    currentIndex = item.end;
  }
  
  if (currentIndex < text.length) {
    const remainingText = text.slice(currentIndex);
    if (remainingText) {
      parts.push(<span key={`text-${currentIndex}`}>{remainingText}</span>);
    }
  }
  
  if (parts.length === 0) {
    return [<span key="text-0">{text}</span>];
  }
  
  return parts;
}

export type DiscordProfile = {
  user: {
    id: string;
    username: string;
    global_name: string | null;
    avatar: string | null;
    accent_color?: number | null;
    avatar_decoration_data?: DecorationLike;
    discriminator: string;
    bio?: string;
  };
  user_profile: {
    bio?: string;
    pronouns?: string | "";
    accent_color?: number | null;
    theme_colors?: number[];
  };
  badges: DiscordBadge[];
  premium_type?: number;
  connected_accounts?: {
    type: string;
    id: string;
    name?: string;
    verified?: boolean;
    icon?: string;
  }[];
};

export default function ProfileCard({
  profile,
  presence,
  onOpenModal,
}: {
  profile: DiscordProfile;
  presence?: PresenceData;
  onOpenModal?: (data: {
    activities: PresenceData["activities"];
    connections?: DiscordProfile["connected_accounts"];
  }) => void;
}) {
  const { user, user_profile, badges } = profile;

  const displayName = presence?.discord_user?.global_name 
    ?? presence?.discord_user?.username 
    ?? user.global_name 
    ?? user.username;
  
  const username = presence?.discord_user?.username ?? user.username;
  
  const presenceUserId = presence?.discord_user?.id ?? user.id;
  const avatarHash = presence?.discord_user?.avatar ?? user.avatar;
  const avatarUrl = avatarHash
    ? `https://cdn.discordapp.com/avatars/${presenceUserId}/${avatarHash}.png?size=256`
    : `https://cdn.discordapp.com/embed/avatars/${parseInt(presenceUserId) % 5}.png`;
  
  const status: "online" | "idle" | "dnd" | "offline" =
    presence?.discord_status ?? "offline";
  const statusMaskOutline = "outline outline-2 outline-zinc-900";
  const pronounsLabel =
    user_profile.pronouns && user_profile.pronouns.trim().length
      ? user_profile.pronouns.trim()
      : null;
  const decorationUrl = getAvatarDecorationUrl(
    presence?.discord_user?.avatar_decoration_data ?? user.avatar_decoration_data,
  );

  return (
    <div className="glass rounded-xl p-4 sm:p-5 w-full border border-white/10 shadow-xl hover:shadow-2xl transition-shadow max-w-full">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="relative flex-shrink-0">
          <Image
            key={`avatar-${presenceUserId}-${avatarHash || "default"}`}
            src={avatarUrl}
            alt={displayName}
            width={72}
            height={72}
            className="rounded-full border border-white/10 w-14 h-14 sm:w-[72px] sm:h-[72px]"
          />
          {decorationUrl ? (
            <Image
              src={decorationUrl}
              alt="Avatar decoration"
              fill
              sizes="80px"
              className="absolute inset-0 z-20 pointer-events-none scale-[1.12] select-none"
              style={{ objectFit: "contain" }}
            />
          ) : null}
          <span
            className={`absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 inline-flex items-center justify-center rounded-full ${statusMaskOutline} bg-zinc-900 pointer-events-none`}
            style={{ width: 18, height: 18 }}
          >
            <StatusIndicator status={status} size={14} />
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-white font-semibold truncate text-sm sm:text-base">
            {displayName}
          </h2>
          <p className="mt-1 flex flex-wrap items-center gap-1 text-xs text-zinc-300">
            <span className="truncate text-zinc-300">@{username}</span>
            {pronounsLabel ? (
              <>
                <span className="text-zinc-500">•</span>
                <span className="text-zinc-200">{pronounsLabel}</span>
              </>
            ) : null}
          </p>
        </div>
      </div>

      {badges?.length ? (
        <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
          {badges.map((b) => (
            <Badge key={b.id} id={b.id} title={b.description || ""} />
          ))}
        </div>
      ) : null}
      {user.bio || user_profile?.bio ? (
        <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-zinc-300 line-clamp-3 leading-relaxed">
          {processBioText(user.bio || user_profile?.bio || "")}
        </p>
      ) : null}

      {presence?.listening_to_spotify && presence.spotify ? (
        <div className="mt-3 sm:mt-4 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-emerald-200">
              <span className="text-base leading-none">♪</span>
          <span className="truncate">
            {presence.spotify.song} · {presence.spotify.artist}
          </span>
        </div>
      ) : null}

      {presence?.activities?.length ? (
        <div className="mt-3 sm:mt-4 space-y-2">
          {presence.activities.slice(0, 2).map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-2 sm:gap-3 rounded-lg border border-white/10 bg-white/5 p-2"
            >
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded bg-zinc-800/60 flex items-center justify-center overflow-hidden flex-shrink-0">
                <Image
                  src={
                    resolveActivityAssetUrl(activity) ||
                    getActivityIconAsset(activity) ||
                    "/window.svg"
                  }
                  alt={activity.name}
                  width={48}
                  height={48}
                  className="block w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      getActivityIconAsset(activity) || "/window.svg";
                  }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs sm:text-sm text-white truncate">
                  {activity.name}
                </div>
                <div className="text-[10px] sm:text-xs text-zinc-300/80 truncate">
                  {activity.details || activity.state || "Activity"}
                </div>
              </div>
            </div>
          ))}
          {onOpenModal && presence.activities.length > 2 ? (
            <button
              onClick={() => onOpenModal({ activities: presence.activities })}
              className="w-full text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-zinc-800/70 hover:bg-zinc-700/70 text-zinc-200 flex-shrink-0"
            >
              View more activities
            </button>
          ) : null}
        </div>
      ) : (
        <div className="mt-3 sm:mt-4 rounded-lg border border-white/10 bg-white/5 p-2 sm:p-3 text-[10px] sm:text-xs text-zinc-400">
          No activity
        </div>
      )}

      {profile.connected_accounts?.length ? (
        <div className="mt-3 sm:mt-4 space-y-2">
          {(() => {
            const uniqueConnections = profile.connected_accounts.filter(
              (connection, index, arr) =>
                arr.findIndex((c) => c.type === connection.type) === index,
            );
            const rows = uniqueConnections.slice(0, 2).map((c) => (
              <div
                key={`${c.type}:${c.id}`}
                className="flex items-center gap-2 sm:gap-3 rounded-lg border border-white/10 bg-white/5 p-2"
              >
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded bg-zinc-800/60 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <Image
                    src={getConnectionIcon(c.type, c.icon)}
                    alt={c.type}
                    width={48}
                    height={48}
                    className="block w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        getConnectionIcon(c.type);
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs sm:text-sm text-white truncate">
                    {c.name || c.id}
                  </div>
                  <div className="text-[10px] sm:text-xs text-zinc-300/80 truncate">
                    Connection
                  </div>
                </div>
              </div>
            ));
            if (onOpenModal && uniqueConnections.length > 2 && rows.length) {
              rows.push(
                <button
                  key="connections-more"
                  onClick={() =>
                    onOpenModal({
                      activities: presence?.activities ?? [],
                      connections: uniqueConnections,
                    })
                  }
                  className="w-full text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-zinc-800/70 hover:bg-zinc-700/70 text-zinc-200 flex-shrink-0"
                >
                  View more connections
                </button>,
              );
            }
            return rows;
          })()}
        </div>
      ) : null}
    </div>
  );
}
