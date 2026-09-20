import { useState } from "react";
import { cn, crewPhotoUrl } from "@/lib/utils";

export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("text-primary", className)}
      aria-hidden="true"
    >
      <path
        d="M4 22c4-9 8-14 12-14s8 5 12 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M7 22.5h18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M16 8v6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="16" cy="7" r="1.4" fill="currentColor" />
    </svg>
  );
}

export function CrewAvatar({
  name,
  hue,
  size = "md",
  slug,
  hasPhoto,
  stamp,
}: {
  name: string;
  hue: number;
  size?: "sm" | "md" | "lg";
  slug?: string;
  hasPhoto?: boolean;
  stamp?: string;
}) {
  const [broken, setBroken] = useState(false);
  const letters = name.trim().split(/\s+/).filter(Boolean);
  const initials =
    letters.length === 0
      ? "VC"
      : letters.length === 1
        ? letters[0].slice(0, 2).toUpperCase()
        : (letters[0][0] + letters[letters.length - 1][0]).toUpperCase();
  const dim = size === "lg" ? "size-20 text-2xl" : size === "sm" ? "size-10 text-sm" : "size-14 text-lg";
  const src = hasPhoto && slug && !broken ? crewPhotoUrl(slug, stamp) : null;
  return (
    <div
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-lg font-display font-medium text-primary-foreground",
        dim,
      )}
      style={{
        background: `linear-gradient(145deg, hsl(${hue} 28% 28%), hsl(${hue} 35% 16%))`,
      }}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="absolute inset-0 size-full object-cover"
          onError={() => setBroken(true)}
        />
      ) : (
        <>
          <svg className="absolute inset-0 size-full opacity-30" viewBox="0 0 64 64" aria-hidden="true">
            <path
              d="M0 32h64M32 0v64M8 8l48 48M56 8 8 56"
              fill="none"
              stroke="white"
              strokeWidth="0.8"
            />
          </svg>
          <span className="relative" aria-hidden="true">
            {initials}
          </span>
        </>
      )}
    </div>
  );
}
