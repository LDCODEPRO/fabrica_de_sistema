class ProjectClassifier:
    def classify(self, idea: str, scope: str) -> str:
        text = (idea + " " + scope).lower()
        if "saas" in text: return "SaaS"
        if "e-commerce" in text or "loja" in text: return "E-commerce"
        if "crm" in text: return "CRM"
        if "erp" in text: return "ERP"
        if "ai" in text or "ia " in text or "inteligência" in text: return "IA"
        if "landing page" in text: return "Landing Page"
        if "automação" in text: return "Automação"
        if "app" in text or "aplicativo" in text: return "Aplicativo"
        return "Website"
