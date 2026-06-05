# DOSSIÊ TÉCNICO — ATIVO 02

> Gerado sob ZERO GHOST LAW. Missão de planejamento. Nenhum código foi copiado, importado ou modificado. Leitura somente-leitura de E:\ realizada para confirmação.

---

## 1. Identificação
- **ID:** 02
- **Nome:** Sistema de Regras Numeradas RULE_000–013
- **Tipo:** Template / Regra (governança)
- **Origem (caminho real CONFIRMADO em E:\):** `E:\PHANDORA\02_RULES\`
  - 14 arquivos confirmados: `RULE_000_MASTER_RULE.md` a `RULE_013_AUDIT_RULE.md` + `RULE_INDEX.md`
  - Tamanhos entre ~600 e ~1029 bytes cada (arquivos pequenos, puramente textuais Markdown)

### Inventário confirmado das 14 regras
| Regra | Severity (confirmado) |
|---|---|
| RULE_000_MASTER_RULE | CRITICAL |
| RULE_001_TRUTH_RULE | a confirmar |
| RULE_002_NO_PHANTOM_PROGRESS | a confirmar |
| RULE_003_SAFE_EXECUTION | a confirmar |
| RULE_004_MEMORY_INTEGRITY | a confirmar |
| RULE_005_OBSIDIAN_DOCUMENTATION | a confirmar |
| RULE_006_GOOGLE_DRIVE_SYNC | MEDIUM |
| RULE_007_GITHUB_DISCIPLINE | a confirmar |
| RULE_008_ANTI_HALLUCINATION | a confirmar |
| RULE_009_DIRECTOR_PRIORITY | a confirmar |
| RULE_010_SELF_IMPROVEMENT | a confirmar |
| RULE_011_SECURITY_RULE | a confirmar |
| RULE_012_TOOL_USAGE_RULE | a confirmar |
| RULE_013_AUDIT_RULE | a confirmar |
| RULE_INDEX (agregador) | n/a |

---

## 2. Finalidade
Conjunto de 13 regras numeradas de governança operacional (mais o índice), cada uma seguindo um **template padronizado de 10 seções** (confirmado por leitura de RULE_000 e RULE_006):
1. Objetivo · 2. Quando aplicar · 3. Condições de bloqueio · 4. Exemplo correto · 5. Exemplo incorreto · 6. Critério de validação · 7. Logs obrigatórios · 8. Dependências · 9. Severity Level · 10. Auto-checklist.

Importa para a Fábrica porque é o **padrão de governança mais bem estruturado** encontrado na auditoria: define um contrato verificável e auditável por regra (com critério de validação, logs e checklist), aplicável diretamente ao módulo `00_GOVERNANCA`. As regras cobrem verdade/anti-alucinação, execução segura, integridade de memória, documentação, sincronização (Drive/GitHub), segurança, uso de ferramentas, auditoria e auto-melhoria.

---

## 3. Dependências
- **Runtime:** Nenhum. São arquivos Markdown estáticos — não há código executável, sem dependência de linguagem ou pacote. (confirmado)
- **Acoplamento interno via wikilinks Obsidian:**
  - `RULE_INDEX.md` referencia todas as 13 regras por `[[RULE_xxx]]`. (confirmado)
  - `RULE_006` depende de `[[SKILL_007_GOOGLE_DRIVE_SYNC]]`. (confirmado)
  - Demais dependências inter-regra/skill: **a confirmar** (não lidas individualmente).
- **Plataforma de visualização:** Obsidian (vault `E:\PHANDORA` contém `.obsidian`) — wikilinks `[[...]]` exigem Obsidian ou renderizador compatível para navegação. (confirmado pela presença de `.obsidian`)
- **Serviços externos citados nas regras (referências de texto, não integrações de código):**
  - Google Drive (RULE_006) — **a confirmar** se há automação real ou apenas regra documental.
  - GitHub (RULE_007) — **a confirmar**.
- **LLMs / bancos de dados:** Nenhum dependido pelo ativo em si. (confirmado — são documentos)

---

## 4. Riscos — **BAIXO**
- **Credenciais/segredos:** Nenhum nos arquivos lidos. Risco residual nas regras não lidas (006/007 mencionam Drive/GitHub) — **a confirmar** que não há tokens/URLs privadas embutidas. O vault contém um `.env` na raiz (NÃO faz parte deste ativo e NÃO deve ser importado).
- **Acoplamento:** Baixo, mas presente — wikilinks a SKILLS (ex. SKILL_007) e nomenclatura interna PHANDORA. Importar regras sem os alvos quebra navegação.
- **Paths hardcoded:** Não observados nas regras lidas; textos mencionam "Obsidian", "Google Drive" de forma genérica. **A confirmar** nas regras 005/006/007.
- **Mocks:** Inexistentes (sem código).
- **Dados pessoais:** Não observados. Referências a "Diretor" são papel, não PII. (confirmado nas lidas)

---

## 5. Compatibilidade com a Fábrica
- **Encaixe primário:** `00_GOVERNANCA` — as 13 regras formam o núcleo de políticas da Fábrica.
- **Encaixe secundário:** `13_AUDIT`/equivalente (RULE_013_AUDIT, RULE_002_NO_PHANTOM, RULE_008_ANTI_HALLUCINATION mapeiam diretamente para a própria Zero Ghost Law desta Fábrica — alinhamento conceitual forte).
- **Ajustes necessários:**
  - Resolver wikilinks Obsidian: re-mapear `[[SKILL_007...]]` para os IDs reais de `03_SKILLS` da Fábrica, ou converter para links relativos / IDs de catálogo.
  - Renomear nomenclatura PHANDORA → padrão Fábrica onde houver acoplamento de marca.
  - Reavaliar Severity Levels contra a escala oficial da Fábrica.
  - Regras 006 (Drive) e 007 (GitHub) podem ser irrelevantes/divergentes da stack da Fábrica — avaliar manter, adaptar ou descartar.

---

## 6. Classificação
**ADAPTAR** — template de 10 seções é excelente e reaproveitável, mas exige desacoplamento dos wikilinks/nomenclatura PHANDORA e revisão das regras de integração (Drive/GitHub) antes de virar política da Fábrica.

---

## 7. Plano de Extração (sem código)
1. **Leitura completa somente-leitura** das 13 regras restantes não lidas individualmente, registrando Severity e bloco "Dependências" de cada uma.
2. **Mapa de dependências:** extrair todos os wikilinks `[[...]]` e classificar como (a) outra regra, (b) skill, (c) externo.
3. **Sanitização:** varredura por segredos/tokens/URLs privadas e por PII; confirmar ausência antes de qualquer importação. Excluir explicitamente o `.env` e qualquer arquivo fora de `02_RULES`.
4. **Parametrização:** substituir nomes de marca/serviço hardcoded (PHANDORA, caminhos Drive/GitHub) por placeholders/variáveis da Fábrica.
5. **Remapeamento de links:** converter wikilinks para os IDs reais de `00_GOVERNANCA`/`03_SKILLS` da Fábrica; recriar um `RULE_INDEX` adaptado.
6. **Decisão por regra:** marcar cada regra como importar/adaptar/descartar (foco em 006/007).
7. **Testes de validação:** verificar que (a) todas as 10 seções estão presentes em cada regra, (b) nenhum link fica órfão, (c) Severity está na escala oficial, (d) regras de auditoria não conflitam com a Zero Ghost Law local.
8. **Importação controlada:** copiar apenas após aprovação, para o módulo de governança da Fábrica — fora do escopo desta missão de planejamento.

---

## 8. Status do Dossiê
**DOSSIÊ COMPLETO — código NÃO importado (Zero Ghost Law)**
