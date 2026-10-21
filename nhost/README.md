# Nhost backend

This folder contains the first SQL migration for L68 Navigator.

## Before applying

- Confirm this is the intended Nhost project and environment.
- Apply the migration first in a development environment.
- Review the SQL and confirm the schema matches the current Nhost PostgreSQL/Auth setup.
- Do not import real personal data during setup.

## Important access-control requirement

The migration creates tables but intentionally does not expose them through Hasura permissions. Hasura permissions must be configured separately and tested before the application uses the API:

- Public/anonymous role: read only guides with status `verified`; no access to profiles or user data.
- Authenticated user: read/update only their own profile and job profile.
- Authenticated user: read/write only their own progress and saved resources.
- Guide editing: restricted to a trusted admin role; never let users assign themselves admin.
- Never expose service-role/admin secrets to the browser.

These rules are requirements, not yet implemented metadata. Do not treat the backend as production-ready until permissions and tests are in place.

## Data minimization

The initial schema deliberately excludes disability diagnoses, medical reports, disability percentages, uploaded certificates and other health documents. Do not add these fields without a documented necessity, legal/privacy review, access controls, retention rules and a secure private-storage design.

## Procedure content

Only mark a guide `verified` after its claims have been checked against official sources. Record the source URL and verification date for each relevant step. Regional and provincial differences must be explicit.
