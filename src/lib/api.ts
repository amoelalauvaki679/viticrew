import { createServerFn } from "@tanstack/react-start";
import { authMiddleware, optionalAuthMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { ALLOWED_DOC_MIME, ALLOWED_PHOTO_MIME, MAX_DOC_BYTES, MAX_PHOTO_BYTES } from "@/lib/constants";
import { ensureSeed } from "@/lib/seed";
import type {
  Account,
  Agency,
  Application,
  CrewCard,
  CrewProfile,
  DocumentMeta,
  Job,
  JobInput,
  ProfileInput,
  ProfileView,
  Role,
  Article,
  ArticleInput,
} from "@/lib/types";
import { hueFromName, slugify } from "@/lib/utils";

type CrewRow = {
  id: number;
  user_id: string | null;
  slug: string;
  full_name: string;
  position: string;
  department: string;
  home_island: string;
  based_in: string;
  availability: string;
  years_experience: number;
  bio: string;
  languages: string;
  skills: string;
  certifications: string;
  looking_for: string;
  share_enabled: boolean;
  photo_hue: number;
  view_count?: number;
  has_photo?: boolean;
  updated_at?: string;
  doc_count?: number;
};

type JobRow = {
  id: number;
  user_id: string | null;
  title: string;
  department: string;
  position: string;
  yacht_name: string;
  yacht_type: string;
  yacht_length: string;
  region: string;
  itinerary: string;
  start_date: string;
  contract_type: string;
  salary: string;
  description: string;
  requirements: string;
  posted_at: string;
};

type AgencyRow = {
  id: number;
  user_id: string | null;
  name: string;
  city: string;
  country: string;
  region: string;
  focus: string;
  email: string;
  website: string;
  about: string;
};

type DocRow = {
  id: number;
  profile_id: number;
  doc_type: string;
  title: string;
  file_name: string;
  mime_type: string;
  expires_on: string | null;
  created_at: string;
};

type ArticleRow = {
  id: number;
  user_id: string | null;
  slug: string;
  title: string;
  dek: string;
  body: string;
  region: string;
  category: string;
  department: string;
  published_at: string;
};

function mapCrew(row: CrewRow): CrewProfile {
  return {
    id: row.id,
    userId: row.user_id,
    slug: row.slug,
    fullName: row.full_name,
    position: row.position,
    department: row.department,
    homeIsland: row.home_island,
    basedIn: row.based_in,
    availability: row.availability,
    yearsExperience: Number(row.years_experience),
    bio: row.bio,
    languages: row.languages,
    skills: row.skills,
    certifications: row.certifications,
    lookingFor: row.looking_for,
    shareEnabled: Boolean(row.share_enabled),
    photoHue: Number(row.photo_hue),
    hasPhoto: Boolean(row.has_photo),
    viewCount: Number(row.view_count ?? 0),
    photoStamp: row.updated_at ?? "",
  };
}

const CREW_LIST_SQL = `
  select p.id, p.user_id, p.slug, p.full_name, p.position, p.department, p.home_island,
         p.based_in, p.availability, p.years_experience, p.bio, p.languages, p.skills,
         p.certifications, p.looking_for, p.share_enabled, p.photo_hue,
         coalesce(p.view_count, 0)::int as view_count,
         (p.photo_data is not null and char_length(p.photo_data) > 20) as has_photo,
         p.updated_at::text as updated_at,
         (select count(*)::int from crew_documents d where d.profile_id = p.id) as doc_count
  from crew_profiles p
`;

function mapCrewCard(row: CrewRow): CrewCard {
  return { ...mapCrew(row), docCount: Number(row.doc_count ?? 0) };
}

function mapJob(row: JobRow): Job {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    department: row.department,
    position: row.position,
    yachtName: row.yacht_name,
    yachtType: row.yacht_type,
    yachtLength: row.yacht_length,
    region: row.region,
    itinerary: row.itinerary,
    startDate: row.start_date,
    contractType: row.contract_type,
    salary: row.salary,
    description: row.description,
    requirements: row.requirements,
    postedAt: row.posted_at,
  };
}

function mapAgency(row: AgencyRow): Agency {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    city: row.city,
    country: row.country,
    region: row.region,
    focus: row.focus,
    email: row.email,
    website: row.website,
    about: row.about,
  };
}

