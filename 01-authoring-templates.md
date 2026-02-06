# Topo Template Authoring Guide

This guide details how to create Topo Templates for the Topo ecosystem.

## 1. Core Concepts

- **Template:** A reusable, parameterized repository defining one or more container services.
- **Project:** A `compose.yaml` that uses `extends:` to pull in Templates, providing argument values and customisations to compose an application.
- **Implementation:** A tool or system that conforms to this specification (e.g., a CLI, GUI, or API that enables users to work with Templates and Projects).
- **x-topo:** A metadata schema extension within standard [Compose](https://compose-spec.io) files that enables interactive features such as prompting, description display, and argument validation.

---

## 2. Authoring Templates

### File Structure

```
my-template/
├── compose.yaml   # REQUIRED: The definition file
├── Dockerfile     # Optional, but typical for Templates defining custom images
└── ...            # Any other files supporting the service, e.g. source code
```

### The compose.yaml

You must extend the standard [Compose Spec](https://compose-spec.io) with `x-topo` metadata. In addition, all template services must explicitly set `platform: linux/arm64` so Implementations target Arm64. The only exception is for services deployed via remoteproc.

```yaml
services:
  hello:
    platform: linux/arm64
    build:
      context: .
      # (Optional) defaults for plain docker compose; Implementations may override these from x-topo args
      args:
        GREETING: "Hello, World"

x-topo:
  name: "hello-world"
  description: |
    A simple Hello World service with a customizable greeting.
  type: "application"
  # ARGUMENT DEFINITIONS
  # These enable interactive prompting behavior.
  args:
    GREETING:
      description: "The greeting message to display"
      required: true
      example: "Hello from Arm!"
```

### The Dockerfile

Implementations pass arguments via standard Docker `ARG` directives.

```Dockerfile
FROM nginx:alpine

# 1. Consume the arg
ARG GREETING

# 2. Enforce requirement (Best Practice)
RUN test -n "$GREETING" || (echo "ERROR: GREETING build argument is required" && exit 1)

# 3. Use the arg to create a simple HTML page
RUN echo "<h1>$GREETING</h1>" > /usr/share/nginx/html/index.html
```

---

## 3. The x-topo Schema Reference

The `x-topo` block must be placed at the root of your YAML file.

```yaml
x-topo:
  name: string # Required
  description: string # Optional
  type: string # Optional, defaults to "application"
  features: [string] # Optional
  args: # Optional
    <ARG_NAME>:
      description: string # Optional
      required: boolean # Optional
      default: string # Optional
      example: string # Optional
```

---

## 4. Testing Your Template

Use the Topo CLI to verify your Templates locally.

```sh
# Create a compose.yaml
topo init

# Use your template using the local directory option `dir:`
topo extend compose.yaml dir:./path/to/my-template

# The CLI will prompt for arguments specified in your service

# Verify build success
topo deploy --target root@some-ssh-target
```
