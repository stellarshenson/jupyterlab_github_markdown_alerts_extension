# Changelog

<!-- <START NEW CHANGELOG ENTRY> -->

## 1.0.21 (2026-06-23)

### Maintenance

- Hardened the Markdown render wrapper: alert transforms now run inside a try/catch that falls back to the original render output, so a transform edge case degrades to plain Markdown instead of rejecting the render
- Added an idempotency guard so re-activating the extension cannot double-wrap the shared Markdown parser

<!-- <END NEW CHANGELOG ENTRY> -->

<!-- <START NEW CHANGELOG ENTRY> -->

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

<!-- <END NEW CHANGELOG ENTRY> -->
