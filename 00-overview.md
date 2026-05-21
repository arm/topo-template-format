# Topo Templates

A Topo Template is a repository that defines one or more container services using the [Compose Spec](https://compose-spec.io) with Topo-specific metadata.

## Requirements

- _Must_ Contain a Compose Spec file named `compose.yaml`, which:
  - _Should_ contain a `x-topo` attribute defining the required fields
    - see [x-topo schema](#x-topo-schema)
  - _Must_ define one or more valid [services](https://github.com/compose-spec/compose-spec/blob/main/05-services.md)
  - _Must_ set `platform: linux/arm64` on every service unless that service uses a remoteproc runtime
- _Could_ Be a git repo

## Examples

### Single Service Template

A Template that builds a single container image:

**compose.yaml**

```yaml
# standard https://github.com/compose-spec/compose-spec/blob/main/05-services.md
services:
  app:
    platform: linux/arm64
    build:
      context: .

# Topo-specific metadata
x-topo:
  name: "kleidi-llm" # Required
  description: |
    Run an LLM locally using KleidiAI optimised inference on Arm CPU
  type: "library" # Optional
  features:
    - "SME"
    - "NEON"
```

### Multi-Service Template

A Template that composes multiple services, which can extend other Templates or use public images:

**compose.yaml**

```yaml
# standard https://github.com/compose-spec/compose-spec/
services:
  # A service that extends another Template
  cool-service:
    extends:
      file: ./cool-service-template/compose.yaml
      service: cool-service
    build:
      args:
        MODEL: "llama-3.1-8b"
        QUANTIZATION: "q4_0"
  # A service using a public container image
  open-webui:
    platform: linux/arm64
    image: ghcr.io/open-webui/open-webui:main

# Topo-specific metadata
x-topo:
  name: "kleidi-llm-webui"
  description: |
    Run an LLM chat web app with Kleidi inference
  type: "application"
  features:
    - "SME"
    - "NEON"
```

This allows Templates to be runnable with plain `docker compose` while Implementations can add customization and local development workflows.

## Spec Examples

- <https://github.com/arm/Lightbulb-LLM-Heterogenous>
- <https://github.com/arm/topo-armv9-cpu-llm-chat>
- <https://github.com/arm/topo-kleidi-service>
- <https://github.com/arm/topo-cortexa-welcome>
- <https://github.com/arm/topo-simd-visual-benchmark>

## Use Cases

- A zephyr starter program compatible with [Remoteproc Runtime](https://github.com/arm/remoteproc-runtime)
- An LLM model running on an Arm-SIMD optimised (e.g. KleidiAI) inference back-end
- A Template running on the Linux host Cortex-A and another service running on the Cortex-M, with both services co-ordinating over RPMsg

## x-topo Schema

The `x-topo` extension provides metadata for Templates. If included, it must be specified at the root level of a [Compose file](https://compose-spec.io).

### Example

```yaml
x-topo:
  name: string # Required
  description: string # Optional
  type: string # Optional, defaults to "application"
  features: [string] # Optional
  deploy_success_message: string # Optional
  args: # Optional
    <ARG_NAME>:
      description: string # Optional
      required: boolean # Optional
      default: string # Optional
      example: string # Optional
```

### Fields

**`name`** (string, required)
Unique identifier for the Template.

**`description`** (string, optional)
Multiline human-readable explanation of what the Template does.

**`type`** (string, optional, default: `application`)
Declares how the template can be consumed. Supported values:

- `library` — Provides reusable functionality intended to be integrated into other projects.
- `application` — A project that composes other libraries or services.

**`features`** (array of strings, optional)
Hardware features required or utilized (e.g., `SVE`, `NEON`, `SME`).

**`deploy_success_message`** (string, optional)
Message displayed to the user after a successful deployment. If omitted, a default message is shown.

**`args`** (object, optional)
Dictionary of build argument definitions. Each key is an argument name (e.g., `GREETING`) with the following properties:

- **`description`** (string, optional) — Context displayed in user prompts
- **`required`** (boolean, optional) — If `true`, Implementations must enforce input or error
- **`default`** (string, optional) — Value used if user skips input (only valid when not required)
- **`example`** (string, optional) — Hint text displayed in help and prompts
