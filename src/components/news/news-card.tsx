import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Article } from "@/lib/types";
import { cn } from "@/lib/utils";

export function formatBriefDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function NewsCard({
  article,
  featured = false,
}: {
  article: Article;
  featured?: boolean;
}) {
  return (
    <Link to="/news/$slug" params={{ slug: article.slug }} className="block">
      <Card
        className={cn(
          "h-full transition-[box-shadow] duration-150 hover:ring-1 hover:ring-primary",
          featured ? "p-6 sm:p-8" : "p-5",
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="primary">{article.region}</Badge>
          <Badge>{article.category}</Badge>
          <span className="text-xs text-muted-foreground">{formatBriefDate(article.publishedAt)}</span>
        </div>
        <h3
          className={cn(
            "mt-3 font-display leading-snug tracking-tight",
            featured ? "text-3xl sm:text-4xl" : "text-xl",
          )}
        >
          {article.title}
        </h3>
        <p className={cn("mt-2 text-muted-foreground", featured ? "text-base" : "text-sm")}>
          {article.dek}
        </p>
        {featured ? (
          <p className="mt-5 text-sm text-primary">Read briefing →</p>
        ) : null}
      </Card>
    </Link>
  );
}