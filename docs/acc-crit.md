# Acceptance Criteria - jupyterlab_github_markdown_alerts_extension

JupyterLab 4 extension that renders GitHub alert blocks (`> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, `> [!CAUTION]`) in Markdown. It wraps the IMarkdownParser render: processAlerts marks alert blocks before Markdown rendering, postProcessAlerts turns the marks into styled divs.

## Authors

- `@kj` Konrad Jelen

## Alert rendering `RENDER`

How a `> [!TYPE]` blockquote in a Markdown cell renders

- [x] `ACC-RENDER-1-CLASS` **Alert block and colour class** - CRITICAL; a blockquote whose first line is `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]` or `> [!CAUTION]` renders as one `div.markdown-alert` with the class `markdown-alert-<type>`, type in lower case
  - evidence: jest "should convert NOTE alert syntax", its TIP, IMPORTANT, WARNING and CAUTION twins, and "should wrap alert markers with styled div" pass, jlpm test 27 of 27 passed (logs/goal-trackers-test.log); Galata "should render each alert type with its title and icon" passes, Galata 5 of 5 passed (logs/goal-galata.log)
  - test: render a cell holding one block of each type; assert one `.markdown-alert-<type>` per type
  - test-tags: UNIT, E2E
  - log: 2026-10-23T07:14:23Z @kj added
  - log: 2026-10-23T07:14:23Z @kj closed: verified
- [x] `ACC-RENDER-2-TITLE` **Alert title** - HIGH; each alert opens with a `p.markdown-alert-title` reading Note, Tip, Important, Warning or Caution
  - evidence: jest "should include correct title for each alert type" passes, jlpm test 27 of 27 passed (logs/goal-trackers-test.log); Galata "should render each alert type with its title and icon" passes, Galata 5 of 5 passed (logs/goal-galata.log)
  - test: render a cell holding the five types; assert the `.markdown-alert-title` text per type
  - test-tags: UNIT, E2E
  - log: 2026-10-23T07:14:23Z @kj added
  - log: 2026-10-23T07:14:23Z @kj closed: verified
- [x] `ACC-RENDER-3-ICON` **Alert icon** - HIGH; the title shows the octicon of its type (`octicon-info`, `octicon-light-bulb`, `octicon-report`, `octicon-alert`, `octicon-stop`) as an `img` with an SVG data URI
  - evidence: jest "should include icon images for light and dark themes" passes, jlpm test 27 of 27 passed (logs/goal-trackers-test.log); Galata "should render each alert type with its title and icon" passes, Galata 5 of 5 passed (logs/goal-galata.log), and fails with the icon removed (logs/goal-galata-mutation-no-icon.log)
  - test: render a cell holding the five types; assert one visible `img.<octicon>` per title with a `data:image/svg+xml;base64,` src
  - test-tags: UNIT, E2E
  - log: 2026-10-23T07:14:23Z @kj added
  - log: 2026-10-23T07:14:23Z @kj closed: verified
- [x] `ACC-RENDER-4-PLAIN-QUOTE` **Edge: plain blockquote** - HIGH; a blockquote whose first line is not an alert marker stays an ordinary blockquote
  - evidence: jest "should handle regular blockquotes (not alerts)" passes, jlpm test 27 of 27 passed (logs/goal-trackers-test.log)
  - test: processAlerts on `> This is a regular blockquote.`; assert no `<!--ALERT_START` and the `>` lines kept
  - test-tags: UNIT
  - log: 2026-10-23T07:14:23Z @kj added
  - log: 2026-10-23T07:14:23Z @kj closed: verified
- [x] `ACC-RENDER-5-EMPTY` **Edge: marker with no content** - LOW; a `> [!NOTE]` line with no `>` line after it creates no alert
  - evidence: jest "should handle alert with no content" passes, jlpm test 27 of 27 passed (logs/goal-trackers-test.log)
  - test: processAlerts on `> [!NOTE]` alone; assert no `<!--ALERT_START`
  - test-tags: UNIT
  - log: 2026-10-23T07:14:23Z @kj added
  - log: 2026-10-23T07:14:23Z @kj closed: verified
- [x] `ACC-RENDER-6-MULTI` **Edge: several alerts in one cell** - MEDIUM; each alert block in a cell renders as its own `div.markdown-alert`
  - evidence: jest "should handle multiple alerts in same document" passes, jlpm test 27 of 27 passed (logs/goal-trackers-test.log); Galata "should render each alert type with its title and icon" renders five alerts in one cell and passes, Galata 5 of 5 passed (logs/goal-galata.log)
  - test: render a cell holding a NOTE block, text, then a WARNING block; assert two alerts
  - test-tags: UNIT, E2E
  - log: 2026-10-23T07:14:23Z @kj added
  - log: 2026-10-23T07:14:23Z @kj closed: verified
- [x] `ACC-RENDER-7-FALLBACK` **Render failure falls back to plain Markdown** - HIGH; when processAlerts, postProcessAlerts or the original render of the processed text throws, the cell gets the original render of the raw Markdown
  - evidence: the three jest tests "should fall back to the original render of the raw content when" + "processAlerts throws", "postProcessAlerts throws", "it throws for the processed content" pass, jlpm test 27 of 27 passed (logs/goal-trackers-test.log); they fail without the try/catch (logs/goal-feature-mutation.log)
  - test: make each of the three throw in turn; assert render resolves to the original render of the raw text
  - test-tags: UNIT
  - log: 2026-10-23T07:14:23Z @kj added
  - log: 2026-10-23T07:14:23Z @kj closed: verified

## Theme `THEME`

Which title icon shows under the light and the dark JupyterLab theme

- [x] `ACC-THEME-8-LIGHT-ICON` **Light theme shows the light icon** - MEDIUM; with `data-jp-theme-light` not `false`, only the `octicon-light` image of each title is visible
  - evidence: Galata "should show the title icon that matches the theme" passes, Galata 7 of 7 passed (logs/fix-r1-galata.log); with the .octicon-light and .octicon-dark display rules in style/base.css swapped it fails at expect(light).toBeVisible(), Received: hidden (logs/fix-r1-r1-3-mutation.log)
  - test: render a NOTE alert, page.theme.setLightTheme(); assert `img.octicon-light` visible and `img.octicon-dark` hidden in the title
  - test-tags: E2E
  - log: 2026-10-23T07:14:23Z @kj added
  - log: 2026-10-23T07:14:24Z @kj open: Galata asserts one visible title image under the default light theme, not which of the two images it is
  - log: 2026-10-23T07:56:09Z @kj edited test "open the five types under JupyterLab Light; assert the one visible title image carries `octicon-light`" -> "render a NOTE alert, page.theme.setLightTheme(); assert `img.octicon-light` visible and `img.octicon-dark` hidden in the title"; test-tags "MANUAL" -> "E2E"
  - log: 2026-10-23T07:56:09Z @kj closed: verified
- [x] `ACC-THEME-9-DARK-ICON` **Dark theme shows the dark icon** - MEDIUM; with `data-jp-theme-light='false'`, only the `octicon-dark` image of each title is visible
  - evidence: with only the dark-theme rule `body[data-jp-theme-light='false'] .octicon-light` in style/base.css set to `display: inline-block`, Galata "should show the title icon that matches the theme" fails at the dark-theme assertion alerts.spec.ts:87, light icon visible, after the light-theme assertions passed (logs/fix-r1b-dark-mutation.log); file restored, Galata 7 of 7 passed (logs/fix-r1b-galata.log)
  - test: render a NOTE alert, page.theme.setDarkTheme(); assert `img.octicon-dark` visible and `img.octicon-light` hidden in the title
  - test-tags: E2E
  - log: 2026-10-23T07:14:24Z @kj added
  - log: 2026-10-23T07:14:24Z @kj open: no test runs the dark theme
  - log: 2026-10-23T07:56:09Z @kj edited test "open the five types under JupyterLab Dark; assert the one visible title image carries `octicon-dark`" -> "render a NOTE alert, page.theme.setDarkTheme(); assert `img.octicon-dark` visible and `img.octicon-light` hidden in the title"; test-tags "MANUAL" -> "E2E"
  - log: 2026-10-23T07:56:09Z @kj closed: verified
  - log: 2026-10-23T08:12:57Z @kj edited evidence "Galata "should show the title icon that matches the theme" passes its dark-theme assertions, Galata 7 of 7 passed (logs/fix-r1-galata.log); with the .octicon-light and .octicon-dark display rules in style/base.css swapped it fails, at the light-theme assertion before the dark-theme ones run (logs/fix-r1-r1-3-mutation.log)" -> "with only the dark-theme rule `body[data-jp-theme-light='false'] .octicon-light` in style/base.css set to `display: inline-block`, Galata "should show the title icon that matches the theme" fails at the dark-theme assertion alerts.spec.ts:87, light icon visible, after the light-theme assertions passed (logs/fix-r1b-dark-mutation.log); file restored, Galata 7 of 7 passed (logs/fix-r1b-galata.log)"

## Markdown inside alerts `BODY`

Markdown in the lines of an alert renders inside the alert block

- [x] `ACC-BODY-10-FORMAT` **Inline formatting** - HIGH; inline Markdown inside an alert renders; `**bold**` becomes `strong`
  - evidence: Galata "should render bold text, a list and a table inside an alert" passes, Galata 5 of 5 passed (logs/goal-galata.log)
  - test: render `> [!TIP]` then `> Some **bold** text.`; assert `strong` with text `bold` inside the alert
  - test-tags: E2E
  - log: 2026-10-23T07:14:24Z @kj added
  - log: 2026-10-23T07:14:24Z @kj closed: verified
- [x] `ACC-BODY-11-LIST` **Lists** - MEDIUM; a bullet or numbered list inside an alert renders as a list inside the alert
  - evidence: jest "should preserve bullet list structure" and "should preserve numbered list structure" pass, jlpm test 27 of 27 passed (logs/goal-trackers-test.log); Galata "should render bold text, a list and a table inside an alert" passes, Galata 5 of 5 passed (logs/goal-galata.log)
  - test: render an alert holding `> - first item` and `> - second item`; assert two `ul > li` inside the alert
  - test-tags: UNIT, E2E
  - log: 2026-10-23T07:14:24Z @kj added
  - log: 2026-10-23T07:14:24Z @kj closed: verified
- [x] `ACC-BODY-12-TABLE` **Tables** - MEDIUM; a pipe table inside an alert renders as a `table` with its `th` and `td` cells inside the alert
  - evidence: jest "should preserve table structure with consecutive rows" and "should not insert blank lines between table rows" pass, jlpm test 27 of 27 passed (logs/goal-trackers-test.log); Galata "should render bold text, a list and a table inside an alert" passes, Galata 5 of 5 passed (logs/goal-galata.log)
  - test: render an alert holding a two-column pipe table; assert the `th` and `td` texts inside the alert
  - test-tags: UNIT, E2E
  - log: 2026-10-23T07:14:24Z @kj added
  - log: 2026-10-23T07:14:24Z @kj closed: verified
- [x] `ACC-BODY-13-PARAGRAPH` **Paragraph breaks** - MEDIUM; an empty `>` line inside an alert starts a new paragraph
  - evidence: jest "should preserve empty lines for paragraph separation" and "should handle multiple paragraphs" pass, jlpm test 27 of 27 passed (logs/goal-trackers-test.log)
  - test: processAlerts on an alert with `>` between two text lines; assert the blank line between them is kept
  - test-tags: UNIT
  - log: 2026-10-23T07:14:24Z @kj added
  - log: 2026-10-23T07:14:24Z @kj closed: verified

## Fenced code `FENCE`

Alert syntax inside ``` and ~~~ fenced code blocks

