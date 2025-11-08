export type ActivityIconId =
  | "spotify"
  | "twitch"
  | "youtube"
  | "cheatbreaker"
  | "minecraft"
  | "valorant"
  | "fortnite"
  | "cs2"
  | "csgo"
  | "counter_strike"
  | "roblox"
  | "osu"
  | "league"
  | "gta"
  | "garrysmod"
  | "fivem"
  | "apex"
  | "rocketleague"
  | "rust"
  | "dota2"
  | "pubg"
  | "overwatch"
  | "rainbow6"
  | "terraria"
  | "amongus"
  | "stardew"
  | "genshin"
  | "chained_together"
  | "bluestacks"
  | "msi"
  | "steam"
  | "game"
  | "custom";

export type ActivityIconMap = Record<ActivityIconId, string>;

export const activityIconMap: Partial<ActivityIconMap> = {
  spotify: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/512px-Spotify_icon.svg.png?20220821125323",
  twitch: "https://www.vectorlogo.zone/logos/twitch/twitch-tile.svg",
  youtube: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/512px-YouTube_full-color_icon_%282017%29.svg.png?20240107144800",
  cheatbreaker: "https://avatars.githubusercontent.com/u/102477943?s=280&v=4",
  minecraft: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Minecraft-creeper-face.jpg/250px-Minecraft-creeper-face.jpg",
  valorant: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxhjYniqXU_9z5dMfSIK0eh-yn8A-qeE9Nmw&s",
  fortnite: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Fortnite_F_lettermark_logo.png",
  cs2: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSRjFeepLSILY3EiRhytlCu-l7sQ5WZ0nWIw&s",
  csgo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSRjFeepLSILY3EiRhytlCu-l7sQ5WZ0nWIw&s",
  counter_strike: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSRjFeepLSILY3EiRhytlCu-l7sQ5WZ0nWIw&s",
  roblox: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Roblox_Corporation_2025_logo.svg/2048px-Roblox_Corporation_2025_logo.svg.png",
  osu: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Osu%21_Logo_2016.svg/500px-Osu%21_Logo_2016.svg.png",
  league: "https://i.scdn.co/image/ab6761610000e5ebe80d1ffb81aa6503ad41c574",
  gta: "https://yt3.googleusercontent.com/-jCZaDR8AoEgC6CBPWFubF2PMSOTGU3nJ4VOSo7aq3W6mR8tcRCgygd8fS-4Ra41oHPo3F3P=s900-c-k-c0x00ffffff-no-rj",
  garrysmod: "https://images.steamusercontent.com/ugc/395553315328698553/C96F9BF14AE6439C24DD3292687A30B1DC498660/",
  fivem: "https://img.utdstc.com/icon/bcb/fc5/bcbfc5ae3d074d8734b9f51e64f7e95d4325485e0c51661dcf3167e45d768a8d:200",
  apex: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Apex_legends_simple_logo.jpg",
  rocketleague: "https://static.wikia.nocookie.net/rocketleague/images/2/27/Rocket_League_logo.jpg/revision/latest/thumbnail/width/360/height/360?cb=20170520101630",
  rust: "https://assets-prd.ignimgs.com/2021/12/07/rust-1638841834256.png?crop=1%3A1%2Csmart&format=jpg&auto=webp&quality=80",
  dota2: "https://i.pinimg.com/736x/8a/8b/50/8a8b50da2bc4afa933718061fe291520.jpg",
  pubg: "https://static.vecteezy.com/system/resources/previews/023/741/147/non_2x/discord-logo-icon-social-media-icon-free-png.png",
  overwatch: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Overwatch_circle_logo.svg/600px-Overwatch_circle_logo.svg.png",
  rainbow6: "https://preview.redd.it/imo-the-new-r6-logo-is-a-downgrade-v0-ozqkd0u34kje1.jpg?width=400&format=pjpg&auto=webp&s=d3462d9635c04c3d5cc4707cd71fa7e6574a47be",
  terraria: "https://forums.terraria.org/index.php?attachments/icon-png.280655/",
  amongus: "https://static.wikia.nocookie.net/logo-timeline/images/c/c4/Among_Us_Icon_2021-present.webp/revision/latest/scale-to-width-down/350?cb=20230910190950",
  stardew: "https://m.media-amazon.com/images/I/41MWR3VC1cL.png",
  genshin: "https://image.api.playstation.com/vulcan/ap/rnd/202508/2602/30935168a0f21b6710dc2bd7bb37c23ed937fb9fa747d84c.png",
  chained_together: "https://cdn2.steamgriddb.com/icon/f1b9f9e8c4ea8e24b0a8eb8a730c74a6.png",
  bluestacks: "https://cdn2.steamgriddb.com/icon_thumb/6f3d86720d498a0f707dc24326038c8a.png",
  msi: "https://asset.msi.com/global/picture/app/msi_community.jpg",
  steam: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/2048px-Steam_icon_logo.svg.png",
  game: "https://static.vecteezy.com/system/resources/previews/023/741/147/non_2x/discord-logo-icon-social-media-icon-free-png.png",
  custom: "https://static.vecteezy.com/system/resources/previews/023/741/147/non_2x/discord-logo-icon-social-media-icon-free-png.png",
};

