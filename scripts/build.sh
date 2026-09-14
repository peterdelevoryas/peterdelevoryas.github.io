#!/usr/bin/env bash
# Build the Zola site on Vercel.
#
# Zola isn't in Vercel's build image, so fetch the release binary. It needs at
# most GLIBC_2.29 and Amazon Linux 2023 ships 2.34, so the gnu build is fine.
set -euo pipefail

ZOLA_VERSION="v0.19.2"
TARBALL="zola-${ZOLA_VERSION}-x86_64-unknown-linux-gnu.tar.gz"
URL="https://github.com/getzola/zola/releases/download/${ZOLA_VERSION}/${TARBALL}"

curl -sSfL "$URL" -o /tmp/zola.tar.gz
tar xzf /tmp/zola.tar.gz -C /tmp
chmod +x /tmp/zola
/tmp/zola --version
/tmp/zola build
