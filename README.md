# Topo Template Format Specification

This repository defines the specification for Topo Templates; an extension to the [Compose specification](https://compose-spec.io/). It describes the expected behavior and requirements that Implementations must follow, focusing on user actions and system behavior rather than specific implementation details.

The human-readable specification can be found [here](00-overview.md) and the machine-readable schema [here](schema/topo-template-format.json).

## Implementations

**[Topo](https://github.com/arm/topo)** is the reference implementation of the Topo Template Format Specification. It is a Command-line interface for working with Topo Templates and Projects.

## Versioning

The Topo Template Format Specification does not enforce exact schema versioning on its Implementations, [much like the Compose specification](https://github.com/compose-spec/compose-spec/blob/main/04-version-and-name.md) itself.

Since the Topo Template Format is purely an extension to the Compose specification we recommend Implementations follow Compose specification best practices when it comes to [support for optional attributes](https://github.com/compose-spec/compose-spec/blob/main/01-status.md#requirements-and-optional-attributes>).

| Metadata |                  |
| -------- | ---------------: |
| Status   | Work in progress |
| Created  |       2025-11-10 |
