# DOSSIÊ TÉCNICO — ATIVO 04: SAFE_GATE

> ZERO GHOST LAW ATIVA — Documento de PLANEJAMENTO. Nenhum código foi importado, copiado ou modificado. Leitura de E:\ somente para confirmação de fatos.

---

## 1. Identificação

| Campo | Valor |
|---|---|
| **ID** | 04 |
| **Nome** | SAFE_GATE (validação de paths e comandos shell + E:\ read-only) |
| **Tipo** | Engine Python (módulo de governança / portão de segurança) |
| **Origem (caminho real em E:\ — CONFIRMADO)** | `E:\Agente X\00_GOVERNANCE\safe_gate.py` (3431 bytes, 25/05/2026) |
| **Variante mais completa (CONFIRMADA)** | `E:\NIVEL 2\NEXUSPREMIUM\core\executor\safe_gate.py` (3677 bytes, 05/05/2026) — classe `SafeGate` com classificação LOW/MEDIUM/HIGH/PROIBIDO |
| **Variante forense (CONFIRMADA)** | `E:\PHANDORA\01_CORE\governance\forensic_safe_gate.py` — classe `ForensicSafeGate` (avalia respostas, não paths) |

**Réplicas reais confirmadas (busca em E:\):** Ativo presente em 6+ árvores distintas — `Agente X` (+RULES +backups diários), `NIVEL 1\RESGATE` (NexusCofre, NexusDesktop, Nexus_Claude), `NIVEL 2\NEXUSPREMIUM`, `PHANDORA`, `BIBLIOTECA_COMPLEXO_ZEUS\...\ZEUS_COMMAND_CENTER` (com baterias de teste: Chaos, Stress, Offensive), e duplicação inteira em `Sistema_open_claude\`. **Confirma a tese de "ativo mais replicado do ecossistema / padrão maduro".**

---

## 2. Finalidade

Portão de segurança (security gate) que intercepta e valida **toda intenção de ação** antes de sua execução, com três responsabilidades centrais confirmadas no código:

1. **Validação de path de escrita** — só permite escrita dentro de raízes autorizadas; bloqueia path traversal (`..`) via `Path.resolve()`.
2. **Proteção da unidade E:\ como read-only** — na versão `Agente X`, `is_safe_path_for_write` bloqueia explicitamente qualquer escrita iniciada em `E:\` retornando `VIOLATION: Tentativa de escrita na unidade E: (Protegida)`; leitura em E:\ é permitida (`validate_action("READ", ...)` → `SAFE_READ`).
3. **Validação de comando shell** — bloqueia tokens de injeção (`;`, `&&`, `||`, `|`, `>`, `<`, `` ` ``, `$(`, `${`) e comandos destrutivos via regex: `rm -r`, `rmdir`, `del`, `format`, `drop table` (case-insensitive). (Obs.: `diskpart` citado no resumo da auditoria **não** foi encontrado na lista de regex da versão `Agente X` — **a confirmar** em outras variantes.)

A versão **NEXUSPREMIUM** acrescenta um modelo de **classificação de risco por ação** (`classificar_risco`):
- **LOW**: `listar_arquivos`, `ler_arquivo`, `check_status`
- **MEDIUM**: `escrever_arquivo`, `executar_llm`, `executar_codex`, `executar_python_script`
- **HIGH**: `deletar_arquivo`, `alterar_estrutura`
- **PROIBIDO**: `executar_comando_shell`, `comando_shell`, `codex`

Além disso bloqueia extensões executáveis (`.bat .ps1 .sh .cmd .exe .dll`), fragmentos de nome sensíveis (`.env`, `token`, `secret`, `api_key`, `password`, `private_key`) e raízes proibidas (`C:\Windows`, vault).

**Por que importa para a Fábrica:** é a camada de enforcement da própria ZERO GHOST LAW — garante que agentes não escrevam fora do escopo autorizado, não destruam dados e não executem shell injection. É o ativo de governança de mais baixo nível e maior reuso do ecossistema.

---

## 3. Dependências

| Dependência | Detalhe | Status |
|---|---|---|
| **Python stdlib** | `os`, `re`, `pathlib.Path` | CONFIRMADO (versão Agente X) — zero dependências externas |
| **Runtime** | Python 3.10/3.11/3.12 (há `.pyc` para cpython-310/311/312) | CONFIRMADO |
| **`realtime.event_bus` (`bus`)** | Versão NEXUSPREMIUM importa `from realtime.event_bus import bus` e publica `SAFE_GATE_BLOCK` — **acoplamento a um event bus interno** | CONFIRMADO (NEXUSPREMIUM) |
| **`policy_registry`** | Versão PHANDORA forense recebe `policy_registry` opcional no construtor | CONFIRMADO (PHANDORA) |
| **Outros ativos críticos** | Acoplado a EXECUTOR (fica em `core/executor/`), governança e — em PHANDORA — protocolo forense (`evidence`, `confidence`, `trace_id`, `claim_status`) | CONFIRMADO parcial |
| **LLMs / bancos de dados** | Nenhuma chamada a LLM ou DB no código lido; trata ações `executar_llm`/`executar_codex` apenas como *strings de classificação*, não as executa | CONFIRMADO — não há cliente LLM/DB embarcado |
| **Serviços externos / rede** | Nenhum | CONFIRMADO |

