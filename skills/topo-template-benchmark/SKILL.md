---
name: topo-template-benchmark
description: Improve Topo Template deployment performance by benchmarking topo deploy or docker compose build, then making the highest-leverage Docker build optimization.
---

# Topo Template Benchmark

Use this skill when the user asks to make `topo deploy`, Docker builds, initial deployment, or development iteration faster for a Topo Template.

Before acting, read `references/topo-template-context.md` for shared Topo Template vocabulary and validation expectations. Read `references/docker-build-performance.md` before proposing or editing Dockerfile or Compose build changes.

## Workflow

1. Identify the Template root. Prefer the repository directory containing the root-level `compose.yaml`.
1. Ask whether the user wants to prioritize initial deployment time or iteration time.
1. If the user prioritizes iteration time, inspect the project and identify the most likely frequent edit path, such as Python source, C/C++ source, model files, dependency manifests, or configuration. Ask the user to confirm the change type to optimize for before editing.
1. Check whether `topo` is installed. If it is, ask the user for an SSH Target and benchmark with `topo deploy --target <ssh-target>`. If `topo` is unavailable or the user cannot provide a Target, benchmark with `docker compose build`.
1. Inspect `compose.yaml`, Dockerfiles, `.dockerignore`, dependency manifests, and source layout to find cache invalidation boundaries and expensive build steps.
1. Choose one high-leverage optimization. Prefer the smallest change likely to improve the selected scenario.
1. Take a baseline. To do this, ensure the docker build cache for the build images is clear first.
1. Apply the change, then re-run the same benchmark path used for the baseline.
1. Report the baseline, change, result, and remaining likely bottlenecks. Encourage the user to start a new chat session for the next incremental optimization.

## Benchmarking

- Use the same command, Template root, build arguments, and Target for baseline and after-change measurements.
- Prefer `topo deploy --target <ssh-target>` because it includes Template build, transfer through the peer-to-peer registry, and deployment to the Target.
- Use `docker compose build` as the fallback when there is no Topo Target or `topo` is unavailable.
- Capture enough output to identify slow steps and cache misses, not just total wall-clock time.
- If optimizing iteration time, run or request a representative edit before the after-change benchmark when practical.
- Clear Docker caches as necessary to establish representative timings. Ask for user permission do to this _once_, remembering their decision if they consent.

## Optimization Guidance

- For initial deployment time, prioritize reducing the amount of work, using smaller dependency sets, avoiding unnecessary downloads, and pre-baking stable expensive setup into base images when appropriate.
- For iteration time, prioritize isolating expensive layers from frequently edited files, copying dependency manifests before source, and moving app code late in the Dockerfile.
- Use BuildKit cache mounts for package managers, compiler caches, model downloads, Git object stores, or similar local rebuild accelerators when the build engine supports them.
- Use registry-backed build cache only when a shared registry and cache population workflow exist or the user explicitly wants CI or multi-host cache reuse.
- Avoid adding non-standard Compose keys. Build settings must remain valid Compose build configuration.
- Do not introduce a large pre-baked base image without explaining the registry storage, rebuild, and publishing trade-offs.

## Reporting

Report the priority selected, benchmark command, edited files, exact optimization made, measured before and after results, and any caveats such as missing Target testing or unsupported build engine behavior.