function mapDoc(row: DocRow): DocumentMeta {
  return {
    id: row.id,
    profileId: row.profile_id,
    docType: row.doc_type,
    title: row.title,
    fileName: row.file_name,
    mimeType: row.mime_type,
    expiresOn: row.expires_on,
    createdAt: row.created_at,
  };
}

function mapArticle(row: ArticleRow): Article {
  return {
    id: row.id,
    userId: row.user_id,
    slug: row.slug,
    title: row.title,
    dek: row.dek,
    body: row.body,
    region: row.region,
    category: row.category,
    department: row.department,
    publishedAt: row.published_at,
  };
}

async function uniqueSlug(sql: Awaited<ReturnType<typeof getSql>>, base: string) {
  let slug = slugify(base);
  for (let i = 0; i < 12; i++) {
    const hit = await sql<{ n: number }>`select count(*)::int as n from crew_profiles where slug = ${slug}`;
    if ((hit[0]?.n ?? 0) === 0) return slug;
    slug = `${slugify(base)}-${Math.random().toString(36).slice(2, 6)}`;
  }
  return `${slugify(base)}-${Date.now().toString(36)}`;
}

export const getAccount = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Account | null> => {
    const sql = await getSql();
    await ensureSeed(sql);
    const rows = await sql<{ user_id: string; role: Role; display_name: string }>`
      select user_id, role, display_name from app_users where user_id = ${context.userId}
    `;
    const row = rows[0];
    if (!row) return null;
    return { userId: row.user_id, role: row.role, displayName: row.display_name };
  });

export const setRole = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { role: Role; displayName: string }) => data)
  .handler(async ({ context, data }): Promise<Account> => {
    if (data.role !== "seafarer" && data.role !== "agent") {
      throw new Error("Choose seafarer or agent.");
    }
    const sql = await getSql();
    const name = data.displayName.trim() || "Crew";
    await sql`
      insert into app_users (user_id, role, display_name)
      values (${context.userId}, ${data.role}, ${name})
      on conflict (user_id) do update set role = excluded.role, display_name = excluded.display_name
    `;
    if (data.role === "seafarer") {
      const existing = await sql<{ id: number }>`select id from crew_profiles where user_id = ${context.userId}`;
      if (!existing[0]) {
        const slug = await uniqueSlug(sql, name);
        await sql`
          insert into crew_profiles (
            user_id, slug, full_name, position, department, home_island, based_in,
            availability, years_experience, bio, languages, skills, certifications,
            looking_for, share_enabled, photo_hue
          ) values (
            ${context.userId}, ${slug}, ${name}, 'Deckhand', 'Deck', 'Suva, Viti Levu',
            'Fiji', 'Immediate', 0, '', 'English, Fijian', '', '', '',
            true, ${hueFromName(name)}
          )
        `;
      }
    }
    return { userId: context.userId, role: data.role, displayName: name };
  });

export const listCrew = createServerFn({ method: "GET" })
  .validator((data?: { department?: string; availability?: string; q?: string }) => data ?? {})
  .handler(async ({ data }): Promise<CrewCard[]> => {
    const sql = await getSql();
    await ensureSeed(sql);
    const department = data.department?.trim() || "";
    const availability = data.availability?.trim() || "";
    const q = data.q?.trim().toLowerCase() || "";
    const rows = await sql.query<CrewRow>(
      `${CREW_LIST_SQL} where p.share_enabled = true order by p.years_experience desc, p.full_name`,
    );
    return rows
      .map(mapCrewCard)
      .filter((c) => {
        if (department && c.department !== department) return false;
        if (availability && c.availability !== availability) return false;
        if (!q) return true;
        const hay = `${c.fullName} ${c.position} ${c.homeIsland} ${c.skills} ${c.certifications}`.toLowerCase();
        return hay.includes(q);
      });
  });

export const getCrewBySlug = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }): Promise<CrewCard | null> => {
    const sql = await getSql();
    await ensureSeed(sql);
    const rows = await sql.query<CrewRow>(
      `${CREW_LIST_SQL} where p.slug = $1 and p.share_enabled = true`,
      [slug],
    );
    return rows[0] ? mapCrewCard(rows[0]) : null;
  });

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<CrewProfile | null> => {
    const sql = await getSql();
    const rows = await sql.query<CrewRow>(`${CREW_LIST_SQL} where p.user_id = $1`, [context.userId]);
    return rows[0] ? mapCrew(rows[0]) : null;
  });

