import React from "react";

export type UserStatus = "online" | "idle" | "dnd" | "offline";

export default function StatusIndicator({ status, size = 16 }: { status: UserStatus; size?: number }) {
  const common = { width: size, height: size };
  switch (status) {
    case "online":
      return (
        <svg {...common} viewBox="0 0 16 16" aria-label="online">
          <circle cx="8" cy="8" r="8" fill="#22c55e" />
        </svg>
      );
    case "idle":
      return (
        <svg {...common} viewBox="0 0 16 16" aria-label="idle">
          <circle cx="8" cy="8" r="8" fill="#facc15" />
          <circle cx="5" cy="5" r="6" fill="#18181b" />
        </svg>
      );
    case "dnd":
      return (
        <svg {...common} viewBox="0 0 16 16" aria-label="do not disturb">
          <circle cx="8" cy="8" r="8" fill="#ef4444" />
          <rect x="3.5" y="7" width="9" height="2" rx="1" fill="#18181b" />
        </svg>
      );
    default:
      return (
        <svg {...common} viewBox="0 0 16 16" aria-label="offline">
          <circle cx="8" cy="8" r="8" fill="#71717a" />
          <circle cx="8" cy="8" r="5" fill="#18181b" />
        </svg>
      );
  }
}


