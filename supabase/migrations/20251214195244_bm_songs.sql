CREATE TABLE
    public.bm_songs
(
    id                    uuid                     not null default gen_random_uuid(),
    created_at            timestamp with time zone not null default now(),
    updated_at            timestamp with time zone not null default now(),
    deleted               boolean                  null     default false,
    song_id               text                     not null,
    song_title            text                     not null,
    song_title_jp         text                     null,
    song_artist           text                     not null,
    song_first_appearance date                     not null,
    song_release_type     text                     not null,
    song_default_media    text                     null,
    song_info             text                     null,
    constraint bm_songs_pkey primary key (id)
) tablespace pg_default;

ALTER TABLE public.bm_songs
    ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER handle_times
    BEFORE INSERT
        OR
        UPDATE
    ON bm_songs
    FOR each row
execute function handle_times();

CREATE POLICY allow_public_users_to_select
    ON public.bm_songs
    FOR SELECT
    using (public.is_public_user());

CREATE POLICY allow_moderator_to_edit
    ON public.bm_songs
    FOR UPDATE
    using (public.is_moderator())
    with check (
    -- Only song_info and updated_at are allowed to be updated by moderators.
    id = public.bm_songs.id AND
    created_at = public.bm_songs.created_at AND
    deleted = public.bm_songs.deleted AND
    song_id = public.bm_songs.song_id AND
    song_title = public.bm_songs.song_title AND
    song_title_jp = public.bm_songs.song_title_jp AND
    song_artist = public.bm_songs.song_artist AND
    song_first_appearance = public.bm_songs.song_first_appearance AND
    song_release_type = public.bm_songs.song_release_type AND
    song_default_media = public.bm_songs.song_default_media
    );

CREATE POLICY allow_admin_all
    ON public.bm_songs
    FOR all
    using (public.is_admin())
    with check (public.is_admin());