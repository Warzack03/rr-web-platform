# rr-management source DDL relevant to import

This document records the source entities provided from the existing `rr-management` application. It is used only to design import/export mapping.

Do not replicate sensitive columns into the new web platform.

## seasons

```sql
CREATE TABLE public.seasons (
    id bigserial NOT NULL,
    name varchar(100) NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    status varchar(20) NOT NULL,
    CONSTRAINT seasons_name_key UNIQUE (name),
    CONSTRAINT seasons_pkey PRIMARY KEY (id)
);
CREATE UNIQUE INDEX ux_seasons_single_current ON public.seasons USING btree (status) WHERE ((status)::text = 'CURRENT'::text);
```

## teams

```sql
CREATE TABLE public.teams (
    id bigserial NOT NULL,
    code varchar(50) NOT NULL,
    name varchar(150) NOT NULL,
    active bool NOT NULL DEFAULT true,
    display_order int4 NOT NULL DEFAULT 0,
    branch varchar(20) NOT NULL,
    CONSTRAINT teams_code_key UNIQUE (code),
    CONSTRAINT teams_name_key UNIQUE (name),
    CONSTRAINT teams_pkey PRIMARY KEY (id)
);
```

## persons

```sql
CREATE TABLE public.persons (
    id bigserial NOT NULL,
    first_name varchar(150) NOT NULL,
    last_name varchar(200) NOT NULL,
    nif_type varchar(50) NOT NULL,
    nif_value varchar(50) NOT NULL,
    birth_date date NULL,
    address varchar(255) NULL,
    contact varchar(255) NULL,
    active bool NOT NULL DEFAULT true,
    document_status varchar(50) NULL,
    notes text NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT persons_nif_value_key UNIQUE (nif_value),
    CONSTRAINT persons_pkey PRIMARY KEY (id)
);
```

Sensitive columns that must not be imported into the new platform:

- `nif_type`
- `nif_value`
- `address`
- `contact`
- `document_status`
- `notes`

## player_profile_seasons

```sql
CREATE TABLE public.player_profile_seasons (
    id bigserial NOT NULL,
    person_id int8 NOT NULL,
    season_id int8 NOT NULL,
    primary_position varchar(50) NULL,
    secondary_position varchar(50) NULL,
    tertiary_position varchar(50) NULL,
    training_preference varchar(100) NULL,
    match_preference varchar(100) NULL,
    level int4 NULL,
    sports_notes text NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT player_profile_seasons_pkey PRIMARY KEY (id),
    CONSTRAINT ux_player_profile_seasons_person_season UNIQUE (person_id, season_id),
    CONSTRAINT player_profile_seasons_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.persons(id),
    CONSTRAINT player_profile_seasons_season_id_fkey FOREIGN KEY (season_id) REFERENCES public.seasons(id)
);
```

Only public-safe profile fields should be imported by default: positions and optional level.

## player_profiles

```sql
CREATE TABLE public.player_profiles (
    id bigserial NOT NULL,
    person_id int8 NOT NULL,
    primary_position varchar(50) NULL,
    secondary_position varchar(50) NULL,
    tertiary_position varchar(50) NULL,
    training_preference varchar(100) NULL,
    match_preference varchar(100) NULL,
    level int4 NULL,
    sports_notes text NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT player_profiles_person_id_key UNIQUE (person_id),
    CONSTRAINT player_profiles_pkey PRIMARY KEY (id),
    CONSTRAINT player_profiles_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.persons(id)
);
```

## team_assignments

```sql
CREATE TABLE public.team_assignments (
    id bigserial NOT NULL,
    person_id int8 NOT NULL,
    team_id int8 NOT NULL,
    season_id int8 NULL,
    start_date date NOT NULL,
    end_date date NULL,
    active bool NOT NULL DEFAULT true,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT team_assignments_pkey PRIMARY KEY (id),
    CONSTRAINT team_assignments_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.persons(id),
    CONSTRAINT team_assignments_season_id_fkey FOREIGN KEY (season_id) REFERENCES public.seasons(id),
    CONSTRAINT team_assignments_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id)
);
CREATE UNIQUE INDEX ux_team_assignments_active_person_season ON public.team_assignments USING btree (person_id, season_id) WHERE ((active = true) AND (season_id IS NOT NULL));
```

Source rr-management allows only one active assignment per person/season. The new platform may allow manual exceptional extra assignments and should not blindly copy this uniqueness as a hard DB constraint.
