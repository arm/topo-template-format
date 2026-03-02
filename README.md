# Topo Template Format Specification

Topo templates are hardware-aware, deployable sample projects for Arm-based Linux systems.
The Topo Template Format Specification extends the [Compose Specification](https://compose-spec.io/) with an `x-topo` block that describes a template's identity, requirements, and configurable parameters. This makes templates easier to discover, validate, and reuse.
Templates are designed for configuration and deployment with [Topo](https://github.com/arm/topo/), and can be used by any community-developed tools that align with this specification.

## Core Concepts

- **Template:** A sample project (typically a git repository containing a `compose.yaml` with an `x-topo` metadata block, along with Dockerfiles and supporting source code) that defines one or more container services and their configurable parameters.
- **Implementation:** A tool or system that conforms to this specification (e.g., a CLI, GUI, or API) and which can discover, validate, configure, and deploy templates.
- **x-topo**: See the x-topo extension definition [below](./README.md#x-topo-extension).

### `x-topo` Extension

A metadata schema extension within standard [Compose](https://compose-spec.io) files that enables interactive features such as prompting, description display, and argument validation. Topo metadata lives at the root of `compose.yaml`:

```yaml
x-topo:
  name: "hello-world"
  description: "Template description"
  type: "application"
  features: ["NEON", "SVE"]
  args:
    GREETING:
      description: "Message shown by the app"
      required: true
      example: "Hello from Arm"
```

## Specification

- Human-readable spec:
  - [Overview](00-overview.md)
  - [Authoring Templates](01-authoring-templates.md)
  - [Parameterization](02-parameterization.md)
  - [Schema Compliance](03-schema.md)
- Machine-readable schema:
  - [`schema/topo-template-format.json`](schema/topo-template-format.json)

## Discover Topo Templates

Anyone can create and host their own Implementations of this Specification.

A curated list of templates (Reference Implementations of the specification) can be found either via:

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

- [Validating Schema Compliance using VS Code](03-schema-compliance.md#validating-schema-compliance-using-vs-code)
- [Validating Schema Compliance using CLI](03-schema-compliance.md#validating-schema-compliance-using-cli)

## Versioning

This format follows Compose-style evolution and does not require strict schema-version pinning by implementations.

Implementations should follow [Compose guidance for optional attributes](https://github.com/compose-spec/compose-spec/blob/main/01-status.md#requirements-and-optional-attributes).

| Metadata |                  |
| -------- | ---------------: |
| Status   | Work in progress |
| Created  |       2025-11-10 |
