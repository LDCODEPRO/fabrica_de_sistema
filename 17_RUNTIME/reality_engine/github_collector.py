import subprocess
import _compat_models as m

def collect(db):
    try:
        # Check se é um repo git
        res = subprocess.run(["git", "status"], capture_output=True, text=True)
        if res.returncode != 0:
            return {"status": "unavailable", "message": "Not a git repository or git not found."}
            
        branch = subprocess.run(["git", "branch", "--show-current"], capture_output=True, text=True).stdout.strip()
        last_commit = subprocess.run(["git", "log", "-1", "--pretty=format:%H|%s|%an|%cI"], capture_output=True, text=True).stdout.strip()
        
        parts = last_commit.split("|")
        commit_hash = parts[0] if len(parts) > 0 else ""
        commit_msg = parts[1] if len(parts) > 1 else ""
        author = parts[2] if len(parts) > 2 else ""
        date = parts[3] if len(parts) > 3 else ""
        
        return {
            "status": "ok",
            "branch": branch,
            "last_commit": commit_hash,
            "message": commit_msg,
            "author": author,
            "date": date
        }
    except Exception as e:
        return {"status": "unavailable", "error": str(e)}
