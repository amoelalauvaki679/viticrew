import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Download, FileStack, Link2, Ship } from "lucide-react";
import { Mark } from "@/components/brand/mark";
import { CrewCard } from "@/components/crew/crew-card";
import { JobCard } from "@/components/jobs/job-card";
import { AppShell } from "@/components/layout/app-shell";
import { NewsCard } from "@/components/news/news-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { featuredHome } from "@/lib/api";
import { PACIFIC_PORTS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { data } = useQuery({ queryKey: ["home"], queryFn: () => featuredHome() });

  return (
    <AppShell>
      <section className="tapa relative overflow-hidden border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:py-24">
          <div>
            <p className="rise text-xs tracking-[0.22em] text-primary uppercase">
              Fiji · Pacific · Asia
            </p>
            <h1 className="rise rise-2 mt-4 font-display text-4xl leading-[1.1] tracking-tight sm:text-6xl">
              Fijian seafarers for yachts
              <span className="italic text-primary"> crossing the Pacific.</span>
            </h1>
            <p className="rise rise-3 mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              Crew cards, tickets, and a single share link for yacht desks from Denarau to
              Phuket. Built for local seafarers, read by agents across Asia-Pacific.
            </p>
            <div className="rise rise-4 mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link to="/login" className={cn(buttonVariants({ size: "lg" }))}>
                Build your crew card
                <ArrowRight className="size-4" />
              </Link>
              <Link to="/crew" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
                Find Fijian crew
              </Link>
              <a
                href="/viticrew-source.zip"
                download="viticrew-source.zip"
                className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}
              >
                Download source pack
                <Download className="size-4" />
              </a>
            </div>
          </div>
          <Card className="flex flex-col justify-between p-6 lg:mt-10">
            <div className="flex items-center gap-3">
              <Mark className="size-10" />
              <div>
                <p className="font-display text-xl">How a desk uses VitiCrew</p>
                <p className="text-sm text-muted-foreground">One link. Full tickets. No chasing PDFs.</p>
              </div>
            </div>
            <ol className="mt-6 space-y-4 text-sm">
              {[
                "Open a Fijian seafarer’s public card.",
                "See STCW, MSA book, medical, and expiry.",
                "Forward the same link to a Phuket or Singapore agent.",
              ].map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-accent text-xs text-accent-foreground">
                    {i + 1}
                  </span>
                  <span className="pt-1 text-muted-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-px bg-border sm:grid-cols-3">
          {[
            { n: "12", l: "Fijian crew cards on the board" },
            { n: "14", l: "Agent desks from Vila to Manila" },
            { n: "8", l: "Open berths on Pacific–Asia routes" },
          ].map((s) => (
            <div key={s.l} className="bg-background px-6 py-8">
              <p className="font-display text-4xl tracking-tight">{s.n}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Ship,
              title: "A proper crew card",
              body: "Position, island, miles, languages, and what you want next — the same facts a captain asks on the dock.",
            },
            {
              icon: FileStack,
              title: "Tickets in one vault",
              body: "STCW, ENG1, seaman’s book, visas, CV. Upload once. Agents with a desk login can open the files.",
            },
            {
              icon: Link2,
              title: "Share across the corridor",
              body: "Copy a link or intro pack. WhatsApp it to Denarau, email it to Langkawi, pin it in a Singapore group.",
            },
          ].map((item) => (
            <Card key={item.title} className="p-6">
              <item.icon className="size-5 text-primary" />
              <h2 className="mt-4 font-display text-2xl tracking-tight">{item.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.18em] text-primary uppercase">Ready now</p>
              <h2 className="mt-2 font-display text-3xl tracking-tight">Fijian crew on the board</h2>
            </div>
            <Link to="/crew" className="text-sm text-primary hover:underline">
              All crew
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(data?.crew ?? []).map((c) => (
              <CrewCard key={c.id} crew={c} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.18em] text-primary uppercase">Open berths</p>
              <h2 className="mt-2 font-display text-3xl tracking-tight">Yachts on the corridor</h2>
            </div>
            <Link to="/jobs" className="text-sm text-primary hover:underline">
              All jobs
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {(data?.jobs ?? []).map((j) => (
              <JobCard key={j.id} job={j} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.18em] text-primary uppercase">Corridor briefing</p>
              <h2 className="mt-2 font-display text-3xl tracking-tight">Pacific–Asia yacht news</h2>
            </div>
            <Link to="/news" className="text-sm text-primary hover:underline">
              All briefings
            </Link>
          </div>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Why a Phuket or Singapore desk opens VitiCrew: a seasonal note they can forward, with
            Fijian crew attached.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {(data?.news ?? []).map((a) => (
              <NewsCard key={a.id} article={a} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="text-xs tracking-[0.18em] text-primary uppercase">The corridor</p>
          <h2 className="mt-2 font-display text-3xl tracking-tight">Desks that already take Fijian crew</h2>
          <div className="mt-8 flex flex-wrap gap-2">
            {PACIFIC_PORTS.map((p) => (
              <Badge key={p.name} className="px-3 py-1.5">
                {p.name}
                <span className="ml-1.5 text-muted-foreground/80">{p.region}</span>
              </Badge>
            ))}
          </div>
          <div className="mt-8">
            <Link to="/agents" className={cn(buttonVariants({ variant: "outline" }))}>
              Agent directory
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