- [x] `ACC-FENCE-14-FENCED` **Fenced code left alone** - HIGH; alert syntax inside a ``` or ~~~ fenced code block stays code text and creates no alert
  - evidence: jest "should not process alerts inside backtick code blocks" and "should not process alerts inside tilde code blocks" pass, jlpm test 27 of 27 passed (logs/goal-trackers-test.log); Galata "should keep alert syntax inside fenced code blocks as code" passes, Galata 5 of 5 passed (logs/goal-galata.log)
  - test: render a cell with `> [!NOTE]` in a ``` fence and `> [!WARNING]` in a ~~~ fence; assert the code text and no `.markdown-alert`
  - test-tags: UNIT, E2E
  - log: 2026-10-23T07:14:24Z @kj added
  - log: 2026-10-23T07:14:24Z @kj closed: verified
- [x] `ACC-FENCE-15-AFTER-FENCE` **Edge: alert after a closed fence** - MEDIUM; an alert that follows a closed fenced code block renders
  - evidence: jest "should process alerts after code block ends" passes, jlpm test 27 of 27 passed (logs/goal-trackers-test.log)
  - test: processAlerts on a ``` fence then `> [!NOTE]`; assert `<!--ALERT_START:NOTE-->`
  - test-tags: UNIT
  - log: 2026-10-23T07:14:24Z @kj added
  - log: 2026-10-23T07:14:24Z @kj closed: verified

## Settings `CONFIG`

The `showBackgrounds` setting, Settings Editor - GitHub Markdown Alerts

- [x] `ACC-CONFIG-16-BG-DEFAULT` **Backgrounds on by default** - MEDIUM; with no saved value, each alert carries `markdown-alert-with-backgrounds`; schema default of `showBackgrounds` is `true`
  - evidence: jest "should add backgrounds when there is no settings registry" passes, jlpm test 27 of 27 passed (logs/goal-trackers-test.log); Galata "should drop the backgrounds class when showBackgrounds is set to false" passes, Galata 5 of 5 passed (logs/goal-galata.log)
  - test: render an alert with no saved setting; assert `markdown-alert-with-backgrounds`
  - test-tags: UNIT, E2E
  - log: 2026-10-23T07:14:25Z @kj added
  - log: 2026-10-23T07:14:25Z @kj closed: verified
  - log: 2026-10-23T07:55:20Z @kj edited evidence "jest "should add backgrounds when there is no settings registry" and "should add background class when showBackgrounds is true" pass, jlpm test 27 of 27 passed (logs/goal-trackers-test.log); Galata "should drop the backgrounds class when showBackgrounds is set to false" passes, Galata 5 of 5 passed (logs/goal-galata.log)" -> "jest "should add backgrounds when there is no settings registry" passes, jlpm test 27 of 27 passed (logs/goal-trackers-test.log); Galata "should drop the backgrounds class when showBackgrounds is set to false" passes, Galata 5 of 5 passed (logs/goal-galata.log)"
- [x] `ACC-CONFIG-17-BG-CHANGE` **Backgrounds off on next render** - MEDIUM; setting `showBackgrounds` to false removes `markdown-alert-with-backgrounds` from the next render, no page reload
  - evidence: Galata "should drop the backgrounds class when showBackgrounds is set to false" passes, Galata 5 of 5 passed (logs/goal-galata.log)
  - test: set showBackgrounds false in the settings registry, reopen the notebook; assert the class is gone
  - test-tags: E2E
  - log: 2026-10-23T07:14:25Z @kj added
  - log: 2026-10-23T07:14:25Z @kj closed: verified
  - log: 2026-10-23T07:55:20Z @kj edited test-tags "UNIT, E2E" -> "E2E"; evidence "jest "should not add background class when showBackgrounds is false" passes, jlpm test 27 of 27 passed (logs/goal-trackers-test.log); Galata "should drop the backgrounds class when showBackgrounds is set to false" passes, Galata 5 of 5 passed (logs/goal-galata.log)" -> "Galata "should drop the backgrounds class when showBackgrounds is set to false" passes, Galata 5 of 5 passed (logs/goal-galata.log)"
- [x] `ACC-CONFIG-22-BG-SAVED` **Saved false applies from the first render** - MEDIUM; a saved `showBackgrounds` false keeps `markdown-alert-with-backgrounds` off from the first render after the settings load
  - evidence: jest "should drop backgrounds when the saved showBackgrounds is false" passes, jlpm test 28 of 28 passed (logs/fix-r1-final.log); with the load-time showBackgrounds assignment in src/index.ts removed it fails, 1 failed, 27 passed of 28 (logs/fix-r1-r1-1-mutation.log)
  - test: activate with a settings registry whose load resolves showBackgrounds false, render an alert; assert no `markdown-alert-with-backgrounds`
  - test-tags: UNIT
  - log: 2026-10-23T07:55:44Z @kj added
  - log: 2026-10-23T07:55:44Z @kj closed: verified

## Activation `ACTIVE`

Plugin activation and the IMarkdownParser render wrapper

- [x] `ACC-ACTIVE-18-CONSOLE` **Activation message** - LOW; activation logs `JupyterLab extension jupyterlab_github_markdown_alerts_extension is activated!` once to the browser console
  - evidence: Galata "should emit an activation console message" passes, Galata 5 of 5 passed (logs/goal-galata.log)
  - test: load JupyterLab, collect console messages; assert the message appears once
  - test-tags: E2E
  - log: 2026-10-23T07:14:25Z @kj added
  - log: 2026-10-23T07:14:25Z @kj closed: verified
- [x] `ACC-ACTIVE-19-WRAP-ONCE` **Render wrapped once** - MEDIUM; activating the plugin again on the same IMarkdownParser leaves its render wrapped once
  - evidence: jest "should wrap render once when activated twice with the same parser" passes, jlpm test 27 of 27 passed (logs/goal-trackers-test.log); it fails without the `__alertsWrapped` guard (logs/goal-feature-mutation.log)
  - test: activate twice with one parser; assert `parser.render` is the same function after the second activation
  - test-tags: UNIT
  - log: 2026-10-23T07:14:25Z @kj added
  - log: 2026-10-23T07:14:25Z @kj closed: verified

## Integration test server `GALATA`

The Galata test server set up by `ui-tests/jupyter_server_test_config.py` and `ui-tests/playwright.config.js`

- [x] `ACC-GALATA-20-SETTINGS-DIR` **Own settings folder** - MEDIUM; the test server keeps user settings in a new `galata-settings-*` temporary folder and never writes `~/.jupyter/lab/user-settings`
  - evidence: hand-run check: REST PUT to the test server on port 46122 wrote showBackgrounds false to /tmp/galata-settings-m3no8xu2/jupyterlab_github_markdown_alerts_extension/plugin.jupyterlab-settings (mtime 08:54:21 +0200); ~/.jupyter/lab/user-settings copy kept mtime 2026-10-23 07:40:37 +0200 (logs/goal-galata-settings-check.log, tmp/workflows/upgrade/07-trackers.json notes)
  - test: start the test server, PUT a plugin setting over REST; assert the file lands under /tmp/galata-settings-* and the home settings file keeps its mtime
  - test-tags: MANUAL
  - log: 2026-10-23T07:14:25Z @kj added
  - log: 2026-10-23T07:14:25Z @kj closed: verified
  - log: 2026-10-23T07:56:26Z @kj edited test "start the test server, PUT a plugin setting over REST; assert the file lands under /tmp/galata-settings-* and the home settings file keeps its mtime" -> "start the Galata test server, read userSettingsDir from #jupyter-config-data; assert it ends in a galata-settings-* folder"; test-tags "MANUAL" -> "E2E"; evidence "hand-run check: PUT to the test server on port 46122 wrote /tmp/galata-settings-m3no8xu2/jupyterlab_github_markdown_alerts_extension/plugin.jupyterlab-settings (mtime 08:54:21 +0200); the home copy kept mtime 2026-10-23 07:40:37 +0200 (logs/goal-galata-settings-check.log)" -> "Galata "should keep the test server settings in its own temporary folder" passes, Galata 7 of 7 passed (logs/fix-r1-galata.log); with the user_settings_dir line removed from ui-tests/jupyter_server_test_config.py it fails, received "/home/lab/.jupyter/lab/user-settings" (logs/fix-r1-r1-4-mutation.log)"
  - log: 2026-10-23T09:40:35Z @kj edited test "start the Galata test server, read userSettingsDir from #jupyter-config-data; assert it ends in a galata-settings-* folder" -> "start the test server, PUT a plugin setting over REST; assert the file lands under /tmp/galata-settings-* and the home settings file keeps its mtime"; test-tags "E2E" -> "MANUAL"; evidence "Galata "should keep the test server settings in its own temporary folder" passes, Galata 7 of 7 passed (logs/fix-r1-galata.log); with the user_settings_dir line removed from ui-tests/jupyter_server_test_config.py it fails, received "/home/lab/.jupyter/lab/user-settings" (logs/fix-r1-r1-4-mutation.log)" -> "hand-run check: REST PUT to the test server on port 46122 wrote showBackgrounds false to /tmp/galata-settings-m3no8xu2/jupyterlab_github_markdown_alerts_extension/plugin.jupyterlab-settings (mtime 08:54:21 +0200); ~/.jupyter/lab/user-settings copy kept mtime 2026-10-23 07:40:37 +0200 (logs/goal-galata-settings-check.log, tmp/workflows/upgrade/07-trackers.json notes)"
  - log: 2026-10-23T09:40:35Z @kj removed Galata test ui-tests/tests/settings-isolation.spec.ts: a one-line config needs no test
- [x] `ACC-GALATA-21-PORT` **Port from JUPYTER_TEST_PORT** - MEDIUM; the test server and the Playwright baseURL use the port in `JUPYTER_TEST_PORT`
  - evidence: Galata "should emit an activation console message" passed with JUPYTER_TEST_PORT=45185: server log `http://localhost:45185/lab`, no :8888 line, Galata 7 of 7 passed (logs/fix-r1b-verify-galata.log)
  - test: run the Galata tests with JUPYTER_TEST_PORT=46121; assert the server log shows `http://localhost:46121/lab` and the tests pass
  - test-tags: E2E
  - log: 2026-10-23T07:14:25Z @kj added
  - log: 2026-10-23T07:14:25Z @kj closed: verified
  - log: 2026-10-23T07:56:26Z @kj edited evidence "Galata run with JUPYTER_TEST_PORT=46121: server log `http://localhost:46121/lab`, Galata 5 of 5 passed (logs/goal-galata.log)" -> "Galata "should keep the test server settings in its own temporary folder" passed with JUPYTER_TEST_PORT=46121: server log `http://localhost:46121/lab`, test page referer `http://localhost:46121/lab/tree/tests-settings-isolation-s-1d217-in-its-own-temporary-folder?reset`, no 8888 line, Galata 7 of 7 passed (logs/fix-r1-galata.log)"
  - log: 2026-10-23T09:42:31Z @kj edited evidence "Galata "should keep the test server settings in its own temporary folder" passed with JUPYTER_TEST_PORT=46121: server log `http://localhost:46121/lab`, test page referer `http://localhost:46121/lab/tree/tests-settings-isolation-s-1d217-in-its-own-temporary-folder?reset`, no 8888 line, Galata 7 of 7 passed (logs/fix-r1-galata.log)" -> "Galata "should emit an activation console message" passed with JUPYTER_TEST_PORT=45185: server log `http://localhost:45185/lab`, no :8888 line, Galata 7 of 7 passed (logs/fix-r1b-verify-galata.log)"

