import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Mark } from "@/components/brand/mark";
import { Button, buttonVariants } from "@/components/ui/button";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/crew", label: "Crew" },
  { to: "/jobs", label: "Jobs" },
  { to: "/news", label: "Briefing" },
  { to: "/agents", label: "Agents" },
] as const;

function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return <div className="size-8 animate-pulse rounded-full bg-secondary" />;
  }
  if (user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          to="/dashboard"
          className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline"
        >
          Desk
        </Link>
        <UserButton />
      </div>
    );
  }
  return (
    <Link to="/login" className={cn(buttonVariants({ size: "sm" }), "min-h-11")}>
      Sign in
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/80 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 text-foreground">
            <Mark className="size-8" />
            <span className="font-display text-lg tracking-tight">{APP_NAME}</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <AuthSlot />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>
        {open ? (
          <div className="border-t border-border px-4 py-4 md:hidden">
            <div className="flex flex-col gap-1">
              {LINKS.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="flex min-h-11 items-center text-sm"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/dashboard"
                className="flex min-h-11 items-center text-sm"
                onClick={() => setOpen(false)}
              >
                Desk
              </Link>
              <div className="pt-2">
                <AuthSlot />
              </div>
            </div>
          </div>
        ) : null}
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="font-display text-foreground">{APP_NAME}</p>
          <p>Fijian seafarers · Pacific to Asia yacht programmes</p>
        </div>
      </footer>
    </div>
  );
}
