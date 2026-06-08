-- DROP VIEW IF EXISTS public.ld_video_channels;

-- SOURCE DATA Tables. Do not drop without backup in production!!!
-- DROP TABLE IF EXISTS public.ld_video_selection;

-- API filled tables. Can be dropped without backup
-- DROP TABLE IF EXISTS public.ld_youtube;

create table
  public.ld_video_selection (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    deleted boolean null default false,
    video_id text not null,
    channel_id text not null,
    channel_type text not null,
    video_title_edited text null,
    video_song text null,
    constraint ld_video_selection_pkey primary key (id)
  ) tablespace pg_default;

GRANT ALL ON TABLE public.ld_video_selection TO service_role;

CREATE TRIGGER handle_times BEFORE INSERT
OR
UPDATE ON ld_video_selection FOR each row
execute function handle_times ();

ALTER TABLE public.ld_video_selection ENABLE ROW LEVEL SECURITY; 

CREATE view public.ld_video_channels
WITH (security_invoker=on)
AS SELECT deleted, channel_id
FROM ld_video_selection
WHERE deleted is false
GROUP by deleted, channel_id;

CREATE TABLE
  public.ld_youtube (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    deleted boolean null default false,
    video_id text not null,
    channel_id text not null,
    channel_title text not null,
    channel_decription text not null,
    channel_customurl text null,
    channel_type text not null,
    channel_artwork text not null,
    video_title_original text not null,
    video_title text not null,
    video_publishedat timestamp not null, 
    video_description text null,
    video_duration text not null,
    video_viewcount int8 not null,
    video_likecount int8 not null,
    video_commentcount int8 not null,
    video_artwork text not null,
    video_song text null,
    constraint ld_youtube_pkey primary key (id)
  ) tablespace pg_default;

GRANT ALL ON TABLE public.ld_youtube TO service_role;

CREATE TRIGGER handle_times BEFORE INSERT
OR
UPDATE ON ld_youtube FOR each row
execute FUNCTION handle_times ();

ALTER TABLE public.ld_youtube ENABLE ROW LEVEL SECURITY;
