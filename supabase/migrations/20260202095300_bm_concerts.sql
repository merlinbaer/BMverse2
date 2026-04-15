create table public.bm_event_concert
(
    id                              uuid                     not null default gen_random_uuid(),
    created_at                      timestamp with time zone not null default now(),
    updated_at                      timestamp with time zone not null default now(),
    deleted                         boolean                  null     default false,
    setlist_id                      text                     not null,
    setlist_versionid               text                     null,
    setlist_eventdate               date                     not null,
    setlist_eventyear               integer                  not null,
    setlist_lastupdated             timestamp with time zone null,
    setlist_info                    text                     null,
    setlist_url                     text                     null,
    setlist_artist_mbid             text                     not null,
    setlist_artist_name             text                     not null,
    setlist_artist_sortname         text                     null,
    setlist_artist_url              text                     null,
    setlist_venue_id                text                     null,
    setlist_venue_name              text                     null,
    setlist_venue_city_id           text                     null,
    setlist_venue_city_name         text                     not null,
    setlist_venue_city_state        text                     null,
    setlist_venue_city_statecode    text                     null,
    setlist_venue_city_coords_lat   real                     null,
    setlist_venue_city_coords_long  real                     null,
    setlist_venue_city_country_code text                     not null,
    setlist_venue_city_country_name text                     not null,
    setlist_venue_url               text                     null,
    setlist_tour_name               text                     null,
    setlist_artwork                 text                     not null,
    constraint bm_event_concert_pkey primary key (id)
) TABLESPACE pg_default;

ALTER TABLE public.bm_event_concert
    ENABLE ROW LEVEL SECURITY;

create trigger handle_times
    BEFORE INSERT
        or
        update
    on bm_event_concert
    for EACH row
execute FUNCTION handle_times();

CREATE POLICY allow_all_users_to_select
    ON public.bm_event_concert
    FOR SELECT
    USING (auth.role() in ('anon', 'authenticated'));
