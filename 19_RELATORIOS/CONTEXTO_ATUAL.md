# CONTEXTO ATUAL — FORJA OS / Fábrica de Sistema (handoff)

**Atualizado:** 2026-06-11
**Para quem:** qualquer máquina/sessão que precise continuar o projeto de onde paramos.
**Como usar:** leia este arquivo antes de começar — ele resume estado, decisões e pendências.

## O que é
Plataforma de operação de agência **multi-cliente** (FORJA OS). Backend FastAPI (`forja_os_server.py`, porta 8000, serve o painel em `/painel`), banco SQLite `nexus.db`, frontend React+esbuild em `16_SISTEMAS/FORJA_OS_PLATFORM` (fonte em `js/*.jsx`, build `node scripts/build.mjs` → `dist/`). Princípio inegociável: **Lei Zero Fantasma** (nada falso/mockado; só dado real ou rótulo honesto).

## Como rodar
- **ABRIR_PAINEL_FORJA.cmd** (raiz) — sobe o backend e abre o painel; valida as LLMs sozinho no boot.
- **INSTALAR.cmd** — máquina nova: instala deps (pip) + cria `.env` (pede a chave do OpenRouter).
- **ATUALIZAR.cmd** — máquina que já tem o sistema: `git pull origin main`.
- Rebuild do painel: `cd 16_SISTEMAS/FORJA_OS_PLATFORM && node scripts/build.mjs`.

## Construído e funcionando (verificado)
- **Clientes** (multi-cliente): conexões por cliente (Instagram/Facebook/Drive) + globais da Fábrica (Canva/OpenRouter/GitHub/Telegram/Email/WhatsApp), validadas via API oficial; credenciais nunca expostas.
- **Projetos**: criar; **Enviar projeto** (upload de pasta/.zip/imagens + briefing); **Desenvolver com a Fábrica** (construtor estruturado gera arquivos completos); **Preview** roda no navegador (`/preview/projeto_{id}/`).
- **Conteúdo**: estúdio de post/reel/story/carrossel; **Planejar campanha** (1–3/dia, 1–21/semana, múltiplas redes, tamanho correto por rede); IA desenvolve legenda/@/#; upload de imagem redimensiona; **Gerar imagem (IA)** via OpenRouter (Nano Banana — pago/precisa crédito); publicar/agendar.
- **Agentes (12 papéis)**: perfis de elite + **biblioteca de conhecimento (ON)** + **ferramentas distintas por papel** + memória (`agent_memory`). Chat (cordial, memória, continuidade) e Equipe Inteligente (Agir/Conversar). Endpoints `/api/agents/{id}/run` e `/act`.
- **LLMs**: roteamento real — Claude (CLI assinatura), Gemini (assinatura), OpenRouter (DeepSeek V4 Pro → Kimi K2.6). Auto-validação no boot; botão Reconectar; prioridade no código + `.env`.
- **Scheduler** (`scheduler_engine.py`) + **atendimento Telegram automático** (`telegram_attendant.py`, long-polling).
- **Financeiro** (livro-caixa real + custo de IA medido), **Operações** (health + scheduler), **Testes** (auto-teste real), **Auditoria**, **Conhecimento** (contagem real do repo).
- Infra: launcher, INSTALAR/ATUALIZAR, backup .zip, Docker (`docker-compose.vps.yml`), 2 remotes GitHub (origin=cipolaricreator, target=LDCODEPRO), espelho Obsidian em `../fabricadesistema`.

## Decisões importantes
- **`.env`** (chave OpenRouter) e **`nexus.db`** (tokens de clientes/dados) ficam **FORA do Git** (segurança). Vão só no backup `.zip` (confidencial).
- Modelo de imagem por IA é pago (OpenRouter) — Claude assinatura não gera imagem; Canva seria por template (não integrado ainda).
- ChatGPT assinatura está **bloqueado pelo Cloudflare** (automação) — não usar; base é Claude/Gemini/OpenRouter.

## Pendências (rumo a "produção 10/10")
1. **VPS + deploy** (Docker + `.env` OpenRouter + domínio/HTTPS) → 24/7 e acesso de qualquer lugar.
2. **Login real** (hoje `/api/auth/login` é stub) + proteger rotas.
3. **Trava de custo** (billing não bloqueia ao estourar) + garantir 1 worker no VPS (senão scheduler/telegram duplicam).
4. **Imagem**: integrar Canva (templates) e/ou crédito OpenRouter para Nano Banana.
5. Módulos honestamente vazios: **Inteligência de mercado** (precisa fonte de busca), **Academia** (conteúdo).
6. Reforçar autonomia dos agentes para projetos grandes (mais rodadas/ferramentas com aprovação).

## Nota atual (honesta)
- Fundação/MVP que funciona: **~8,5/10**.
- Produto comercial 100% pronto: **~6,5/10** (falta deploy/login/finalizações acima).
