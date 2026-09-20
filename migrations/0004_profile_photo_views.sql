-- Profile photo and public-card views

alter table crew_profiles add column if not exists photo_data text;
alter table crew_profiles add column if not exists photo_mime text;
alter table crew_profiles add column if not exists view_count int not null default 0;

create table if not exists profile_views (
  id              serial primary key,
  profile_id      int not null references crew_profiles(id) on delete cascade,
  viewer_user_id  text,
  viewer_label    text not null default 'Yacht desk',
  created_at      timestamptz not null default now()
);

create index if not exists profile_views_profile_idx on profile_views (profile_id, created_at desc);
create index if not exists crew_profiles_views_idx on crew_profiles (view_count desc);
