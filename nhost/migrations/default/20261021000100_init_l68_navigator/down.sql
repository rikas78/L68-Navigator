-- Rollback for the initial L68 Navigator schema.
-- This deletes data in these tables; only use when intentionally resetting the environment.
DROP TABLE IF EXISTS public.saved_resources;
DROP TABLE IF EXISTS public.job_profiles;
DROP TABLE IF EXISTS public.user_guide_progress;
DROP TABLE IF EXISTS public.guide_steps;
DROP TABLE IF EXISTS public.guides;
DROP TABLE IF EXISTS public.profiles;
