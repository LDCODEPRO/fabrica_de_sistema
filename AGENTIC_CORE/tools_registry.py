"""
tools_registry.py — Ferramentas REAIS e SEGURAS dos agentes da FORJA OS.

Todas as ferramentas têm trava de segurança:
- Leitura/listagem/busca: restritas à raiz do repositório (sem traversal).
- Escrita: SOMENTE dentro da sandbox 09_AGENT_WORKSPACE.
- Banco: SOMENTE consultas SELECT (DDL/DML bloqueados).
- Terminal: SOMENTE comandos de uma allowlist não destrutiva.
Cada ferramenta recebe UMA string (action_input) e devolve texto.
"""
import os
import json
import sqlite3
import subprocess
import urllib.request
import urllib.error
from pathlib import Path

# Conectores cuja conta é da Fábrica (global, client_id=0); os demais são por-cliente.
GLOBAL_KINDS = {"canva", "openrouter", "github", "telegram", "email", "whatsapp"}

# Ferramentas por PAPEL — cada agente age de forma distinta (só vê suas ferramentas).
# ORCHESTRATOR (e papéis não listados) recebem TODAS as ferramentas (coordenador).
ROLE_TOOLS = {
    "ARCHITECT":     ["listar_pasta", "ler_arquivo", "buscar_no_repo", "status_sistema", "escrever_arquivo"],
    "DEVELOPER":     ["listar_pasta", "ler_arquivo", "buscar_no_repo", "escrever_arquivo", "rodar_comando", "status_sistema"],
    "QA":            ["listar_pasta", "ler_arquivo", "buscar_no_repo", "rodar_comando", "consultar_banco", "status_sistema"],
    "DEVOPS":        ["status_sistema", "rodar_comando", "listar_pasta", "ler_arquivo"],
    "AI_ENGINEER":   ["status_sistema", "consultar_banco", "buscar_no_repo", "ler_arquivo"],
    "ANALYST":       ["status_sistema", "consultar_banco", "buscar_no_repo", "ler_arquivo"],
    "SECURITY":      ["buscar_no_repo", "ler_arquivo", "listar_pasta", "consultar_banco", "status_sistema"],
    "DATA_ENGINEER": ["consultar_banco", "status_sistema", "listar_pasta", "ler_arquivo"],
    "DOCS":          ["listar_pasta", "ler_arquivo", "buscar_no_repo", "escrever_arquivo"],
    "DESIGNER":      ["listar_pasta", "ler_arquivo", "escrever_arquivo"],
    "COMMUNICATION": ["status_sistema", "enviar_telegram", "enviar_email", "enviar_whatsapp"],
}

ROOT = Path(__file__).resolve().parent.parent
WORKSPACE = ROOT / "09_AGENT_WORKSPACE"
DB_PATH = ROOT / "nexus.db"
_SKIP_DIRS = {".git", "node_modules", "__pycache__", ".pytest_cache", ".tools",
              ".npm-cache", ".build-tmp", ".build-dist", ".build-dist-v006", "conselheiro_profile"}
_TEXT_EXTS = {".py", ".js", ".jsx", ".ts", ".tsx", ".md", ".txt", ".json", ".yaml",
              ".yml", ".html", ".css", ".cmd", ".ps1", ".cfg", ".ini", ".env"}
_MAX_OUT = 3500  # corta saídas grandes para caber no loop do agente

# Allowlist de comandos de terminal (não destrutivos / só leitura ou testes)
_CMD_ALLOW = ("git status", "git log", "git diff", "git branch", "git remote",
              "python --version", "python -m pytest", "pytest", "pip list",
              "node --version", "npm ls")


def _truncate(s):
    s = str(s)
    return s if len(s) <= _MAX_OUT else s[:_MAX_OUT] + "\n…[saída truncada]"


