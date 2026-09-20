import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { NewsCard } from "@/components/news/news-card";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { listArticles } from "@/lib/api";
import { NEWS_CATEGORIES, REGIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/news/")({ component: NewsIndex });

function NewsIndex() {
  const [region, setRegion] = useState("");
  const [category, setCategory] = useState("");
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["news"],
    queryFn: () => listArticles({ data: {} }),
  });
  const filtered = useMemo(
    () =>
      (data ?? []).filter((a) => {
        if (region && a.region !== region) return false;
        if (category && a.category !== category) return false;
        return true;
      }),
    [data, region, category],
  );
  const lead = filtered[0];
  const rest = filtered.slice(1);

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs tracking-[0.18em] text-primary uppercase">Corridor briefing</p>
            <h1 className="mt-2 font-display text-4xl tracking-tight">Pacific–Asia yacht news</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Seasonal notes for desks from Denarau to Phuket. Forward a briefing the same way you
              forward a crew card — one link, no login required to read.
            </p>
          </div>
          <Link to="/post-briefing" className={cn(buttonVariants({ variant: "outline" }))}>
            Post a briefing
          </Link>
        </div>

        <Card className="mt-8 border-primary/25 bg-accent/40 p-5 sm:p-6">
          <p className="text-xs tracking-[0.18em] text-primary uppercase">How agents find VitiCrew</p>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground sm:text-base">
            A Phuket or Singapore office does not browse a new crew site. They open a note a
            Denarau desk forwarded — Fiji season, a Raja Ampat dive programme, a Langkawi yard —
            then three Fijian cards underneath. That forward is the distribution.
          </p>
        </Card>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Select value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="">All regions</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All desks</option>
            {NEWS_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
        {isPending ? (
          <p className="mt-10 text-sm text-muted-foreground">Loading briefing…</p>
        ) : isError ? (
          <Card className="mt-10 p-6">
            <p className="font-display text-2xl">Briefing desk is catching up</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Notes did not load. Try again in a moment.
            </p>
            <button
              type="button"
              className={cn(buttonVariants({ variant: "outline" }), "mt-4")}
              onClick={() => void refetch()}
            >
              Retry
            </button>
          </Card>
        ) : filtered.length === 0 ? (
          <Card className="mt-10 p-6">
            <p className="font-display text-2xl">No notes on this filter</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Clear the region or desk, or publish a corridor briefing for other agents to forward.
            </p>
          </Card>
        ) : (
          <div className="mt-8 space-y-4">
            {lead ? <NewsCard article={lead} featured /> : null}
            {rest.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {rest.map((a) => (
                  <NewsCard key={a.id} article={a} />
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </AppShell>
  );
}