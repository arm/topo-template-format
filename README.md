# Topo Template Format Specification

A Topo Template is a containerized sample project for Arm-based Linux systems. At minimum, it is a directory containing a `compose.yaml`, Dockerfiles, and source code, with an `x-topo` metadata block that describes what the template does, what hardware features it needs, and what parameters a user can configure.

This specification defines the `x-topo` extension. It was developed for use with [Topo](https://github.com/arm/topo/), but this is an open spec and any tool can read and act on `x-topo` metadata to discover, validate, and deploy templates.

## How It Works

A template's `compose.yaml` is a standard [Compose](https://compose-spec.io/) file with an `x-topo` block at the root:

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
  type: "application"
  features: ["NEON"]
  args:
    GREETING:
      description: "Message shown by the app"
      required: true
      example: "Hello from Arm"
```

Because this is valid Compose, any template can be run with plain `docker compose`. The `x-topo` block is what allows tools like Topo to add interactive configuration, argument validation, and hardware feature filtering on top.

## Specification

- Human-readable spec:
  - [Overview](00-overview.md)
  - [Authoring Templates](01-authoring-templates.md)
  - [Parameterization](02-parameterization.md)
  - [Schema Compliance](03-schema.md)
- Machine-readable schema:
  - [`schema/topo-template-format.json`](schema/topo-template-format.json)

## Discover Topo Templates

A curated list of example templates can be found either via:

- the [topo templates](https://github.com/arm/topo?tab=readme-ov-file#3-find-a-template) command or
- the [topo catalog](https://github.com/arm/topo/blob/main/internal/catalog/data/templates.json).

We welcome any contributors who wish to add their own template to the list to submit a Pull Request as indicated below.

## Propose Your Template to Topo

If you want your template to be added to the template list:

1. Review the [Authoring Templates section of the Specification](01-authoring-templates.md).
2. [Validate Schema Compliance](./README.md#validate-schema-compliance) of your proposed template.
3. Open a Pull Request in the `Topo` repository to update the [Topo template catalog](https://github.com/arm/topo/blob/main/internal/catalog/data/templates.json).

### Validate Schema Compliance

The [machine-readable schema](schema/topo-template-format.json) to check any template against is provided as a [JSON schema](https://json-schema.org/) and is therefore compatible with any supported tooling.

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