def _safe_path(rel, base=ROOT):
    """Resolve rel dentro de base, bloqueando traversal."""
    target = (base / str(rel).strip().lstrip("/\\")).resolve()
    if base != target and base not in target.parents:
        raise ValueError("caminho fora da área permitida")
    return target


class ToolRegistry:
    def __init__(self, context=None, role=None):
        # context: {"client_id": N} — para ações por-cliente (ex.: postar no IG do cliente)
        # role: papel canônico do agente (filtra as ferramentas → ação distinta por papel)
        self.context = context or {}
        self.role = role
        self.tools = {}
        self._register_default_tools()
        if role and role in ROLE_TOOLS:
            allowed = set(ROLE_TOOLS[role])
            self.tools = {k: v for k, v in self.tools.items() if k in allowed}

    def _register_default_tools(self):
        self.register("ler_arquivo", self._ler_arquivo,
            "Lê um arquivo de texto do repositório. ActionInput: caminho relativo (ex.: forja_os_server.py).")
        self.register("listar_pasta", self._listar_pasta,
            "Lista arquivos/pastas. ActionInput: caminho relativo (vazio = raiz).")
        self.register("buscar_no_repo", self._buscar_no_repo,
            "Busca um termo nos arquivos de texto do repo. ActionInput: termo a procurar.")
        self.register("consultar_banco", self._consultar_banco,
            "Consulta SOMENTE leitura no nexus.db. ActionInput: uma instrução SELECT.")
        self.register("status_sistema", self._status_sistema,
            "Status real do sistema (missões, agentes, evidências, providers). ActionInput: vazio.")
        self.register("escrever_arquivo", self._escrever_arquivo,
            "Escreve arquivo NA SANDBOX (09_AGENT_WORKSPACE). ActionInput JSON: {\"path\":\"nome.txt\",\"conteudo\":\"...\"}.")
        self.register("rodar_comando", self._rodar_comando,
            "Roda comando seguro (allowlist: git status/log/diff, pytest, versões). ActionInput: o comando.")
        self.register("enviar_telegram", self._enviar_telegram,
            "Envia mensagem pelo Telegram da Fábrica. ActionInput JSON: {\"texto\":\"...\",\"chat_id\":\"...\"}.")
        self.register("postar_instagram", self._postar_instagram,
            "Posta no Instagram DO CLIENTE atual. ActionInput JSON: {\"image_url\":\"URL pública\",\"legenda\":\"...\"}.")
        self.register("enviar_email", self._enviar_email,
            "Envia e-mail pelo SMTP da Fábrica. ActionInput JSON: {\"to\":\"...\",\"assunto\":\"...\",\"corpo\":\"...\"}.")
        self.register("enviar_whatsapp", self._enviar_whatsapp,
            "Envia WhatsApp (Cloud API da Fábrica). ActionInput JSON: {\"to\":\"55119...\",\"texto\":\"...\"}.")

    def register(self, name, func, description):
        self.tools[name] = {"func": func, "description": description}

    def get_tool_descriptions(self):
        return "\n".join(f"- {n}: {d['description']}" for n, d in self.tools.items())

    def execute(self, tool_name, *args, **kwargs):
        if tool_name not in self.tools:
            return f"Erro: ferramenta '{tool_name}' não existe. Válidas: {', '.join(self.tools)}"
        try:
            return _truncate(self.tools[tool_name]["func"](*args, **kwargs))
        except Exception as e:
            return f"Erro ao executar {tool_name}: {type(e).__name__}: {e}"

    # ---------------- implementações reais ----------------
    def _ler_arquivo(self, arg=""):
        p = _safe_path(arg)
        if not p.exists() or not p.is_file():
            return f"Arquivo não encontrado: {arg}"
        return p.read_text(encoding="utf-8", errors="replace")

    def _listar_pasta(self, arg=""):
        p = _safe_path(arg) if arg else ROOT
        if not p.is_dir():
            return f"Não é pasta: {arg}"
        out = []
        for e in sorted(p.iterdir(), key=lambda x: (x.is_file(), x.name.lower())):
            if e.name in _SKIP_DIRS or e.name.startswith("."):
                continue
            out.append(("[dir] " if e.is_dir() else "      ") + e.name)
        return "\n".join(out) or "(vazio)"

    def _buscar_no_repo(self, arg=""):
        termo = (arg or "").strip()
        if len(termo) < 2:
            return "Informe um termo com 2+ caracteres."
        hits = []
        for dirpath, dirnames, filenames in os.walk(ROOT):
            dirnames[:] = [d for d in dirnames if d not in _SKIP_DIRS and not d.startswith(".")]
            for fn in filenames:
                if Path(fn).suffix.lower() not in _TEXT_EXTS:
                    continue
                fp = Path(dirpath) / fn
                try:
                    for i, line in enumerate(fp.read_text(encoding="utf-8", errors="ignore").splitlines(), 1):
                        if termo.lower() in line.lower():
                            rel = fp.relative_to(ROOT).as_posix()
                            hits.append(f"{rel}:{i}: {line.strip()[:120]}")
                            if len(hits) >= 40:
                                return "\n".join(hits) + "\n…[muitos resultados]"
                except Exception:
                    continue
        return "\n".join(hits) or f"Nenhum resultado para '{termo}'."

    def _consultar_banco(self, arg=""):
        sql = (arg or "").strip().rstrip(";")
        low = sql.lower()
        if not low.startswith("select"):
            return "Bloqueado: somente SELECT é permitido."
        forbidden = ("insert", "update", "delete", "drop", "alter", "create", "replace", "attach", "pragma")
        if any(f in low for f in forbidden):
            return "Bloqueado: instrução contém comando não permitido."
        c = sqlite3.connect(str(DB_PATH)); c.row_factory = sqlite3.Row
        try:
            rows = c.execute(sql + " LIMIT 50").fetchall()
            if not rows:
                return "(0 linhas)"
            cols = rows[0].keys()
            out = [" | ".join(cols)]
            for r in rows:
                out.append(" | ".join(str(r[k])[:40] for k in cols))
            return "\n".join(out)
        finally:
            c.close()

    def _status_sistema(self, arg=""):
        c = sqlite3.connect(str(DB_PATH))
        try:
            def cnt(q):
                try:
                    return c.execute(q).fetchone()[0]
                except Exception:
                    return "?"
            q_prov = ("SELECT COUNT(*) FROM llm_providers WHERE status IN "
                      "('active_real','CERTIFIED','ROUTER_LIMITED')")
            missoes = cnt("SELECT COUNT(*) FROM missions")
            agentes = cnt("SELECT COUNT(*) FROM agents")
            evid = cnt("SELECT COUNT(*) FROM evidences")
            prov = cnt(q_prov)
            return (f"missoes={missoes} agentes={agentes} "
                    f"evidencias={evid} providers_ativos={prov}")
        finally:
            c.close()

    def _escrever_arquivo(self, arg=""):
        try:
            data = json.loads(arg)
        except Exception:
            return "ActionInput deve ser JSON: {\"path\":\"nome.txt\",\"conteudo\":\"...\"}"
        rel = data.get("path") or ""
        conteudo = data.get("conteudo", "")
        if not rel:
            return "Faltou 'path'."
        WORKSPACE.mkdir(parents=True, exist_ok=True)
        p = _safe_path(rel, base=WORKSPACE)  # escrita só na sandbox
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(str(conteudo), encoding="utf-8")
        return f"Escrito: 09_AGENT_WORKSPACE/{p.relative_to(WORKSPACE).as_posix()} ({len(str(conteudo))} chars)"

    def _rodar_comando(self, arg=""):
        cmd = (arg or "").strip()
        if not any(cmd == a or cmd.startswith(a + " ") for a in _CMD_ALLOW):
            return ("Bloqueado por segurança. Comandos permitidos: " + ", ".join(_CMD_ALLOW))
        try:
            proc = subprocess.run(cmd, shell=True, cwd=str(ROOT), capture_output=True,
                                  text=True, encoding="utf-8", errors="replace", timeout=120)
            out = (proc.stdout or "") + (("\n[stderr]\n" + proc.stderr) if proc.stderr else "")
            return out.strip() or f"(sem saída · código {proc.returncode})"
        except subprocess.TimeoutExpired:
            return "Comando excedeu o tempo limite (120s)."

    # ---------------- ações via conexões (Fábrica × cliente) ----------------
    def _resolve_credential(self, kind):
        """Retorna (credential, meta, motivo). Global=conta da Fábrica (client_id=0);
        senão usa a conta do cliente no contexto."""
        c = sqlite3.connect(str(DB_PATH)); c.row_factory = sqlite3.Row
        try:
            if kind in GLOBAL_KINDS:
                row = c.execute("SELECT * FROM client_connections WHERE kind=? AND client_id=0", (kind,)).fetchone()
            else:
                cid = (self.context or {}).get("client_id")
                if not cid:
                    return None, {}, "sem cliente no contexto (ação por-cliente exige um cliente)"
                row = c.execute("SELECT * FROM client_connections WHERE kind=? AND client_id=?",
                                (kind, int(cid))).fetchone()
            if not row or not row["credential"]:
                return None, {}, f"{kind} não conectado"
            try:
                meta = json.loads(row["metadata_json"] or "{}")
            except Exception:
                meta = {}
            return row["credential"], meta, "ok"
        finally:
            c.close()

    def _enviar_telegram(self, arg=""):
        try:
            data = json.loads(arg) if (arg or "").strip().startswith("{") else {"texto": arg}
        except Exception:
            data = {"texto": arg}
        texto = data.get("texto") or data.get("mensagem") or ""
        if not texto:
            return "Faltou 'texto'."
        cred, meta, reason = self._resolve_credential("telegram")
        if not cred:
            return "Telegram: " + reason + " — conecte em Integrações da Fábrica."
        chat_id = data.get("chat_id") or meta.get("chat_id")
        if not chat_id:
            return "Telegram: faltou chat_id (passe no input ou salve na conexão)."
        body = json.dumps({"chat_id": chat_id, "text": texto}).encode()
        req = urllib.request.Request(f"https://api.telegram.org/bot{cred}/sendMessage",
                                     data=body, headers={"Content-Type": "application/json"}, method="POST")
        try:
            with urllib.request.urlopen(req, timeout=15) as r:
                out = json.loads(r.read())
            return "Telegram enviado com sucesso." if out.get("ok") else ("Telegram falhou: " + str(out)[:140])
        except urllib.error.HTTPError as e:
            return f"Telegram HTTP {e.code}"
        except Exception as e:
            return f"Telegram erro: {type(e).__name__}"

    def _postar_instagram(self, arg=""):
        try:
            data = json.loads(arg)
        except Exception:
            return "ActionInput JSON: {\"image_url\":\"URL pública\",\"legenda\":\"...\"}"
        cred, meta, reason = self._resolve_credential("instagram")
        if not cred:
            return "Instagram: " + reason + " — conecte a conta do cliente em Clientes."
        ig_id = meta.get("ig_user_id") or data.get("ig_user_id")
        if not ig_id:
            return "Instagram: faltou ig_user_id (id da conta IG Business; salve na conexão do cliente)."
        image_url = data.get("image_url")
        if not image_url:
            return "Instagram: faltou image_url (URL pública da imagem)."
        legenda = data.get("legenda", "")
        try:
            import urllib.parse
            # 1) cria container de mídia
            q = urllib.parse.urlencode({"image_url": image_url, "caption": legenda, "access_token": cred})
            req1 = urllib.request.Request(f"https://graph.facebook.com/v21.0/{ig_id}/media?{q}", method="POST")
            with urllib.request.urlopen(req1, timeout=30) as r:
                creation = json.loads(r.read()).get("id")
            if not creation:
                return "Instagram: falha ao criar container."
            # 2) publica
            q2 = urllib.parse.urlencode({"creation_id": creation, "access_token": cred})
            req2 = urllib.request.Request(f"https://graph.facebook.com/v21.0/{ig_id}/media_publish?{q2}", method="POST")
            with urllib.request.urlopen(req2, timeout=30) as r:
                pub = json.loads(r.read())
            return "Instagram publicado: post id " + str(pub.get("id", "?"))
        except urllib.error.HTTPError as e:
            try:
                detail = json.loads(e.read()).get("error", {}).get("message", "")
            except Exception:
                detail = ""
            return f"Instagram HTTP {e.code}: {detail[:120]}"
        except Exception as e:
            return f"Instagram erro: {type(e).__name__}"

    def _enviar_email(self, arg=""):
        try:
            data = json.loads(arg)
        except Exception:
            return "ActionInput JSON: {\"to\":\"...\",\"assunto\":\"...\",\"corpo\":\"...\"}"
        to = data.get("to"); assunto = data.get("assunto", ""); corpo = data.get("corpo") or data.get("texto", "")
        if not to:
            return "E-mail: faltou 'to'."
        cred, meta, reason = self._resolve_credential("email")
        if not cred:
            return "E-mail: " + reason + " — conecte em Integrações da Fábrica."
        host = meta.get("smtp_host"); user = meta.get("smtp_user"); frm = meta.get("from_email") or user
        try:
            port = int(meta.get("smtp_port") or 587)
        except Exception:
            port = 587
        if not (host and user):
            return "E-mail: configuração SMTP incompleta (host/usuário)."
        try:
            import smtplib
            from email.mime.text import MIMEText
            msg = MIMEText(corpo, "plain", "utf-8")
            msg["Subject"] = assunto; msg["From"] = frm; msg["To"] = to
            s = smtplib.SMTP(host, port, timeout=20)
            try:
                s.starttls()
            except Exception:
                pass
            s.login(user, cred); s.sendmail(frm, [to], msg.as_string()); s.quit()
            return "E-mail enviado para " + to
        except Exception as e:
            return f"E-mail falhou: {type(e).__name__}"

    def _enviar_whatsapp(self, arg=""):
        try:
            data = json.loads(arg)
        except Exception:
            return "ActionInput JSON: {\"to\":\"55119...\",\"texto\":\"...\"}"
        to = data.get("to"); texto = data.get("texto") or data.get("mensagem", "")
        if not (to and texto):
            return "WhatsApp: faltou 'to' ou 'texto'."
        cred, meta, reason = self._resolve_credential("whatsapp")
        if not cred:
            return "WhatsApp: " + reason + " — conecte em Integrações da Fábrica."
        pnid = meta.get("phone_number_id")
        if not pnid:
            return "WhatsApp: falta phone_number_id na conexão."
        body = json.dumps({"messaging_product": "whatsapp", "to": to, "type": "text",
                           "text": {"body": texto}}).encode()
        req = urllib.request.Request(f"https://graph.facebook.com/v21.0/{pnid}/messages",
                                     data=body, headers={"Authorization": "Bearer " + cred,
                                                          "Content-Type": "application/json"}, method="POST")
        try:
            with urllib.request.urlopen(req, timeout=20) as r:
                out = json.loads(r.read())
            mid = (out.get("messages") or [{}])[0].get("id", "?")
            return "WhatsApp enviado (id " + str(mid) + ")"
        except urllib.error.HTTPError as e:
            try:
                detail = json.loads(e.read()).get("error", {}).get("message", "")
            except Exception:
                detail = ""
            return f"WhatsApp HTTP {e.code}: {detail[:120]}"
        except Exception as e:
            return f"WhatsApp erro: {type(e).__name__}"
