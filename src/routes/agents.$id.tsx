import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAgency } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/agents/$id")({ component: AgentDetail });

function AgentDetail() {
  const { id } = Route.useParams();
  const { data, isPending } = useQuery({
    queryKey: ["agency", id],
    queryFn: () => getAgency({ data: Number(id) }),
  });

  if (isPending) {
    return (
      <AppShell>
        <div className="mx-auto max-w-3xl px-4 py-16 text-muted-foreground">Loading desk…</div>
      </AppShell>
    );
  }
  if (!data) {
    return (
      <AppShell>
        <div className="mx-auto max-w-3xl px-4 py-16">
          <h1 className="font-display text-3xl">Desk not found</h1>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Badge tone="primary">{data.region}</Badge>
        <h1 className="mt-3 font-display text-4xl tracking-tight">{data.name}</h1>
        <p className="mt-2 text-muted-foreground">
          {data.city}, {data.country}
        </p>
        <p className="mt-6 leading-relaxed">{data.about}</p>
        <Card className="mt-8 p-5 text-sm">
          <p className="text-muted-foreground">Focus</p>
          <p className="mt-1">{data.focus}</p>
          {data.email ? (
            <p className="mt-4">
              <a className="text-primary hover:underline" href={`mailto:${data.email}`}>
                {data.email}
              </a>
            </p>
          ) : null}
        </Card>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/crew" className={cn(buttonVariants())}>
            Send them a crew card
          </Link>
          <Link to="/agents" className={cn(buttonVariants({ variant: "outline" }))}>
            All desks
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
