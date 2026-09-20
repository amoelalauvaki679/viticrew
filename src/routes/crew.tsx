import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CrewCard } from "@/components/crew/crew-card";
import { AppShell } from "@/components/layout/app-shell";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { listCrew } from "@/lib/api";
import { AVAILABILITY, DEPARTMENTS } from "@/lib/constants";

export const Route = createFileRoute("/crew")({ component: CrewBoard });

function CrewBoard() {
  const [q, setQ] = useState("");
  const [department, setDepartment] = useState("");
  const [availability, setAvailability] = useState("");
  const { data, isPending } = useQuery({
    queryKey: ["crew"],
    queryFn: () => listCrew({ data: {} }),
  });
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return (data ?? []).filter((c) => {
      if (department && c.department !== department) return false;
      if (availability && c.availability !== availability) return false;
      if (!query) return true;
      const hay = `${c.fullName} ${c.position} ${c.homeIsland} ${c.skills} ${c.certifications}`.toLowerCase();
      return hay.includes(query);
    });
  }, [data, q, department, availability]);

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-xs tracking-[0.18em] text-primary uppercase">The board</p>
        <h1 className="mt-2 font-display text-4xl tracking-tight">Fijian seafarers</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Search by department, availability, tickets, or home island. Open a card and send the link
          to any Asia-Pacific yacht desk.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <Input
            placeholder="Search name, ticket, skill"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Select value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option value="">All departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </Select>
          <Select value={availability} onChange={(e) => setAvailability(e.target.value)}>
            <option value="">Any availability</option>
            {AVAILABILITY.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </Select>
        </div>
        {isPending ? (
          <p className="mt-10 text-sm text-muted-foreground">Loading crew…</p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => (
              <CrewCard key={c.id} crew={c} />
            ))}
          </div>
        )}
        {!isPending && filtered.length === 0 ? (
          <p className="mt-10 text-sm text-muted-foreground">No crew match those filters.</p>
        ) : null}
      </div>
    </AppShell>
  );
}
