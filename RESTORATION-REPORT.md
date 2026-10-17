# Restoration report — 17 October 2026

## Restored material

The validated immutable frontend package was the recovery authority. Its ZIP SHA-256 was `d6b4e4d89d0b49ef80643d29ff6d2642a29d91fb63f9a8b7d99272ac0e3e07d5`.

- HTML, JavaScript, three stylesheets, logo, two local font weights and two license files were copied without changes.
- Four content source JSON files were reconstructed from the final course.json, retaining the original module-to-file allocation. All nine modules, 40 lesson IDs, ordering, corrected theory, bibliography and examples are preserved.
- The build script was reconstructed with selective asset publishing. It emits exactly 12 public files and removes stale derived output. Original research assets elsewhere in source were not deleted or included in the sanitized source package.
- The recreated build reproduces all 12 recovered frontend files byte for byte, including course.json and course.js. No derived-field or formatting exceptions were needed.

## Checks run after reconstruction

These checks were executed on the recovered code, rather than assumed from prior results:

1. Build: nine modules, 40 lessons, 12 public files.
2. Structural validation: 40 applied phone frames, four externally controlled examples, stable IDs/order/titles, balanced product markup and test guidance.
3. DOM-stub app test: 40 routes, progress persistence/import, malformed input and utility routes.
4. Rebuilt scaler test: uniform scale, zoom control outside horizontal panning, hint, fallback and observer cleanup.
5. Rebuilt component-control test: width/type/grid state changes and exclusive selected states.
6. JavaScript syntax validation.
7. SHA-256 comparison against the recovered snapshot: 12/12 identical, zero differences.

The automated controls/scaler checks use a DOM stub. They do not claim a new browser visual inspection. The frontend itself is byte-identical to the previously validated package.

## Package boundaries

The sanitized source archive contains only the active frontend source, four content JSON files, the five required assets, build/validation scripts, recovery manifests, this report and the generated 12-file frontend. No .git, .openai, caches, old reference images, credentials or private research reports are included.

No publication or additional design/content improvement was performed during restoration.
