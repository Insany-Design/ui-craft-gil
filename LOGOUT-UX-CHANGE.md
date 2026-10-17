# Logout navigation delta — 2026-10-17

Added ordinary `/logout` link “Sair do guia” to the existing utility navigation; the SPA intercepts only hash links. Sidebar footer now says “Estude no seu ritmo.” GET logout confirmation explains that exit ends access in this browser without deleting saved progress, and offers “Continuar estudando” linking to `/`.

Only source/index.html changed among the 57 frontend source files. All 41 lesson content, scripts, styles and examples are byte-identical to the preceding revision. Private payload was regenerated to incorporate the navigation HTML. Gate changes are HTML copy/return link only: sessions, POST logout, CSRF and all authorization rules unchanged. ADMIN_SETUP_ENABLED remains true.

Passed: 19 gate tests, all four frontend test files, teaching validation (41 lessons), complete official build, TypeScript noEmit, compiled Worker in-memory D1 probe, private/client artifact inspection (13 client files / 12 private assets, zero private markers). No real password or persisted configuration created. Not published. Visual delta is restricted to navigation text/link and logout page; no new screenshot-based browser QA performed.
