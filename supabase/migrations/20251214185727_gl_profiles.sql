CREATE TYPE public.user_role AS enum (
  'user',
  'admin',
  'moderator'
);

CREATE TABLE 
  public.gl_profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    deleted boolean null default false,
    user_email text not null,
    user_role public.user_role not null default 'user',
    user_name text null,
    user_country text null,
    last_seen_at timestamp with time zone null default now()
) tablespace pg_default;

CREATE POLICY users_can_read_own_profile
  ON public.gl_profiles
  FOR SELECT
  using (id = auth.uid());

ALTER TABLE public.gl_profiles ENABLE ROW LEVEL SECURITY;
