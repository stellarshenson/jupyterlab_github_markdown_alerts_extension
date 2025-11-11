# Making a new release of jupyterlab_github_markdown_alerts_extension

## Release 1.0.5 (2025-11-11)

This release delivers complete GitHub-style alert rendering for JupyterLab 4 with full theme support and optional customization.

**Key Features**:
- **Complete Alert Support** - All five GitHub alert types (NOTE, TIP, IMPORTANT, WARNING, CAUTION) with proper icons and colors
- **Theme Integration** - Automatic color adaptation for light and dark themes matching GitHub's exact styling
- **Icon Rendering** - SVG icons encoded as data URIs with theme-specific colors for each alert type
- **Optional Backgrounds** - User-configurable colored backgrounds via Settings → GitHub Markdown Alerts (disabled by default)
- **Markdown Compatibility** - Full markdown parsing within alert blocks (bold, italic, links, code, etc.)
- **Code Block Awareness** - Alert syntax in code blocks displays as examples rather than rendering as alerts

**Technical Implementation**:
- Two-phase processing using HTML comment markers to preserve markdown features
- Base64-encoded SVG data URIs to bypass JupyterLab's HTML sanitizer
- CSS theme detection using `body[data-jp-theme-light='false']` selector
- Settings integration via `@jupyterlab/settingregistry`

---

## Publishing Instructions

The extension can be published to `PyPI` and `npm` manually or using the [Jupyter Releaser](https://github.com/jupyter-server/jupyter_releaser).

## Manual release

### Python package

This extension can be distributed as Python packages. All of the Python
packaging instructions are in the `pyproject.toml` file to wrap your extension in a
Python package. Before generating a package, you first need to install some tools:

```bash
pip install build twine hatch
```

Bump the version using `hatch`. By default this will create a tag.
See the docs on [hatch-nodejs-version](https://github.com/agoose77/hatch-nodejs-version#semver) for details.

```bash
hatch version <new-version>
```

Make sure to clean up all the development files before building the package:

```bash
jlpm clean:all
```

You could also clean up the local git repository:

```bash
git clean -dfX
```

To create a Python source package (`.tar.gz`) and the binary package (`.whl`) in the `dist/` directory, do:

```bash
python -m build
```

> `python setup.py sdist bdist_wheel` is deprecated and will not work for this package.

Then to upload the package to PyPI, do:

```bash
twine upload dist/*
```

### NPM package

To publish the frontend part of the extension as a NPM package, do:

```bash
npm login
npm publish --access public
```

## Automated releases with the Jupyter Releaser

The extension repository should already be compatible with the Jupyter Releaser. But
the GitHub repository and the package managers need to be properly set up. Please
follow the instructions of the Jupyter Releaser [checklist](https://jupyter-releaser.readthedocs.io/en/latest/how_to_guides/convert_repo_from_repo.html).

Here is a summary of the steps to cut a new release:

- Go to the Actions panel
- Run the "Step 1: Prep Release" workflow
- Check the draft changelog
- Run the "Step 2: Publish Release" workflow

> [!NOTE]
> Check out the [workflow documentation](https://jupyter-releaser.readthedocs.io/en/latest/get_started/making_release_from_repo.html)
> for more information.

## Publishing to `conda-forge`

If the package is not on conda forge yet, check the documentation to learn how to add it: https://conda-forge.org/docs/maintainer/adding_pkgs.html

Otherwise a bot should pick up the new version publish to PyPI, and open a new PR on the feedstock repository automatically.
