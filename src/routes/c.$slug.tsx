import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { CrewAvatar } from "@/components/brand/mark";
import { AppShell } from "@/components/layout/app-shell";
import { SharePanel } from "@/components/share/share-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAccount, getCrewBySlug, getDocumentFile, listDocumentMeta, recordProfileView } from "@/lib/api";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { docLabel } from "@/lib/constants";
import { formatCount, formatList } from "@/lib/utils";

export const Route = createFileRoute("/c/$slug")({ component: PublicCrew });

function PublicCrew() {
  const { slug } = Route.useParams();
  const { user, isPending: authPending } = useCurrentUserState();
  const [views, setViews] = useState<number | null>(null);
  const crewQ = useQuery({ queryKey: ["crew", slug], queryFn: () => getCrewBySlug({ data: slug }) });
  const docsQ = useQuery({
    queryKey: ["docs-meta", crewQ.data?.id],
    queryFn: () => listDocumentMeta({ data: crewQ.data!.id }),
    enabled: !!crewQ.data,
  });
  const accountQ = useQuery({
    queryKey: ["account"],
    queryFn: () => getAccount(),
    enabled: !!user,
  });
  const canOpen = accountQ.data?.role === "agent" || accountQ.data?.userId === crewQ.data?.userId;

  useEffect(() => {
    if (!slug || !crewQ.data || authPending) return;
    const current = crewQ.data.viewCount;
    if (user && crewQ.data.userId === user.id) {
      setViews(current);
      return;
    }
    const key = `viti-view:${slug}`;
    try {
      if (sessionStorage.getItem(key)) {
        setViews(current);
        return;
      }
      sessionStorage.setItem(key, "1");
    } catch {
      // private mode
    }
    void recordProfileView({ data: slug })
      .then((r) => setViews(r.viewCount))
      .catch(() => setViews(current));
  }, [slug, crewQ.data, user, authPending]);

  async function openDoc(id: number, fileName: string, mime: string) {
    const file = await getDocumentFile({ data: id });
    const bin = Uint8Array.from(atob(file.fileData), (c) => c.charCodeAt(0));
    const blob = new Blob([bin], { type: mime || file.mimeType });
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = file.fileName || fileName;
    a.click();
    URL.revokeObjectURL(href);
  }

  const crew = crewQ.data;
  if (crewQ.isPending) {
    return (
      <AppShell>
        <div className="mx-auto max-w-4xl px-4 py-16 text-muted-foreground">Loading card…</div>
      </AppShell>
    );
  }
  if (!crew) {
    return (
      <AppShell>
        <div className="mx-auto max-w-4xl px-4 py-16">
          <h1 className="font-display text-3xl">Crew card not found</h1>
          <p className="mt-2 text-muted-foreground">This link may be private or no longer shared.</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="flex gap-4">
            <CrewAvatar
              name={crew.fullName}
              hue={crew.photoHue}
              size="lg"
              slug={crew.slug}
              hasPhoto={crew.hasPhoto}
              stamp={crew.photoStamp}
            />
            <div>
              <p className="text-xs tracking-[0.18em] text-primary uppercase">{crew.department}</p>
              <h1 className="mt-1 font-display text-4xl tracking-tight">{crew.fullName}</h1>
              <p className="mt-1 text-lg text-primary">{crew.position}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge tone={crew.availability === "Immediate" ? "ok" : "default"}>
                  {crew.availability}
                </Badge>
                <Badge>{crew.homeIsland}</Badge>
                <Badge>{crew.yearsExperience} years</Badge>
                <Badge className="gap-1">
                  <Eye className="size-3.5" aria-hidden="true" />
                  {formatCount(views ?? crew.viewCount)} views
                </Badge>
              </div>
            </div>
          </div>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground">{crew.bio}</p>
          <dl className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-xs tracking-wide text-muted-foreground uppercase">Based</dt>
              <dd className="mt-1">{crew.basedIn}</dd>
            </div>
            <div>
              <dt className="text-xs tracking-wide text-muted-foreground uppercase">Looking for</dt>
              <dd className="mt-1">{crew.lookingFor || "Open"}</dd>
            </div>
            <div>
              <dt className="text-xs tracking-wide text-muted-foreground uppercase">Languages</dt>
              <dd className="mt-1">{crew.languages}</dd>
            </div>
            <div>
              <dt className="text-xs tracking-wide text-muted-foreground uppercase">Skills</dt>
              <dd className="mt-2 flex flex-wrap gap-1.5">
                {formatList(crew.skills).map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </dd>
            </div>
          </dl>
          <div className="mt-8">
            <h2 className="font-display text-2xl">Tickets held</h2>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {formatList(crew.certifications).map((c) => (
                <Badge key={c} tone="primary">
                  {c}
                </Badge>
              ))}
            </div>
          </div>
          <div className="mt-8">
            <h2 className="font-display text-2xl">Document vault</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Names and expiry are public. Files open for the seafarer and signed-in yacht agents.
            </p>
            <ul className="mt-4 divide-y divide-border rounded-xl border border-border">
              {(docsQ.data ?? []).length === 0 ? (
                <li className="px-4 py-4 text-sm text-muted-foreground">
                  No files uploaded yet — listed tickets above still stand.
                </li>
              ) : (
                (docsQ.data ?? []).map((d) => (
                  <li key={d.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                    <div>
                      <p className="text-sm">{d.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {docLabel(d.docType)}
                        {d.expiresOn ? ` · expires ${d.expiresOn}` : ""}
                      </p>
                    </div>
                    {canOpen ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => void openDoc(d.id, d.fileName, d.mimeType)}
                      >
                        Open
                      </Button>
                    ) : (
                      <Badge>On file</Badge>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
        <div className="space-y-4">
          <SharePanel crew={crew} />
          <Card className="p-5 text-sm text-muted-foreground">
            Share this page with any yacht agent from Fiji through Southeast Asia. They do not need
            an account to read the card.
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
