import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mark } from "@/components/brand/mark";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { APP_NAME } from "@/lib/constants";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (isPending) {
    return <div className="min-h-dvh bg-background" />;
  }
  if (user) return <Navigate to="/dashboard" />;

  async function onEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "up") {
        const res = await authClient.signUp.email({
          email,
          password,
          name: name.trim() || email.split("@")[0],
          callbackURL: "/dashboard",
        });
        if (res.error) throw new Error(res.error.message || "Could not create account.");
      } else {
        const res = await authClient.signIn.email({
          email,
          password,
          callbackURL: "/dashboard",
        });
        if (res.error) throw new Error(res.error.message || "Could not sign in.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="tapa min-h-dvh bg-background px-4 py-12 text-foreground">
      <div className="mx-auto w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <Mark className="size-8" />
          <span className="font-display text-xl">{APP_NAME}</span>
        </Link>
        <Card className="p-6">
          <h1 className="font-display text-3xl tracking-tight">
            {mode === "in" ? "Come aboard" : "Create your desk"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Seafarers build a card and vault. Agents search the Fijian list and open tickets.
          </p>
          {authEnabled ? (
            <div className="mt-6 flex flex-col gap-2">
              {GROK_PROVIDERS.map((p) => (
                <Button
                  key={p.providerId}
                  type="button"
                  variant="outline"
                  onClick={() => signIn(p.providerId, { callbackURL: "/dashboard" })}
                >
                  Continue with {p.label}
                </Button>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm text-muted-foreground">Sign-in is disabled.</p>
          )}
          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            Email
            <span className="h-px flex-1 bg-border" />
          </div>
          <form className="flex flex-col gap-3" onSubmit={(e) => void onEmail(e)}>
            {mode === "up" ? (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            ) : null}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "up" ? "new-password" : "current-password"}
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" disabled={busy}>
              {busy ? "Please wait…" : mode === "in" ? "Sign in" : "Create account"}
            </Button>
          </form>
          <button
            type="button"
            className="mt-4 text-sm text-muted-foreground hover:text-foreground"
            onClick={() => {
              setMode(mode === "in" ? "up" : "in");
              setError(null);
            }}
          >
            {mode === "in" ? "New here? Create an account" : "Already have an account? Sign in"}
          </button>
        </Card>
      </div>
    </main>
  );
}
