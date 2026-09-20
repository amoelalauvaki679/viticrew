import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { Eye } from "lucide-react";
import { PhotoField } from "@/components/crew/photo-field";
import { AppShell } from "@/components/layout/app-shell";
import { NewsCard } from "@/components/news/news-card";
import { SharePanel } from "@/components/share/share-panel";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAccount, getMyProfile, listArticles, listMyApplications, listMyDocuments, listMyProfileViews } from "@/lib/api";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn, formatCount } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

function Dashboard() {
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
    enabled: !!user && accountQ.data?.role === "seafarer",
  });
  const docsQ = useQuery({
    queryKey: ["my-docs"],
    queryFn: () => listMyDocuments(),
    enabled: !!user && accountQ.data?.role === "seafarer",
  });
  const appsQ = useQuery({
    queryKey: ["my-apps"],
    queryFn: () => listMyApplications(),
    enabled: !!user && accountQ.data?.role === "seafarer",
  });
  const newsQ = useQuery({
    queryKey: ["news"],
    queryFn: () => listArticles({ data: {} }),
    enabled: !!user && accountQ.data?.role === "agent",
  });
  const viewsQ = useQuery({
    queryKey: ["my-views"],
    queryFn: () => listMyProfileViews(),
    enabled: !!user && accountQ.data?.role === "seafarer",
  });

  if (isPending || (user && accountQ.isPending)) {
    return (
      <AppShell>
        <div className="mx-auto max-w-6xl px-4 py-16 text-muted-foreground">Loading desk…</div>
      </AppShell>
    );
  }
  if (!user) return <RedirectToSignIn />;
  if (accountQ.data === null) return <Navigate to="/onboarding" />;

  const account = accountQ.data;
  const profile = profileQ.data;

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-xs tracking-[0.18em] text-primary uppercase">
          {account?.role === "agent" ? "Agent desk" : "Seafarer desk"}
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-tight">
          Bula, {account?.displayName || user.displayName || "crew"}
        </h1>

        {account?.role === "seafarer" ? (
          <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="p-6">
              <p className="text-xs text-muted-foreground uppercase">Crew card</p>
              <div className="mt-3">
                {profile ? (
                  <PhotoField
                    crew={profile}
                    onChanged={(next) => {
                      void qc.setQueryData(["my-profile"], next);
                      void qc.invalidateQueries({ queryKey: ["crew"] });
                    }}
                  />
                ) : (
                  <h2 className="font-display text-2xl">Complete your card</h2>
                )}
              </div>
              {profile ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge tone="primary">{profile.position}</Badge>
                  <Badge>{profile.availability}</Badge>
                  <Badge>{profile.homeIsland}</Badge>
                </div>
              ) : null}
              <p className="mt-4 text-sm text-muted-foreground">
                {profile?.bio || "Add a short bio, tickets, and what you want next so a captain can place you."}
              </p>
              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <Link to="/profile" className={cn(buttonVariants())}>
                  Edit card
                </Link>
                <Link to="/documents" className={cn(buttonVariants({ variant: "outline" }))}>
                  Document vault · {docsQ.data?.length ?? 0}
                </Link>
              </div>
            </Card>
            {profile ? <SharePanel crew={profile} /> : <Card className="p-6 text-sm text-muted-foreground">Save a crew card to get a share link.</Card>}
            <Card className="p-6 lg:col-span-2">
              <div className="grid gap-6 sm:grid-cols-[160px_1fr]">
                <div>
                  <p className="text-xs tracking-wide text-muted-foreground uppercase">Profile views</p>
                  <p className="mt-2 flex items-end gap-2 font-display text-4xl tracking-tight">
                    <Eye className="mb-1 size-6 text-primary" aria-hidden="true" />
                    {formatCount(viewsQ.data?.viewCount ?? profile?.viewCount ?? 0)}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Desks that opened your public card.
                  </p>
                </div>
                <div>
                  <p className="text-xs tracking-wide text-muted-foreground uppercase">Recent desks</p>
                  <ul className="mt-3 divide-y divide-border">
                    {(viewsQ.data?.recent ?? []).length === 0 ? (
                      <li className="py-3 text-sm text-muted-foreground">
                        No opens yet. Share the card — that is what fills this list.
                      </li>
                    ) : (
                      (viewsQ.data?.recent ?? []).map((v) => (
                        <li key={v.id} className="flex flex-wrap justify-between gap-2 py-2.5 text-sm">
                          <span>{v.viewerLabel}</span>
                          <span className="text-muted-foreground">{formatViewWhen(v.createdAt)}</span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            </Card>
            <Card className="p-6 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl">Applications</h2>
                <Link to="/jobs" className="text-sm text-primary">
                  Browse jobs
                </Link>
              </div>
              <ul className="mt-4 divide-y divide-border">
                {(appsQ.data ?? []).length === 0 ? (
                  <li className="py-4 text-sm text-muted-foreground">No applications yet.</li>
                ) : (
                  (appsQ.data ?? []).map((a) => (
                    <li key={a.id} className="flex flex-wrap justify-between gap-2 py-3 text-sm">
                      <span>
                        {a.jobTitle} · {a.yachtName}
                      </span>
                      <span className="text-muted-foreground">{a.region}</span>
                    </li>
                  ))
                )}
              </ul>
            </Card>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Card className="p-6">
              <h2 className="font-display text-2xl">Search crew</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Filter Fijian seafarers by department, availability, and tickets.
              </p>
              <Link to="/crew" className={cn(buttonVariants(), "mt-5")}>
                Open the board
              </Link>
            </Card>
            <Card className="p-6">
              <h2 className="font-display text-2xl">Post a role</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Pacific season, Asia winter, or a Denarau day-charter slot.
              </p>
              <Link to="/post-job" className={cn(buttonVariants(), "mt-5")}>
                New job
              </Link>
            </Card>
            <Card className="p-6">
              <h2 className="font-display text-2xl">Agent network</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Desks from Port Vila to Manila that already take Fijian crew.
              </p>
              <Link to="/agents" className={cn(buttonVariants({ variant: "outline" }), "mt-5")}>
                Directory
              </Link>
            </Card>
            <Card className="p-6 md:col-span-3">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <h2 className="font-display text-2xl">Corridor briefing</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Forward a seasonal note with three crew cards. That is how the next desk sees
                    VitiCrew.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link to="/news" className={cn(buttonVariants({ variant: "outline" }))}>
                    Read
                  </Link>
                  <Link to="/post-briefing" className={cn(buttonVariants())}>
                    Post a briefing
                  </Link>
                </div>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {(newsQ.data ?? []).slice(0, 3).map((a) => (
                  <NewsCard key={a.id} article={a} />
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function formatViewWhen(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
