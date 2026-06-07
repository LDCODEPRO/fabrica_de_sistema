from fastapi import APIRouter, Depends
from .deps import get_audit_repo, get_evidence_repo

router = APIRouter()

@router.get("/audits")
def get_audits(
    audit_repo = Depends(get_audit_repo),
    evidence_repo = Depends(get_evidence_repo)
):
    audits = audit_repo.list()
    evidences = evidence_repo.list()
    
    return {
        "audits": audits,
        "evidences": evidences
    }
