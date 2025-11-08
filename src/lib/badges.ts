export type BadgeId =
  | "premium"
  | "premium_tenure_1_month_v2"
  | "premium_tenure_3_month_v2"
  | "premium_tenure_6_month_v2"
  | "premium_tenure_12_month_v2"
  | "premium_tenure_24_month_v2"
  | "premium_tenure_36_month_v2"
  | "premium_tenure_60_month_v2"
  | "premium_tenure_72_month_v2"
  | "guild_booster_lvl1"
  | "guild_booster_lvl2"
  | "guild_booster_lvl3"
  | "guild_booster_lvl4"
  | "guild_booster_lvl5"
  | "guild_booster_lvl6"
  | "guild_booster_lvl7"
  | "guild_booster_lvl8"
  | "guild_booster_lvl9"
  | "hypesquad"
  | "hypesquad_house_1"
  | "hypesquad_house_2"
  | "hypesquad_house_3"
  | "verified_developer"
  | "early_supporter"
  | "active_developer"
  | "quest_completed"
  | "orb_profile_badge"
  | "legacy_username";

export type IconBadges = Record<BadgeId, string>;

export const iconBadges: IconBadges = {
  premium:
    "https://raw.githubusercontent.com/mezotv/discord-badges/31090bff0ede59bd4ae6d2b490b7e97c8731e7ec/assets/discordnitro.svg",
  premium_tenure_1_month_v2:
    "https://github.com/mezotv/discord-badges/blob/main/assets/subscriptions/badges/bronze.png?raw=true",
  premium_tenure_3_month_v2:
    "https://github.com/mezotv/discord-badges/blob/main/assets/subscriptions/badges/silver.png?raw=true",
  premium_tenure_6_month_v2:
    "https://github.com/mezotv/discord-badges/blob/main/assets/subscriptions/badges/gold.png?raw=true",
  premium_tenure_12_month_v2:
    "https://github.com/mezotv/discord-badges/blob/main/assets/subscriptions/badges/platinum.png?raw=true",
  premium_tenure_24_month_v2:
    "https://github.com/mezotv/discord-badges/blob/main/assets/subscriptions/badges/diamond.png?raw=true",
  premium_tenure_36_month_v2:
    "https://github.com/mezotv/discord-badges/blob/main/assets/subscriptions/badges/emerald.png?raw=true",
  premium_tenure_60_month_v2:
    "https://github.com/mezotv/discord-badges/blob/main/assets/subscriptions/badges/ruby.png?raw=true",
  premium_tenure_72_month_v2:
    "https://github.com/mezotv/discord-badges/blob/main/assets/subscriptions/badges/opal.png?raw=true",
  guild_booster_lvl1:
    "https://raw.githubusercontent.com/mezotv/discord-badges/refs/heads/main/assets/boosts/discordboost1.svg",
  guild_booster_lvl2:
    "https://raw.githubusercontent.com/mezotv/discord-badges/refs/heads/main/assets/boosts/discordboost2.svg",
  guild_booster_lvl3:
    "https://raw.githubusercontent.com/mezotv/discord-badges/refs/heads/main/assets/boosts/discordboost3.svg",
  guild_booster_lvl4:
    "https://raw.githubusercontent.com/mezotv/discord-badges/refs/heads/main/assets/boosts/discordboost4.svg",
  guild_booster_lvl5:
    "https://raw.githubusercontent.com/mezotv/discord-badges/refs/heads/main/assets/boosts/discordboost5.svg",
  guild_booster_lvl6:
    "https://raw.githubusercontent.com/mezotv/discord-badges/refs/heads/main/assets/boosts/discordboost6.svg",
  guild_booster_lvl7:
    "https://raw.githubusercontent.com/mezotv/discord-badges/refs/heads/main/assets/boosts/discordboost7.svg",
  guild_booster_lvl8:
    "https://raw.githubusercontent.com/mezotv/discord-badges/refs/heads/main/assets/boosts/discordboost8.svg",
  guild_booster_lvl9:
    "https://raw.githubusercontent.com/mezotv/discord-badges/refs/heads/main/assets/boosts/discordboost9.svg",
  hypesquad: "/badges/hypesquad.svg",
  hypesquad_house_1:
    "https://raw.githubusercontent.com/mezotv/discord-badges/31090bff0ede59bd4ae6d2b490b7e97c8731e7ec/assets/hypesquadbravery.svg",
  hypesquad_house_2:
    "https://raw.githubusercontent.com/mezotv/discord-badges/31090bff0ede59bd4ae6d2b490b7e97c8731e7ec/assets/hypesquadbrilliance.svg",
  hypesquad_house_3:
    "https://raw.githubusercontent.com/mezotv/discord-badges/31090bff0ede59bd4ae6d2b490b7e97c8731e7ec/assets/hypesquadbalance.svg",
  verified_developer: "/badges/verified_dev.svg",
  early_supporter:
    "https://raw.githubusercontent.com/mezotv/discord-badges/31090bff0ede59bd4ae6d2b490b7e97c8731e7ec/assets/discordearlysupporter.svg",
  active_developer:
    "https://raw.githubusercontent.com/mezotv/discord-badges/refs/heads/main/assets/activedeveloper.svg",
  quest_completed:
    "https://github.com/mezotv/discord-badges/blob/main/assets/quest.png?raw=true",
  orb_profile_badge:
    "https://raw.githubusercontent.com/mezotv/discord-badges/refs/heads/main/assets/orb.svg",
  legacy_username: "/badges/legacy.svg",
};

export function getBadgeIcon(badgeId: string): string | undefined {
  return iconBadges[badgeId as BadgeId];
}
