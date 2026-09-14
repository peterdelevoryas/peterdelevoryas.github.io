#!/usr/bin/env bash
# Build the Zola site.
#
# Zola isn't in Vercel's build image, so fetch the release binary. On Linux the
# gnu build needs at most GLIBC_2.29 and Amazon Linux 2023 ships 2.34, so it
# runs fine there. Platform detection is here so this script also works for a
# local build (`bash scripts/build.sh`) and for `vercel deploy --temporary`,
# which builds on your own machine rather than on Vercel's builders.
set -euo pipefail

ZOLA_VERSION="v0.19.2"

case "$(uname -s)/$(uname -m)" in
  Linux/x86_64)         TARGET="x86_64-unknown-linux-gnu" ;;
  Darwin/arm64)         TARGET="aarch64-apple-darwin" ;;
  Darwin/x86_64)        TARGET="x86_64-apple-darwin" ;;
  *) echo "build.sh: unsupported platform $(uname -s)/$(uname -m)" >&2; exit 1 ;;
esac

CACHE="${TMPDIR:-/tmp}/zola-${ZOLA_VERSION}-${TARGET}"
if [[ ! -x "$CACHE/zola" ]]; then
  mkdir -p "$CACHE"
  URL="https://github.com/getzola/zola/releases/download/${ZOLA_VERSION}/zola-${ZOLA_VERSION}-${TARGET}.tar.gz"
  curl -sSfL "$URL" -o "$CACHE/zola.tar.gz"
  tar xzf "$CACHE/zola.tar.gz" -C "$CACHE"
  chmod +x "$CACHE/zola"
fi

"$CACHE/zola" --version
"$CACHE/zola" build
