import { Check, Copy, Mail, MessageCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { copyToClipboard } from "@/lib/utils";
import type { CrewProfile } from "@/lib/types";

function pack(crew: CrewProfile, url: string) {
  return [
    `VitiCrew — ${crew.fullName}`,
    `${crew.position} · ${crew.homeIsland} · ${crew.availability}`,
    `${crew.yearsExperience} years · ${crew.certifications}`,
    crew.lookingFor ? `Seeking: ${crew.lookingFor}` : "",
    url,
  ]
    .filter(Boolean)
    .join("\n");
}

export function SharePanel({ crew }: { crew: CrewProfile }) {
  const [copied, setCopied] = useState<"link" | "pack" | null>(null);
  const url = useMemo(() => {
    if (typeof window === "undefined") return `/c/${crew.slug}`;
    return `${window.location.origin}/c/${crew.slug}`;
  }, [crew.slug]);
  const text = pack(crew, url);
  const mail = `mailto:?subject=${encodeURIComponent(`Fijian crew: ${crew.fullName}`)}&body=${encodeURIComponent(text)}`;
  const wa = `https://wa.me/?text=${encodeURIComponent(text)}`;

  async function copy(kind: "link" | "pack") {
    const value = kind === "link" ? url : text;
    const ok = await copyToClipboard(value);
    if (!ok) return;
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1600);
  }

  return (
    <Card className="p-5">
      <p className="text-xs tracking-wide text-muted-foreground uppercase">Share with agents</p>
      <h3 className="mt-1 font-display text-2xl tracking-tight">One link, Asia-Pacific wide</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Send this crew card to a yacht desk in Denarau, Singapore, Phuket, or Auckland. No login required to view.
      </p>
      <div className="mt-4 flex gap-2">
        <Input readOnly value={url} className="font-mono text-xs" />
        <Button type="button" variant="outline" onClick={() => void copy("link")} aria-label="Copy link">
          {copied === "link" ? <Check className="size-4" /> : <Copy className="size-4" />}
        </Button>
      </div>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <Button type="button" variant="subtle" className="flex-1" onClick={() => void copy("pack")}>
          {copied === "pack" ? "Copied pack" : "Copy intro pack"}
        </Button>
        <a href={mail} className="flex-1">
          <Button type="button" variant="outline" className="w-full">
            <Mail className="size-4" />
            Email
          </Button>
        </a>
        <a href={wa} target="_blank" rel="noreferrer" className="flex-1">
          <Button type="button" variant="outline" className="w-full">
            <MessageCircle className="size-4" />
            WhatsApp
          </Button>
        </a>
      </div>
    </Card>
  );
}