---

## 4. Riscos (avaliação: BAIXO)

- **Credenciais:** Nenhuma credencial, token ou chave hardcoded encontrada. A versão NEXUSPREMIUM, ao contrário, **defende** contra eles (bloqueia nomes `secret`, `api_key`, `password`, `private_key`). Positivo.
- **Paths hardcoded (PRINCIPAL ponto de adaptação):**
  - Agente X: usa `AGENTE_X_ROOT` dinâmico (`Path(__file__).parent.parent`) — bom — mas tem `E:\BIBLIOTECA_COMPLEXO_ZEUS` literal em comentário/regra.
  - NEXUSPREMIUM: `allowed_roots` e `forbidden_roots` **hardcoded** em `D:\NEXUSPREMIUM`, `E:\DATASTORE\Security\API_Vault`, `C:\Windows`. Precisa parametrização para a Fábrica.
- **Acoplamento:** NEXUSPREMIUM acopla a `realtime.event_bus`; importação isolada quebraria sem stub/parametrização. Versão Agente X é stand-alone (preferível como base).
- **Mocks:** Blocos `if __name__ == "__main__"` apenas com testes de demonstração (prints) — não são mocks de produção. Baixo risco.
- **Dados pessoais:** Nenhum dado pessoal no código.
- **Limitações de segurança (a endurecer na adaptação):** blacklist de regex shell é incompleta (`diskpart`, `format c:`, `:(){ :|: }`, powershell `Remove-Item -Recurse`, `Invoke-Expression` não cobertos). A própria existência de `tests\test_safe_gate_offensive.py` e relatórios de "ATAQUES/CHAOS/STRESS" no ZEUS_COMMAND_CENTER indica que o ativo já passou por hardening — fonte útil de casos de teste (**a revisar, não importar**).

---

## 5. Compatibilidade com a Fábrica

- **00_GOVERNANCA** — encaixe natural e primário. SAFE_GATE é o enforcement técnico da ZERO GHOST LAW e da regra de E:\ read-only. Deve viver aqui como engine de governança.
- **05_AGENTS** — todo agente que escreva arquivo ou rode shell deve chamar `validate_action()` antes de agir.
- **02_WORKFLOWS** — orquestrador chama o gate como pré-condição de cada step destrutivo/de escrita.
- **03_SKILLS** — pode ser exposto como skill de validação reutilizável.
- **16_SISTEMAS / 17_RUNTIME** — biblioteca compartilhada consumida em runtime.
- **O que precisa ser adaptado:**
  1. Substituir `AGENTE_X_ROOT` / `D:\NEXUSPREMIUM` por raiz parametrizável da Fábrica (`D:\FABRICA_DE_SISTEMAS`).
  2. Tornar `allowed_roots`/`forbidden_roots`/blacklists configuráveis (arquivo de policy em 00_GOVERNANCA), não hardcoded.
  3. Manter regra E:\ read-only (já alinhada à ZERO GHOST LAW).
  4. Desacoplar de `realtime.event_bus` (injeção de dependência / logger opcional).

---

## 6. Classificação

**ADAPTAR** — Padrão maduro, sem dependências externas críticas e diretamente alinhado à ZERO GHOST LAW, mas exige parametrização de paths hardcoded e desacoplamento do event_bus antes de virar engine única da Fábrica.

---

## 7. Plano de Extração (sem código)

1. **Escolher base canônica:** consolidar a partir da versão `Agente X` (stand-alone, stdlib pura) + funcionalidades da NEXUSPREMIUM (classificação de risco LOW/MEDIUM/HIGH/PROIBIDO, blacklist de extensões/fragmentos sensíveis).
2. **Sanitização:** remover todos os paths absolutos hardcoded (`D:\NEXUSPREMIUM`, `E:\BIBLIOTECA_COMPLEXO_ZEUS`, `E:\DATASTORE`), remover blocos `__main__` de demonstração.
3. **Parametrização:** introduzir um arquivo de policy (JSON/TOML em 00_GOVERNANCA) definindo `fabrica_root`, `allowed_roots`, `forbidden_roots`, blacklists shell e extensões; carregar em runtime.
4. **Desacoplamento:** tornar a publicação de eventos (`SAFE_GATE_BLOCK`) opcional via logger/callback injetado, sem dependência rígida de `realtime.event_bus`.
5. **Endurecer blacklist shell:** adicionar `diskpart`, `format`, `Remove-Item -Recurse`, `Invoke-Expression`, fork bombs, e normalização de comando antes do match.
6. **Reconstruir testes** (não importar): recriar suíte cobrindo path traversal, E:\ write block, shell injection e os cenários ofensivos/chaos referenciados — escrevendo do zero em 17_RUNTIME/tests.
7. **Validação final:** rodar a suíte; só então promover o engine a 00_GOVERNANCA como dependência obrigatória de 05_AGENTS / 02_WORKFLOWS.
8. **Implementação:** reescrever o módulo do zero na Fábrica seguindo o padrão arquitetural confirmado — sem copiar arquivos de E:\.

---

## 8. Status do Dossiê

**DOSSIÊ COMPLETO — código NÃO importado (Zero Ghost Law)**