export const saveMyProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: ProfileInput) => data)
  .handler(async ({ context, data }): Promise<CrewProfile> => {
    const sql = await getSql();
    const name = data.fullName.trim();
    if (name.length < 2) throw new Error("Name is required.");
    const existing = await sql<{ id: number }>`select id from crew_profiles where user_id = ${context.userId}`;
    if (existing[0]) {
      await sql`
        update crew_profiles set
          full_name = ${name},
          position = ${data.position},
          department = ${data.department},
          home_island = ${data.homeIsland},
          based_in = ${data.basedIn},
          availability = ${data.availability},
          years_experience = ${Math.max(0, Math.floor(data.yearsExperience))},
          bio = ${data.bio},
          languages = ${data.languages},
          skills = ${data.skills},
          certifications = ${data.certifications},
          looking_for = ${data.lookingFor},
          share_enabled = ${data.shareEnabled},
          updated_at = now()
        where user_id = ${context.userId}
      `;
    } else {
      const slug = await uniqueSlug(sql, name);
      await sql`
        insert into crew_profiles (
          user_id, slug, full_name, position, department, home_island, based_in,
          availability, years_experience, bio, languages, skills, certifications,
          looking_for, share_enabled, photo_hue
        ) values (
          ${context.userId}, ${slug}, ${name}, ${data.position}, ${data.department},
          ${data.homeIsland}, ${data.basedIn}, ${data.availability},
          ${Math.max(0, Math.floor(data.yearsExperience))}, ${data.bio}, ${data.languages},
          ${data.skills}, ${data.certifications}, ${data.lookingFor}, ${data.shareEnabled},
          ${hueFromName(name)}
        )
      `;
    }
    const rows = await sql.query<CrewRow>(`${CREW_LIST_SQL} where p.user_id = $1`, [context.userId]);
    if (!rows[0]) throw new Error("Could not save profile.");
    return mapCrew(rows[0]);
  });

export const listDocumentMeta = createServerFn({ method: "GET" })
  .validator((profileId: number) => profileId)
  .handler(async ({ data: profileId }): Promise<DocumentMeta[]> => {
    const sql = await getSql();
    const rows = await sql<DocRow>`
      select id, profile_id, doc_type, title, file_name, mime_type, expires_on::text as expires_on, created_at::text as created_at
      from crew_documents
      where profile_id = ${profileId}
      order by created_at desc
    `;
    return rows.map(mapDoc);
  });

export const listMyDocuments = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<DocumentMeta[]> => {
    const sql = await getSql();
    const rows = await sql<DocRow>`
      select id, profile_id, doc_type, title, file_name, mime_type, expires_on::text as expires_on, created_at::text as created_at
      from crew_documents
      where user_id = ${context.userId}
      order by created_at desc
    `;
    return rows.map(mapDoc);
  });

export const uploadDocument = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (data: {
      docType: string;
      title: string;
      fileName: string;
      mimeType: string;
      fileData: string;
      expiresOn: string | null;
    }) => data,
  )
  .handler(async ({ context, data }): Promise<DocumentMeta> => {
    const sql = await getSql();
    const profiles = await sql<{ id: number }>`select id from crew_profiles where user_id = ${context.userId}`;
    const profileId = profiles[0]?.id;
    if (!profileId) throw new Error("Create your crew card before uploading documents.");
    if (!ALLOWED_DOC_MIME.includes(data.mimeType)) {
      throw new Error("Upload a PDF, JPG, PNG, or WebP.");
    }
    const raw = data.fileData.includes(",") ? data.fileData.split(",")[1] : data.fileData;
    if (!raw) throw new Error("Empty file.");
    const bytes = Math.floor((raw.length * 3) / 4);
    if (bytes > MAX_DOC_BYTES) throw new Error("Keep files under 1 MB.");
    const title = data.title.trim() || data.fileName;
    const expires = data.expiresOn?.trim() ? data.expiresOn.trim() : null;
    const rows = await sql<DocRow>`
      insert into crew_documents (
        user_id, profile_id, doc_type, title, file_name, mime_type, file_data, expires_on
      ) values (
        ${context.userId}, ${profileId}, ${data.docType}, ${title}, ${data.fileName},
        ${data.mimeType}, ${raw}, ${expires}
      )
      returning id, profile_id, doc_type, title, file_name, mime_type, expires_on::text as expires_on, created_at::text as created_at
    `;
    if (!rows[0]) throw new Error("Upload failed.");
    return mapDoc(rows[0]);
  });

