# DOSSIÊ TÉCNICO — ATIVO 11: Memória em 3 Camadas (SQLite + ChromaDB + Obsidian)

> ZERO GHOST LAW ATIVA — Missão APENAS DE PLANEJAMENTO.
> Nenhum código foi copiado, importado ou modificado de E:\. Leitura somente.
> Data: 2026-06-04

---

## 1. Identificação

| Campo | Valor |
|---|---|
| **ID** | 11 |
| **Nome** | Memória em 3 Camadas (SQLite + ChromaDB + Obsidian) |
| **Tipo** | Padrão / Arquitetura de referência |
| **Origem (confirmada)** | `E:\Agente X\02_MEMORY` (núcleo das 3 camadas, CONFIRMADO) |
| **Origem secundária** | `E:\Sistema_open_claude` (vault Obsidian: pastas `Memoria`, `Decisoes`, `.obsidian` — CONFIRMADO) |

**Estrutura real verificada em `E:\Agente X\02_MEMORY`:**
- `short_term/context_manager.py` (5.181 B) + `MEMORY.md` (9.050 B) — working memory
- `long_term/memory_manager.py` (9.956 B) + `db_init.py` (5.599 B) + `db_migration_fase4.py` (1.196 B)
- `vector_memory/chroma_manager.py` (4.586 B) — interface ChromaDB
- `vector/chroma.sqlite3` (188.416 B) — store vetorial persistido
- `agente_x.db` (≈1,4 MB) + `agente_x.db-wal` (≈7,8 MB) + `agente_x.db-shm` — **evidência de uso real forte**
- `learning_memory.db` (12.288 B) + `-journal` — base de aprendizado separada
- `agente_x_pre_cleanup_2026-0…` — backup pré-limpeza (≈320 MB, confirmado)

---

## 2. Finalidade

Arquitetura de memória de agente em **três camadas complementares**, todas com persistência física real (princípio "Zero Ghost": sem mocks, sem dumps falsos):

1. **Short-term / Working memory** (`context_manager.py`): mantém snapshot compacto do estado ativo (objetivo atual, fatos, últimas observações do loop ReAct), limitado a `MAX_CONTEXT_CHARS = 2500`, persistido em `MEMORY.md` para continuidade cross-session. Injetado a cada turno do LLM.
2. **Long-term / Estruturada** (`memory_manager.py` sobre `agente_x.db`): CRUD real em SQLite com tabelas `missions`, `sessions`, `logs`, `knowledge`, `fila_execucao`. WAL ativo, thread-safe (`check_same_thread=False`).
3. **Vetorial / Semântica** (`chroma_manager.py` sobre ChromaDB em `vector/`): busca semântica com embeddings `all-MiniLM-L6-v2` (sentence-transformers), distância cosseno (`hnsw:space=cosine`), upsert/search/delete por `doc_id`.

Camada complementar (4ª, narrativa): **Obsidian** como base de conhecimento humano-legível (vault em `E:\Sistema_open_claude`), espelhada na Fábrica em `11_OBSIDIAN`.

**Por que importa para a Fábrica:** é o padrão de memória de referência — separa estado efêmero (working), histórico estruturado/auditável (SQLite) e recuperação semântica (vetorial). Resolve diretamente a necessidade de agentes (05_AGENTS) com continuidade, auditoria de missões e RAG.

---

## 3. Dependências

**Bibliotecas Python (confirmadas no código):**
- `sqlite3` (stdlib) — camadas long-term e vetorial-metadata
- `chromadb` + `from chromadb.config import Settings` — camada vetorial (`PersistentClient`)
- `sentence-transformers` (transitiva via embedding padrão `all-MiniLM-L6-v2`) — **a confirmar versão**; chromadb baixa o modelo na 1ª execução
- stdlib: `json`, `uuid`, `logging`, `pathlib`, `contextlib`, `time`, `re`

**Runtime:**
- Python 3.9+ (uso de `list[dict]`, `dict[str,str]` type hints) — **a confirmar versão exata**
- Sistema de arquivos local persistente (paths derivados de `Path(__file__).resolve().parent.parent.parent`)

**Bancos / serviços de dados:**
- SQLite `agente_x.db` (schema v1.0 em `db_init.py`, WAL mode)
- SQLite `learning_memory.db` (base de aprendizado separada — schema **a confirmar**, não lido)
- ChromaDB persistido em `vector/chroma.sqlite3`

**LLMs:** Nenhuma chamada de LLM dentro destes módulos (a memória é agnóstica). As tabelas `sessions` registram `provider`/`model`, mas o consumo do LLM é externo. **A confirmar** qual orquestrador chama estes managers.

**Outros ativos críticos da Fábrica:**
- Acoplamento implícito a um diretório raiz com subpastas `02_MEMORY` e `09_LOGS` (ver Riscos)
- Obsidian vault (origem secundária) — relação narrativa, não código

---

## 4. Riscos

