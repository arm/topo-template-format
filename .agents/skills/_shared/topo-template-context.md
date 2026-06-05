# Shared Topo Template Context

Topo (https://github.com/arm/topo) is a CLI app which discovers, configures, builds, and deploys containerized examples to Arm-based Linux targets over SSH. A Topo Template (https://github.com/arm/topo-template-format) is a Compose project that remains runnable with plain `docker compose`, plus root-level `x-topo` metadata that lets Topo validate the Template, match it to target hardware features, and prompt for build-time configuration.

Use Topo vocabulary precisely:

- Host: the machine running Topo and building images.
- Target: the Arm64 Linux system where the deployment runs.
- Template: a containerized sample project containing `compose.yaml`, supporting files such as Dockerfiles and source, and `x-topo` metadata.
- X-Topo: the Compose extension key, written `x-topo`, that describes Template identity, type, hardware features, deploy message, and configurable build arguments.
- Feature: a hardware capability required or used by the Template, such as `NEON`, `SVE`, `SME`, a GPU, or an NPU.
- Remote processor: a peer execution environment managed from Linux, usually through Remoteproc Runtime and `runtime: remoteproc` services.
- Parameterization: Template configuration through Docker build arguments, with prompts and validation described in `x-topo.args` and actual values carried through Compose `build.args`.

Refresh spec-sensitive context at runtime before making or validating Template changes. Authoritative references, in order:

- Published Topo Template Format schema: `https://raw.githubusercontent.com/arm/topo-template-format/refs/heads/main/schema/topo-template-format.json`.
- Published Topo Template Format docs: `https://github.com/arm/topo-template-format`, especially `README.md`, `00-overview.md`, `01-authoring-templates.md`, `02-parameterization.md`, and `03-schema.md`.
- Published Topo glossary for domain terms: `https://github.com/arm/topo/blob/main/docs/glossary.md`.
- Compose Spec for standard Compose semantics. Do not invent non-standard Compose keys except the root-level `x-topo` extension.

When references conflict, prefer the schema for validation behavior, then the specification docs for authoring intent, then the target repository's actual Compose behavior for the smallest safe change.

When validating changes, check if `topo` is installed, and prompt the user for an SSH target to test against. `topo clone dir:./path/to/template` can be used to test parameterisation, `topo deploy` can be used to test build and deploy.
