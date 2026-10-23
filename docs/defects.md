# Defects - jupyterlab_github_markdown_alerts_extension

Faults found during the 1.0.26 upgrade (JupyterLab 4.6, TypeScript 5.8, Galata tests), each closed with the evidence of its fix.

## Authors

- `@kj` Konrad Jelen

## Developer tooling `TOOLS`

ESLint and Jest configuration

- [x] `DEF-TOOLS-1-ESLINT-TMP` **Lint fails on workflow scripts in tmp/** - MINOR; `jlpm run lint:check` reported 49 errors, all in tmp/workflows/upgrade/prepare.mjs; fix: `tmp` added to the ESLint ignores; `eslint.config.mjs`
  - evidence: jlpm run lint:check: 0 errors, 5 warnings, all jupyter/no-untranslated-string in src/utils.ts (logs/goal-trackers-verify.log)
  - repro: put a .mjs file under tmp/, run jlpm run lint:check
  - test-tags: MANUAL
  - root-cause: 2026-10-23T07:14:25Z @kj ESLint 9 flat config does not read .gitignore, and the ignores list in eslint.config.mjs lacked `tmp`
  - log: 2026-10-23T07:14:25Z @kj added
  - log: 2026-10-23T07:14:25Z @kj closed: fixed: `tmp` in ESLint ignores
- [x] `DEF-TOOLS-2-JEST-ESM` **src/index.ts not importable under Jest** - MINOR; a spec importing src/index.ts failed with `SyntaxError: Unexpected token 'export'`, so the render wrapper had 0% coverage; fix: `@jupyter/react-components`, `@jupyter/web-components`, `@microsoft`, `exenv-es6` added to esModules; `jest.config.js`
  - evidence: jlpm test 27 of 27 passed, 2 suites, index.ts 75.86% statements (logs/goal-trackers-test.log); removing any of the four entries makes the suite fail to parse (logs/goal-feature-jest-config-min.log)
  - repro: import src/index.ts from a jest spec, run jlpm test
  - test-tags: UNIT
  - root-cause: 2026-10-23T07:14:26Z @kj jest.config.js replaces the @jupyterlab/testing transformIgnorePatterns with its own esModules list, which omits ES-module packages that @jupyterlab/rendermime loads through @jupyterlab/apputils and @jupyterlab/ui-components
  - log: 2026-10-23T07:14:26Z @kj added
  - log: 2026-10-23T07:14:26Z @kj closed: fixed: four ES-module packages added to esModules
- [x] `DEF-TOOLS-17-JEST-REGEX` **Jest collects spec files outside src/** - MINOR; jlpm test ran a third, failing suite tmp/workflows/review/patches/r1-1.before/src/__tests__/index.spec.ts; fix: `roots: ['<rootDir>/src']` limits test discovery to src/; `jest.config.js`
  - evidence: with roots: ['<rootDir>/src'] and a probe copy at tmp/discovery-probe/src/__tests__/index.spec.ts, jest --listTests lists only the 2 src/__tests__ specs; with the line removed it also lists the probe; probe trashed (logs/fix-r1b-r1-12-listtests.log); jlpm test 28 of 28 passed (logs/fix-r1b-r1-12-test.log)
  - repro: copy a spec to tmp/x/src/__tests__/, run jlpm test
  - test-tags: MANUAL
  - root-cause: 2026-10-23T07:58:15Z @kj testRegex 'src/.*/.*.spec.ts[x]?$' is unanchored and testPathIgnorePatterns covers only node_modules, so any path containing src/ is a test path
  - log: 2026-10-23T07:58:15Z @kj added
  - log: 2026-10-23T07:58:15Z @kj closed: wontfix in this round: outside the fix-r1 change list; testRegex unchanged
  - log: 2026-10-23T08:12:57Z @kj amended text "jlpm test ran a third, failing suite tmp/workflows/review/patches/r1-1.before/src/__tests__/index.spec.ts; fix not applied: anchor testRegex to '<rootDir>/src/' or add '<rootDir>/tmp/' to testPathIgnorePatterns; `jest.config.js`" -> "jlpm test ran a third, failing suite tmp/workflows/review/patches/r1-1.before/src/__tests__/index.spec.ts; fix: `roots: ['<rootDir>/src']` limits test discovery to src/; `jest.config.js`"
  - log: 2026-10-23T08:12:57Z @kj edited evidence "trigger removed, regex unchanged: the copied spec folder went to the trash, jest --listTests lists only the 2 src/__tests__ specs, and testRegex still matches a path under tmp/ (logs/fix-r1-r1-11-verify.log); jlpm test 28 of 28 passed (logs/fix-r1-final.log)" -> "with roots: ['<rootDir>/src'] and a probe copy at tmp/discovery-probe/src/__tests__/index.spec.ts, jest --listTests lists only the 2 src/__tests__ specs; with the line removed it also lists the probe; probe trashed (logs/fix-r1b-r1-12-listtests.log); jlpm test 28 of 28 passed (logs/fix-r1b-r1-12-test.log)"