export const deleteDocument = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    await sql`delete from crew_documents where id = ${id} and user_id = ${context.userId}`;
  });

export const getDocumentFile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    const roleRows = await sql<{ role: Role }>`select role from app_users where user_id = ${context.userId}`;
    const role = roleRows[0]?.role;
    const rows = await sql<{
      user_id: string;
      file_name: string;
      mime_type: string;
      file_data: string;
    }>`
      select user_id, file_name, mime_type, file_data from crew_documents where id = ${id}
    `;
    const row = rows[0];
    if (!row) throw new Error("Document not found.");
    if (row.user_id !== context.userId && role !== "agent") {
      throw new Error("Not allowed to view this document.");
    }
    return { fileName: row.file_name, mimeType: row.mime_type, fileData: row.file_data };
  });

export const listJobs = createServerFn({ method: "GET" })
  .validator((data?: { region?: string; department?: string }) => data ?? {})
  .handler(async ({ data }): Promise<Job[]> => {
    const sql = await getSql();
    await ensureSeed(sql);
    const rows = await sql<JobRow>`select * from jobs order by posted_at desc`;
    return rows
      .map(mapJob)
      .filter((j) => {
        if (data.region && j.region !== data.region) return false;
        if (data.department && j.department !== data.department) return false;
        return true;
      });
  });

export const getJob = createServerFn({ method: "GET" })
  .validator((id: number) => id)
  .handler(async ({ data: id }): Promise<Job | null> => {
    const sql = await getSql();
    await ensureSeed(sql);
    const rows = await sql<JobRow>`select * from jobs where id = ${id}`;
    return rows[0] ? mapJob(rows[0]) : null;
  });

export const postJob = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: JobInput) => data)
  .handler(async ({ context, data }): Promise<Job> => {
    const sql = await getSql();
    const account = await sql<{ role: Role }>`select role from app_users where user_id = ${context.userId}`;
    if (account[0]?.role !== "agent") throw new Error("Only yacht agents can post roles.");
    if (!data.title.trim() || !data.yachtName.trim()) throw new Error("Title and yacht name are required.");
    const rows = await sql<JobRow>`
      insert into jobs (
        user_id, title, department, position, yacht_name, yacht_type, yacht_length,
        region, itinerary, start_date, contract_type, salary, description, requirements
      ) values (
        ${context.userId}, ${data.title.trim()}, ${data.department}, ${data.position},
        ${data.yachtName.trim()}, ${data.yachtType}, ${data.yachtLength}, ${data.region},
        ${data.itinerary}, ${data.startDate}, ${data.contractType}, ${data.salary},
        ${data.description}, ${data.requirements}
      )
      returning *
    `;
    if (!rows[0]) throw new Error("Could not post role.");
    return mapJob(rows[0]);
  });

export const applyToJob = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { jobId: number; coverNote: string }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const account = await sql<{ role: Role }>`select role from app_users where user_id = ${context.userId}`;
    if (account[0]?.role !== "seafarer") throw new Error("Sign in as a seafarer to apply.");
    const profile = await sql<{ id: number }>`select id from crew_profiles where user_id = ${context.userId}`;
    const existing = await sql<{ id: number }>`
      select id from applications where user_id = ${context.userId} and job_id = ${data.jobId}
    `;
    if (existing[0]) return { ok: true as const, already: true };
    await sql`
      insert into applications (user_id, job_id, profile_id, cover_note)
      values (${context.userId}, ${data.jobId}, ${profile[0]?.id ?? null}, ${data.coverNote.trim()})
    `;
    return { ok: true as const, already: false };
  });

export const listMyApplications = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Application[]> => {
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      job_id: number;
      cover_note: string;
      created_at: string;
      title: string;
      yacht_name: string;
      region: string;
    }>`
      select a.id, a.job_id, a.cover_note, a.created_at::text as created_at,
             j.title, j.yacht_name, j.region
      from applications a
      join jobs j on j.id = a.job_id
      where a.user_id = ${context.userId}
      order by a.created_at desc
    `;
    return rows.map((r) => ({
      id: r.id,
      jobId: r.job_id,
      coverNote: r.cover_note,
      createdAt: r.created_at,
      jobTitle: r.title,
      yachtName: r.yacht_name,
      region: r.region,
    }));
  });

