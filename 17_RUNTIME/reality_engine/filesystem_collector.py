import os
from pathlib import Path

def collect():
    try:
        test_file = Path(".test_write_fs")
        test_file.write_text("ok")
        test_file.unlink()
        return {"status": "writable"}
    except Exception:
        return {"status": "readonly"}
