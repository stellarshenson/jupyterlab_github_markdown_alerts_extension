import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { IMarkdownParser } from '@jupyterlab/rendermime';
import { ISettingRegistry } from '@jupyterlab/settingregistry';

// Import utility functions from separate module (allows testing without JupyterLab deps)
import { processAlerts, postProcessAlerts } from './utils';

// Re-export for backwards compatibility
export { processAlerts, postProcessAlerts } from './utils';

/**
 * Initialization data for the jupyterlab_github_markdown_alerts_extension extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_github_markdown_alerts_extension:plugin',
  description:
    'Jupyterlab extension to render alerts tips like they are rendered in github in markdown',
  autoStart: true,
  requires: [IMarkdownParser],
  optional: [ISettingRegistry],
  activate: (
    app: JupyterFrontEnd,
    markdownParser: IMarkdownParser,
    settingRegistry: ISettingRegistry | null
  ) => {
    let showBackgrounds = false;

    // Load settings
    if (settingRegistry) {
      const loadSettings = () => {
        settingRegistry
          .load(plugin.id)
          .then(settings => {
            showBackgrounds = settings.get('showBackgrounds')
              .composite as boolean;
            settings.changed.connect(() => {
              showBackgrounds = settings.get('showBackgrounds')
                .composite as boolean;
            });
          })
          .catch(reason => {
            console.error(
              'Failed to load settings for jupyterlab_github_markdown_alerts_extension',
              reason
            );
          });
      };
      loadSettings();
    }

    // Idempotent: never re-wrap on re-activation, otherwise originalRender
    // would capture an already-wrapped function
    if (!(markdownParser.render as any).__alertsWrapped) {
      const originalRender = markdownParser.render.bind(markdownParser);

      const wrappedRender = async (content: string): Promise<string> => {
        try {
          const processedContent = processAlerts(content);
          const renderedHtml = await originalRender(processedContent);
          return postProcessAlerts(renderedHtml, showBackgrounds);
        } catch (reason) {
          // Degrade to plain Markdown instead of rejecting render, which
          // would push rendermime into an un-highlighted fallback
          console.error(
            'jupyterlab_github_markdown_alerts_extension: render failed, falling back to plain markdown',
            reason
          );
          return originalRender(content);
        }
      };
      (wrappedRender as any).__alertsWrapped = true;
      markdownParser.render = wrappedRender;
    }

    console.log(
      'JupyterLab extension jupyterlab_github_markdown_alerts_extension is activated!'
    );
  }
};

export default plugin;
