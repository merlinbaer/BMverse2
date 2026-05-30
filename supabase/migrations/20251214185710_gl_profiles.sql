-- User profile stuff --
CREATE TYPE public.user_role AS enum (
    'user',
    'admin',
    'moderator'
    );

CREATE TYPE public.user_region AS enum (
    'UNKN',
    'JPAN',
    'NOAM',
    'LATM',
    'EURO',
    'UKIE',
    'EASI',
    'SEAS',
    'OCEA',
    'MEAF'

    );

CREATE TABLE
    public.gl_profiles
(
    id          uuid primary key references auth.users (id) on delete cascade,
    created_at  timestamp with time zone not null default now(),
    updated_at  timestamp with time zone not null default now(),
    deleted     boolean                  null     default false,
    user_email  text                     not null,
    user_role   public.user_role         not null default 'user',
    user_name   text                     null,
    user_region public.user_region       not null default 'UNKN'
) tablespace pg_default;

GRANT SELECT ON public.gl_profiles TO anon;
GRANT SELECT, UPDATE ON TABLE public.gl_profiles TO authenticated;
GRANT ALL ON TABLE public.gl_profiles TO service_role;

ALTER TABLE public.gl_profiles
    ENABLE ROW LEVEL SECURITY;

CREATE POLICY users_can_read_own_profile
    ON public.gl_profiles
    FOR SELECT
    using (id = auth.uid());

CREATE POLICY users_can_update_own_profile
    ON public.gl_profiles
    FOR UPDATE
    USING (id = auth.uid())
    WITH CHECK (
    id = auth.uid() AND
    created_at = public.gl_profiles.created_at AND
    deleted = public.gl_profiles.deleted AND
    user_email = public.gl_profiles.user_email AND
    user_role = public.gl_profiles.user_role
    );

CREATE TRIGGER handle_times
    BEFORE INSERT
        OR
        UPDATE
    ON gl_profiles
    FOR each row
execute function handle_times();
