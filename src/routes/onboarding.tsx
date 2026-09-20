import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { Anchor, Briefcase } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAccount, setRole } from "@/lib/api";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import type { Role } from "@/lib/types";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

function Onboarding() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const accountQ = useQuery({
    queryKey: ["account"],
    queryFn: () => getAccount(),
    enabled: !!user,
  });
  const [role, setRoleChoice] = useState<Role>("seafarer");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.displayName && !name) setName(user.displayName);
  }, [user, name]);

  if (isPending || (user && accountQ.isPending)) {
    return (
      <AppShell>
        <div className="mx-auto max-w-6xl px-4 py-16 text-muted-foreground">Loading…</div>
      </AppShell>
    );
  }
  if (!user) return <RedirectToSignIn />;
  if (accountQ.data) return <Navigate to="/dashboard" />;

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      await setRole({ data: { role, displayName: name.trim() || user!.displayName || "Crew" } });
      await navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not continue.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <p className="text-xs tracking-[0.18em] text-primary uppercase">First step</p>
        <h1 className="mt-2 font-display text-4xl tracking-tight">How will you use VitiCrew?</h1>
        <p className="mt-3 text-muted-foreground">
          You can browse the board either way. This just opens the right desk.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <button type="button" onClick={() => setRoleChoice("seafarer")} className="text-left">
            <Card
              className={`h-full p-5 ${role === "seafarer" ? "shadow-[0_0_0_1px_var(--color-primary)]" : ""}`}
            >
              <Anchor className="size-5 text-primary" />
              <p className="mt-3 font-display text-2xl">Seafarer</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Build a crew card, upload a photo and tickets, share a link with any Asia-Pacific desk.
              </p>
            </Card>
          </button>
          <button type="button" onClick={() => setRoleChoice("agent")} className="text-left">
            <Card
              className={`h-full p-5 ${role === "agent" ? "shadow-[0_0_0_1px_var(--color-primary)]" : ""}`}
            >
              <Briefcase className="size-5 text-primary" />
              <p className="mt-3 font-display text-2xl">Yacht agent</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Search Fijian crew, open documents, post roles on Pacific–Asia programmes.
              </p>
            </Card>
          </button>
        </div>
        <div className="mt-6 flex max-w-md flex-col gap-2">
          <Label htmlFor="display">Name on the board</Label>
          <Input id="display" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
        <Button className="mt-6" disabled={busy} onClick={() => void submit()}>
          {busy ? "Saving…" : "Continue"}
        </Button>
      </div>
    </AppShell>
  );
}
