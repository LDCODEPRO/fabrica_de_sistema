"""
connectors.py — Catálogo de integrações da FORJA OS (por cliente).

Cada conector declara: chave, rótulo, que credencial precisa e COMO validar de
verdade (test). Validação real via API oficial quando há token. Sem scraping.
Segredos nunca são retornados pela API — só status.
"""
import json
import urllib.request
import urllib.error


def _http_get(url, headers=None, timeout=12):
    req = urllib.request.Request(url, headers=headers or {}, method="GET")
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.status, r.read().decode("utf-8", "replace")


# scope: "global" = conta da Fábrica, logada UMA vez, usada em todos os clientes.
#        "client" = conta própria de cada cliente.
CONNECTORS = {
    "canva": {
        "label": "Canva (Connect API)",
        "field": "Access Token (OAuth Canva Connect)",
        "needs": "token",
        "category": "design",
        "scope": "global",
        "how": "Sua conta Canva Pro (da Fábrica): conecte UMA vez e use para todos os clientes. Crie um app em canva.dev (Connect API).",
    },
    "openrouter": {
        "label": "OpenRouter (LLMs)",
        "field": "API Key (sk-or-...)",
        "needs": "token",
        "category": "ia",
        "scope": "global",
        "how": "Chave da Fábrica, usada por todos os clientes. Conecte uma vez.",
    },
    "github": {
        "label": "GitHub",
        "field": "Personal Access Token",
        "needs": "token",
        "category": "dev",
        "scope": "global",
        "how": "Conta da Fábrica (escopo repo). Conecte uma vez.",
    },
    "telegram": {
        "label": "Telegram (bot)",
        "field": "Bot token (do @BotFather)",
        "needs": "token",
        "category": "notificação",
        "scope": "global",
        "extra": [{"key": "chat_id", "label": "Chat ID de destino (ex.: -1001234 ou seu id)"}],
        "how": "Bot da Fábrica para notificações/aprovações. Grátis, sem revisão.",
    },
    "email": {
        "label": "E-mail (SMTP)",
        "field": "Senha SMTP (ou senha de app do Gmail)",
        "needs": "token",
        "category": "comunicação",
        "scope": "global",
        "extra": [
            {"key": "smtp_host", "label": "Servidor SMTP (ex.: smtp.gmail.com)"},
            {"key": "smtp_port", "label": "Porta (ex.: 587)"},
            {"key": "smtp_user", "label": "Usuário/e-mail de login"},
            {"key": "from_email", "label": "E-mail remetente (de:)"},
        ],
        "how": "E-mail da Fábrica via SMTP. No Gmail use uma 'senha de app'. Conecte uma vez.",
    },
    "whatsapp": {
        "label": "WhatsApp (Cloud API · Meta)",
        "field": "Access Token (WhatsApp Cloud API)",
        "needs": "token",
        "category": "social",
        "scope": "global",
        "extra": [{"key": "phone_number_id", "label": "Phone Number ID (do app WhatsApp)"}],
        "how": "WhatsApp Business da Fábrica. Requer Cloud API na Meta (WABA + número + token). Mensagens proativas usam templates aprovados.",
    },
    "instagram": {
        "label": "Instagram (Meta Graph)",
        "field": "Access Token (Graph API)",
        "needs": "token",
        "category": "social",
        "scope": "client",
        "extra": [{"key": "ig_user_id", "label": "ID da conta Instagram Business"}],
        "how": "Conta de CADA cliente. Requer Instagram Business + Página Facebook + app Meta com instagram_content_publish.",
    },
    "facebook": {
        "label": "Facebook Page (Meta Graph)",
        "field": "Page Access Token",
        "needs": "token",
        "category": "social",
        "scope": "client",
        "how": "Página do Facebook de cada cliente.",
    },
    "google_drive": {
        "label": "Google Drive",
        "field": "OAuth Access Token",
        "needs": "token",
        "category": "storage",
        "scope": "client",
        "how": "Drive de cada cliente (entregas/arquivos dele).",
    },
}


def list_connectors(scope=None):
    items = [
        {"kind": k, "label": v["label"], "field": v["field"],
         "category": v["category"], "scope": v.get("scope", "client"),
         "extra": v.get("extra", []), "how": v["how"]}
        for k, v in CONNECTORS.items()
    ]
    if scope:
        items = [it for it in items if it["scope"] == scope]
    return items


def test_connection(kind, credential, meta=None):
    """Valida a credencial via API oficial. Retorna (status, detail)."""
    cred = (credential or "").strip()
    meta = meta or {}
    if kind not in CONNECTORS:
        return "ERROR", f"conector desconhecido: {kind}"
    if not cred:
        return "PENDING", "sem credencial"

    try:
        if kind == "email":
            host = meta.get("smtp_host"); user = meta.get("smtp_user")
            try:
                port = int(meta.get("smtp_port") or 587)
            except Exception:
                port = 587
            if not (host and user):
                return "PENDING", "faltam servidor SMTP / usuário"
            import smtplib
            s = smtplib.SMTP(host, port, timeout=12)
            try:
                s.starttls()
            except Exception:
                pass
            s.login(user, cred); s.quit()
            return "CONNECTED", "SMTP ok (" + user + ")"

        if kind == "whatsapp":
            pnid = meta.get("phone_number_id")
            if not pnid:
                return "PENDING", "falta phone_number_id"
            st, body = _http_get(f"https://graph.facebook.com/v21.0/{pnid}?access_token={cred}")
            data = json.loads(body)
            if "error" in data:
                return "ERROR", str(data["error"].get("message", "token inválido"))[:120]
            return "CONNECTED", "whatsapp ok"

        if kind == "telegram":
            st, body = _http_get(f"https://api.telegram.org/bot{cred}/getMe")
            data = json.loads(body)
            if data.get("ok"):
                return "CONNECTED", "bot @" + (data.get("result", {}).get("username", "?"))
            return "ERROR", "token inválido"

        if kind == "github":
            st, body = _http_get("https://api.github.com/user",
                                 {"Authorization": "Bearer " + cred,
                                  "User-Agent": "forja-os", "Accept": "application/vnd.github+json"})
            login = json.loads(body).get("login", "?")
            return "CONNECTED", "user " + str(login)

        if kind in ("instagram", "facebook"):
            st, body = _http_get(f"https://graph.facebook.com/v21.0/me?access_token={cred}")
            data = json.loads(body)
            if "error" in data:
                return "ERROR", str(data["error"].get("message", "token inválido"))[:120]
            return "CONNECTED", "id " + str(data.get("id", "?"))

        if kind == "canva":
            st, body = _http_get("https://api.canva.com/rest/v1/users/me",
                                 {"Authorization": "Bearer " + cred})
            return "CONNECTED", "canva ok"

        if kind == "google_drive":
            st, body = _http_get("https://www.googleapis.com/drive/v3/about?fields=user",
                                 {"Authorization": "Bearer " + cred})
            return "CONNECTED", "drive ok"

        if kind == "openrouter":
            st, body = _http_get("https://openrouter.ai/api/v1/models",
                                 {"Authorization": "Bearer " + cred})
            return "CONNECTED", "openrouter ok"

    except urllib.error.HTTPError as e:
        return "ERROR", f"HTTP {e.code}"
    except Exception as e:
        return "ERROR", f"{type(e).__name__}"

    return "PENDING", "sem teste para este conector"
