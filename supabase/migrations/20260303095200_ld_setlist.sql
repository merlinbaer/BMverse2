-- SOURCE DATA Tables. Do not drop without backup in production!!!
-- DROP TABLE IF EXISTS public.ld_song_mapping;
-- DROP TABLE IF EXISTS public.ld_upcoming_concerts;

-- API filled tables. Can be dropped without backup
-- DROP TABLE IF EXISTS public.ld_setlist_songs;
-- DROP TABLE IF EXISTS public.ld_setlist;
-- DROP TABLE IF EXISTS public.ld_setlist_upcoming;

create table
  public.ld_song_mapping (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    deleted boolean null default false,
    song_name_original text not null,
    song_title text not null,
    constraint ld_song_mapping_pkey primary key (id)
  ) tablespace pg_default;

GRANT ALL ON TABLE public.ld_song_mapping TO service_role;

CREATE TRIGGER handle_times BEFORE INSERT
OR
UPDATE ON ld_song_mapping FOR each row
execute function handle_times ();

ALTER TABLE public.ld_song_mapping ENABLE ROW LEVEL SECURITY; 

CREATE TABLE
  public.ld_setlist (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    deleted boolean null default false,
    setlist_id text not null,
    setlist_versionid text not null,
    setlist_eventdate date not null,
    setlist_eventyear int4 not null,
    setlist_lastupdated timestamp with time zone not null,
    setlist_info text null,
    setlist_url text not null,
    setlist_artist_mbid text not null,
    setlist_artist_name text not null,
    setlist_artist_sortname text null,
    setlist_artist_url text not null,
    setlist_venue_id text not null,
    setlist_venue_name text null,
    setlist_venue_city_id text not null,
    setlist_venue_city_name text not null,
    setlist_venue_city_state text null,
    setlist_venue_city_statecode text null,
    setlist_venue_city_coords_lat real null, 
    setlist_venue_city_coords_long real null,
    setlist_venue_city_country_code text not null,
    setlist_venue_city_country_name text not null,
    setlist_venue_url text not null,
    setlist_tour_name text null,
    setlist_artwork text not null,
    constraint ld_setlist_pkey primary key (id)
  ) tablespace pg_default;

GRANT ALL ON TABLE public.ld_setlist TO service_role;

CREATE TRIGGER handle_times BEFORE INSERT
OR
UPDATE ON ld_setlist FOR each row
execute FUNCTION handle_times ();

ALTER TABLE public.ld_setlist ENABLE ROW LEVEL SECURITY;

create table
  public.ld_setlist_songs (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    deleted boolean null default false,
    setlist_id text not null,
    setlist_versionid text not null,
    song_nr int2 not null,
    song_name_original text not null,
    song_name text null,
    song_encore boolean not null,
    song_info text null,
    song_artwork text null,
    constraint ld_setlist_songs_pkey primary key (id)
  ) tablespace pg_default;

GRANT ALL ON TABLE public.ld_setlist_songs TO service_role;

CREATE TRIGGER handle_times BEFORE INSERT
OR
UPDATE ON ld_setlist_songs FOR each row
execute function handle_times ();

ALTER TABLE public.ld_setlist_songs ENABLE ROW LEVEL SECURITY; 

create table
  public.ld_upcoming_concerts (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    deleted boolean null default false,
    setlist_id text not null,
    setlist_eventdate date not null,
    setlist_tickets text null,
    constraint ld_upcoming_concerts_pkey primary key (id)
  ) tablespace pg_default;

GRANT ALL ON TABLE public.ld_upcoming_concerts TO service_role;

CREATE TRIGGER handle_times BEFORE INSERT
OR
UPDATE ON ld_upcoming_concerts FOR each row
execute function handle_times ();

ALTER TABLE public.ld_upcoming_concerts ENABLE ROW LEVEL SECURITY; 

CREATE TABLE
  public.ld_setlist_upcoming (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    deleted boolean null default false,
    setlist_id text not null,
    setlist_versionid text not null,
    setlist_eventdate date not null,
    setlist_eventyear int4 not null,
    setlist_lastupdated timestamp with time zone not null,
    setlist_info text null,
    setlist_url text not null,
    setlist_artist_mbid text not null,
    setlist_artist_name text not null,
    setlist_artist_sortname text null,
    setlist_artist_url text not null,
    setlist_venue_id text not null,
    setlist_venue_name text null,
    setlist_venue_city_id text not null,
    setlist_venue_city_name text not null,
    setlist_venue_city_state text null,
    setlist_venue_city_statecode text null,
    setlist_venue_city_coords_lat real null, 
    setlist_venue_city_coords_long real null,
    setlist_venue_city_country_code text not null,
    setlist_venue_city_country_name text not null,
    setlist_venue_url text not null,
    setlist_tour_name text null,
    setlist_artwork text not null,
    setlist_tickets text null,
    constraint ld_setlist_upcoming_pkey primary key (id)
  ) tablespace pg_default;

GRANT ALL ON TABLE public.ld_setlist_upcoming TO service_role;

CREATE TRIGGER handle_times BEFORE INSERT
OR
UPDATE ON ld_setlist_upcoming FOR each row
execute FUNCTION handle_times ();

ALTER TABLE public.ld_setlist_upcoming ENABLE ROW LEVEL SECURITY;
