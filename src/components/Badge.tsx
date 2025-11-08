"use client";
import Image from "next/image";
import { getBadgeIcon } from "@/lib/badges";

export default function Badge({ id, title }: { id: string; title?: string }) {
  const icon = getBadgeIcon(id);
  if (!icon) return null;
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/10 backdrop-blur-sm">
      <Image src={icon} alt={title ?? id} width={20} height={20} />
      {/*<Image src={icon} alt={title ?? id} width={16} height={16} />
      {title && <span className="text-xs text-zinc-300">{title}</span>}*/}
    </span>
  );
}
