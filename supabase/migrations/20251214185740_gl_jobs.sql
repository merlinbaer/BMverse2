-- DROP TABLE IF EXISTS public.gl_jobs;

CREATE TABLE
  public.gl_jobs (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    deleted boolean null default false,
    name text not null,
    status text not null,
    message text null,
    constraint gl_jobs_pkey primary key (id)
  ) tablespace pg_default;

GRANT ALL ON TABLE public.gl_jobs TO service_role;

CREATE TRIGGER handle_times BEFORE INSERT
OR
UPDATE ON gl_jobs FOR each row
execute function handle_times ();

ALTER TABLE public.gl_jobs ENABLE ROW LEVEL SECURITY;