export const listAgencies = createServerFn({ method: "GET" })
  .validator((data?: { region?: string }) => data ?? {})
  .handler(async ({ data }): Promise<Agency[]> => {
    const sql = await getSql();
    await ensureSeed(sql);
    const rows = await sql<AgencyRow>`select * from agencies order by country, city`;
    return rows.map(mapAgency).filter((a) => !data.region || a.region === data.region);
  });

export const getAgency = createServerFn({ method: "GET" })
  .validator((id: number) => id)
  .handler(async ({ data: id }): Promise<Agency | null> => {
    const sql = await getSql();
    await ensureSeed(sql);
    const rows = await sql<AgencyRow>`select * from agencies where id = ${id}`;
    return rows[0] ? mapAgency(rows[0]) : null;
  });

export const featuredHome = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  await ensureSeed(sql);
  const crew = await sql.query<CrewRow>(
    `${CREW_LIST_SQL} where p.share_enabled = true order by p.years_experience desc limit 6`,
  );
  const jobs = await sql<JobRow>`select * from jobs order by posted_at desc limit 4`;
  const agencies = await sql<AgencyRow>`select * from agencies order by city limit 8`;
  let news: Article[] = [];
  try {
    const rows = await sql<ArticleRow>`
      select id, user_id, slug, title, dek, body, region, category, department,
             published_at::text as published_at
      from articles
      order by published_at desc
      limit 3
    `;
    news = rows.map(mapArticle);
  } catch (err) {
    console.error("[featuredHome] articles", err);
  }
  return {
    crew: crew.map(mapCrewCard),
    jobs: jobs.map(mapJob),
    agencies: agencies.map(mapAgency),
    news,
  };
});

export const listArticles = createServerFn({ method: "GET" })
  .validator((data?: { region?: string; category?: string }) => data ?? {})
  .handler(async ({ data }): Promise<Article[]> => {
    const sql = await getSql();
    await ensureSeed(sql);
    try {
      const rows = await sql<ArticleRow>`
        select id, user_id, slug, title, dek, body, region, category, department,
               published_at::text as published_at
        from articles
        order by published_at desc
      `;
      return rows
        .map(mapArticle)
        .filter((a) => {
          if (data.region && a.region !== data.region) return false;
          if (data.category && a.category !== data.category) return false;
          return true;
        });
    } catch (err) {
      console.error("[listArticles]", err);
      throw new Error("Could not load the corridor briefing.");
    }
  });

export const getArticleBySlug = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }): Promise<Article | null> => {
    const sql = await getSql();
    await ensureSeed(sql);
    const rows = await sql<ArticleRow>`
      select id, user_id, slug, title, dek, body, region, category, department,
             published_at::text as published_at
      from articles
      where slug = ${slug}
    `;
    return rows[0] ? mapArticle(rows[0]) : null;
  });

export const postArticle = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: ArticleInput) => data)
  .handler(async ({ context, data }): Promise<Article> => {
    const sql = await getSql();
    const account = await sql<{ role: Role }>`select role from app_users where user_id = ${context.userId}`;
    if (account[0]?.role !== "agent") throw new Error("Only yacht agents can post a briefing.");
    const title = data.title.trim();
    const body = data.body.trim();
    if (title.length < 8 || body.length < 40) throw new Error("Give the briefing a title and a proper note.");
    let slug = slugify(title);
    for (let i = 0; i < 8; i++) {
      const hit = await sql<{ n: number }>`select count(*)::int as n from articles where slug = ${slug}`;
      if ((hit[0]?.n ?? 0) === 0) break;
      slug = `${slugify(title)}-${Math.random().toString(36).slice(2, 6)}`;
    }
    const rows = await sql<ArticleRow>`
      insert into articles (
        user_id, slug, title, dek, body, region, category, department
      ) values (
        ${context.userId}, ${slug}, ${title}, ${data.dek.trim()}, ${body},
        ${data.region}, ${data.category}, ${data.department}
      )
      returning id, user_id, slug, title, dek, body, region, category, department,
                published_at::text as published_at
    `;
    if (!rows[0]) throw new Error("Could not publish.");
    return mapArticle(rows[0]);
  });