export type ActivityIconRule = { test: RegExp; icon: string };

export const activityIconRules: ActivityIconRule[] = [
  { test: /spotify/i, icon: getIconPath("spotify") },
  { test: /cheatbreaker/i, icon: getIconPath("cheatbreaker") },
  { test: /minecraft|fabric|forge|laby|lunar/i, icon: getIconPath("minecraft") },
  { test: /valorant/i, icon: getIconPath("valorant") },
  { test: /fortnite/i, icon: getIconPath("fortnite") },
  { test: /counter[- ]?strike|cs2|cs:go/i, icon: getIconPath("counter_strike") },
  { test: /cs2\b/i, icon: getIconPath("cs2") },
  { test: /cs:?go/i, icon: getIconPath("csgo") },
  { test: /roblox/i, icon: getIconPath("roblox") },
  { test: /osu!?/i, icon: getIconPath("osu") },
  { test: /league of legends|\blol\b/i, icon: getIconPath("league") },
  { test: /gta|grand theft auto/i, icon: getIconPath("gta") },
  { test: /garry'?s mod/i, icon: getIconPath("garrysmod") },
  { test: /five[- ]?m/i, icon: getIconPath("fivem") },
  { test: /apex legends|apex\b/i, icon: getIconPath("apex") },
  { test: /rocket league/i, icon: getIconPath("rocketleague") },
  { test: /rust\b/i, icon: getIconPath("rust") },
  { test: /dota 2|\bdota\b/i, icon: getIconPath("dota2") },
  { test: /pubg|battlegrounds/i, icon: getIconPath("pubg") },
  { test: /overwatch/i, icon: getIconPath("overwatch") },
  { test: /rainbow ?six|r6\b/i, icon: getIconPath("rainbow6") },
  { test: /terraria/i, icon: getIconPath("terraria") },
  { test: /among us/i, icon: getIconPath("amongus") },
  { test: /stardew/i, icon: getIconPath("stardew") },
  { test: /genshin/i, icon: getIconPath("genshin") },
  { test: /youtube/i, icon: getIconPath("youtube") },
  { test: /chained together/i, icon: getIconPath("chained_together") },
  { test: /twitch/i, icon: getIconPath("twitch") },
  { test: /bluestacks/i, icon: getIconPath("bluestacks") },
  { test: /msi/i, icon: getIconPath("msi") },
  {
    test: /gta\s*(san andreas|v|iv|iii|3|vice city|online)?|grand theft auto\s*(v|iv|iii|3|san andreas|vice city)?/i,
    icon: getIconPath("gta")
  },
];

export function addActivityIconRule(pattern: RegExp, icon: string) {
  activityIconRules.unshift({ test: pattern, icon });
}

export function overrideActivityIcons(map: Partial<ActivityIconMap>) {
  Object.assign(activityIconMap, map);
}
export function overrideActivityIcon(key: ActivityIconId, iconPath: string) {
  (activityIconMap as Partial<ActivityIconMap>)[key] = iconPath;
}

export type ActivityLike = {
  id: string;
  name: string;
  type: number;
  application_id?: string;
  url?: string | null;
};

export function resolveActivityIconId(activity: ActivityLike): ActivityIconId {
  const name = activity.name?.toLowerCase() ?? "";
  if (activity.type === 1 || (activity.url && activity.url.includes("twitch.tv"))) return "twitch";
  if (activity.type === 2) return "spotify";
  if (name.includes("youtube")) return "youtube";
  if (name.includes("cheatbreaker")) return "cheatbreaker";
  if (name.includes("minecraft")) return "minecraft";
  if (name.includes("valorant")) return "valorant";
  if (name.includes("fortnite")) return "fortnite";
  if (name.includes("bluestacks")) return "bluestacks";
  if (name.includes("msi")) return "msi";
  if (/(cs2|cs:go|counter[- ]?strike)/i.test(name)) return "cs2";
  if (name.includes("roblox")) return "roblox";
  if (/osu!?/i.test(name)) return "osu";
  if (/(league of legends|\blol\b)/i.test(name)) return "league";
  if (/(gta|grand theft auto)/i.test(name)) return "gta";
  return "game";
}

export function getActivityIconAsset(activity: ActivityLike): string {
  const name = activity.name ?? "";
  for (const r of activityIconRules) {
    if (r.test.test(name)) return r.icon;
  }
  const key = resolveActivityIconId(activity);
  return getIconPath(key);
}

function getIconPath(key: ActivityIconId): string {
  const explicit = (activityIconMap as Partial<ActivityIconMap>)[key];
  if (explicit) return explicit as string;
  return `/icons/${key}.svg`;
}