## Integration test server `GALATA`

Galata test server and Playwright configuration in `ui-tests/`

- [x] `DEF-GALATA-3-REUSE-SERVER` **Galata tests would attach to the developer lab** - MEDIUM; Playwright would run the tests against the lab already on 8888 (jupyterhub-singleuser) instead of a test server; fix: port and baseURL read `JUPYTER_TEST_PORT`, `reuseExistingServer: false`; `ui-tests/playwright.config.js`
  - evidence: Playwright started and stopped its own server on JUPYTER_TEST_PORT=46121, log `http://localhost:46121/lab`; Galata 5 of 5 passed (logs/goal-galata.log)
  - repro: run a JupyterLab on 8888, run jlpm playwright test in ui-tests/
  - test-tags: E2E
  - root-cause: 2026-10-23T07:14:26Z @kj playwright.config.js hardcoded port 8888 with reuseExistingServer true, so any server answering on 8888 was taken as the test server
  - log: 2026-10-23T07:14:26Z @kj added
  - log: 2026-10-23T07:14:26Z @kj closed: fixed: JUPYTER_TEST_PORT, reuseExistingServer false
- [x] `DEF-GALATA-4-PORT-PIN` **Test server pinned to port 8888** - MEDIUM; the Galata test server could only listen on 8888, which the developer lab holds; fix: `c.ServerApp.port` reads `JUPYTER_TEST_PORT`; `ui-tests/jupyter_server_test_config.py`
  - evidence: server log `http://localhost:46121/lab` with JUPYTER_TEST_PORT=46121; Galata 5 of 5 passed (logs/goal-galata.log)
  - repro: with 8888 taken, run jlpm playwright test in ui-tests/
  - test-tags: E2E
  - root-cause: 2026-10-23T07:14:26Z @kj jupyterlab.galata.configure_jupyter_server sets port 8888 with port_retries 0, and the test config did not override it
  - log: 2026-10-23T07:14:26Z @kj added
  - log: 2026-10-23T07:14:26Z @kj closed: fixed: c.ServerApp.port from JUPYTER_TEST_PORT
- [x] `DEF-GALATA-5-MOTD-TAB` **Galata start-up wait times out on this workstation** - MEDIUM; every Galata test failed after 17.6 s waiting for an active Launcher, because the workstation MOTD opened a Welcome tab; fix: `c.GalaxaHubMotd.open_on_start = False`; `ui-tests/jupyter_server_test_config.py`
  - evidence: first run failed at 17.6 s (logs/upgrade-galata.log); with the fix Galata 5 of 5 passed (logs/goal-galata.log)
  - repro: on a host with the GalaxaHub MOTD extension, run jlpm playwright test in ui-tests/
  - test-tags: E2E
  - root-cause: 2026-10-23T07:14:26Z @kj the GalaxaHubMotd server extension opens a Welcome tab at start, so the Launcher is not the active tab galata waits for
  - log: 2026-10-23T07:14:26Z @kj added
  - log: 2026-10-23T07:14:26Z @kj closed: fixed: MOTD off in the test server
