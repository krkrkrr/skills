#!/usr/bin/env bash
# Regenerate <dir>/index.md for an OKF bundle directory.
# Usage: okf-index.sh <dir> [group-key] [heading]
#   group-key: a frontmatter key (e.g. category) — one section per value.
#   heading:   section title when group-key is omitted (default: directory name).
# Lists every concept (*.md except index.md / log.md) directly under <dir>, and every
# subdirectory that has an index.md, using each concept's title and description.
set -euo pipefail

dir="${1:?usage: okf-index.sh <dir> [group-key] [heading]}"
key="${2:-}"
heading="${3:-$(basename "$dir")}"

# Print the value of a top-level frontmatter key, unquoted.
fm() {
  awk -v k="$2" '
    NR == 1 && $0 != "---" { exit }
    NR > 1 && $0 == "---" { exit }
    NR > 1 && index($0, k ":") == 1 {
      v = substr($0, length(k) + 2); sub(/^[ \t]+/, "", v); sub(/[ \t]+$/, "", v)
      if (v ~ /^".*"$/ || v ~ /^'\''.*'\''$/) v = substr(v, 2, length(v) - 2)
      print v; exit
    }' "$1"
}

entries=$(
  for f in "$dir"/*.md; do
    [ -e "$f" ] || continue
    name=$(basename "$f")
    case "$name" in index.md|log.md) continue ;; esac
    title=$(fm "$f" title); desc=$(fm "$f" description)
    group=$heading; [ -n "$key" ] && group=$(fm "$f" "$key")
    printf '%s\t* [%s](%s)%s\n' "${group:-その他}" "${title:-${name%.md}}" "$name" "${desc:+ - $desc}"
  done | sort -t "$(printf '\t')" -k1,1 -k2,2
)

{
  current=""
  while IFS="$(printf '\t')" read -r group line; do
    [ -z "$group" ] && continue
    if [ "$group" != "$current" ]; then
      [ -n "$current" ] && echo
      echo "# $group"; echo
      current=$group
    fi
    echo "$line"
  done <<< "$entries"

  subdirs=$(for d in "$dir"/*/; do [ -f "$d/index.md" ] && basename "$d"; done || true)
  if [ -n "$subdirs" ]; then
    [ -n "$current" ] && echo
    echo "# Subdirectories"; echo
    for s in $subdirs; do echo "* [$s]($s/)"; done
  fi
} > "$dir/index.md"
