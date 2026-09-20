import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Copy, Mail, MessageCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { CrewCard } from "@/components/crew/crew-card";
import { AppShell } from "@/components/layout/app-shell";
import { formatBriefDate } from "@/components/news/news-card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getArticleBySlug, listCrew } from "@/lib/api";
import { cn, copyToClipboard } from "@/lib/utils";

export const Route = createFileRoute("/news/$slug")({ component: NewsArticle });

function NewsArticle() {
  const { slug } = Route.useParams();
  const articleQ = useQuery({
    queryKey: ["news", slug],
    queryFn: () => getArticleBySlug({ data: slug }),
  });
  const crewQ = useQuery({
    queryKey: ["crew"],
    queryFn: () => listCrew({ data: {} }),
  });
  const article = articleQ.data;
  const related = (crewQ.data ?? [])
    .filter((c) => !article?.department || c.department === article.department)
    .slice(0, 3);

  if (articleQ.isPending) {
    return (
      <AppShell>
        <div className="mx-auto max-w-3xl px-4 py-16 text-muted-foreground">Loading briefing…</div>
      </AppShell>
    );
  }
  if (!article) {
    return (
      <AppShell>
        <div className="mx-auto max-w-3xl px-4 py-16">
          <h1 className="font-display text-3xl">Briefing not found</h1>
        </div>
      </AppShell>
    );
  }

  const paragraphs = article.body.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);

  return (
    <AppShell>
      <article className="mx-auto grid max-w-5xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_300px]">
        <div>
          <p className="text-xs tracking-[0.18em] text-primary uppercase">Corridor briefing</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Badge tone="primary">{article.region}</Badge>
            <Badge>{article.category}</Badge>
            <Badge>{formatBriefDate(article.publishedAt)}</Badge>
          </div>
          <h1 className="mt-4 font-display text-4xl tracking-tight">{article.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{article.dek}</p>
          <div className="mt-8 space-y-4 text-base leading-relaxed">
            {paragraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
          {related.length > 0 ? (
            <div className="mt-12">
              <h2 className="font-display text-2xl tracking-tight">Fijian crew who fit this note</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Forward a card with the briefing. That is how a Phuket desk sees VitiCrew.
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {related.map((c) => (
                  <CrewCard key={c.id} crew={c} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
        <aside className="space-y-4">
          <ForwardPanel title={article.title} slug={article.slug} dek={article.dek} />
          <Card className="p-5 text-sm text-muted-foreground">
            Agents do not need an account to read this. Sign in only if you want to open tickets on
            the crew cards below.
          </Card>
          <Link to="/news" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
            All briefings
          </Link>
        </aside>
      </article>
    </AppShell>
  );
}

function ForwardPanel({ title, slug, dek }: { title: string; slug: string; dek: string }) {
  const [copied, setCopied] = useState<"link" | "pack" | null>(null);
  const url = useMemo(() => {
    if (typeof window === "undefined") return `/news/${slug}`;
    return `${window.location.origin}/news/${slug}`;
  }, [slug]);
  const pack = [`VitiCrew briefing — ${title}`, dek, url, "Fijian crew board: same origin, /crew"].join("\n\n");
  const mail = `mailto:?subject=${encodeURIComponent(`Pacific–Asia briefing: ${title}`)}&body=${encodeURIComponent(pack)}`;
  const wa = `https://wa.me/?text=${encodeURIComponent(pack)}`;

  async function copy(kind: "link" | "pack") {
    const ok = await copyToClipboard(kind === "link" ? url : pack);
    if (!ok) return;
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1600);
  }

  return (
    <Card className="p-5">
      <p className="text-xs tracking-wide text-muted-foreground uppercase">Forward to a desk</p>
      <h3 className="mt-1 font-display text-2xl tracking-tight">Send this down the corridor</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        WhatsApp a Phuket office. Email Singapore. Pin it in a Denarau group.
      </p>
      <div className="mt-4 flex gap-2">
        <Input readOnly value={url} className="font-mono text-xs" />
        <Button type="button" variant="outline" onClick={() => void copy("link")} aria-label="Copy link">
          {copied === "link" ? <Check className="size-4" /> : <Copy className="size-4" />}
        </Button>
      </div>
      <div className="mt-3 flex flex-col gap-2">
        <Button type="button" variant="subtle" onClick={() => void copy("pack")}>
          {copied === "pack" ? "Copied pack" : "Copy briefing pack"}
        </Button>
        <a href={mail}>
          <Button type="button" variant="outline" className="w-full">
            <Mail className="size-4" />
            Email a desk
          </Button>
        </a>
        <a href={wa} target="_blank" rel="noreferrer">
          <Button type="button" variant="outline" className="w-full">
            <MessageCircle className="size-4" />
            WhatsApp
          </Button>
        </a>
      </div>
    </Card>
  );
}
