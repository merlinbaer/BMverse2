create table
    public.bm_videos
(
    id                   uuid                        not null default gen_random_uuid(),
    created_at           timestamp with time zone    not null default now(),
    updated_at           timestamp with time zone    not null default now(),
    deleted              boolean                     null     default false,
    video_id             text                        not null,
    channel_id           text                        not null,
    channel_title        text                        not null,
    channel_decription   text                        not null,
    channel_customurl    text                        null,
    channel_type         text                        not null,
    channel_artwork      text                        not null,
    video_title_original text                        not null,
    video_title          text                        not null,
    video_publishedat    timestamp without time zone not null,
    video_description    text                        null,
    video_duration       text                        not null,
    video_viewcount      bigint                      not null,
    video_likecount      bigint                      not null,
    video_commentcount   bigint                      not null,
    video_artwork        text                        not null,
    video_song           text                        null,
    constraint bm_videos_pkey primary key (id)
) TABLESPACE pg_default;

GRANT SELECT ON TABLE public.bm_videos TO anon, authenticated;
GRANT ALL ON TABLE public.bm_videos TO service_role;

ALTER TABLE public.bm_videos
    ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER handle_times
    BEFORE INSERT
        OR
        UPDATE
    ON bm_videos
    FOR each row
execute function handle_times();

CREATE POLICY allow_all_users_to_select
    ON public.bm_videos
    FOR SELECT
    using (auth.role() in ('anon', 'authenticated'));
