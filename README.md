# Topo Template Format Specification

Topo templates are hardware-aware, deployable sample projects for Arm-based Linux systems.
The Topo Template Format Specification exists to make these templates easier to discover, validate and reuse. It extends the standard [Compose Specification](https://compose-spec.io/) with an `x-topo` block for template metadata.
Templates are designed to be easy to deploy with [Topo](https://github.com/arm/topo/).

## Core Concepts

- **Template:** A reusable, parameterized repository defining one or more container services.
- **Project**: A `compose.yaml` that consumes one or more Templates to build a runnable application.
- **Implementation:** A tool or system that conforms to this specification (e.g., a CLI, GUI, or API that enables users to work with Templates and Projects).

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
- Machine-readable schema:
  - [`schema/topo-template-format.json`](schema/topo-template-format.json)

## Discover Topo Templates

Anyone can create and host their own Implementations of this Specification.

A curated list of templates can be found either via:

- the [topo templates](https://github.com/arm/topo?tab=readme-ov-file#3-find-a-template) command or
- the [topo catalog](https://github.com/arm/topo/blob/main/internal/catalog/data/templates.json)

We welcome any contributors who wish to add their own template to the list to submit a Pull Request as indicated below.

## Propose Your Template to Topo

If you want your template to be added to the template list:

1. Go over [Authoring Templates section of the Specification](01-authoring-templates.md).
2. [Validate Schema Compliance](./README.md#validate-schema-compliance) of your proposed template against this [Specification's schema](./schema/topo-template-format.json).
3. Open a Pull Request in the `Topo` repository to update the [Topo template catalog](https://github.com/arm/topo/blob/main/internal/catalog/data/templates.json).

### Validate Schema Compliance

There are multiple ways of validating your Implementation depending on your development setup. Below we list a few options:

#### Validating Schema Compliance using VS Code

Install the **YAML** extension, then map the schema to your template files in `.vscode/settings.json`:

```json
{
  "yaml.schemas": {
    "path/to/schema/topo-template-format.json": "**/compose.yaml"
  }
}
```

Open `compose.yaml` and verify there are no schema errors in the Problems panel.

#### Validating Schema Compliance using CLI

You can validate any template `compose.yaml` from the command line with `check-jsonschema` in your own virtual environment:

```sh
pip install check-jsonschema
check-jsonschema --schemafile schema/topo-template-format.json path/to/compose.yaml
```

## Versioning

This format follows Compose-style evolution and does not require strict schema-version pinning by implementations.

Implementations should follow [Compose guidance for optional attributes](https://github.com/compose-spec/compose-spec/blob/main/01-status.md#requirements-and-optional-attributes).

| Metadata |                  |
| -------- | ---------------: |
| Status   | Work in progress |
| Created  |       2025-11-10 |
