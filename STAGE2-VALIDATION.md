# Stage 2: manual owner handoff ready for root publication

Validated locally 2026-10-17, after stage-1 UX revision. Not deployed by this agent.

Production logic change: only `ADMIN_SETUP_ENABLED = true` in `server/config.mjs`. The gate implementation, password policies, CSRF, rate limiting, source frontend and private asset payload are unchanged byte for byte.

Validation: 17/17 gate unit tests; complete official Vinext build; teaching validation (41 lessons, 9 modules, 18,005 words); all four frontend test files; TypeScript noEmit; real compiled Worker in Miniflare with memory-only D1; client artifact inspection (13 client files, 12 private assets, no private markers); hosted smoke script syntax check. All passed.

Read-only local Worker probe: simulated owner gets form with exclusive-material-password warning, new shared password label and Secure/HttpOnly/SameSite=Strict CSRF cookie; other user 403; anonymous user 303; private paths 401 no-store; unconfigured login preparation page has no form. No admin POST attempted. Config, session and rate tables remain empty. Raw identity headers in this local probe are only the simulated dispatch contract, not independent production-boundary proof.

Hosted smoke (root after deployment): `node scripts/smoke-hosted-stage1.mjs`. Despite historical filename it now supports either stage while unconfigured; checks preparation notice/no form, all private GET/HEAD paths and forged-header rejection including absence of setup form/CSRF markup. Read-only; no cookies or password/configuration submissions. It has NOT been run against the new revision before publication.

Owner handoff must be top-level browser navigation to `/admin/password`, sign in with the verified owner account, then owner manually enters/confirms/submits a unique material password, never their ChatGPT password. This pins the Site-specific owner identity. Assistant must not create the password or admin configuration.

Hosting quotas, KDF CPU/memory under production load and global login rate (30/min) remain operational constraints. A direct Worker bypass hostname must not be exposed. No new billing confirmation was observed by root, but this is not a zero-cost guarantee. Previously public caches cannot be retroactively guaranteed erased. Enabling setup does not publish the course to anonymous users.
