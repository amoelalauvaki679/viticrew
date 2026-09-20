import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { applyToJob, getAccount, getJob } from "@/lib/api";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/jobs/$id")({ component: JobDetail });

function JobDetail() {
  const { id } = Route.useParams();
  const jobId = Number(id);
  const { user } = useCurrentUserState();
  const jobQ = useQuery({ queryKey: ["job", jobId], queryFn: () => getJob({ data: jobId }) });
  const accountQ = useQuery({
    queryKey: ["account"],
    queryFn: () => getAccount(),
    enabled: !!user,
  });
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const job = jobQ.data;

  async function apply() {
    setBusy(true);
    try {
      const res = await applyToJob({ data: { jobId, coverNote: note } });
      toast.success(res.already ? "Already applied." : "Application sent.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not apply.");
    } finally {
      setBusy(false);
    }
  }

  if (jobQ.isPending) {
    return (
      <AppShell>
        <div className="mx-auto max-w-3xl px-4 py-16 text-muted-foreground">Loading role…</div>
      </AppShell>
    );
  }
  if (!job) {
    return (
      <AppShell>
        <div className="mx-auto max-w-3xl px-4 py-16">
          <h1 className="font-display text-3xl">Role not found</h1>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="text-xs tracking-[0.18em] text-primary uppercase">
          {job.yachtName} · {job.yachtLength} {job.yachtType}
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-tight">{job.title}</h1>
        <div className="mt-4 flex flex-wrap gap-1.5">
          <Badge tone="primary">{job.region}</Badge>
          <Badge>{job.contractType}</Badge>
          <Badge>{job.startDate}</Badge>
          {job.salary ? <Badge>{job.salary}</Badge> : null}
        </div>
        <p className="mt-6 text-muted-foreground">{job.itinerary}</p>
        <div className="mt-8 space-y-4 text-sm leading-relaxed">
          <p>{job.description}</p>
          <div>
            <h2 className="font-display text-xl">Requirements</h2>
            <p className="mt-2 text-muted-foreground">{job.requirements}</p>
          </div>
        </div>
        <Card className="mt-10 p-5">
          <h2 className="font-display text-2xl">Apply as Fijian crew</h2>
          {!user ? (
            <div className="mt-4">
              <Link to="/login" className={cn(buttonVariants())}>
                Sign in to apply
              </Link>
            </div>
          ) : accountQ.data?.role !== "seafarer" ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Switch to a seafarer desk to send an application.
            </p>
          ) : (
            <div className="mt-4 flex flex-col gap-3">
              <Textarea
                placeholder="Short note to the captain or agent"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <Button disabled={busy} onClick={() => void apply()}>
                {busy ? "Sending…" : "Send application"}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
