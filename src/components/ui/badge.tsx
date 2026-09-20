import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Badge({
  className,
  tone = "default",
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  tone?: "default" | "ok" | "warn" | "primary";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        tone === "default" && "bg-secondary text-muted-foreground",
        tone === "primary" && "bg-accent text-accent-foreground",
        tone === "ok" && "bg-ok/15 text-ok",
        tone === "warn" && "bg-warn/15 text-warn",
        className,
      )}
      {...props}
    />
  );
}
