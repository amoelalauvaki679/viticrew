import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getAccount, postArticle } from "@/lib/api";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { DEPARTMENTS, NEWS_CATEGORIES, REGIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/post-briefing")({ component: PostBriefing });

function PostBriefing() {
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
    dek: "",
    body: "",
    region: "South Pacific",
    category: "Manning",
    department: "",
  });

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const article = await postArticle({ data: form });
      toast.success("Briefing published.");
      await navigate({ to: "/news/$slug", params: { slug: article.slug } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not publish.");
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
          <h1 className="font-display text-3xl">Agents post briefings</h1>
          <p className="mt-2 text-muted-foreground">
            Seafarer desks share crew cards. Yacht desks publish corridor notes.
          </p>
          <Link to="/news" className={cn(buttonVariants({ variant: "outline" }), "mt-6")}>
            Read the briefing
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <form onSubmit={(e) => void submit(e)} className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-4xl tracking-tight">Post a corridor briefing</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Public. Any desk from Vila to Manila can open it and forward it with a crew card.
        </p>
        <div className="mt-8 grid gap-4">
          <Field label="Headline">
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </Field>
          <Field label="Dek">
            <Input value={form.dek} onChange={(e) => setForm({ ...form, dek: e.target.value })} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Region">
              <Select value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })}>
                {REGIONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </Select>
            </Field>
            <Field label="Desk">
              <Select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {NEWS_CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </Select>
            </Field>
          </div>
          <Field label="Related department">
            <Select
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
            >
              <option value="">Any</option>
              {DEPARTMENTS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </Select>
          </Field>
          <Field label="Note">
            <Textarea
              className="min-h-48"
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              required
            />
          </Field>
        </div>
        <Button className="mt-6" type="submit" disabled={busy}>
          {busy ? "Publishing…" : "Publish briefing"}
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
