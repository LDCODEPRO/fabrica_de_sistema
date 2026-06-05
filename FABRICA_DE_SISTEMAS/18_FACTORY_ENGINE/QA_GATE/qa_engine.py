from .test_runner import TestRunner
from .audit_runner import AuditRunner
from .certification_engine import CertificationEngine

class QAEngine:
    def __init__(self):
        self.test_runner = TestRunner()
        self.audit_runner = AuditRunner()
        self.cert_engine = CertificationEngine()

    def run_qa_pipeline(self, project_id: str, code_path: str) -> dict:
        tests_passed = self.test_runner.run_tests(code_path)
        audit_passed = self.audit_runner.run_audit(code_path)
        
        status = "CERTIFIED" if (tests_passed and audit_passed) else "REJECTED"
        
        cert = self.cert_engine.generate_certificate(project_id, status)
        return {
            "status": status,
            "certificate": cert
        }
