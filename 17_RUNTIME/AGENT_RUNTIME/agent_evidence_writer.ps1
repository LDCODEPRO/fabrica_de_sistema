# =============================================================================
# AGENT_EVIDENCE_WRITER.PS1
# Fabrica de Sistemas - Agent Runtime Component
# Grava arquivo de evidencia para uma resposta de agente.
# =============================================================================

param(
    [Parameter(Mandatory = $true)]
    [string]$ProjectPath,

    [Parameter(Mandatory = $true)]
    [string]$AgentName,

    [Parameter(Mandatory = $true)]
    [string]$ResponseContent,

    [string]$TaskFile    = "",
    [string]$ProjectName = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$now     = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$dateStr = Get-Date -Format "yyyy-MM-dd HH:mm"

# Garantir estrutura de diretorios
$evidenceDir = Join-Path $ProjectPath "_AGENT_RUNTIME\EVIDENCE"
if (-not (Test-Path $evidenceDir)) {
    New-Item -ItemType Directory -Path $evidenceDir -Force | Out-Null
}

# Calcular hash simples da resposta (tamanho + primeiras palavras)
$responseLen  = $ResponseContent.Length
$responseHash = "$responseLen-chars"
$firstWords   = ($ResponseContent -split '\s+' | Select-Object -First 8) -join " "

# Gerar arquivo de evidencia
$evidenceFile = Join-Path $evidenceDir "${AgentName}_EVIDENCE.md"

$content = @"
# EVIDENCE - $AgentName

**Data:** $dateStr
**Agente:** $AgentName
**Projeto:** $ProjectName
**Tarefa:** $TaskFile
**Modo:** HUMAN_ASSISTED

---

## Metadados da Resposta

| Campo | Valor |
|---|---|
| Tamanho da resposta | $responseLen caracteres |
| Identificador | $responseHash |
| Primeiras palavras | $firstWords... |

---

## Status

AGENT_RESPONSE_RECEIVED

---

## Validacao pelo Operador

Status apos validacao: [A SER PREENCHIDO PELO OPERADOR]

Observacoes: [A SER PREENCHIDO PELO OPERADOR]

---

_Evidencia registrada por AGENT_RUNTIME_V1 em ${now}_
"@

Set-Content -Path $evidenceFile -Value $content -Encoding UTF8
Write-Output "EVIDENCE_WRITTEN: $evidenceFile"
