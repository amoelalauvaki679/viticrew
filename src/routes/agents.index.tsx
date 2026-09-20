import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { listAgencies } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/agents/")({ component: AgentsPage });

function AgentsPage() {
  const [region, setRegion] = useState("");
  const { data, isPending } = useQuery({
    queryKey: ["agencies"],
    queryFn: () => listAgencies({ data: {} }),
  });
  const filtered = useMemo(
    () => (data ?? []).filter((a) => !region || a.region === region),
    [data, region],
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-xs tracking-[0.18em] text-primary uppercase">Asia-Pacific desks</p>
        <h1 className="mt-2 font-display text-4xl tracking-tight">Yacht agents on the corridor</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Share a VitiCrew card — or a corridor briefing — with any of these desks. They cover Fiji
          through Southeast Asia, the same water your tickets are written for.
        </p>
        <Link to="/news" className={cn(buttonVariants({ variant: "outline" }), "mt-6")}>
          Forward a briefing instead
        </Link>
        <div className="mt-8 max-w-xs">
          <Select value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="">Pacific and Asia</option>
            <option value="Pacific">Pacific</option>
            <option value="Asia">Asia</option>
          </Select>
        </div>
        {isPending ? (
          <p className="mt-10 text-sm text-muted-foreground">Loading desks…</p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a) => (
              <Link key={a.id} to="/agents/$id" params={{ id: String(a.id) }} className="block">
                <Card className="h-full p-5 transition-[box-shadow] duration-150 hover:ring-1 hover:ring-primary">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-display text-xl leading-snug">{a.name}</h2>
                    <Badge tone="primary">{a.region}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {a.city}, {a.country}
                  </p>
                  <p className="mt-3 text-sm">{a.focus}</p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
