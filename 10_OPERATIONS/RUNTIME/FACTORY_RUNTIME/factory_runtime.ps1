# =============================================================================
# FACTORY_RUNTIME.PS1
# Fabrica de Sistemas - Ponto unico de entrada operacional
# Executa o pipeline completo: ORCHESTRATOR -> EXECUTOR -> STATUS -> AUDIT
# =============================================================================

param(
    [Parameter(Mandatory = $true)]
    [string]$ProjectName,

    # Forcar re-orquestracao mesmo se MISSION_BOARD ja existir
    [switch]$ForceOrchestrate,

    # Executar AGENT_RUNTIME apos MISSION_EXECUTOR (modo HUMAN_ASSISTED)
    [switch]$RunAgentRuntime,

    # Nao gerar relatorio final (apenas log)
    [switch]$NoReport
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$ScriptDir = $PSScriptRoot

# ---------------------------------------------------------------------------
# Carregar modulos do runtime
# ---------------------------------------------------------------------------
. (Join-Path $ScriptDir "runtime_config.ps1")
. (Join-Path $ScriptDir "runtime_logger.ps1")
. (Join-Path $ScriptDir "runtime_validator.ps1")

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
$pipelineResults = [ordered]@{
    Project        = $ProjectName
    StartTime      = Get-Date
    EndTime        = $null
    Validate       = @{ Result = "PENDENTE"; Duration = 0; Detail = "" }
    Orchestrate    = @{ Result = "PENDENTE"; Duration = 0; Detail = "" }
    Execute        = @{ Result = "PENDENTE"; Duration = 0; Detail = "" }
    AgentRuntime   = @{ Result = "NAO_EXECUTADO"; Duration = 0; Detail = "Parametro -RunAgentRuntime nao usado" }
    Status         = @{ Result = "PENDENTE"; Duration = 0; Detail = "" }
    Audit          = @{ Result = "PENDENTE"; Duration = 0; Detail = "" }
    AuditScore     = -1
    AuditVerdict   = ""
    FinalResult    = "PENDENTE"
}

function Invoke-Stage {
    param(
        [string]$StageName,
        [string]$StageKey,
        [scriptblock]$Action
    )
    Write-RuntimeConsole -Stage $StageName -Msg "Iniciando..." -Level "START"
    $t0 = Get-Date
    try {
        $detail = & $Action
        $elapsed = ((Get-Date) - $t0).TotalSeconds
        $pipelineResults[$StageKey] = @{ Result = "OK"; Duration = $elapsed; Detail = $detail }
        Write-RuntimeLog -Project $ProjectName -Stage $StageName -Result "OK" -Detail $detail -Duration $elapsed
        Write-RuntimeConsole -Stage $StageName -Msg $detail -Level "OK"
        return $true
    } catch {
        $elapsed = ((Get-Date) - $t0).TotalSeconds
        $errMsg = $_.Exception.Message -replace '[\r\n]', ' '
        $pipelineResults[$StageKey] = @{ Result = "FALHA"; Duration = $elapsed; Detail = $errMsg }
        Write-RuntimeLog -Project $ProjectName -Stage $StageName -Result "FALHA" -Detail $errMsg -Duration $elapsed
        Write-RuntimeConsole -Stage $StageName -Msg $errMsg -Level "FAIL"
        return $false
    }
}

# ---------------------------------------------------------------------------
# Cabecalho
# ---------------------------------------------------------------------------
Write-Host ""
Write-Host "=================================================="
Write-Host " FACTORY RUNTIME V1"
Write-Host " Projeto: $ProjectName"
Write-Host " Inicio:  $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host "=================================================="
Write-Host ""

Initialize-RuntimeLog
Write-RuntimeLog -Project $ProjectName -Stage "RUNTIME_START" -Result "INFO" -Detail "Pipeline iniciado"

# ---------------------------------------------------------------------------
# ETAPA 1: VALIDACAO
# ---------------------------------------------------------------------------
$validOK = Invoke-Stage -StageName "VALIDACAO" -StageKey "Validate" -Action {
    $checks = Invoke-PreflightChecks -ProjectName $ProjectName

    if (-not $checks.ProjectExists.OK) {
        throw $checks.ProjectExists.Message
    }

    $msgs = @("Projeto OK")
    if ($checks.ReadmeExists -and -not $checks.ReadmeExists.OK) {
        $msgs += "AVISO: $($checks.ReadmeExists.Message)"
    }
    if ($checks.EnginesAvailable -and -not $checks.EnginesAvailable.OK) {
        throw $checks.EnginesAvailable.Message
    }
    $msgs += "Motores OK"
    $msgs -join " | "
}

if (-not $validOK) {
    Write-Host ""
    Write-Host "[RUNTIME] Validacao falhou. Pipeline interrompido."
    $pipelineResults.FinalResult = "FALHA_VALIDACAO"
    $pipelineResults.EndTime = Get-Date
    Write-RuntimeLog -Project $ProjectName -Stage "RUNTIME_END" -Result "FALHA" -Detail "Interrompido na validacao"
    exit 1
}

$projectPath = Join-Path $PROJECTS_DIR $ProjectName

# ---------------------------------------------------------------------------
# ETAPA 2: ORCHESTRATOR
# ---------------------------------------------------------------------------
$orchStatus = Get-OrchestratorStatus -ProjectPath $projectPath

if ($orchStatus.Orchestrated -and -not $ForceOrchestrate) {
    # Projeto ja orquestrado — pular
    $pipelineResults.Orchestrate = @{ Result = "SKIP"; Duration = 0; Detail = "MISSION_BOARD ja existe. Use -ForceOrchestrate para regenerar." }
    Write-RuntimeLog -Project $ProjectName -Stage "ORCHESTRATOR" -Result "SKIP" -Detail "Ja orquestrado"
    Write-RuntimeConsole -Stage "ORCHESTRATOR" -Msg "MISSION_BOARD existente. Pulando." -Level "SKIP"
} else {
    Invoke-Stage -StageName "ORCHESTRATOR" -StageKey "Orchestrate" -Action {
        $raw = & $ORCHESTRATOR_SCRIPT -ProjectName $ProjectName -RootPath $FABRICA_ROOT 2>&1
        ($raw | Where-Object { $_ -notmatch '^\s*$' } | Select-Object -Last 3) -join " | "
    } | Out-Null
}

# ---------------------------------------------------------------------------
# ETAPA 3: MISSION_EXECUTOR
# ---------------------------------------------------------------------------
Invoke-Stage -StageName "MISSION_EXECUTOR" -StageKey "Execute" -Action {
    $raw = & $EXECUTOR_SCRIPT -ProjectPath $projectPath 2>&1
    $lastLines = ($raw | Select-Object -Last 2) -join " | "
    $lastLines
} | Out-Null

# ---------------------------------------------------------------------------
# ETAPA 4: AGENT_RUNTIME (opcional — ativado por -RunAgentRuntime)
# ---------------------------------------------------------------------------
if ($RunAgentRuntime) {
    if (-not (Test-Path $AGENT_RUNTIME_SCRIPT)) {
        $pipelineResults.AgentRuntime = @{ Result = "SKIP"; Duration = 0; Detail = "agent_runtime.ps1 nao encontrado em $AGENT_RUNTIME_SCRIPT" }
        Write-RuntimeConsole -Stage "AGENT_RUNTIME" -Msg "Script nao encontrado. Pulando." -Level "SKIP"
        Write-RuntimeLog -Project $ProjectName -Stage "AGENT_RUNTIME" -Result "SKIP" -Detail "Script nao encontrado"
    } else {
        # Ler agentes pendentes do MISSION_BOARD
        $missionBoardPath = Join-Path $projectPath "MISSION_BOARD.md"
        $boardLines = Get-Content -Path $missionBoardPath -Encoding UTF8
        $agentRows  = @($boardLines | Where-Object { $_ -match '_AGENT' -and $_ -match '\|' })

        $pendingAgents = @()
        foreach ($row in $agentRows) {
            $parts = ($row -split '\|') | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" }
            if ($parts.Count -ge 3) {
                $aName   = $parts[0]
                $aFile   = $parts[1]
                $aStatus = $parts[2]
                # Incluir agentes com task file real e status diferente de CONCLUIDO/AGENT_RESPONSE_RECEIVED
                if ($aFile -notmatch '^[-–(]' -and $aFile.Length -gt 3 -and
                    $aStatus -ne "CONCLUIDO" -and $aStatus -ne "AGENT_RESPONSE_RECEIVED") {
                    $pendingAgents += $aName
                }
            }
        }

        if ($pendingAgents.Count -eq 0) {
            $pipelineResults.AgentRuntime = @{ Result = "SKIP"; Duration = 0; Detail = "Nenhum agente pendente para gerar prompt" }
            Write-RuntimeConsole -Stage "AGENT_RUNTIME" -Msg "Nenhum agente pendente. Pulando." -Level "SKIP"
            Write-RuntimeLog -Project $ProjectName -Stage "AGENT_RUNTIME" -Result "SKIP" -Detail "Nenhum agente pendente"
        } else {
            $arPrompted = 0
            $arFailed   = 0
            $arT0       = Get-Date

            foreach ($agentName in $pendingAgents) {
                Write-RuntimeConsole -Stage "AGENT_RUNTIME" -Msg "Gerando prompt: $agentName" -Level "START"
                try {
                    $arRaw = & $AGENT_RUNTIME_SCRIPT -ProjectName $ProjectName -AgentName $agentName -Mode Generate 2>&1
                    $arOut = ($arRaw | Select-Object -Last 1)
                    Write-RuntimeConsole -Stage "AGENT_RUNTIME" -Msg "$agentName - $arOut" -Level "OK"
                    $arPrompted++
                } catch {
                    $arFailed++
                    Write-RuntimeConsole -Stage "AGENT_RUNTIME" -Msg "FALHA $agentName : $_" -Level "FAIL"
                }
            }

            $arDuration = ((Get-Date) - $arT0).TotalSeconds
            $arDetail   = "Prompts gerados: $arPrompted | Falhas: $arFailed | Agentes: $($pendingAgents -join ', ')"
            $arResult   = if ($arFailed -eq 0) { "OK" } else { "PARCIAL" }

            $pipelineResults.AgentRuntime = @{ Result = $arResult; Duration = $arDuration; Detail = $arDetail }
            Write-RuntimeLog -Project $ProjectName -Stage "AGENT_RUNTIME" -Result $arResult -Detail $arDetail -Duration $arDuration
            Write-RuntimeConsole -Stage "AGENT_RUNTIME" -Msg $arDetail -Level "OK"
        }
    }
}

# ---------------------------------------------------------------------------
# ETAPA 5: STATUS_ENGINE
# ---------------------------------------------------------------------------
Invoke-Stage -StageName "STATUS_ENGINE" -StageKey "Status" -Action {
    $raw = & $STATUS_SCRIPT -ProjectName $ProjectName 2>&1
    $lastLines = ($raw | Select-Object -Last 2) -join " | "
    $lastLines
} | Out-Null

# ---------------------------------------------------------------------------
# ETAPA 5: AUDIT_ENGINE
# ---------------------------------------------------------------------------
$auditOK = Invoke-Stage -StageName "AUDIT_ENGINE" -StageKey "Audit" -Action {
    $raw = & $AUDIT_SCRIPT -ProjectName $ProjectName 2>&1
    $lastLines = ($raw | Select-Object -Last 3) -join " | "
    $lastLines
}

# Ler score e veredicto do relatorio de auditoria
if (Test-Path $AUDIT_REPORT) {
    $auditContent = Get-Content -Path $AUDIT_REPORT -Encoding UTF8 -Raw
    if ($auditContent -match 'Score operacional da Fabrica\*\*\s*\|\s*\*\*(\d+)\s*/\s*100') {
        $pipelineResults.AuditScore = [int]$Matches[1]
    }
    if ($auditContent -match 'APROVADO') { $pipelineResults.AuditVerdict = "APROVADO" }
    elseif ($auditContent -match 'REPROVADO') { $pipelineResults.AuditVerdict = "REPROVADO" }
    elseif ($auditContent -match 'ALERTA') { $pipelineResults.AuditVerdict = "ALERTA" }
}

# ---------------------------------------------------------------------------
# Resultado final
# ---------------------------------------------------------------------------
$pipelineResults.EndTime = Get-Date
$totalDuration = ($pipelineResults.EndTime - $pipelineResults.StartTime).TotalSeconds

$stageFails = @(@("Validate","Execute","Status","Audit") | Where-Object {
    $pipelineResults[$_].Result -eq "FALHA"
})

$pipelineResults.FinalResult = if ($stageFails.Count -eq 0) { "SUCESSO" } else { "PARCIAL" }

Write-Host ""
Write-Host "=================================================="
Write-Host " RESULTADO FINAL: $($pipelineResults.FinalResult)"
Write-Host " Duracao total: $([math]::Round($totalDuration,1))s"
Write-Host " Score auditoria: $($pipelineResults.AuditScore)/100"
Write-Host "=================================================="
Write-Host ""

Write-RuntimeLog -Project $ProjectName -Stage "RUNTIME_END" `
    -Result $pipelineResults.FinalResult `
    -Detail "Score=$($pipelineResults.AuditScore) | Duracao=${totalDuration}s" `
    -Duration $totalDuration

# ---------------------------------------------------------------------------
# RELATORIO FINAL
# ---------------------------------------------------------------------------
if (-not $NoReport) {
    $now = Get-Date -Format "yyyy-MM-dd HH:mm"

    $sb = [System.Text.StringBuilder]::new()
    $null = $sb.AppendLine("# FACTORY RUNTIME EXECUTION REPORT")
    $null = $sb.AppendLine("")
    $null = $sb.AppendLine("**Projeto:** $ProjectName")
    $null = $sb.AppendLine("**Execucao:** $now")
    $null = $sb.AppendLine("**Duracao total:** $([math]::Round($totalDuration,1))s")
    $null = $sb.AppendLine("**Resultado:** $($pipelineResults.FinalResult)")
    $null = $sb.AppendLine("")
    $null = $sb.AppendLine("---")
    $null = $sb.AppendLine("")
    $null = $sb.AppendLine("## Pipeline de Execucao")
    $null = $sb.AppendLine("")
    $null = $sb.AppendLine("| Etapa | Resultado | Duracao | Detalhe |")
    $null = $sb.AppendLine("|---|---|---|---|")

    foreach ($key in @("Validate","Orchestrate","Execute","AgentRuntime","Status","Audit")) {
        $s = $pipelineResults[$key]
        $dur = "$([math]::Round($s.Duration,1))s"
        $det = if ($s.Detail.Length -gt 80) { $s.Detail.Substring(0,80) + "..." } else { $s.Detail }
        $null = $sb.AppendLine("| $key | $($s.Result) | $dur | $det |")
    }

    $null = $sb.AppendLine("")
    $null = $sb.AppendLine("## Score de Auditoria")
    $null = $sb.AppendLine("")
    $null = $sb.AppendLine("| Metrica | Valor |")
    $null = $sb.AppendLine("|---|---|")
    $null = $sb.AppendLine("| Score operacional | $($pipelineResults.AuditScore)/100 |")
    $null = $sb.AppendLine("| Veredicto | $($pipelineResults.AuditVerdict) |")
    $null = $sb.AppendLine("")
    $null = $sb.AppendLine("## Proxima Acao Recomendada")
    $null = $sb.AppendLine("")

    $nextAction = switch ($pipelineResults.FinalResult) {
        "SUCESSO"  { "Pipeline executado com sucesso. Revisar FACTORY_AUDIT_REPORT para detalhes." }
        "PARCIAL"  { "Algumas etapas falharam. Verificar RUNTIME_LOG.md para diagnostico." }
        default    { "Verificar RUNTIME_LOG.md." }
    }
    if ($pipelineResults.AuditScore -ge 0 -and $pipelineResults.AuditScore -lt 80) {
        $nextAction = "Score abaixo de 80. Revisar issues no FACTORY_AUDIT_REPORT.md."
    }
    $null = $sb.AppendLine($nextAction)
    $null = $sb.AppendLine("")
    $null = $sb.AppendLine("---")
    $null = $sb.AppendLine("_Gerado por FACTORY_RUNTIME_V1 em ${now}_")

    Set-Content -Path $EXEC_REPORT_PATH -Value $sb.ToString() -Encoding UTF8
    Write-Host "[REPORT] $EXEC_REPORT_PATH"
}
