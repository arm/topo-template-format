#!/usr/bin/env bash

set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source_dir="$repo_root/.agents/skills"
target_dir="${AGENTS_SKILLS_DIR:-$HOME/.agents/skills}"
mode="copy"
shopt -s nullglob

usage() {
  printf 'Usage: %s [--copy|--symlink]\n' "$(basename "$0")"
  printf '\n'
  printf 'Installs skills from .agents/skills to %s.\n' "$target_dir"
  printf 'Use --symlink when developing skills in this checkout.\n'
}

print_command() {
  printf '+'
  printf ' %q' "$@"
  printf '\n'
}

run_command() {
  print_command "$@"
  read -r -p 'Run this command? [y/N] ' answer
  case "$answer" in
    [Yy] | [Yy][Ee][Ss]) "$@" ;;
    *)
      printf 'Skipped.\n'
      return 1
      ;;
  esac
}

remove_existing_skill() {
  local target_path="$1"

  printf 'Installed skill directory already exists at: %s\n' "$target_path"
  printf 'Delete it so this installer can overwrite it?\n'
  print_command rm -rf "$target_path"
  read -r -p 'Delete existing skill? [y/N] ' answer
  case "$answer" in
    [Yy] | [Yy][Ee][Ss]) rm -rf "$target_path" ;;
    *)
      printf 'Skipped. Existing skill directory was left unchanged.\n'
      return 1
      ;;
  esac
}

for argument in "$@"; do
  case "$argument" in
    --copy) mode="copy" ;;
    --symlink) mode="symlink" ;;
    -h | --help)
      usage
      exit 0
      ;;
    *)
      printf 'Unknown argument: %s\n\n' "$argument" >&2
      usage >&2
      exit 2
      ;;
  esac
done

if [[ -d "$target_dir" ]]; then
  printf 'Using existing skills directory: %s\n' "$target_dir"
else
  run_command mkdir -p "$target_dir" || exit 1
fi

skill_paths=("$source_dir"/topo-template-*)

if (( ${#skill_paths[@]} == 0 )); then
  printf 'No installable skills found in %s.\n' "$source_dir" >&2
  exit 1
fi

for source_path in "${skill_paths[@]}"; do
  if [[ ! -d "$source_path" || ! -f "$source_path/SKILL.md" ]]; then
    continue
  fi

  skill="$(basename "$source_path")"
  target_path="$target_dir/$skill"

  if [[ "$mode" == "copy" ]]; then
    if [[ -e "$target_path" || -L "$target_path" ]]; then
      remove_existing_skill "$target_path" || continue
    fi

    run_command cp -R "$source_path" "$target_dir/" || continue
  else
    if [[ -L "$target_path" && "$(readlink "$target_path")" == "$source_path" ]]; then
      printf 'Already linked: %s\n' "$target_path"
      continue
    fi

    if [[ -e "$target_path" || -L "$target_path" ]]; then
      remove_existing_skill "$target_path" || continue
    fi

    run_command ln -s "$source_path" "$target_path" || continue
  fi
done

printf 'Restart your agent after installing skills.\n'
