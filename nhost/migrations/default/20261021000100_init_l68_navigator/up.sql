-- L68 Navigator initial schema.
-- Intentionally contains no medical reports, disability percentages, diagnoses, or document uploads.
-- Hasura permissions must be configured and tested before exposing these tables through the API.

CREATE TABLE IF NOT EXISTS public.profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  preferred_region text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT profiles_display_name_length CHECK (display_name IS NULL OR char_length(display_name) <= 100),
  CONSTRAINT profiles_region_length CHECK (preferred_region IS NULL OR char_length(preferred_region) <= 120)
);

CREATE TABLE IF NOT EXISTS public.guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  summary text NOT NULL DEFAULT '',
  territory text NOT NULL DEFAULT 'Italia',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'verified', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT guides_slug_format CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  CONSTRAINT guides_title_length CHECK (char_length(title) BETWEEN 1 AND 180),
  CONSTRAINT guides_summary_length CHECK (char_length(summary) <= 2000),
  CONSTRAINT guides_territory_length CHECK (char_length(territory) BETWEEN 1 AND 120)
);

CREATE TABLE IF NOT EXISTS public.guide_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id uuid NOT NULL REFERENCES public.guides(id) ON DELETE CASCADE,
  step_order integer NOT NULL CHECK (step_order > 0),
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  responsible_office text,
  source_label text,
  source_url text,
  verified_at date,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (guide_id, step_order),
  CONSTRAINT guide_steps_title_length CHECK (char_length(title) BETWEEN 1 AND 180),
  CONSTRAINT guide_steps_source_url_scheme CHECK (source_url IS NULL OR source_url ~ '^https?://')
);

CREATE TABLE IF NOT EXISTS public.user_guide_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  guide_id uuid NOT NULL REFERENCES public.guides(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  current_step integer NOT NULL DEFAULT 0 CHECK (current_step >= 0),
  completed_step_orders integer[] NOT NULL DEFAULT '{}',
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, guide_id)
);

CREATE TABLE IF NOT EXISTS public.job_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  professional_headline text,
  skills text[] NOT NULL DEFAULT '{}',
  target_roles text[] NOT NULL DEFAULT '{}',
  preferred_work_modes text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT job_profiles_headline_length CHECK (professional_headline IS NULL OR char_length(professional_headline) <= 180)
);

CREATE TABLE IF NOT EXISTS public.saved_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label text NOT NULL,
  url text NOT NULL,
  resource_type text NOT NULL DEFAULT 'other' CHECK (resource_type IN ('official_info', 'job_offer', 'training', 'other')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT saved_resources_label_length CHECK (char_length(label) BETWEEN 1 AND 180),
  CONSTRAINT saved_resources_url_scheme CHECK (url ~ '^https?://'),
  UNIQUE (user_id, url)
);

CREATE INDEX IF NOT EXISTS guide_steps_guide_order_idx ON public.guide_steps (guide_id, step_order);
CREATE INDEX IF NOT EXISTS user_guide_progress_user_idx ON public.user_guide_progress (user_id);
CREATE INDEX IF NOT EXISTS saved_resources_user_created_idx ON public.saved_resources (user_id, created_at DESC);

-- No user-facing table permissions are granted by this migration.
-- Configure Hasura row-level permissions so users can only read/write their own rows
-- and anonymous visitors can only read guides whose status is 'verified'.
