# Relatório: FORJA GitHub Collector

**Status:** CERTIFIED (READ-ONLY)
**Ação:** Coleta da branch atual, último hash de commit e mensagens.

O coletor opera rigorosamente utilizando a CLI do Git via `subprocess`.
Não exige injeção de tokens do Github API, evadiu o risco de Push acidental e garante que se o terminal não tiver Git, o retorno não será simulado, mas sim `unavailable`.
