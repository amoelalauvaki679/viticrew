import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { JobCard } from "@/components/jobs/job-card";
import { AppShell } from "@/components/layout/app-shell";
import { buttonVariants } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { listJobs } from "@/lib/api";
import { DEPARTMENTS, REGIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/jobs/")({ component: JobsPage });

function JobsPage() {
  const [region, setRegion] = useState("");
  const [department, setDepartment] = useState("");
  const { data, isPending } = useQuery({ queryKey: ["jobs"], queryFn: () => listJobs({ data: {} }) });
  const filtered = useMemo(
    () =>
      (data ?? []).filter((j) => {
        if (region && j.region !== region) return false;
        if (department && j.department !== department) return false;
        return true;
      }),
    [data, region, department],
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs tracking-[0.18em] text-primary uppercase">Open berths</p>
            <h1 className="mt-2 font-display text-4xl tracking-tight">Yacht jobs on the corridor</h1>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Roles for yachts moving through Fiji, the Coral Sea, Indonesia, and Southeast Asia.
            </p>
          </div>
          <Link to="/post-job" className={cn(buttonVariants({ variant: "outline" }))}>
            Post a role
          </Link>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Select value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="">All regions</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
          <Select value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option value="">All departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </Select>
        </div>
        {isPending ? (
          <p className="mt-10 text-sm text-muted-foreground">Loading jobs…</p>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {filtered.map((j) => (
              <JobCard key={j.id} job={j} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
