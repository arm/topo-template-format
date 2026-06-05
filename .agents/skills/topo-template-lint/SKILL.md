---
name: topo-template-lint
description: Check Topo Template metadata correctness. Use when validating compose.yaml x-topo metadata, README alignment, deployment success messages, or build argument wiring.
---

# Topo Template Lint

Use this skill when the user asks to lint, validate, check, review, or fix Topo Template metadata correctness.

<!-- prettier-ignore-start -->
<!-- BEGIN GENERATED: topo-template-context -->
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
<!-- END GENERATED: topo-template-context -->
<!-- prettier-ignore-end -->

## Workflow

Run these checks in order. If the user asked you to fix issues, make the smallest safe changes and re-run the relevant checks after editing.

1. Confirm the current directory is a Template root.
2. Validate `compose.yaml` against the Topo Template Format schema.
3. Check that `x-topo.name` and `x-topo.description` match `README.md`.
4. Check that `x-topo.deployment_success_message` exists and is useful.
5. Check that every `x-topo.args` entry is consumed by the corresponding Docker build.

## Checks

### 1. Template Root

- Require a root-level `compose.yaml`.
- Require a root-level `x-topo` block in `compose.yaml`.
- Require `x-topo.name` to be present. This is the schema-minimum signal that the directory is a Topo Template.
- If the check fails, report that the current directory is not a Template and stop before schema validation unless the user asked you to repair it.

### 2. Schema

- Fetch the current published schema before validating.
- Check whether a supported validator is already installed, in this order: `check-jsonschema`, `ajv`, `jsonschema`.
- Prefer `check-jsonschema` because it validates YAML directly and is available from Homebrew as `brew install check-jsonschema`; on supported Ubuntu releases it may be available as `apt install python3-check-jsonschema`.
- Do not install validators on the user's behalf. If no supported validator is installed, stop and tell the user to install one before continuing.
- Treat schema errors as blocking issues. Fix schema errors before judging higher-level metadata intent.

### 3. README Alignment

- Read `README.md` from the Template root.
- Compare `x-topo.name` with the README title or clearly named project heading. The values do not need to be byte-identical, but they must identify the same Template without ambiguity.
- Compare `x-topo.description` with the README's first useful project summary. The metadata should accurately describe the same behavior, hardware focus, and user-facing purpose as the README.
- Flag generic, stale, marketing-only, or contradictory metadata.
- Prefer updating `x-topo` from the README when the README is specific and current. Prefer updating the README only when the Compose services show the README is stale.

### 4. Deployment Success Message

- Require `x-topo.deployment_success_message` to be present.
- The message should tell the user what succeeded and how to observe or use the deployed Template next.
- Flag placeholder messages, empty strings, and messages that mention URLs, ports, commands, or files not supported by the Compose services or README.

### 5. Build Argument Consumption

- For every key in `x-topo.args`, find the service or services whose `build.args` provide that argument.
- For each matching service, resolve its Docker build context and Dockerfile path. Use `Dockerfile` in the build context when `build.dockerfile` is omitted.
- Require the Dockerfile to declare the argument with `ARG <NAME>` or `ARG <NAME>=<default>` in a stage where it is needed.
- Check that the argument is actually used after declaration, for example in `RUN`, `ENV`, `LABEL`, `COPY --from`, or another instruction. A declared but unused `ARG` does not count as consumed.
- Flag `x-topo.args` keys that are not present in any `services.<service>.build.args` unless the service extends another Template where the argument is intentionally supplied by the parent Template.
- Flag `services.<service>.build.args` entries that look user-configurable but are missing from `x-topo.args` when the user asked for a comprehensive lint.
- Do not require runtime-only environment variables to appear in `x-topo.args`; this check is only for Docker build arguments.

## Reporting

Report findings in the same order as the checks. Include file paths, line numbers when available, the validation command used, and whether each check passed or failed. If changes were made, summarize the files edited and the re-validation result.
