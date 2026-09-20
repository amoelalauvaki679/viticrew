-- VitiCrew application schema

create table if not exists app_users (
  user_id      text primary key,
  role         text not null check (role in ('seafarer', 'agent')),
  display_name text not null default '',
  created_at   timestamptz not null default now()
);

create table if not exists crew_profiles (
  id               serial primary key,
  user_id          text unique,
  slug             text not null unique,
  full_name        text not null,
  position         text not null,
  department       text not null,
  home_island      text not null,
  based_in         text not null,
  availability     text not null,
  years_experience int not null default 0,
  bio              text not null default '',
  languages        text not null default 'English, Fijian',
  skills           text not null default '',
  certifications   text not null default '',
  looking_for      text not null default '',
  share_enabled    boolean not null default true,
  photo_hue        int not null default 168,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists crew_profiles_slug_idx on crew_profiles (slug);
create index if not exists crew_profiles_dept_idx on crew_profiles (department);

create table if not exists crew_documents (
  id          serial primary key,
  user_id     text not null,
  profile_id  int not null references crew_profiles(id) on delete cascade,
  doc_type    text not null,
  title       text not null,
  file_name   text not null,
  mime_type   text not null,
  file_data   text not null,
  expires_on  date,
  created_at  timestamptz not null default now()
);

create index if not exists crew_documents_user_idx on crew_documents (user_id);
create index if not exists crew_documents_profile_idx on crew_documents (profile_id);

create table if not exists jobs (
  id            serial primary key,
  user_id       text,
  title         text not null,
  department    text not null,
  position      text not null,
  yacht_name    text not null,
  yacht_type    text not null,
  yacht_length  text not null,
  region        text not null,
  itinerary     text not null,
  start_date    text not null,
  contract_type text not null,
  salary        text not null default '',
  description   text not null,
  requirements  text not null default '',
  posted_at     timestamptz not null default now()
);

create index if not exists jobs_region_idx on jobs (region);

create table if not exists applications (
  id         serial primary key,
  user_id    text not null,
  job_id     int not null references jobs(id) on delete cascade,
  profile_id int,
  cover_note text not null default '',
  created_at timestamptz not null default now(),
  unique (user_id, job_id)
);

create index if not exists applications_user_idx on applications (user_id);
create index if not exists applications_job_idx on applications (job_id);

create table if not exists agencies (
  id         serial primary key,
  user_id    text unique,
  name       text not null,
  city       text not null,
  country    text not null,
  region     text not null,
  focus      text not null,
  email      text not null default '',
  website    text not null default '',
  about      text not null default '',
  created_at timestamptz not null default now()
);
