/**
 * Unit tests for the markdown parser render wrapper in index.ts
 */

import { JupyterFrontEnd } from '@jupyterlab/application';
import { IMarkdownParser } from '@jupyterlab/rendermime';
import { ISettingRegistry } from '@jupyterlab/settingregistry';

import plugin from '../index';
import * as utils from '../utils';

const app = {} as JupyterFrontEnd;
const raw = `> [!NOTE]
> This is a note.`;

describe('markdown parser render wrapper', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should wrap render once when activated twice with the same parser', () => {
    const parser: IMarkdownParser = { render: async content => content };
    plugin.activate(app, parser, null);
    const wrapped = parser.render;
    plugin.activate(app, parser, null);
    expect(parser.render).toBe(wrapped);
  });

  it.each(['processAlerts', 'postProcessAlerts'] as const)(
    'should fall back to the original render of the raw content when %s throws',
    async transform => {
      jest.spyOn(utils, transform).mockImplementation(() => {
        throw new Error('transform failed');
      });
      const parser: IMarkdownParser = {
        render: async content => `<p>${content}</p>`
      };
      plugin.activate(app, parser, null);
      await expect(parser.render(raw)).resolves.toBe(`<p>${raw}</p>`);
    }
  );

  it('should fall back to the original render of the raw content when it throws for the processed content', async () => {
    const parser: IMarkdownParser = {
      render: async content => {
        if (content !== raw) {
          throw new Error('render failed');
        }
        return `<p>${content}</p>`;
      }
    };
    plugin.activate(app, parser, null);
    await expect(parser.render(raw)).resolves.toBe(`<p>${raw}</p>`);
  });

  it('should add backgrounds when there is no settings registry', async () => {
    const parser: IMarkdownParser = { render: async content => content };
    plugin.activate(app, parser, null);
    await expect(parser.render(raw)).resolves.toContain(
      'markdown-alert-with-backgrounds'
    );
  });

  it('should drop backgrounds when the saved showBackgrounds is false', async () => {
    const parser: IMarkdownParser = { render: async content => content };
    const settings = {
      get: () => ({ composite: false }),
      changed: { connect: () => undefined }
    };
    const registry = {
      load: async () => settings
    } as unknown as ISettingRegistry;
    plugin.activate(app, parser, registry);
    await new Promise(resolve => setTimeout(resolve, 0));
    const html = await parser.render(raw);
    expect(html).toContain('markdown-alert-note');
    expect(html).not.toContain('markdown-alert-with-backgrounds');
  });
});
