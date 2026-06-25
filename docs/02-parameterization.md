# Topo Parameterization

## Overview

Templates support parameterization through Docker build arguments:

- `x-topo.args` defines argument metadata (description, whether required, examples, and advisory hints)
- Standard Compose `build.args` provides argument values

## How Parameterization Works

Templates extend [compose-spec](https://compose-spec.io/) with `x-topo.args` to define and document build arguments.
Unless a service is intended for a remote processor, every service definition in these examples (and in compliant Templates) must include `platform: linux/arm64`. Remote processor services omit `platform` but must set `remoteproc` as their `runtime` so Implementations can recognize the exception.

**compose.yaml**

```yaml
services:
  welcome:
    platform: linux/arm64
    build:
      context: .
      # Optional default: allows running with plain docker compose
      # Not used by Implementations that read x-topo.args
      args:
        GREETING: "Hello, World"

x-topo:
  name: "Topo Welcome"

  # Build argument metadata for interactive prompting
  args:
    # Implementations prompt users to provide these values
    GREETING:
      description: |
        The greeting message to display in the container
      required: true
      example: "Hello from Arm SME"
```

These build args are then consumed in the service's Dockerfile as `ARG`

### Example Dockerfile

**Dockerfile**

```Dockerfile
FROM nginx:alpine

ARG GREETING

# Docker files cannot require an arg - it is necessary to force failure if the value is not specified
RUN test -n "$GREETING" || (echo "ERROR: GREETING build argument is required" && exit 1)
...
```

## Worked example

### Creating a Project

Users can initialize a new Project, resulting in an empty `compose.yaml` file.

### Extending Projects with Templated Services

When users extend a Project with services defined in a Template, Implementations must handle build argument collection and validation. The examples below illustrate how a CLI interface might handle this:

**Interactive Mode**
Implementations may choose to prompt users when required arguments are missing:

```
$ topo extend ...

Missing Build Arg
The greeting message to display in the container
GREETING (required)> Sup
```

**Direct Argument Specification**
Implementations may support providing arguments directly:

```
$ topo extend ... GREETING=Sup`
```

**Non-Interactive Mode)**
Implementations may support a non-interactive mode that errors on missing required arguments:

```
$ topo extend ... --no-prompt

error: "Missing build args"
missing_args:
    GREETING:
      description: |
          The greeting message to display in the container
      required: true
      example: "Hello from Arm SME"
```

## Argument Hints

Argument definitions may include `hints`, which Implementations can use to discover, filter, or suggest suitable argument values. Hints do not define validation constraints, and Implementations may ignore hints they do not understand.

Hint keys must use lowercase dotted namespaces to avoid collisions, such as `huggingface.task` or `file.format`. Hint values may be strings, numbers, booleans, or arrays of those scalar values.

```yaml
x-topo:
  args:
    MODEL:
      description: "Model artifact reference"
      default: "bartowski/Qwen_Qwen3.5-0.8B-GGUF:SmolLM2-135M-Instruct-Q4_K_M.gguf"
      hints:
        huggingface.task: text-generation
        file.format: gguf
```

Recommended hint key conventions include:

- `huggingface.task` — suggests a Hugging Face task or pipeline filter, such as `text-generation`
- `file.format` — suggests a desired artifact or file format, such as `gguf`

### Processing Steps

When users extend a Project with a Template, Implementations should perform the following steps:

1.  Retrieve the Template repository (e.g., clone to a local subdirectory)
1.  Parse the Template's `compose.yaml` and read argument metadata from `x-topo.args`
1.  Collect values for any required arguments from `x-topo.args` (e.g., by prompting the user)
1.  Update the Project's `compose.yaml` with a service definition that extends the Template
1.  Set the `services.<service-name>.build.args` with the collected values

### Resulting Configuration

After adding the service with build arguments, the compose file is updated:

**compose.yaml**

```yaml
services:
  cool-service:
    extends:
      file: ./cool-service/compose.yaml
      service: welcome
    build:
      args:
        GREETING: "Sup"
```

## Parameterization Layering

### Templates Satisfying Requirements

Templates can provide default `build.args` values that satisfy requirements from Templates they extend. When a Template provides a value for an argument that another Template marks as `required: true`, that argument effectively becomes **optional** for end users.

**Extended Template's compose.yaml**

```yaml
x-topo:
  args:
    GREETING:
      description: The greeting message to display
      required: true
      example: "Hello, World"
```

**Parent Template's compose.yaml**

```yaml
services:
  welcome-service:
    extends:
      file: ./welcome-service/compose.yaml
      service: welcome
    build:
      args:
        GREETING: "Hello from Arm SME Project" # Satisfies the extended Template's requirement
```

This layering means:

- The extended Template declares `GREETING` as required
- The parent Template provides a default value
- End users can accept the default or override it
- The Template runs with plain `docker compose up` without prompting

### Templates Adding Parameterization

Templates can also define their own `x-topo.args` to expose configuration:

```yaml
services:
  welcome-service:
    extends:
      file: ./welcome-service/compose.yaml
      service: welcome
    build:
      args:
        GREETING: "Hello, World"

  ollama-service:
    platform: linux/arm64
    build:
      context: .
      args:
        MODEL: qwen3:0.6B

x-topo:
  name: "My Template"
  args:
    MODEL:
      description: "hugging face model ID to use"
      required: true
      default: qwen3:7B
```

The effective required arguments for the Template are:

- Template-level args marked as `required: true`
- Extended Template args marked as `required: true` that the parent Template hasn't provided defaults for

When users instantiate a Template as a new Project, Implementations should collect required arguments in the same manner as when extending an existing Project with a Template.