- [x] `DEF-GALATA-6-USER-SETTINGS` **Test server wrote the developer user settings** - MEDIUM; a settings write reaching the Galata test server landed in `~/.jupyter/lab/user-settings`; fix: `c.LabApp.user_settings_dir = mkdtemp(prefix="galata-settings-")`; `ui-tests/jupyter_server_test_config.py`
  - evidence: PUT to the test server wrote /tmp/galata-settings-m3no8xu2/jupyterlab_github_markdown_alerts_extension/plugin.jupyterlab-settings; the home copy kept mtime 2026-10-23 07:40:37 +0200 (logs/goal-galata-settings-check.log)
  - repro: start the test server, PUT /lab/api/settings/jupyterlab_github_markdown_alerts_extension:plugin, check ~/.jupyter/lab/user-settings
  - test-tags: MANUAL
  - root-cause: 2026-10-23T07:14:26Z @kj configure_jupyter_server moves the workspaces folder and server root to temporary folders but leaves LabApp.user_settings_dir at ~/.jupyter/lab/user-settings, and the test config did not set it
  - log: 2026-10-23T07:14:26Z @kj added
  - log: 2026-10-23T07:14:26Z @kj closed: fixed: user_settings_dir in a mkdtemp folder
- [x] `DEF-GALATA-7-TRASH-DELETE` **Galata scratch folders never deleted** - MINOR; every test left its scratch folder in the server root; the DELETE answered 400 `send2trash failed: [Errno 13] Permission denied: b'/.Trash-1000'`; fix: `c.AsyncLargeFileManager.delete_to_trash = False`; `ui-tests/jupyter_server_test_config.py`
  - evidence: final run: 0 `400 DELETE` lines, Galata 5 of 5 passed (logs/goal-galata.log); before the fix 400 DELETE in logs/upgrade-galata.log
  - repro: run jlpm playwright test in ui-tests/, grep the server log for `400 DELETE /api/contents/tests-`
  - test-tags: E2E
  - root-cause: 2026-10-23T07:14:26Z @kj server root is a mkdtemp folder under /tmp, another filesystem than HOME, so send2trash targets root-owned /.Trash-1000; the site config sets delete_to_trash True on AsyncLargeFileManager, which outranks a FileContentsManager setting
  - log: 2026-10-23T07:14:26Z @kj added
  - log: 2026-10-23T07:14:26Z @kj closed: fixed: delete_to_trash False on AsyncLargeFileManager
- [x] `DEF-GALATA-16-README-PORT` **ui-tests README silent on a taken port 8888** - MINOR; ui-tests/README.md step 3 gave only `jlpm playwright test` and never named JUPYTER_TEST_PORT, so a reader with port 8888 taken had no instruction; fix: one sentence under step 3; `ui-tests/README.md`
  - evidence: ui-tests/README.md:48 reads "When another server already holds port 8888, run `JUPYTER_TEST_PORT=8889 jlpm playwright test`; CI keeps the default port." (logs/fix-r1-r1-11-verify.log)
  - repro: read step 3 of ui-tests/README.md before the fix; JUPYTER_TEST_PORT is not mentioned
  - test-tags: MANUAL
  - root-cause: 2026-10-23T07:58:15Z @kj configure_jupyter_server pins port 8888 with port_retries 0; JUPYTER_TEST_PORT existed in the test configs but not in the README
  - log: 2026-10-23T07:58:15Z @kj added
  - log: 2026-10-23T07:58:15Z @kj closed: fixed: README sentence on JUPYTER_TEST_PORT

## Dependencies and version floors `DEPS`

Python extras, CI install pins and the README requirements

