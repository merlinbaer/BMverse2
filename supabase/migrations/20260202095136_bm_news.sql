CREATE TABLE
    public.bm_news
(
    id           uuid                     not null default gen_random_uuid(),
    created_at   timestamp with time zone not null default now(),
    updated_at   timestamp with time zone not null default now(),
    deleted      boolean                  null     default false,
    news_update  timestamp with time zone not null default now(),
    news_info    text                     not null,
    news_updater text                     not null,
    constraint bm_news_pkey primary key (id)
) tablespace pg_default;

ALTER TABLE public.bm_news
    ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER handle_times
    BEFORE INSERT
        OR
        UPDATE
    ON bm_news
    FOR each row
execute function handle_times();

CREATE POLICY allow_anon_users_to_select
    ON public.bm_news
    FOR SELECT
    USING (auth.role() = 'anon');

CREATE POLICY allow_public_users_to_select
    ON public.bm_news
    FOR SELECT
    using (public.is_public_user());

CREATE POLICY allow_moderator_to_insert
    ON public.bm_news
    FOR INSERT
    WITH CHECK (public.is_moderator());

CREATE POLICY allow_moderator_to_edit
    ON public.bm_news
    FOR UPDATE
    using (public.is_moderator())
    with check (
    -- Only news_info, news_updater and updated_at are allowed to be updated by moderators.
    id = public.bm_news.id AND
    created_at = public.bm_news.created_at AND
    deleted = public.bm_news.deleted
    );

CREATE OR REPLACE FUNCTION public.sync_bm_news()
    RETURNS trigger
    SET search_path = 'public'
    LANGUAGE plpgsql
    SECURITY definer
AS
$$
BEGIN
    -- 1. Overwrite the news_updater with the actual user ID or 'postgres'
    NEW.news_updater := coalesce(auth.uid()::text, 'postgres');

    -- 2. Update the singleton sync row (sync_id = 1)
    UPDATE public.gl_sync
    SET updater = NEW.news_updater
    WHERE sync_id = 1;

    RETURN NEW;
END;
$$;

CREATE TRIGGER sync_bm_news
    BEFORE INSERT OR UPDATE
    ON public.bm_news
    FOR EACH ROW
EXECUTE FUNCTION public.sync_bm_news();
