import { Link } from "@tanstack/react-router";
import { Eye } from "lucide-react";
import { CrewAvatar } from "@/components/brand/mark";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { CrewCard as CrewCardType } from "@/lib/types";
import { formatCount } from "@/lib/utils";

export function CrewCard({ crew }: { crew: CrewCardType }) {
  return (
    <Link to="/c/$slug" params={{ slug: crew.slug }} className="block">
      <Card className="h-full p-4 transition-[box-shadow] duration-150 hover:ring-1 hover:ring-primary">
        <div className="flex gap-4">
          <CrewAvatar
            name={crew.fullName}
            hue={crew.photoHue}
            slug={crew.slug}
            hasPhoto={crew.hasPhoto}
            stamp={crew.photoStamp}
          />
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg leading-snug tracking-tight">{crew.fullName}</p>
            <p className="mt-0.5 text-sm text-primary">{crew.position}</p>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {crew.homeIsland} · {crew.yearsExperience} yrs
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <Badge tone={crew.availability === "Immediate" ? "ok" : "default"}>
                {crew.availability}
              </Badge>
              <Badge>{crew.department}</Badge>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Eye className="size-3.5" aria-hidden="true" />
                {formatCount(crew.viewCount)} views
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
