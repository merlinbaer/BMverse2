-- Table public.gl_installs

CREATE TABLE
  public.gl_installs (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    deleted boolean null default false,
    install_date date not null,
    install_count integer not null,
    install_target text not null,
    constraint gl_installs_pkey primary key (id)
  ) tablespace pg_default;

GRANT ALL ON TABLE public.gl_installs TO service_role;

-- Revoke all from other roles to ensure only service_role can use it
REVOKE ALL ON TABLE public.gl_installs FROM anon, authenticated;

CREATE TRIGGER handle_times BEFORE INSERT
OR
UPDATE ON gl_installs FOR each row
execute function handle_times ();

ALTER TABLE public.gl_installs ENABLE ROW LEVEL SECURITY;
