import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";

function bytesFromBase64(raw: string) {
  const bin = atob(raw);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export const Route = createFileRoute("/api/crew-photo/$slug")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const slug = decodeURIComponent(url.pathname.split("/").pop() ?? "");
        if (!slug) return new Response("Not found", { status: 404 });
        const sql = await getSql();
        const rows = await sql<{ photo_data: string | null; photo_mime: string | null }>`
          select photo_data, photo_mime from crew_profiles where slug = ${slug}
        `;
        const row = rows[0];
        if (!row?.photo_data || !row.photo_mime) {
          return new Response("Not found", { status: 404 });
        }
        const raw = row.photo_data.includes(",") ? row.photo_data.split(",")[1] : row.photo_data;
        if (!raw) return new Response("Not found", { status: 404 });
        return new Response(bytesFromBase64(raw), {
          headers: {
            "Content-Type": row.photo_mime,
            "Cache-Control": "public, max-age=120",
          },
        });
      },
    },
  },
});
