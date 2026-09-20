import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { PhotoField } from "@/components/crew/photo-field";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getAccount, getMyProfile, saveMyProfile } from "@/lib/api";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { ALL_POSITIONS, AVAILABILITY, DEPARTMENTS, HOME_ISLANDS } from "@/lib/constants";
import type { ProfileInput } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

const empty: ProfileInput = {
  fullName: "",
  position: "Deckhand",
  department: "Deck",
  homeIsland: "Suva, Viti Levu",
  basedIn: "Fiji",
  availability: "Immediate",
  yearsExperience: 0,
  bio: "",
  languages: "English, Fijian",
  skills: "",
  certifications: "",
  lookingFor: "",
  shareEnabled: true,
};

function ProfilePage() {
  const { user, isPending } = useCurrentUserState();
  const qc = useQueryClient();
  const accountQ = useQuery({
    queryKey: ["account"],
    queryFn: () => getAccount(),
    enabled: !!user,
  });
  const profileQ = useQuery({
    queryKey: ["my-profile"],
    queryFn: () => getMyProfile(),
    enabled: !!user,
  });
  const [form, setForm] = useState<ProfileInput>(empty);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const p = profileQ.data;
    if (!p) return;
    setForm({
      fullName: p.fullName,
      position: p.position,
      department: p.department,
      homeIsland: p.homeIsland,
      basedIn: p.basedIn,
      availability: p.availability,
      yearsExperience: p.yearsExperience,
      bio: p.bio,
      languages: p.languages,
      skills: p.skills,
      certifications: p.certifications,
      lookingFor: p.lookingFor,
      shareEnabled: p.shareEnabled,
    });
  }, [profileQ.data]);

  function set<K extends keyof ProfileInput>(key: K, value: ProfileInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await saveMyProfile({ data: form });
      await qc.invalidateQueries({ queryKey: ["my-profile"] });
      await qc.invalidateQueries({ queryKey: ["crew"] });
      toast.success("Crew card saved.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setBusy(false);
    }
  }

  if (isPending || (user && (accountQ.isPending || profileQ.isPending))) {
    return (
      <AppShell>
        <div className="mx-auto max-w-2xl px-4 py-16 text-muted-foreground">Loading card…</div>
      </AppShell>
    );
  }
  if (!user) return <RedirectToSignIn />;
  if (accountQ.data?.role === "agent") {
    return (
      <AppShell>
        <div className="mx-auto max-w-2xl px-4 py-16">
          <h1 className="font-display text-3xl">Crew cards are for seafarers</h1>
          <Link to="/crew" className={cn(buttonVariants(), "mt-6")}>
            Search crew
          </Link>
        </div>
      </AppShell>
    );
  }

  const slug = profileQ.data?.slug;

  return (
    <AppShell>
      <form onSubmit={(e) => void submit(e)} className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-4xl tracking-tight">Your crew card</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This is what captains and Asia-Pacific agents see. Keep tickets current.
        </p>
        {slug ? (
          <Link to="/c/$slug" params={{ slug }} className="mt-3 inline-block text-sm text-primary">
            Open public card
          </Link>
        ) : null}
        {profileQ.data ? (
          <div className="mt-8 rounded-xl border border-border bg-card p-5">
            <PhotoField
              crew={profileQ.data}
              onChanged={(next) => {
                void qc.setQueryData(["my-profile"], next);
                void qc.invalidateQueries({ queryKey: ["crew"] });
              }}
            />
          </div>
        ) : null}
        <div className="mt-8 grid gap-4">
          <Field label="Full name">
            <Input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} required />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Department">
              <Select value={form.department} onChange={(e) => set("department", e.target.value)}>
                {DEPARTMENTS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </Select>
            </Field>
            <Field label="Position">
              <Select value={form.position} onChange={(e) => set("position", e.target.value)}>
                {ALL_POSITIONS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </Select>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Home island">
              <Select value={form.homeIsland} onChange={(e) => set("homeIsland", e.target.value)}>
                {HOME_ISLANDS.map((h) => (
                  <option key={h}>{h}</option>
                ))}
              </Select>
            </Field>
            <Field label="Currently based">
              <Input value={form.basedIn} onChange={(e) => set("basedIn", e.target.value)} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Availability">
              <Select value={form.availability} onChange={(e) => set("availability", e.target.value)}>
                {AVAILABILITY.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </Select>
            </Field>
            <Field label="Years on yachts">
              <Input
                type="number"
                min={0}
                value={form.yearsExperience}
                onChange={(e) => set("yearsExperience", Number(e.target.value))}
              />
            </Field>
          </div>
          <Field label="Bio">
            <Textarea value={form.bio} onChange={(e) => set("bio", e.target.value)} />
          </Field>
          <Field label="Languages">
            <Input value={form.languages} onChange={(e) => set("languages", e.target.value)} />
          </Field>
          <Field label="Skills (comma separated)">
            <Input value={form.skills} onChange={(e) => set("skills", e.target.value)} />
          </Field>
          <Field label="Tickets / certifications">
            <Textarea
              value={form.certifications}
              onChange={(e) => set("certifications", e.target.value)}
            />
          </Field>
          <Field label="Looking for">
            <Input value={form.lookingFor} onChange={(e) => set("lookingFor", e.target.value)} />
          </Field>
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.shareEnabled}
              onChange={(e) => set("shareEnabled", e.target.checked)}
            />
            Share this card publicly with yacht agents
          </label>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button type="submit" disabled={busy}>
            {busy ? "Saving…" : "Save card"}
          </Button>
          <Link to="/documents" className={cn(buttonVariants({ variant: "outline" }))}>
            Document vault
          </Link>
        </div>
      </form>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium tracking-wide text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
