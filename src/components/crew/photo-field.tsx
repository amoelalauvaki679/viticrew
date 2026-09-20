import { useRef, useState } from "react";
import { toast } from "sonner";
import { Camera } from "lucide-react";
import { CrewAvatar } from "@/components/brand/mark";
import { Button, buttonVariants } from "@/components/ui/button";
import { removeProfilePhoto, uploadProfilePhoto } from "@/lib/api";
import { ALLOWED_PHOTO_MIME, MAX_PHOTO_BYTES } from "@/lib/constants";
import type { CrewProfile } from "@/lib/types";
import { cn, fileToDataUrl } from "@/lib/utils";

export function PhotoField({
  crew,
  onChanged,
}: {
  crew: CrewProfile;
  onChanged: (next: CrewProfile) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function onFile(file: File | undefined) {
    if (!file) return;
    if (!ALLOWED_PHOTO_MIME.includes(file.type)) {
      toast.error("Upload a JPG, PNG, or WebP.");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      toast.error("Keep the photo under 1 MB.");
      return;
    }
    setBusy(true);
    try {
      const fileData = await fileToDataUrl(file);
      const next = await uploadProfilePhoto({ data: { mimeType: file.type, fileData } });
      onChanged(next);
      toast.success("Photo on your card.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not upload.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function remove() {
    setBusy(true);
    try {
      const next = await removeProfilePhoto();
      onChanged(next);
      toast.success("Photo removed.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not remove.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <CrewAvatar
        name={crew.fullName}
        hue={crew.photoHue}
        size="lg"
        slug={crew.slug}
        hasPhoto={crew.hasPhoto}
        stamp={crew.photoStamp}
      />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium tracking-wide text-muted-foreground">Profile photo</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Captains and Asia-Pacific desks see this on your public card.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <label className={cn(buttonVariants({ variant: "outline" }), "cursor-pointer")}>
            <Camera className="size-4" />
            {busy ? "Uploading…" : crew.hasPhoto ? "Replace photo" : "Upload photo"}
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              disabled={busy}
              onChange={(e) => void onFile(e.target.files?.[0])}
            />
          </label>
          {crew.hasPhoto ? (
            <Button type="button" variant="ghost" disabled={busy} onClick={() => void remove()}>
              Remove
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
