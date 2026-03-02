# Schema Compliance

The [machine-readable schema](schema/topo-template-format.json) to check any project against is provided as a [JSON schema](https://json-schema.org/) and is therefore compatible with any supported tooling.

## Validating Schema Compliance using VS Code

Install the [YAML extension](https://github.com/redhat-developer/vscode-yaml), then inline the schema's URL in your template files:

```yaml
#yaml-language-server: $schema=https://raw.githubusercontent.com/arm/topo-template-format/refs/heads/main/schema/topo-template-format.json
services:
  # ...

x-topo:
  # ...
```

Open `compose.yaml` and verify there are no schema errors in the Problems panel.

## Validating Schema Compliance using CLI

You can validate any template `compose.yaml` from the command line with `check-jsonschema` in your own virtual environment:

```sh
pip install check-jsonschema
check-jsonschema --schemafile schema/topo-template-format.json path/to/compose.yaml
```
