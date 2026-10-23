# Changelog

<!-- <START NEW CHANGELOG ENTRY> -->

## [1.0.27] - 2026-10-23

### Added

- Jest tests for the Markdown render wrapper: one wrap of the shared parser, the fallback to plain Markdown on a transform error, the backgrounds default and a saved false value
- Galata integration tests for the five alert types, the backgrounds setting, fenced code, Markdown inside alerts and the title icon per theme
- Lint and unit-test steps in the CI build job
- The `check_links` CI job, restored with the badge URLs and YouTube links ignored
- A `test` Python extra with `jupyterlab>=4.6,<5`, which the CI `.[test]` install expects
- docs/acc-crit.md with 22 acceptance criteria for the shipped behaviour, all closed
- docs/defects.md with the defects found during the upgrade, each closed with its fix or rejected with a reason
- docs/defects.md records that a context menu stays open after a click inside an iframe, such as the HTML viewer; the cause is the Lumino Menu in JupyterLab core, not this extension

### Changed

- Alert backgrounds are on by default
- A user who saved `showBackgrounds: false` keeps the plain GitHub styling
- The extension requires JupyterLab 4.6 or later; the `@jupyterlab/*` dependencies move to ^4.6.0
- The README Requirements list JupyterLab >= 4.6 and Python >= 3.10
- TypeScript moves to ~5.8.3, because the Uint8Array generics in lib0 need TypeScript 5.7 or later
- npm dependencies upgraded within their major versions
- Updated the project Makefile to version 1.46: `make install` raises the patch version and writes it into package-lock.json too
- Every CI job runs Python 3.13 and pins `jupyterlab>=4.6,<5`
- The Galata test server reads its port from `JUPYTER_TEST_PORT`; ui-tests/README.md names the variable for the test run, `jlpm start` and codegen

### Fixed

- Galata tests no longer attach to a lab already serving on port 8888; Playwright starts and stops its own test server
- The Galata test server keeps user settings in a temporary folder instead of writing `~/.jupyter/lab/user-settings`
- Galata start-up no longer times out on a host whose MOTD extension opens a Welcome tab
- Galata deletes its scratch folder after each test; the delete had failed with a send2trash permission error
- package-lock.json is re-resolved to the package.json ranges; it had kept 25 old ranges, among them TypeScript ~5.5.4
- Jest can import src/index.ts: four ES-module packages are added to the Jest transform list
- Jest collects tests only under src/, so copies of spec files elsewhere in the tree no longer run
- `jlpm run lint:check` no longer fails on workflow scripts under tmp/

<!-- <END NEW CHANGELOG ENTRY> -->

## [1.0.25] - 2026-09-08

### Changed

- Updated the scaffold to extension-template v4.6.5: the labextension build moves from @jupyterlab/builder to @jupyter/builder, eslint moves to the version 9 flat config in eslint.config.mjs, and pyproject declares the licence through the SPDX field with a Python 3.10 floor
- Updated the project Makefile to version 1.38
- Upgraded the dependency lockfiles; the audit fix that would have downgraded @jupyterlab/application, @jupyterlab/rendermime and @jupyterlab/testutils below JupyterLab 4 was reverted
- Removed setup.py and added CONTRIBUTING.md, with the README development section now pointing at it
- Delegated the integration-test snapshot workflow to the maintainer-tools checkout action and installed only the chromium shell in the build workflow
- Stopped tracking junit.xml and ignored the logs directory

## 1.0.21 (2026-06-23)

### Maintenance

- Hardened the Markdown render wrapper: alert transforms now run inside a try/catch that falls back to the original render output, so a transform edge case degrades to plain Markdown instead of rejecting the render
- Added an idempotency guard so re-activating the extension cannot double-wrap the shared Markdown parser

## 1.0.9 (2025-11-11)

### Features

- Complete GitHub-style alert rendering for all five types (NOTE, TIP, IMPORTANT, WARNING, CAUTION)
- Theme-aware icon colors with automatic light/dark theme switching
- Base64-encoded SVG icons via data URIs to bypass HTML sanitization
- Optional colored backgrounds setting (Settings → GitHub Markdown Alerts)
- Code block detection to prevent alert processing in markdown examples
- Two-phase HTML comment marker approach for proper markdown parsing within alerts

### Documentation

- Added screenshot showcasing all five alert types
- Added standard badges (GitHub Actions, npm, PyPI, PyPI downloads, JupyterLab 4)
- Integrated alert examples directly into README
- Updated repository URLs in package.json

### Bug Fixes

- Fixed icon rendering by using img tags with data URIs instead of inline SVG
- Fixed markdown parsing within alert content blocks
- Matched exact GitHub CSS styling (no backgrounds, no border-radius by default)
- Fixed alert processing to skip code blocks

### Infrastructure

- Removed link checking workflow
- Updated build workflow to Python 3.12
- Simplified workflow by removing unimplemented lint/test steps