export const uploadProfilePhoto = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { mimeType: string; fileData: string }) => data)
  .handler(async ({ context, data }): Promise<CrewProfile> => {
    if (!ALLOWED_PHOTO_MIME.includes(data.mimeType)) {
      throw new Error("Upload a JPG, PNG, or WebP.");
    }
    const raw = data.fileData.includes(",") ? data.fileData.split(",")[1] : data.fileData;
    if (!raw) throw new Error("Empty photo.");
    const bytes = Math.floor((raw.length * 3) / 4);
    if (bytes > MAX_PHOTO_BYTES) throw new Error("Keep the photo under 1 MB.");
    const sql = await getSql();
    const updated = await sql.query<CrewRow>(
      `update crew_profiles
       set photo_data = $1, photo_mime = $2, updated_at = now()
       where user_id = $3
       returning id`,
      [raw, data.mimeType, context.userId],
    );
    if (!updated[0]) throw new Error("Save your crew card before adding a photo.");
    const rows = await sql.query<CrewRow>(`${CREW_LIST_SQL} where p.user_id = $1`, [context.userId]);
    if (!rows[0]) throw new Error("Could not save photo.");
    return mapCrew(rows[0]);
  });

export const removeProfilePhoto = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<CrewProfile> => {
    const sql = await getSql();
    await sql`
      update crew_profiles
      set photo_data = null, photo_mime = null, updated_at = now()
      where user_id = ${context.userId}
    `;
    const rows = await sql.query<CrewRow>(`${CREW_LIST_SQL} where p.user_id = $1`, [context.userId]);
    if (!rows[0]) throw new Error("Could not remove photo.");
    return mapCrew(rows[0]);
  });

export const recordProfileView = createServerFn({ method: "POST" })
  .middleware([optionalAuthMiddleware])
  .validator((slug: string) => slug)
  .handler(async ({ context, data: slug }): Promise<{ viewCount: number }> => {
    const sql = await getSql();
    const rows = await sql<{ id: number; user_id: string | null; view_count: number }>`
      select id, user_id, coalesce(view_count, 0)::int as view_count
      from crew_profiles
      where slug = ${slug} and share_enabled = true
    `;
    const profile = rows[0];
    if (!profile) return { viewCount: 0 };
    if (context.userId && profile.user_id === context.userId) {
      return { viewCount: Number(profile.view_count) };
    }

    let label = "Yacht desk";
    if (context.userId) {
      const acc = await sql<{ display_name: string; role: Role }>`
        select display_name, role from app_users where user_id = ${context.userId}
      `;
      if (acc[0]?.role === "agent") label = acc[0].display_name || "Agent desk";
      else if (acc[0]) label = "Seafarer";
      const recent = await sql<{ n: number }>`
        select count(*)::int as n from profile_views
        where profile_id = ${profile.id}
          and viewer_user_id = ${context.userId}
          and created_at > now() - interval '6 hours'
      `;
      if ((recent[0]?.n ?? 0) > 0) return { viewCount: Number(profile.view_count) };
    }

    await sql`
      insert into profile_views (profile_id, viewer_user_id, viewer_label)
      values (${profile.id}, ${context.userId}, ${label})
    `;
    const bumped = await sql<{ view_count: number }>`
      update crew_profiles set view_count = coalesce(view_count, 0) + 1
      where id = ${profile.id}
      returning view_count
    `;
    return { viewCount: Number(bumped[0]?.view_count ?? profile.view_count + 1) };
  });

export const listMyProfileViews = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<{ viewCount: number; recent: ProfileView[] }> => {
    const sql = await getSql();
    const mine = await sql<{ id: number; view_count: number }>`
      select id, coalesce(view_count, 0)::int as view_count
      from crew_profiles where user_id = ${context.userId}
    `;
    const profile = mine[0];
    if (!profile) return { viewCount: 0, recent: [] };
    const recent = await sql<{ id: number; viewer_label: string; created_at: string }>`
      select id, viewer_label, created_at::text as created_at
      from profile_views
      where profile_id = ${profile.id}
      order by created_at desc
      limit 12
    `;
    return {
      viewCount: Number(profile.view_count),
      recent: recent.map((r) => ({
        id: r.id,
        viewerLabel: r.viewer_label,
        createdAt: r.created_at,
      })),
    };
  });
