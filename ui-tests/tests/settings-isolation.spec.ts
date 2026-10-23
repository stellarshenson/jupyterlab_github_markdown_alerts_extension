import { expect, test } from '@jupyterlab/galata';

test('should keep the test server settings in its own temporary folder', async ({
  page
}) => {
  // the page config lists the server's user settings folder
  const dir = await page.evaluate(
    () =>
      JSON.parse(document.getElementById('jupyter-config-data')!.textContent!)
        .userSettingsDir
  );
  expect(dir).toMatch(/\/galata-settings-[^/]+$/);
});
