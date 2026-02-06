# Development Guide

This guide covers the development workflow, tools, and conventions for contributing to the Topo Template Specification.

## Exporting to Confluence

Use the provided script to convert markdown files to Confluence Wiki Markup format:

```bash
# Install dependencies
npm install

# Convert a markdown file
node scripts/md2confluence.js <filename.md>
```

This can then be imported on Confluence with Cmd+Shift+D and selecting "Confluence wiki" as the import format

## Formatting

The contents of this repository are formatted using [Prettier](https://prettier.io/). Use the npm script to apply formatting as needed:

```bash
# Install dependencies
npm install

# Re-format all files in place
npx run format
```
