import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  deleteDocument,
  getAccount,
  getDocumentFile,
  listMyDocuments,
  uploadDocument,
} from "@/lib/api";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { ALLOWED_DOC_MIME, DOC_TYPES, MAX_DOC_BYTES, docLabel } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/documents")({ component: DocumentsPage });

function DocumentsPage() {
  const { user, isPending } = useCurrentUserState();
  const qc = useQueryClient();
  const accountQ = useQuery({
    queryKey: ["account"],
    queryFn: () => getAccount(),
    enabled: !!user,
  });
  const docsQ = useQuery({
    queryKey: ["my-docs"],
    queryFn: () => listMyDocuments(),
    enabled: !!user,
  });
  const [docType, setDocType] = useState("stcw");
  const [title, setTitle] = useState("");
  const [expiresOn, setExpiresOn] = useState("");
  const [busy, setBusy] = useState(false);

  async function onFile(file: File | undefined) {
    if (!file) return;
    if (!ALLOWED_DOC_MIME.includes(file.type)) {
      toast.error("Upload a PDF, JPG, PNG, or WebP.");
      return;
    }
    if (file.size > MAX_DOC_BYTES) {
      toast.error("Keep files under 1 MB.");
      return;
    }
    setBusy(true);
    try {
      const fileData = await readDataUrl(file);
      await uploadDocument({
        data: {
          docType,
          title: title.trim() || file.name,
          fileName: file.name,
          mimeType: file.type,
          fileData,
          expiresOn: expiresOn || null,
        },
      });
      setTitle("");
      await qc.invalidateQueries({ queryKey: ["my-docs"] });
      toast.success("Document stored.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: number) {
    await deleteDocument({ data: id });
    await qc.invalidateQueries({ queryKey: ["my-docs"] });
    toast.success("Removed.");
  }

  async function open(id: number, fileName: string, mime: string) {
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

  if (isPending || (user && accountQ.isPending)) {
    return (
      <AppShell>
        <div className="mx-auto max-w-2xl px-4 py-16 text-muted-foreground">Loading vault…</div>
      </AppShell>
    );
  }
  if (!user) return <RedirectToSignIn />;
  if (accountQ.data?.role === "agent") {
    return (
      <AppShell>
        <div className="mx-auto max-w-2xl px-4 py-16">
          <h1 className="font-display text-3xl">Vaults belong to seafarers</h1>
          <Link to="/crew" className={cn(buttonVariants(), "mt-6")}>
            Open a crew card instead
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-4xl tracking-tight">Document vault</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          STCW, seaman’s book, medical, passport, CV. Agents who are signed in can open files from
          your public card. The rest of the world only sees that the ticket is on file.
        </p>
        <Card className="mt-8 p-5">
          <p className="text-sm font-medium">Upload</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Select value={docType} onChange={(e) => setDocType(e.target.value)}>
              {DOC_TYPES.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </Select>
            <Input
              placeholder="Label (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input type="date" value={expiresOn} onChange={(e) => setExpiresOn(e.target.value)} />
            <Input
              type="file"
              accept=".pdf,image/jpeg,image/png,image/webp"
              disabled={busy}
              onChange={(e) => void onFile(e.target.files?.[0])}
            />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">PDF or image, 1 MB max.</p>
        </Card>
        <ul className="mt-6 divide-y divide-border rounded-xl border border-border">
          {(docsQ.data ?? []).length === 0 ? (
            <li className="px-4 py-5 text-sm text-muted-foreground">Nothing in the vault yet.</li>
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
                <div className="flex gap-2">
                  <Badge>On file</Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => void open(d.id, d.fileName, d.mimeType)}
                  >
                    Open
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => void remove(d.id)}>
                    Remove
                  </Button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </AppShell>
  );
}

function readDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}
