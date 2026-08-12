
create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  ip_hash text
);
grant all on public.sessions to service_role;
alter table public.sessions enable row level security;

create table public.quiz_sessions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.sessions(id) on delete set null,
  interests text[] not null default '{}',
  questions jsonb,
  answers jsonb,
  city text,
  created_at timestamptz not null default now()
);
grant all on public.quiz_sessions to service_role;
alter table public.quiz_sessions enable row level security;

create table public.career_results (
  id uuid primary key default gen_random_uuid(),
  quiz_session_id uuid references public.quiz_sessions(id) on delete cascade,
  result_json jsonb not null,
  created_at timestamptz not null default now()
);
grant all on public.career_results to service_role;
alter table public.career_results enable row level security;

create table public.college_queries (
  id uuid primary key default gen_random_uuid(),
  college_name text not null,
  stream text not null,
  category text not null default 'General',
  board_percentage text,
  result_json jsonb,
  research_confidence text,
  created_at timestamptz not null default now(),
  cached_until timestamptz
);
create index college_queries_lookup_idx on public.college_queries (college_name, stream, category);
grant all on public.college_queries to service_role;
alter table public.college_queries enable row level security;

create table public.accuracy_reports (
  id uuid primary key default gen_random_uuid(),
  result_type text,
  result_id uuid,
  reported_issue text,
  created_at timestamptz not null default now()
);
grant all on public.accuracy_reports to service_role;
alter table public.accuracy_reports enable row level security;
