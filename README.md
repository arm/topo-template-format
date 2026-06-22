# Topo Template Format Specification

A Topo Template is a containerized sample project for Arm-based Linux systems. At minimum, it is a directory containing a `compose.yaml`, Dockerfiles, and source code, with an `x-topo` metadata block that describes what the Template does, what hardware features it requires, and what parameters a user can configure.

This specification defines the `x-topo` extension. It was developed for use with [Topo](https://github.com/arm/topo/), but this is an open spec and any tool can read and act on `x-topo` metadata to discover, validate, and deploy Templates.

Not sure what these terms mean? [Topo's glossary](https://github.com/arm/topo/blob/main/docs/glossary.md) defines many of its core concepts.

## How It Works

A Template's `compose.yaml` is a standard [Compose](https://compose-spec.io/) file with an `x-topo` block at the root:

```yaml
services:
  app:
    platform: linux/arm64
    build:
      context: .
      args:
        GREETING: "Hello, World"

x-topo:
  name: "hello-world"
  description: "A simple greeting app for Arm"
  features: ["NEON"]
  args:
    GREETING:
      description: "Message shown by the app"
      required: true
      example: "Hello from Arm"
```

Because this is valid Compose, any Template can be run with plain `docker compose`. The `x-topo` block is what allows tools like Topo to add interactive configuration, argument validation, and target feature matching on top.

## Specification

- Human-readable spec:
  - [Overview](00-overview.md)
  - [Authoring Templates](01-authoring-templates.md)
  - [Parameterization](02-parameterization.md)
  - [Schema Compliance](03-schema.md)
- Machine-readable schema:
  - [`schema/topo-template-format.json`](schema/topo-template-format.json)

## Discover Topo Templates

A curated list of example Templates can be found either via:

- the [topo templates](https://github.com/arm/topo?tab=readme-ov-file#3-find-a-template) command or
- the [topo catalog](https://github.com/arm/topo/blob/main/internal/catalog/data/templates.json).

We welcome any contributors who wish to add their own Template to the list to submit a Pull Request as indicated below.

## Authoring Skills

This repository includes public agent skills that help authors create and validate Topo Templates.

- `topo-template-context`: provides Topo and Topo Template reference context for questions about `x-topo` metadata, schema, docs, and CLI Template behavior.
- `topo-template-bootstrap`: converts a repository into a Topo Template by adding or improving `compose.yaml` and `x-topo` metadata.
- `topo-template-lint`: reviews an existing Topo Template for correctness, consistency, and authoring best practices.
- `topo-template-optimize-deployment`: optimizes `topo deploy` or Docker build performance for initial deployment and iteration workflows.

### Installing Skills

You can install the skills with [`npx skills`](https://github.com/vercel-labs/skills):

```sh
npx skills add arm/topo-template-format
```

Or install the skills manually by copying or symlinking the directories under `skills/` into your agent's skills directory.

Restart your agent after installing or updating skills.

## Propose Your Template to Topo

If you want your Template to be added to the Template list:

1. Review the [Authoring Templates section of the Specification](01-authoring-templates.md).
2. [Validate Schema Compliance](./README.md#validate-schema-compliance) of your proposed Template.
3. Open a Pull Request in the `Topo` repository to update the [Topo Template catalog](https://github.com/arm/topo/blob/main/internal/catalog/data/templates.json).

### Validate Schema Compliance

The [machine-readable schema](schema/topo-template-format.json) to check any Template against is provided as a [JSON schema](https://json-schema.org/) and is therefore compatible with any supported tooling.

For validation workflows, see:

- [Validating Schema Compliance in Your Editor](03-schema.md#validating-schema-compliance-in-your-editor)
- [Validating Schema Compliance using CLI](03-schema.md#validating-schema-compliance-using-cli)

## Versioning

This format follows Compose-style evolution and does not require strict schema-version pinning by implementations.

Implementations should follow [Compose guidance for optional attributes](https://github.com/compose-spec/compose-spec/blob/main/01-status.md#requirements-and-optional-attributes).

| Metadata |                  |
| -------- | ---------------: |
| Status   | Work in progress |
| Created  |       2025-11-10 |
