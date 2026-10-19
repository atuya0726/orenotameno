#!/bin/sh
# Bootstraps a private venv with pymupdf, then runs fetch.py. See fetch.py for arguments.
set -eu
root=$(cd "$(dirname "$0")/../.." && pwd)
venv="$root/.cache/past-exam/venv"
if [ ! -x "$venv/bin/python" ]; then
  python3 -m venv "$venv"
  "$venv/bin/pip" -q install --disable-pip-version-check pymupdf
fi
exec "$venv/bin/python" -I "$root/scripts/past-exam/fetch.py" "$@"
