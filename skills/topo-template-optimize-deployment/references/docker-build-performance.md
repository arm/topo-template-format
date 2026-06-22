# Docker Build Performance Reference

Topo Template performance matters in two common scenarios:

- Initial deployment: first build and deployment to a Target should not require excessive downloads, compilation, or image transfer.
- Iteration: common application edits should avoid invalidating expensive Docker layers and should minimize image changes that must be transferred to the Target.

## Reduce The Work

Make expensive steps do less before adding more complex caching.

- Use shallow or narrow Git fetches when full history is not needed, such as `--depth=1` or tool-specific narrow clone options.
- Filter optional dependency groups when the Template does not need them.
- Use minimal pinned dependency lists.
- Avoid installing complete SDKs, toolchains, development packages, recommendations, or test dependencies unless the Template actually needs them.
- For apt-based images, prefer explicit package lists and `--no-install-recommends`.

## Isolate Expensive Layers

Order Dockerfile instructions from least to most frequently changing so common edits do not invalidate slow setup.

- Copy dependency manifests before source code, install dependencies, then copy source code.
- Put stable system packages, SDK setup, dependency downloads, and toolchain setup early.
- Put application source, configuration, and assets that change often late.
- Use multi-stage builds to separate slow workspace setup from fast application builds.
- Review `.dockerignore` so unrelated repository changes do not enter the build context and invalidate cache.

Examples:

```dockerfile
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
```

```dockerfile
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
```

```dockerfile
COPY go.mod go.sum ./
RUN go mod download
COPY . .
```

## Pre-Baked Base Images

Use a pre-baked base image when a large, stable setup step dominates build time and changes rarely.

- Build the expensive workspace once, publish it to a registry, and make the Template Dockerfile `FROM` that image.
- This can reduce application builds from minutes to seconds.
- Rebuild and republish the base image when inputs such as SDK, framework, model, or dependency versions change.
- Explain the trade-off: large images cost registry storage and require a publishing workflow.

## BuildKit Cache Mounts

Use cache mounts when a `RUN` step may re-run but the tool can reuse persistent local state.

Common targets include package manager caches, compiler caches, Git object stores, and model download caches.

```dockerfile
RUN --mount=type=cache,target=/var/cache/apt \
    --mount=type=cache,target=/var/lib/apt/lists \
    apt-get update && apt-get install -y --no-install-recommends build-essential cmake
```

```dockerfile
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install -r requirements.txt
```

```dockerfile
RUN --mount=type=cache,target=/go/pkg/mod \
    go build -o /app .
```

Cache mounts are local to the build Host. They help repeated local builds, but they do not help a fresh CI Host unless the cache directory is restored separately.

Docker and nerdctl support BuildKit cache mounts. Podman/Buildah support can differ, so test before relying on it for a Template used across engines.

## Registry-Backed Build Cache

Use `cache_from` and `cache_to` when cache reuse must work across Hosts or CI runs and a registry workflow is available.

```yaml
services:
  myapp:
    build:
      context: .
      cache_from:
        - type=registry,ref=registry.example.com/myapp:cache
      cache_to:
        - type=registry,ref=registry.example.com/myapp:cache,mode=max
```

This requires a job or manual process to populate the cache. Avoid adding it unless the user has a suitable registry and wants shared cache reuse.

Podman/Buildah caching differs from Docker BuildKit. Buildah pushes intermediate images, uses heavier cache storage, and may not support tagged cache references. Validate the intended engine before depending on registry-backed cache in a Template.
