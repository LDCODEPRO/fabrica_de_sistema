# ORCHESTRATOR PATH FIX REPORT

**Data:** 2026-06-05
**Missao:** ORCHESTRATOR_PATH_FIX_V1

---

## 1. Arquivos Auditados

| Arquivo | Paths Hardcoded Encontrados |
|---|---|
| `16_SISTEMAS/PROJECT_ORCHESTRATOR/orchestrate.ps1` | 2 (linhas 12-13) |
| `16_SISTEMAS/PROJECT_FACTORY_CLI/create-project.ps1` | 1 (linha 58) |
| `17_RUNTIME/FACTORY_RUNTIME/factory_runtime.ps1` | 3 (deteccao/workaround do D:\) |
| `17_RUNTIME/MISSION_EXECUTOR/mission_executor.ps1` | 0 |
| `17_RUNTIME/STATUS_ENGINE/status_engine.ps1` | 0 |
| `17_RUNTIME/AUDIT_ENGINE/audit_engine.ps1` | 0 |

---

## 2. Paths Hardcoded Encontrados

| Arquivo | Linha | Path Hardcoded |
|---|---|---|
| orchestrate.ps1 | 12 | `D:\FABRICA_DE_SISTEMAS\15_PROJETOS` |
| orchestrate.ps1 | 13 | `D:\FABRICA_DE_SISTEMAS\16_SISTEMAS\PROJECT_ORCHESTRATOR` |
| create-project.ps1 | 58 | `D:\FABRICA_DE_SISTEMAS\15_PROJETOS\$ProjectName` |
| factory_runtime.ps1 | 131 | Regex de deteccao `D:\\FABRICA_DE_SISTEMAS` |
| factory_runtime.ps1 | 144 | Mensagem de log com referencia ao D:\ |
| factory_runtime.ps1 | 146 | Detail do log com referencia ao D:\ |

---

## 3. Paths Corrigidos

### orchestrate.ps1

**Antes:**
```powershell
$PROJECTS_BASE    = "D:\FABRICA_DE_SISTEMAS\15_PROJETOS"
$ORCHESTRATOR_DIR = "D:\FABRICA_DE_SISTEMAS\16_SISTEMAS\PROJECT_ORCHESTRATOR"
```

**Depois:**
```powershell
param(..., [string]$RootPath = "")
if (-not $RootPath) {
    $RootPath = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
}
$PROJECTS_BASE    = Join-Path $RootPath "15_PROJETOS"
$ORCHESTRATOR_DIR = $PSScriptRoot
```

### create-project.ps1

**Antes:**
```powershell
$projectDir = "D:\FABRICA_DE_SISTEMAS\15_PROJETOS\$ProjectName"
```

**Depois:**
```powershell
param(..., [string]$RootPath = "")
if (-not $RootPath) {
    $RootPath = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
}
$projectDir = Join-Path $RootPath "15_PROJETOS\$ProjectName"
```

### factory_runtime.ps1

**Antes:** Bloco de 15 linhas detectando D:\ e criando SKIP_PATH_MISMATCH

**Depois:**
```powershell
Invoke-Stage -StageName "ORCHESTRATOR" -StageKey "Orchestrate" -Action {
    $raw = & $ORCHESTRATOR_SCRIPT -ProjectName $ProjectName -RootPath $FABRICA_ROOT 2>&1
    ($raw | Where-Object { $_ -notmatch '^\s*$' } | Select-Object -Last 3) -join " | "
} | Out-Null
```

### orchestrate.ps1 — Encoding

Problema adicional detectado: o arquivo usava UTF-8 sem BOM.  
PS5.1 lia o arquivo como Windows-1252, corrompendo caracteres acentuados.  
O caractere `—` (U+2014) em `"— (Coordenação)"` causava parse error.

**Correcao 1:** UTF-8 BOM adicionado ao arquivo via `[System.Text.UTF8Encoding]::new($true)`  
**Correcao 2:** String `"— (Coordenação)"` substituida por `"-- (Coordenacao)"` (ASCII puro para maxima compatibilidade)

Mesmo fix aplicado ao `create-project.ps1` (BOM adicionado).

---

## 4. Paths Remanescentes

**Nenhum path absoluto hardcoded remanescente** nos scripts de runtime ou sistemas.

Verificacao:
```
grep -rn "D:\\" 16_SISTEMAS/ 17_RUNTIME/ --include="*.ps1"
```
Resultado: 0 ocorrencias de paths D:\ em codigo executavel.

---

## 5. Testes Executados

### Teste 1: orchestrate.ps1 direto com -Force

```powershell
.\orchestrate.ps1 -ProjectName "PROJETO_002_TESTE_SAAS" -Force
```

**Resultado:** SUCESSO  
Projeto detectado em `C:\...\15_PROJETOS\PROJETO_002_TESTE_SAAS`  
MISSION_BOARD.md e task files regenerados corretamente.  
Nenhum path D:\ exigido.

### Teste 2: factory_runtime.ps1 com -ForceOrchestrate

```powershell
.\factory_runtime.ps1 -ProjectName "PROJETO_002_TESTE_SAAS" -ForceOrchestrate
```

| Etapa | Resultado |
|---|---|
| VALIDACAO | OK |
| ORCHESTRATOR | OK (chamado com -RootPath dinamico) |
| MISSION_EXECUTOR | OK (4 agentes despachados) |
| STATUS_ENGINE | OK (dashboard 2609 bytes) |
| AUDIT_ENGINE | OK (APROVADO, Score 100/100) |
| **RESULTADO FINAL** | **SUCESSO em 1.4s** |

---

## 6. Resultado Final

| Item | Antes | Depois |
|---|---|---|
| orchestrate.ps1 portavel | NAO (D:\ hardcoded) | SIM (PSScriptRoot dinamico) |
| create-project.ps1 portavel | NAO (D:\ hardcoded) | SIM (PSScriptRoot dinamico) |
| factory_runtime.ps1 limpo | NAO (workaround D:\) | SIM (chamada direta com -RootPath) |
| Pipeline completo sem D:\ | NAO | SIM |
| Score auditoria | 100/100 | 100/100 (mantido) |

---

## 7. A Fabrica esta portavel em relacao a path?

**SIM.**

A Fabrica pode ser movida para qualquer drive ou diretorio.  
Todos os scripts detectam automaticamente sua localizacao via `$PSScriptRoot`.  
O parametro `-RootPath` permite override manual se necessario.  
Nenhum path absoluto hardcoded permanece nos scripts executaveis.

---

## SAVE LAW

| Acao | Resultado |
|---|---|
| git status | Executado |
| git add | Staged |
| git commit | Pendente |
| git push | Pendente |