- [x] `DEF-DEPS-8-TEST-EXTRA` **CI installs an undeclared test extra** - MINOR; `python -m pip install .[test]` in build.yml warned that the package does not provide the extra 'test' and installed without it; fix: `test` extra with `jupyterlab>=4.6,<5`, `dev` pulls it in; `pyproject.toml`
  - evidence: tomllib on pyproject.toml: test ['jupyterlab>=4.6,<5'], dev pulls [test]; HEAD held only dev (logs/goal-trackers-verify.log)
  - repro: pip install .[test] on HEAD pyproject.toml, read the warning
  - test-tags: MANUAL
  - root-cause: 2026-10-23T07:14:26Z @kj [project.optional-dependencies] held only `dev` while .github/workflows/build.yml installs `.[test]`
  - log: 2026-10-23T07:14:26Z @kj added
  - log: 2026-10-23T07:14:26Z @kj closed: fixed: test extra declared
- [x] `DEF-DEPS-9-CI-FLOOR` **CI JupyterLab floor below the extension floor** - MINOR; CI pip installs pinned `jupyterlab>=4.0.0,<5` while the @jupyterlab/* dependencies need ^4.6.0, and test_isolated ran Python 3.12; fix: pins `>=4.6,<5`, Python 3.13 on every setup step; `.github/workflows/build.yml`, `.github/workflows/update-integration-tests.yml`
  - evidence: every jupyterlab pin in .github/workflows reads >=4.6,<5 and every Python setup 3.13 (logs/goal-trackers-verify.log, logs/goal-conform-yaml.log)
  - repro: git show HEAD:.github/workflows/build.yml, grep `jupyterlab>=` and `python-version`
  - test-tags: MANUAL
  - root-cause: 2026-10-23T07:14:26Z @kj the @jupyterlab/* dependencies were raised to ^4.6.0 without the CI pins; test_isolated and the base-setup steps kept Python 3.12
  - log: 2026-10-23T07:14:26Z @kj added
  - log: 2026-10-23T07:14:27Z @kj closed: fixed: CI pins >=4.6,<5 and Python 3.13
- [x] `DEF-DEPS-10-README-REQ` **README requirements out of date** - MINOR; README Requirements listed `JupyterLab >= 4.0.0` and no Python floor; fix: JupyterLab >= 4.6 and Python >= 3.10; `README.md`
  - evidence: README.md Requirements reads JupyterLab >= 4.6 and Python >= 3.10 (logs/goal-trackers-verify.log)
  - repro: git show HEAD:README.md, read the Requirements section
  - test-tags: MANUAL
  - root-cause: 2026-10-23T07:14:27Z @kj README not updated when package.json raised @jupyterlab/* to ^4.6.0 and pyproject.toml set requires-python >=3.10
  - log: 2026-10-23T07:14:27Z @kj added
  - log: 2026-10-23T07:14:27Z @kj closed: fixed: README requirements
- [x] `DEF-DEPS-11-LOCK-RANGES` **package-lock.json kept the old dependency ranges** - MEDIUM; package-lock.json packages[""] disagreed with package.json on 25 ranges, among them typescript ~5.5.4 (resolved 5.5.4) against ~5.8.3 and @jupyterlab/settingregistry ^4.0.0 against ^4.6.0; fix: npm install --package-lock-only, then prettier; `package-lock.json`
  - evidence: packages[""] matches package.json, 0 mismatches, typescript resolved 5.8.3 (logs/fix-r1-r1-11-verify.log); npm install --package-lock-only exit 0 (logs/fix-r1-r1-6-npm.log); jlpm install --immutable exit 0 (logs/fix-r1-r1-6-immutable.log)
  - repro: compare packages[""] dependencies and devDependencies in package-lock.json with package.json
  - test-tags: MANUAL
  - root-cause: 2026-10-23T07:58:14Z @kj the package.json range edits were followed by jlpm install only, which writes yarn.lock; npm install --package-lock-only was never run
  - log: 2026-10-23T07:58:14Z @kj added
  - log: 2026-10-23T07:58:14Z @kj closed: fixed: package-lock.json re-resolved to the package.json ranges

## CI workflows `BUILD`

GitHub Actions jobs and steps in .github/workflows

- [x] `DEF-BUILD-12-LINT-TEST` **CI build job ran neither lint nor jest** - MEDIUM; a lint error or a failing jest test did not fail the build job; fix: 'Lint the extension' (jlpm run lint:check) and 'Test the extension' (jlpm run test) steps before 'Build the extension'; `.github/workflows/build.yml`
  - evidence: build steps parse in order Checkout, Base Setup, Install dependencies, Lint the extension, Test the extension, Build the extension (logs/fix-r1-r1-5-yaml.log); jlpm run lint:check and jlpm run test exit 0 locally (logs/fix-r1-r1-5-ci-steps.log)
  - repro: git show HEAD:.github/workflows/build.yml, list the build job steps
  - test-tags: MANUAL
  - root-cause: 2026-10-23T07:58:14Z @kj the build job steps were Checkout, Base Setup, Install dependencies, Build the extension, Package the extension, Upload extension packages; none ran lint:check or jest
  - log: 2026-10-23T07:58:14Z @kj added
  - log: 2026-10-23T07:58:14Z @kj closed: fixed: lint and test steps in the build job

## Test coverage `TESTS`

Behaviour that no automated test exercised

- [x] `DEF-TESTS-13-BG-LOAD` **Saved showBackgrounds load path untested** - MEDIUM; no jest case ran the settings load in src/index.ts; with its showBackgrounds assignment removed the 27 jest cases still passed; fix: jest case with a settings registry that loads showBackgrounds false; `src/__tests__/index.spec.ts`
  - evidence: jest "should drop backgrounds when the saved showBackgrounds is false" passes, jlpm test 28 of 28 passed (logs/fix-r1-final.log); with the assignment removed only that case fails, 1 failed, 27 passed (logs/fix-r1-r1-1-mutation.log)
  - repro: remove the load-time showBackgrounds assignment in src/index.ts, run jlpm test on the 27 cases before the fix
  - test-tags: UNIT
  - root-cause: 2026-10-23T07:58:14Z @kj every jest case activated the plugin with settingRegistry null, so the settings load never ran under test
  - log: 2026-10-23T07:58:14Z @kj added
  - log: 2026-10-23T07:58:14Z @kj closed: fixed: jest case for the saved false value
- [x] `DEF-TESTS-14-THEME-ICON` **Theme title icon untested** - MEDIUM; no test told the light title icon from the dark one, and no test switched the theme; fix: Galata test 'should show the title icon that matches the theme'; `ui-tests/tests/alerts.spec.ts`
  - evidence: Galata "should show the title icon that matches the theme" passes, Galata 7 of 7 passed (logs/fix-r1-galata.log); with the .octicon-light and .octicon-dark display rules swapped it fails, Received: hidden (logs/fix-r1-r1-3-mutation.log)
  - repro: read ui-tests/tests/alerts.spec.ts:61-64: filter({ visible: true }) then toHaveCount(1) passes whichever of the two images shows
  - test-tags: E2E
  - root-cause: 2026-10-23T07:58:14Z @kj 'should render each alert type with its title and icon' filters the title images on visible and expects one, which either image satisfies
  - log: 2026-10-23T07:58:14Z @kj added
  - log: 2026-10-23T07:58:15Z @kj closed: fixed: Galata theme icon test
- [x] `DEF-TESTS-15-SETTINGS-DIR` **Test server settings isolation checked only by hand** - MINOR; the user_settings_dir line in ui-tests/jupyter_server_test_config.py had no repository test; its criterion was closed on a hand-run REST PUT; fix: Galata test reading userSettingsDir from the page config; `ui-tests/tests/settings-isolation.spec.ts`
  - evidence: Galata "should keep the test server settings in its own temporary folder" passes, Galata 7 of 7 passed (logs/fix-r1-galata.log); with the user_settings_dir line removed it fails, received "/home/lab/.jupyter/lab/user-settings" (logs/fix-r1-r1-4-mutation.log)
  - repro: search ui-tests/tests for userSettingsDir or user_settings_dir before the fix; no match
  - test-tags: E2E
  - root-cause: 2026-10-23T07:58:15Z @kj the user_settings_dir fix was verified with a hand-run REST PUT and no Galata test was written for it
  - log: 2026-10-23T07:58:15Z @kj added
  - log: 2026-10-23T07:58:15Z @kj closed: fixed: Galata settings folder test

