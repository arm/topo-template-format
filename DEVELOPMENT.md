# Development Guide

This guide covers the development workflow, tools, and conventions for contributing to the Topo Template Specification.

## Formatting

The contents of this repository are formatted using [Prettier](https://prettier.io/). Use the npm script to apply formatting as needed:

```bash
# Install dependencies
npm install

# Re-format all files in place
npx run format
```

## Skills

Public agent skills live under `skills/`.

To test skills from this checkout while developing them, install the local repository with `npx skills`. Choose symlinks when prompted if you want edits in this checkout to be reflected immediately.

```sh
npx skills add . --global
```

Each installable skill folder should be self-contained, but shared Topo Template context is maintained in `skills/_shared/topo-template-context.md` to avoid hand-edited drift across skills. After editing that shared context, update each skill's `references/topo-template-context.md` copy:

```bash
npm run sync:skills
```

Check that skill context references are current:

```bash
npm run check:skills
```

Skill-specific instructions should stay workflow-focused. Put stable common vocabulary in the shared context, reference the current schema/docs for evolving spec details, and avoid copying the full specification into individual skills.
