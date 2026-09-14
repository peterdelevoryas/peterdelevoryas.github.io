#!/usr/bin/env bash
# Mint an access token for the gated resume.
#
#   ./scripts/mint-token.sh acme-recruiter
set -euo pipefail

LABEL="${1:-}"
if [[ -z "$LABEL" ]]; then
  echo "usage: $0 <label>    e.g. $0 acme-recruiter" >&2
  exit 1
fi
if [[ "$LABEL" == *,* || "$LABEL" == *:* ]]; then
  echo "error: label must not contain ',' or ':'" >&2
  exit 1
fi

TOKEN="$(openssl rand -hex 16)"

cat <<EOF
label   $LABEL
token   $TOKEN

Append this entry to RESUME_TOKENS
(Vercel dashboard -> Settings -> Environment Variables), comma-separated:

  ${TOKEN}:${LABEL}

Then redeploy, and share:

  https://pjd.dev/resume?t=${TOKEN}

To revoke: delete that entry from RESUME_TOKENS and redeploy.
EOF
