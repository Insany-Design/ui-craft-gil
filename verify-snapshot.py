#!/usr/bin/env python3
"""Verify all generated files against the recovered immutable snapshot manifest."""
import json,hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parent
expected=json.loads((ROOT/'RESTORATION-HASHES.json').read_text())['files']
actual={f.relative_to(ROOT/'guide-dist').as_posix():hashlib.sha256(f.read_bytes()).hexdigest() for f in (ROOT/'guide-dist').rglob('*') if f.is_file()}
different=[p for p in expected.keys()|actual.keys() if expected.get(p)!=actual.get(p)]
assert not different,('Files differ from restored snapshot',different)
print(json.dumps({'publicFiles':len(actual),'byteIdenticalToRecoveredSnapshot':True,'differences':[]},indent=2))
