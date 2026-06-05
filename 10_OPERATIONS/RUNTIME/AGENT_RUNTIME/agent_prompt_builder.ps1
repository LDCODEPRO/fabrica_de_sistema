# =============================================================================
# AGENT_PROMPT_BUILDER.PS1
# Fabrica de Sistemas - Agent Runtime Component
# Constroi o prompt operacional completo para um agente.
# Saida: conteudo do prompt como string via Write-Output.
# =============================================================================

param(
    [Parameter(Mandatory = $true)]
    [string]$AgentJson,       # JSON do agent_loader

    [Parameter(Mandatory = $true)]
    [string]$TaskContent,     # Conteudo do task file

    [Parameter(Mandatory = $true)]
    [string]$ProjectName,

    [string]$ProjectType  = "",
    [string]$TaskFile     = "",
    [string]$TaskStatus   = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$agent    = $AgentJson | ConvertFrom-Json
$now      = Get-Date -Format "yyyy-MM-dd HH:mm"

# ---------------------------------------------------------------------------
# Construir prompt
# ---------------------------------------------------------------------------
$sb = [System.Text.StringBuilder]::new()

$null = $sb.AppendLine("# PROMPT OPERACIONAL - $($agent.AgentName)")
$null = $sb.AppendLine("")
$null = $sb.AppendLine("**Gerado em:** $now")
$null = $sb.AppendLine("**Projeto:** $ProjectName")
$null = $sb.AppendLine("**Tarefa:** $TaskFile")
$null = $sb.AppendLine("**Status anterior:** $TaskStatus")
$null = $sb.AppendLine("**Modo:** HUMAN_ASSISTED")
$null = $sb.AppendLine("")
$null = $sb.AppendLine("---")
$null = $sb.AppendLine("")

# Secao 1: Identidade
$null = $sb.AppendLine("## 1. Identidade do Agente")
$null = $sb.AppendLine("")
$null = $sb.AppendLine("Voce e o **$($agent.AgentName)** da Fabrica de Sistemas.")
$null = $sb.AppendLine("")
if ($agent.Identity) {
    $null = $sb.AppendLine($agent.Identity)
    $null = $sb.AppendLine("")
}
if ($agent.Responsibilities) {
    $null = $sb.AppendLine("**Responsabilidades:**")
    $null = $sb.AppendLine("")
    $null = $sb.AppendLine($agent.Responsibilities)
    $null = $sb.AppendLine("")
}

# Secao 2: Missao atual
$null = $sb.AppendLine("## 2. Missao Atual")
$null = $sb.AppendLine("")
$null = $sb.AppendLine($TaskContent)
$null = $sb.AppendLine("")

# Secao 3: Contexto do projeto
$null = $sb.AppendLine("## 3. Contexto do Projeto")
$null = $sb.AppendLine("")
$null = $sb.AppendLine("| Campo | Valor |")
$null = $sb.AppendLine("|---|---|")
$null = $sb.AppendLine("| Projeto | $ProjectName |")
$null = $sb.AppendLine("| Tipo | $ProjectType |")
$null = $sb.AppendLine("| Arquivo de tarefa | $TaskFile |")
$null = $sb.AppendLine("")

# Secao 4: Regras aplicaveis
$null = $sb.AppendLine("## 4. Regras Aplicaveis")
$null = $sb.AppendLine("")
if ($agent.Limits) {
    $null = $sb.AppendLine("**Limites do agente:**")
    $null = $sb.AppendLine("")
    $null = $sb.AppendLine($agent.Limits)
    $null = $sb.AppendLine("")
}
$null = $sb.AppendLine("**Regras gerais:**")
$null = $sb.AppendLine("")
$null = $sb.AppendLine("- Nao inventar dados, arquivos ou estruturas que nao existem.")
$null = $sb.AppendLine("- Nao declarar tarefa concluida sem evidencia real.")
$null = $sb.AppendLine("- Todo output deve ser baseado em informacoes reais do projeto.")
$null = $sb.AppendLine("- Respostas devem ser objetivas, estruturadas e diretamente acionaveis.")
$null = $sb.AppendLine("")

# Secao 5: Output esperado
$null = $sb.AppendLine("## 5. Output Esperado")
$null = $sb.AppendLine("")
$null = $sb.AppendLine("Responda APENAS o que for solicitado na secao de tarefa (item 2).")
$null = $sb.AppendLine("Estruture sua resposta em secoes claras com titulos Markdown.")
$null = $sb.AppendLine("Inclua ao final uma secao **EVIDENCIA** com:")
$null = $sb.AppendLine("")
$null = $sb.AppendLine("- Lista de decisoes tomadas")
$null = $sb.AppendLine("- Justificativa para cada decisao")
$null = $sb.AppendLine("- O que ficou pendente (se houver)")
$null = $sb.AppendLine("- Proxima acao recomendada")
$null = $sb.AppendLine("")

# Secao 6: Restricoes
$null = $sb.AppendLine("## 6. Restricoes")
$null = $sb.AppendLine("")
$null = $sb.AppendLine("- NAO use APIs externas sem autorizacao explicita.")
$null = $sb.AppendLine("- NAO altere arquivos fora do escopo da tarefa.")
$null = $sb.AppendLine("- NAO declare status CONCLUIDO - o operador faz isso apos validacao.")
$null = $sb.AppendLine("- NAO crie arquivos fictícios ou placeholders sem conteudo real.")
$null = $sb.AppendLine("")

# Secao 7: ZERO GHOST LAW
$null = $sb.AppendLine("## 7. ZERO GHOST LAW")
$null = $sb.AppendLine("")
$null = $sb.AppendLine("Cada afirmacao sua deve ser verificavel.")
$null = $sb.AppendLine("Cada arquivo mencionado deve existir ou ser criado com conteudo real.")
$null = $sb.AppendLine("Nenhum dado pode ser assumido, estimado ou inventado.")
$null = $sb.AppendLine("Se uma informacao nao estiver disponivel, declare explicitamente como AUSENTE.")
$null = $sb.AppendLine("")

# Secao 8: Evidencia obrigatoria
$null = $sb.AppendLine("## 8. Evidencia Obrigatoria")
$null = $sb.AppendLine("")
$null = $sb.AppendLine("Ao final da sua resposta, inclua obrigatoriamente:")
$null = $sb.AppendLine("")
$null = $sb.AppendLine('```')
$null = $sb.AppendLine("EVIDENCIA:")
$null = $sb.AppendLine("- Agente: $($agent.AgentName)")
$null = $sb.AppendLine("- Projeto: $ProjectName")
$null = $sb.AppendLine("- Tarefa: $TaskFile")
$null = $sb.AppendLine("- Data: [DATA_ATUAL]")
$null = $sb.AppendLine("- Decisoes: [LISTA]")
$null = $sb.AppendLine("- Pendencias: [LISTA ou NENHUMA]")
$null = $sb.AppendLine("- Status recomendado: EM_VALIDACAO")
$null = $sb.AppendLine('```')
$null = $sb.AppendLine("")
$null = $sb.AppendLine("---")
$null = $sb.AppendLine("_Prompt gerado por AGENT_RUNTIME_V1 - HUMAN_ASSISTED MODE_")

Write-Output $sb.ToString()
