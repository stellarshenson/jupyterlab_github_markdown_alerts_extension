# To the maintainer of `jupyterlab_github_markdown_alerts_extension`

**Subject: your `render` wrapper and the intermittent loss of code-block syntax highlighting - analysis and verdict**

Rendered Markdown fenced code blocks (bash / python / json) intermittently render as plain uncoloured `<pre><code>` in JupyterLab 4.x. Your extension is the only third-party code that wraps the shared Markdown render pipeline, so it is the natural first suspect; this brief confirms the chain, clears your code, and points at the real defect so you don't chase a non-bug.

## Verdict

- **Cleared** - your `render` wrapper is highlight-safe; no change is required for correctness
- **Defect is in core** - `@jupyterlab/markedparser-extension` swallows a thrown highlight and emits a plain block, one-shot, with no retry
- **Trigger** - a cold or flaky lazy `import()` of a CodeMirror language chunk (`spec.load()`), common behind a JupyterHub proxy or on the first render before chunks are warm
- **Independent of alerts and mermaid** - reproduces on bash/python/json fences with zero alerts present

## Why you were suspected

Your extension reassigns the shared `IMarkdownParser.render` (`src/index.ts` lines 55-61), the single chokepoint every Markdown render passes through.

- **Wrapper** - `processAlerts(content)` → `await originalRender(processed)` → `postProcessAlerts(renderedHtml)`
- **Shared singleton** - `markdownParser` is one app-wide instance, so any wrapper is in the path of every notebook cell and preview render

## Why your code is cleared

The wrapper never alters code-block text and never touches the highlight cache.

- **`processAlerts` skips fences** - it tracks ` ``` ` / `~~~` and passes every in-code-block line through verbatim (`src/utils.ts` lines 96-109), so the code token text is unchanged → core's highlight cache key still matches
- **`postProcessAlerts` is a marker swap** - it only regex-replaces your own `<!--ALERT_START/END-->` comments with alert `<div>`s (lines 156-177); it does not re-serialize or strip `<pre><code>` spans
- **No-op on alert-free docs** - with no `> [!NOTE]`-style alerts, both functions are identity, so your patched `render` is byte-identical to core's - it cannot be the cause there
- **In-alert code survives** - a fenced block inside an alert is highlighted by `originalRender` before your marker swap, so its spans are preserved

## Optional hardening (defensive, not a fix)

Your patch is correct today but is a shared-singleton override; two cheap guards keep it from becoming a future hazard.

- **Guard the transforms** - wrap `processAlerts` / `postProcessAlerts` in try/catch with fallback to the raw `originalRender` output, so a future regex edge case degrades to plain Markdown instead of a rejected `render` (a rejected `render` is what would push rendermime into an un-highlighted fallback)
- **Idempotent patch** - guard against double-wrapping on re-activation (`if ((markdownParser.render as any).__alertsWrapped) return;` then tag the new function), so `originalRender` never captures an already-wrapped function

## What to tell users now

- **No action on your side** - the fix belongs in core (see the companion report) or in a dedicated DOM-recovery extension
- **Immediate workaround** - reload the tab or reopen the preview once language chunks are warm; the re-render colours correctly
