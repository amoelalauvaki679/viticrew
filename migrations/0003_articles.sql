create table if not exists articles (
  id            serial primary key,
  user_id       text,
  slug          text not null unique,
  title         text not null,
  dek           text not null default '',
  body          text not null,
  region        text not null,
  category      text not null,
  department    text not null default '',
  published_at  timestamptz not null default now(),
  created_at    timestamptz not null default now()
);

create index if not exists articles_published_idx on articles (published_at desc);
create index if not exists articles_region_idx on articles (region);
