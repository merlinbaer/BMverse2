-- User stuff --
CREATE TABLE
    public.gl_users
(
    id           uuid primary key references auth.users (id) on delete cascade,
    created_at   timestamp with time zone not null default now(),
    updated_at   timestamp with time zone not null default now(),
    deleted      boolean                  null     default false,
    last_seen_at timestamp with time zone not null default now()
) tablespace pg_default;

GRANT SELECT ON public.gl_users TO anon;
GRANT SELECT, UPDATE ON TABLE public.gl_users TO authenticated;
GRANT ALL ON TABLE public.gl_users TO service_role;

ALTER TABLE public.gl_users
    ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER handle_times
    BEFORE INSERT
        OR
        UPDATE
    ON gl_users
    FOR each row
execute function handle_times();
