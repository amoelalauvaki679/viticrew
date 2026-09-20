import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Job } from "@/lib/types";

export function JobCard({ job }: { job: Job }) {
  return (
    <Link to="/jobs/$id" params={{ id: String(job.id) }} className="block">
      <Card className="h-full p-5 transition-[box-shadow] duration-150 hover:ring-1 hover:ring-primary">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className="text-xs tracking-wide text-muted-foreground uppercase">
            {job.yachtName} · {job.yachtLength}
          </p>
          <Badge tone="primary">{job.region}</Badge>
        </div>
        <h3 className="mt-3 font-display text-xl leading-snug tracking-tight">{job.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{job.itinerary}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          <Badge>{job.contractType}</Badge>
          <Badge>{job.position}</Badge>
          <Badge>{job.startDate}</Badge>
        </div>
      </Card>
    </Link>
  );
}
