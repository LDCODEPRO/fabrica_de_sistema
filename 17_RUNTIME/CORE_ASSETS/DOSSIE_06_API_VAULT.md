# DOSSIÊ TÉCNICO — ATIVO 06: API Vault SQLite (cofre multi-provider)

> Documento de PLANEJAMENTO. Zero Ghost Law ativa: nenhum código foi importado, copiado ou modificado. Leitura somente-leitura de E:\ realizada para confirmação factual.

---

## 1. Identificação
- **ID:** 06
- **Nome:** API Vault SQLite (cofre multi-provider)
- **Tipo:** Engine Python (gerenciador de segredos)
- **Origem (caminhos reais confirmados em E:\):**
  - `E:\NIVEL 1\DATASTORE\Security\API_Vault\api_vault.py` (2.793 bytes) — variante NIVEL 1
  - `E:\NIVEL 2\NEXUSPREMIUM\vault\secrets\api_vault.py` (2.736 bytes) — variante NIVEL 2 (NEXUSPREMIUM)
- **Observação:** As duas variantes são quase idênticas. A de NIVEL 2 é a mais madura/segura (path relativo via `Path(__file__)`, sem auto-destruição de `.env`).

---

## 2. Finalidade
Cofre de credenciais baseado em **SQLite** que centraliza chaves de API fora do código-fonte e fora de arquivos `.env` expostos. Funcionalidades confirmadas no código:
- Cria tabela `api_keys` (`servico_id` PK, `api_key`, `base_url`, `status` default `ATIVA`).
- `registrar_chave()` — insert/upsert idempotente de uma chave por serviço.
- `obter_chave()` — recupera chave + base_url apenas se `status='ATIVA'`; lança `ValueError` se ausente/inativa.
- Bloco `__main__` de **migração** de `.env` → SQLite.

**Por que importa para a Fábrica:** É um pré-requisito de segurança de alto impacto. Elimina segredos em texto plano e dá às engines/agentes um ponto único de consulta de credenciais. Substitui os `.env` expostos do legado.

---

## 3. Dependências
- **Runtime:** Python 3 (uso de f-strings, `pathlib`).
- **Bibliotecas (confirmadas no import):**
  - `sqlite3` (stdlib) — armazenamento.
  - `os` (stdlib).
  - `pathlib.Path` (stdlib — apenas na variante NIVEL 2).
  - `python-dotenv` (`from dotenv import load_dotenv`) — **dependência externa**, usada só no fluxo de migração `__main__`.
- **Banco de dados:** arquivo SQLite `nexus_vault.db`.
  - NIVEL 1: caminho hardcoded `D:\DATASTORE\Security\API_Vault\nexus_vault.db`.
  - NIVEL 2: relativo ao próprio arquivo (`Path(__file__).parent / "nexus_vault.db"`).
- **Provedores (LLMs/serviços):** o código de migração trata explicitamente apenas **`openai`** e **`tavily`**. A afirmação da auditoria de "6 provedores" **NÃO foi confirmada no código lido** — o modelo de dados é genérico (qualquer `servico_id` cabe), mas só 2 estão cabeados. **A confirmar** a origem dos "6".
- **Outros ativos críticos da Fábrica:** nenhum acoplamento direto detectado; é um ativo-base que outras engines consumiriam. **A confirmar** quem chama `obter_chave()` no ecossistema.

---

## 4. Riscos (conhecido: BAIXO)
- **Credenciais / segurança:**
  - As chaves são gravadas **em texto plano** na coluna `api_key` do SQLite — **sem criptografia em repouso**. O cofre protege contra exposição em código/git, mas não contra leitura do `.db`.
  - Variante **NIVEL 1 destrói o `.env`** (`os.remove(env_path)`) após migrar — operação irreversível e perigosa. A variante NIVEL 2 já desativou isso por segurança.
- **Paths hardcoded:** `DB_PATH = r"D:\DATASTORE\Security\API_Vault\nexus_vault.db"` e `env_path = r"D:\DATASTORE\Security\Keys\.env"` na variante NIVEL 1. Quebra fora dessa máquina/estrutura.
- **Acoplamento:** baixo. Classe autocontida; única dependência externa é `python-dotenv` (e só no `__main__`).
- **Concorrência:** `check_same_thread=False` permite uso multi-thread (Flask + daemons) mas SQLite não protege contra writes concorrentes pesados — risco de lock sob carga. **A confirmar** padrão de uso real.
- **Mocks:** nenhum detectado.
- **Dados pessoais:** nenhum dado pessoal; apenas segredos técnicos.

---

## 5. Compatibilidade com a Fábrica
- **`17_RUNTIME`:** encaixe natural. O `.db` e a engine de cofre devem viver sob runtime (ex.: `17_RUNTIME/SECURITY/` ou similar), com o `DB_PATH` parametrizado para a raiz da Fábrica.
- **`00_GOVERNANCA`:** a política de gestão de segredos (quem registra, rotação, criptografia) deve ser documentada aqui.
- **`05_AGENTS` / `16_SISTEMAS`:** consumidores naturais de `obter_chave()` — agentes e sistemas pediriam credenciais ao cofre em vez de ler `.env`.
- **`03_SKILLS` / `02_WORKFLOWS`:** workflows que invocam LLMs (OpenAI, etc.) passariam a resolver chaves via cofre.
- **Adaptações necessárias:** (1) remover paths Windows hardcoded e parametrizar via config/env da Fábrica; (2) adotar a variante NIVEL 2 como base (path relativo, sem auto-delete); (3) generalizar a lista de provedores além de openai/tavily; (4) avaliar criptografia em repouso.

---

## 6. Classificação
**ADAPTAR** — engine sólida e de baixo risco, mas exige remoção de paths hardcoded, desativação da auto-destruição do `.env` e confirmação/expansão dos provedores antes de entrar na Fábrica.

---

## 7. Plano de Extração (sem código)
1. **Seleção da base:** adotar a variante **NIVEL 2** (`E:\NIVEL 2\NEXUSPREMIUM\vault\secrets\api_vault.py`) como referência — path relativo e sem `os.remove(.env)`.
2. **Sanitização:** remover qualquer chave/segredo residual; garantir que **nenhum `nexus_vault.db` ou `.env` real** seja trazido junto.
3. **Parametrização:** substituir `DB_PATH` hardcoded por configuração derivada da raiz da Fábrica (`17_RUNTIME`); idem para qualquer caminho de migração.
4. **Generalização de provedores:** confirmar a origem dos "6 provedores" da auditoria e tornar o registro orientado a configuração (lista de serviços), não cabeado a openai/tavily.
5. **Segurança em repouso:** decidir e documentar (em `00_GOVERNANCA`) política de criptografia da coluna `api_key` e permissões de arquivo do `.db`.
6. **Desativar destruição de dados:** garantir que o fluxo de migração NUNCA delete o `.env` automaticamente.
7. **Testes:** criar testes de unidade para `registrar_chave` (insert + upsert), `obter_chave` (ATIVA, inativa, inexistente → `ValueError`) e migração contra um `.db` temporário; teste de concorrência multi-thread.
8. **Integração:** definir interface de consumo padrão para `05_AGENTS`/`16_SISTEMAS` e validar dependência `python-dotenv` no requirements da Fábrica.

---

## 8. Status do Dossiê
**DOSSIÊ COMPLETO — código NÃO importado (Zero Ghost Law)**