| Categoria | Achado | Severidade |
|---|---|---|
| **Dados pessoais** | `agente_x.db` (≈1,4 MB) e `learning_memory.db` contêm dados reais de uso/pessoais. **Importar o PADRÃO/schema, NUNCA os dados.** | ALTO |
| **Paths hardcoded** | Todos os managers derivam o root via `Path(__file__).resolve().parent.parent.parent` e assumem layout fixo `02_MEMORY/...` e `09_LOGS/memory.log`. Quebra se a árvore de pastas mudar. | MÉDIO |
| **Logging com path fixo** | `db_init.py` faz `logging.basicConfig(filename=_ROOT/"09_LOGS"/"memory.log")` na importação do módulo — efeito colateral global no import. | MÉDIO |
| **Credenciais** | Nenhuma credencial/segredo encontrado dentro dos 3 módulos lidos. `E:\Sistema_open_claude\.env` existe (não lido) — **a confirmar** se há segredos relacionados. | BAIXO/A confirmar |
| **Mocks** | Nenhum. Código segue Zero Ghost (operações reais). | NULO |
| **Acoplamento** | Modelo de embedding (`all-MiniLM-L6-v2`) e schema v1.0 acoplados; migração `db_migration_fase4.py` indica schema evolutivo. `chroma.sqlite3` pré-existente carrega coleção `agente_x_memory` com dados — não migrar. | MÉDIO |
| **Falha silenciosa** | `context_manager` engole exceções de I/O (`except: pass`) — bom para resiliência, ruim para diagnóstico. | BAIXO |

---

## 5. Compatibilidade com a Fábrica

A Fábrica já tem destino natural para cada camada:

- **`17_RUNTIME`** → casa principal dos managers em runtime (libs de memória reutilizáveis pelos agentes).
- **`05_AGENTS`** → consumidores diretos (working memory injetada por turno; sessions/missions registradas).
- **`02_WORKFLOWS`** → a tabela `fila_execucao` (enqueue/dequeue por prioridade) mapeia para orquestração de workflows.
- **`16_SISTEMAS`** → se a memória virar serviço/sistema empacotado.
- **`11_OBSIDIAN`** (já existe na árvore E:\Agente X equivalente) → 4ª camada narrativa.
- **`00_GOVERNANCA`** → registrar política "schema sim, dados não" + retenção/LGPD.
- **`03_SKILLS`** → expor add_memory/search_memory como skill de RAG.

**O que precisa ser adaptado:**
1. Remover dependência do layout fixo `parent.parent.parent` → injetar root/paths via config (`12_CONFIG` ou env).
2. Mover o `logging.basicConfig` para fora do import (configuração centralizada).
3. Recriar bancos VAZIOS a partir de `db_init.py` (schema), descartando `agente_x.db`/`learning_memory.db`/`chroma.sqlite3` com dados.
4. Parametrizar `collection_name`, `persist_dir` e `db_path` (já há defaults; tornar obrigatório no boot).
5. Confirmar e fixar versão de `chromadb` + `sentence-transformers` em requirements.

---

## 6. Classificação

**ADAPTAR** — arquitetura sólida e em uso real, mas precisa de parametrização de paths/logging e, obrigatoriamente, recriação de bancos vazios (os dados atuais contêm informação pessoal e não devem ser importados).

---

## 7. Plano de Extração (sem código)

1. **Isolar o padrão, não os dados.** Importar apenas os módulos `.py` (context_manager, memory_manager, db_init, db_migration_fase4, chroma_manager) e o schema. NUNCA copiar `agente_x.db`, `agente_x.db-wal/shm`, `learning_memory.db`, `vector/chroma.sqlite3`, nem o backup `agente_x_pre_cleanup_*`.
2. **Sanitização:** garantir que nenhum `.db`, `.wal`, `-journal` ou `chroma.sqlite3` seja transferido. Recriar tudo via `init_database()` em diretório limpo.
3. **Parametrização:** substituir `Path(__file__).resolve().parent.parent.parent` e os paths fixos (`02_MEMORY`, `09_LOGS`) por configuração injetada (root configurável). Remover `logging.basicConfig` do escopo de import.
4. **Pinagem de dependências:** registrar versões de `chromadb` e `sentence-transformers`; documentar o download do modelo `all-MiniLM-L6-v2` no primeiro boot (e considerar cache offline).
5. **Confirmar pendências marcadas:** schema de `learning_memory.db` (não lido), versão Python alvo, conteúdo de `E:\Sistema_open_claude\.env`, e qual orquestrador consome os managers.
6. **Governança/LGPD:** registrar em `00_GOVERNANCA` política de retenção e a regra "schema sim, dados não".
7. **Testes pós-importação:** (a) `init_database` cria schema v1.0 do zero; (b) CRUD em missions/knowledge/fila; (c) ChromaManager faz upsert + search retornando distância em coleção vazia recém-criada; (d) ContextManager persiste e recarrega `MEMORY.md`; (e) verificar ausência de qualquer dado herdado.

---

## 8. Status do Dossiê

**DOSSIÊ COMPLETO — código NÃO importado (Zero Ghost Law)**
