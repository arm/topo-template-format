---
name: topo-template-bootstrap
description: Convert a repository into a Topo Template by adding or improving compose.yaml and x-topo metadata.
---

# Topo Template Bootstrap

Use this skill when the user asks to create, convert, initialize, or bootstrap a repository as a Topo Template.

Before acting, read `references/topo-template-context.md` for shared Topo Template vocabulary, authoritative references, and validation expectations.

## Workflow

1. Identify the Template root. Prefer the repository directory that contains or should contain the root-level `compose.yaml`.
2. Inspect the existing repository before editing. Read `compose.yaml`, Dockerfiles, README files, and source files needed to understand service purpose and build arguments.
3. Refresh the current schema and authoring docs when the requested change depends on field names, allowed values, service platform rules, or parameterization behavior.
4. Make the smallest safe change that turns the repository into a valid, useful Template while preserving plain `docker compose` behavior.
5. Validate the result with the topo-template-lint workflow or equivalent schema validation.

## Bootstrap Guidance

- Add a root-level `compose.yaml` only when one is missing. If one exists, preserve existing services, build contexts, images, volumes, networks, and runtime settings unless they conflict with the Template requirements.
- Add or improve a root-level `x-topo` block. Do not place `x-topo` under `services`.
- Choose `x-topo.name` from the repository or application purpose. Prefer short, stable, lowercase, hyphenated names.
- Set `x-topo.description` from the actual application behavior, not generic marketing language.
- Set `x-topo.type` only when useful. Use `application` for runnable examples that compose services and `library` for reusable Templates intended to be extended by other projects.
- Add `x-topo.features` only when the repository clearly requires or showcases target capabilities. Do not guess hardware requirements from weak evidence.
- Set `platform: linux/arm64` on services unless the service uses Remoteproc Runtime.
- Expose configuration through `x-topo.args` only for Docker or Compose build arguments that users should set. Ensure argument names match the keys used in `services.<service>.build.args` and Dockerfile `ARG` instructions.
- Keep default `build.args` values when they help the project run with plain `docker compose`. Use `x-topo.args` for prompt metadata and validation intent.

## Reporting

Report what changed and why. Include the Template root, files edited, validation command used, validation result, and any spec-sensitive assumptions that came from current docs or schema.
