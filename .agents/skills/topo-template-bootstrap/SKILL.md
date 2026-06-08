---
name: topo-template-bootstrap
description: Convert a repository into a Topo Template by adding or improving compose.yaml and x-topo metadata.
---

# Topo Template Bootstrap

Use this skill when the user asks to create, convert, initialize, or bootstrap a repository as a Topo Template.

<!-- prettier-ignore-start -->
<!-- BEGIN GENERATED: topo-template-context -->
# Shared Topo Template Context

Topo (https://github.com/arm/topo) is a CLI app which discovers, configures, builds, and deploys containerized examples to Arm-based Linux targets over SSH. A Topo Template (https://github.com/arm/topo-template-format) is a Compose project that remains runnable with plain `docker compose`, plus root-level `x-topo` metadata that lets Topo validate the Template, match it to target hardware features, and prompt for build-time configuration.

Use Topo vocabulary precisely:

- Host: the machine running Topo and building images.
- Target: the Arm64 Linux system where the deployment runs.
- Template: a containerized sample project containing `compose.yaml`, supporting files such as Dockerfiles and source, and `x-topo` metadata.
- X-Topo: the Compose extension key, written `x-topo`, that describes Template identity, type, hardware features, deploy message, and configurable build arguments.
- Feature: a Target hardware capability required or used by the Template, such as `NEON`, `SVE`, `SME`, a GPU, or an NPU.
- Remote processor: a peer execution environment managed from Linux, usually through Remoteproc Runtime and `runtime: remoteproc` services.
- Parameterization: Template configuration through Docker build arguments, with prompts and validation described in `x-topo.args` and actual values carried through Compose `build.args`.

Refresh spec-sensitive context at runtime before making or validating Template changes. Authoritative references, in order:

- Published Topo Template Format schema: `https://raw.githubusercontent.com/arm/topo-template-format/refs/heads/main/schema/topo-template-format.json`.
- Published Topo Template Format docs: `https://github.com/arm/topo-template-format`, especially `README.md`, `00-overview.md`, `01-authoring-templates.md`, `02-parameterization.md`, and `03-schema.md`.
- Published Topo glossary for domain terms: `https://github.com/arm/topo/blob/main/docs/glossary.md`.
- Compose Spec for standard Compose semantics. Do not invent non-standard Compose keys except the root-level `x-topo` extension.

When references conflict, prefer the schema for validation behavior, then the specification docs for authoring intent, then the target repository's actual Compose behavior for the smallest safe change.

When validating changes, check if `topo` is installed, and prompt the user for an SSH target to test against. `topo clone dir:./path/to/template` can be used to test parameterisation, `topo deploy` can be used to test build and deploy.
<!-- END GENERATED: topo-template-context -->
<!-- prettier-ignore-end -->

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
