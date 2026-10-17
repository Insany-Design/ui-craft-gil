# Recovered UI mobile course source

The active source lives in source/. Content is split across four source/content/part-*.json files. The local font and logo assets are in source/real-assets/.

Run from the package directory:

```
python build.py
python validate-teaching.py
node test-app.cjs
node test-realistic-scaling.cjs
node test-component-controls.cjs
node --check source/app.js
python verify-snapshot.py
```

The build emits exactly 12 files in dist/. RESTORATION-HASHES.json records the validated recovered frontend. verify-snapshot.py is a recovery check: intentional future content changes will require a newly reviewed baseline instead of silently replacing that manifest.

RESTORATION-STRUCTURE.json allows structural tests to run without a Git repository. The app's browser storage key remains ui-mobile-study-v2.

See RESTORATION-REPORT.md for provenance, checks and package scope.
