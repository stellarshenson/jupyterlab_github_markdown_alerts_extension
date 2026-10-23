import { expect, IJupyterLabPageFixture, test } from '@jupyterlab/galata';
import type { Locator } from '@playwright/test';

const PLUGIN_ID = 'jupyterlab_github_markdown_alerts_extension:plugin';

const ALERTS = [
  { type: 'NOTE', title: 'Note', icon: 'octicon-info' },
  { type: 'TIP', title: 'Tip', icon: 'octicon-light-bulb' },
  { type: 'IMPORTANT', title: 'Important', icon: 'octicon-report' },
  { type: 'WARNING', title: 'Warning', icon: 'octicon-alert' },
  { type: 'CAUTION', title: 'Caution', icon: 'octicon-stop' }
];

/**
 * Write a notebook holding one markdown cell, open it and return the rendered cell.
 * A markdown cell in a saved notebook opens rendered, so no kernel dialog or menu is driven.
 */
async function renderCell(
  page: IJupyterLabPageFixture,
  path: string,
  source: string
): Promise<Locator> {
  const notebook = {
    cells: [{ cell_type: 'markdown', id: 'alerts', metadata: {}, source }],
    metadata: {
      kernelspec: {
        display_name: 'Python 3',
        language: 'python',
        name: 'python3'
      }
    },
    nbformat: 4,
    nbformat_minor: 5
  };
  await page.contents.uploadContent(JSON.stringify(notebook), 'text', path);
  await page.evaluate(async path => {
    await window.jupyterapp.commands.execute('docmanager:open', {
      path,
      factory: 'Notebook'
    });
  }, path);
  return page.locator('.jp-MarkdownCell .jp-RenderedMarkdown');
}

test('should render each alert type with its title and icon', async ({
  page,
  tmpPath
}) => {
  const source = ALERTS.map(({ type }) => `> [!${type}]\n> ${type} body`).join(
    '\n\n'
  );
  const cell = await renderCell(page, `${tmpPath}/types.ipynb`, source);

  for (const { type, title, icon } of ALERTS) {
    const alert = cell.locator(`.markdown-alert-${type.toLowerCase()}`);
    await expect(alert).toHaveCount(1);
    await expect(alert).toContainClass('markdown-alert');
    await expect(alert.locator('.markdown-alert-title')).toHaveText(title);
    await expect(alert).toContainText(`${type} body`);
    // one light and one dark image; the theme decides which one shows
    const visibleIcon = alert
      .locator(`.markdown-alert-title img.${icon}`)
      .filter({ visible: true });
    await expect(visibleIcon).toHaveCount(1);
    await expect(visibleIcon).toHaveAttribute(
      'src',
      /^data:image\/svg\+xml;base64,/
    );
  }
});

test('should show the title icon that matches the theme', async ({
  page,
  tmpPath
}) => {
  const title = (
    await renderCell(page, `${tmpPath}/theme.ipynb`, '> [!NOTE]\n> Body')
  ).locator('.markdown-alert-title');
  const light = title.locator('img.octicon-light');
  const dark = title.locator('img.octicon-dark');

  await page.theme.setLightTheme();
  await expect(light).toBeVisible();
  await expect(dark).toBeHidden();

  await page.theme.setDarkTheme();
  await expect(light).toBeHidden();
  await expect(dark).toBeVisible();
});

test('should drop the backgrounds class when showBackgrounds is set to false', async ({
  page,
  tmpPath
}) => {
  const path = `${tmpPath}/backgrounds.ipynb`;
  const source = '> [!NOTE]\n> Body';

  const before = (await renderCell(page, path, source)).locator(
    '.markdown-alert'
  );
  await expect(before).toHaveCount(1);
  await expect(before).toContainClass('markdown-alert-with-backgrounds');

  await page.evaluate(async id => {
    const registry = await window.galata.getPlugin(
      '@jupyterlab/apputils-extension:settings'
    );
    await registry!.set(id, 'showBackgrounds', false);
  }, PLUGIN_ID);
  // a markdown cell renders again only when its widget is new or its text changes
  await page.evaluate(() => window.jupyterapp.shell.currentWidget!.dispose());

  const after = (await renderCell(page, path, source)).locator(
    '.markdown-alert'
  );
  await expect(after).toHaveCount(1);
  await expect(after).not.toContainClass('markdown-alert-with-backgrounds');
});

test('should keep alert syntax inside fenced code blocks as code', async ({
  page,
  tmpPath
}) => {
  const backticks = '> [!NOTE]\n> inside backticks';
  const tildes = '> [!WARNING]\n> inside tildes';
  const source = `\`\`\`\n${backticks}\n\`\`\`\n\n~~~\n${tildes}\n~~~`;
  const cell = await renderCell(page, `${tmpPath}/fenced.ipynb`, source);

  const code = cell.locator('pre code');
  await expect(code).toHaveCount(2);
  await expect(code.nth(0)).toHaveText(backticks);
  await expect(code.nth(1)).toHaveText(tildes);
  await expect(cell.locator('.markdown-alert')).toHaveCount(0);
});

test('should render bold text, a list and a table inside an alert', async ({
  page,
  tmpPath
}) => {
  const source = [
    '> [!TIP]',
    '> Some **bold** text.',
    '>',
    '> - first item',
    '> - second item',
    '>',
    '> | Name | Value |',
    '> | ---- | ----- |',
    '> | a    | 1     |'
  ].join('\n');
  const cell = await renderCell(page, `${tmpPath}/rich.ipynb`, source);

  const alert = cell.locator('.markdown-alert-tip');
  await expect(alert).toHaveCount(1);
  await expect(alert.locator('strong')).toHaveText('bold');
  await expect(alert.locator('ul > li')).toHaveText([
    'first item',
    'second item'
  ]);
  await expect(alert.locator('table th')).toHaveText(['Name', 'Value']);
  await expect(alert.locator('table td')).toHaveText(['a', '1']);
});
