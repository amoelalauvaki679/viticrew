import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getAccount, postJob } from "@/lib/api";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  ALL_POSITIONS,
  CONTRACT_TYPES,
  DEPARTMENTS,
  REGIONS,
  YACHT_TYPES,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/post-job")({ component: PostJob });

function PostJob() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const accountQ = useQuery({
    queryKey: ["account"],
    queryFn: () => getAccount(),
    enabled: !!user,
  });
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    title: "",
    department: "Deck",
    position: "Deckhand",
    yachtName: "",
    yachtType: "Motor yacht",
    yachtLength: "45m",
    region: "South Pacific",
    itinerary: "",
    startDate: "",
    contractType: "Seasonal",
    salary: "",
    description: "",
    requirements: "STCW, ENG1, Seaman's book",
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const job = await postJob({ data: form });
      toast.success("Role posted.");
      await navigate({ to: "/jobs/$id", params: { id: String(job.id) } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not post.");
    } finally {
      setBusy(false);
    }
  }

  if (isPending) {
    return (
      <AppShell>
        <div className="mx-auto max-w-2xl px-4 py-16 text-muted-foreground">Loading…</div>
      </AppShell>
    );
  }
  if (!user) return <RedirectToSignIn />;
  if (accountQ.data && accountQ.data.role !== "agent") {
    return (
      <AppShell>
        <div className="mx-auto max-w-2xl px-4 py-16">
          <h1 className="font-display text-3xl">Agents post roles</h1>
          <p className="mt-2 text-muted-foreground">This desk is set as seafarer.</p>
          <Link to="/jobs" className={cn(buttonVariants({ variant: "outline" }), "mt-6")}>
            Back to jobs
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <form onSubmit={(e) => void submit(e)} className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-4xl tracking-tight">Post a yacht role</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Visible to Fijian seafarers on the board. Prefer Pacific–Asia programmes.
        </p>
        <div className="mt-8 grid gap-4">
          <Field label="Title">
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} required />
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
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Yacht">
              <Input value={form.yachtName} onChange={(e) => set("yachtName", e.target.value)} required />
            </Field>
            <Field label="Type">
              <Select value={form.yachtType} onChange={(e) => set("yachtType", e.target.value)}>
                {YACHT_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </Select>
            </Field>
            <Field label="Length">
              <Input value={form.yachtLength} onChange={(e) => set("yachtLength", e.target.value)} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Region">
              <Select value={form.region} onChange={(e) => set("region", e.target.value)}>
                {REGIONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </Select>
            </Field>
            <Field label="Contract">
              <Select value={form.contractType} onChange={(e) => set("contractType", e.target.value)}>
                {CONTRACT_TYPES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </Select>
            </Field>
          </div>
          <Field label="Itinerary">
            <Input value={form.itinerary} onChange={(e) => set("itinerary", e.target.value)} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Start">
              <Input value={form.startDate} onChange={(e) => set("startDate", e.target.value)} />
            </Field>
            <Field label="Salary">
              <Input value={form.salary} onChange={(e) => set("salary", e.target.value)} />
            </Field>
          </div>
          <Field label="Description">
            <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} />
          </Field>
          <Field label="Requirements">
            <Textarea value={form.requirements} onChange={(e) => set("requirements", e.target.value)} />
          </Field>
        </div>
        <Button className="mt-6" type="submit" disabled={busy}>
          {busy ? "Posting…" : "Publish role"}
        </Button>
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
