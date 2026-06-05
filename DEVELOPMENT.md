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

Public agent skills live under `.agents/skills/`.

To develop skills, install them as symlinks.

```sh
mkdir -p ~/.agents/skills
ln -s "$PWD/.agents/skills/topo-template-bootstrap" ~/.agents/skills/topo-template-bootstrap
ln -s "$PWD/.agents/skills/topo-template-lint" ~/.agents/skills/topo-template-lint
ln -s "$PWD/.agents/skills/topo-template-optimise" ~/.agents/skills/topo-template-optimise
```

Each installable skill folder should be self-contained, but shared Topo Template context is maintained in `.agents/skills/_shared/topo-template-context.md` to avoid hand-edited drift across skills. After editing that shared context, update the embedded generated blocks in each skill:

```bash
npm run sync:skills
```

Check that generated skill context is current:

```bash
npm run check:skills
```

Skill-specific instructions should stay workflow-focused. Put stable common vocabulary in the shared context, reference the current schema/docs for evolving spec details, and avoid copying the full specification into individual skills.
