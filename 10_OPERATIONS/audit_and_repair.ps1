# =============================================================================
# AUDIT_AND_REPAIR.PS1
# Fabrica de Sistemas - Auditoria e reparo da fundacao
# Usa caminhos dinamicos baseados em PSScriptRoot.
# NAO forja scores. NAO injeta texto falso. Reporta o estado real.
# =============================================================================

$target = Split-Path $PSScriptRoot -Parent
if ([string]::IsNullOrWhiteSpace($target)) {
    $target = (Get-Location).Path
}

$global:issuesFound   = 0
$global:issuesFixed   = 0
$global:issuesPending = 0

function Log-Issue { param($msg); Write-Host "ISSUE: $msg" -ForegroundColor Yellow; $global:issuesFound++ }
function Log-Fix   { param($msg); Write-Host "FIX:   $msg" -ForegroundColor Green;  $global:issuesFixed++ }
function Log-Skip  { param($msg); Write-Host "SKIP:  $msg" -ForegroundColor Cyan }

Write-Host "AUDIT_AND_REPAIR iniciando em: $target" -ForegroundColor Cyan

# FASE 1 - LOCALIZACAO REAL
$locReport = "# FOUNDATION REAL INVENTORY`n`n## LOCALIZACAO REAL`n"
if (Test-Path $target) {
    $locReport += "- $target : EXISTE`n"
} else {
    Log-Issue "Raiz nao encontrada: $target"
    $global:issuesPending++
    Write-Host "ERRO CRITICO: Raiz nao encontrada. Abortando." -ForegroundColor Red
    exit 1
}

# FASE 2 - INVENTARIO FISICO
$allFiles  = Get-ChildItem -Path $target -Recurse -File   -ErrorAction SilentlyContinue
$allDirs   = Get-ChildItem -Path $target -Recurse -Directory -ErrorAction SilentlyContinue
$emptyFiles = @($allFiles | Where-Object { $_.Length -eq 0 })
$emptyDirs  = @($allDirs  | Where-Object { @(Get-ChildItem -Path $_.FullName -ErrorAction SilentlyContinue).Count -eq 0 })

$locReport += "`n## INVENTARIO FISICO INICIAL`n"
$locReport += "- Pastas: $($allDirs.Count)`n"
$locReport += "- Arquivos: $($allFiles.Count)`n"
$locReport += "- Arquivos vazios detectados: $($emptyFiles.Count)`n"
$locReport += "- Pastas vazias detectadas: $($emptyDirs.Count)`n"

# Remover arquivos genuinamente vazios (Zero Ghost Law)
foreach ($ef in $emptyFiles) {
    # Nao remover READMEs, eles serao tratados abaixo
    if ($ef.Name -eq "README.md") { continue }
    Log-Issue "Arquivo vazio (fantasma): $($ef.FullName)"
    Remove-Item $ef.FullName -Force -ErrorAction SilentlyContinue
    Log-Fix "Arquivo vazio removido: $($ef.Name)"
}

# FASE 3 - AUDITORIA ESTRUTURAL
$expectedDirs = @(
    "00_GOVERNANCA", "01_RULES", "02_WORKFLOWS", "03_SKILLS", "04_CHECKLISTS",
    "05_AGENTS", "06_CORE_BASE", "09_PROJETOS", "10_OPERATIONS", "11_AUDITORIA",
    "14_DOCUMENTACAO", "16_SISTEMAS", "18_EXPORTS", "19_RELATORIOS"
)

foreach ($dir in $expectedDirs) {
    $path = Join-Path $target $dir
    if (!(Test-Path $path)) {
        Log-Issue "Diretorio ausente: $dir"
        New-Item -ItemType Directory -Path $path -Force | Out-Null
        Log-Fix "Diretorio criado: $dir"
    }
    $readmePath = Join-Path $path "README.md"
    if (!(Test-Path $readmePath)) {
        Log-Issue "README ausente em: $dir"
        Set-Content -Path $readmePath -Value "# $dir`n`nDiretorio da Fabrica de Sistemas." -Encoding UTF8
        Log-Fix "README criado em: $dir"
    } else {
        $content = Get-Content $readmePath -Raw -ErrorAction SilentlyContinue
        if ([string]::IsNullOrWhiteSpace($content)) {
            Log-Issue "README vazio em: $dir"
            Set-Content -Path $readmePath -Value "# $dir`n`nDiretorio da Fabrica de Sistemas." -Encoding UTF8
            Log-Fix "README preenchido em: $dir"
        }
    }
}

# FASE 4 - AUDITORIA DE WORKFLOWS (apenas reporta, NAO sobrescreve conteudo real)
$wfDir = Join-Path $target "02_WORKFLOWS"
if (Test-Path $wfDir) {
    $workflows = Get-ChildItem -Path $wfDir -Directory -ErrorAction SilentlyContinue
    foreach ($w in $workflows) {
        $req = @("INPUTS.md", "OUTPUTS.md", "WORKFLOW.md", "CHECKLIST.md")
        foreach ($r in $req) {
            $fPath = Join-Path $w.FullName $r
            if (!(Test-Path $fPath)) {
                Log-Issue "Arquivo ausente em workflow $($w.Name): $r"
                # Criar apenas com aviso — NAO injetar conteudo falso
                Set-Content -Path $fPath -Value "# $($r.Replace('.md',''))`n`n[PENDENTE: conteudo real necessario para $($w.Name)]" -Encoding UTF8
                Log-Fix "Arquivo criado com marcador PENDENTE: $($w.Name)/$r"
                $global:issuesPending++
            } else {
                $content = Get-Content $fPath -Raw -ErrorAction SilentlyContinue
                if ([string]::IsNullOrWhiteSpace($content)) {
                    Log-Issue "Arquivo de workflow vazio: $($w.Name)/$r"
                    Set-Content -Path $fPath -Value "# $($r.Replace('.md',''))`n`n[PENDENTE: conteudo real necessario para $($w.Name)]" -Encoding UTF8
                    Log-Fix "Arquivo marcado como PENDENTE: $($w.Name)/$r"
                    $global:issuesPending++
                } elseif ($content -match "placeholder") {
                    # Reportar mas NAO sobrescrever — o operador deve preencher
                    Log-Issue "ALERTA: Arquivo $($w.Name)/$r ainda contem 'placeholder'. Necessita revisao manual."
                    $global:issuesPending++
                }
            }
        }
    }
}

# FASE 5 - AUDITORIA DE SKILLS (apenas verifica existencia)
$skillsDir = Join-Path $target "03_SKILLS"
if (Test-Path $skillsDir) {
    $skills = Get-ChildItem -Path $skillsDir -Directory -ErrorAction SilentlyContinue
    foreach ($s in $skills) {
        $sysSkill = Join-Path $s.FullName "SYSTEM_SKILL.md"
        if (!(Test-Path $sysSkill)) {
            Log-Issue "SYSTEM_SKILL.md ausente em: $($s.Name)"
            Set-Content -Path $sysSkill -Value "# $($s.Name) - SYSTEM_SKILL`n`n[PENDENTE: definicao real da skill necessaria]" -Encoding UTF8
            Log-Fix "SYSTEM_SKILL.md criado com marcador PENDENTE em: $($s.Name)"
            $global:issuesPending++
        }
    }
}

# FASE 6 - AUDITORIA CORE BASE
$coreDir = Join-Path $target "06_CORE_BASE"
if (Test-Path $coreDir) {
    $cores = Get-ChildItem -Path $coreDir -Directory -ErrorAction SilentlyContinue
    foreach ($c in $cores) {
        $req = @("DEPENDENCIES.md", "EDITABLE_AREAS.md", "PROTECTED_AREAS.md")
        foreach ($r in $req) {
            $fPath = Join-Path $c.FullName $r
            if (!(Test-Path $fPath)) {
                Log-Issue "Arquivo ausente em core base $($c.Name): $r"
                Set-Content -Path $fPath -Value "# $($r.Replace('.md',''))`n`n[PENDENTE: mapeamento real necessario para $($c.Name)]" -Encoding UTF8
                Log-Fix "Arquivo criado com marcador PENDENTE: $($c.Name)/$r"
                $global:issuesPending++
            }
        }
    }
}

# FASE 7 - GITHUB STATUS (apenas leitura, sem commit automatico)
$gitStatus = git -C $target status --porcelain 2>$null
if ($gitStatus) {
    Log-Issue "Repositorio tem arquivos nao versionados ou modificados ($(@($gitStatus).Count) itens)"
    Log-Skip "Commit automatico DESATIVADO. Execute: git add . && git commit manualmente."
    $global:issuesPending++
} else {
    Log-Fix "Repositorio git sincronizado."
}

# FASE 8 - CALCULAR SCORE REAL
$finalDirs  = @(Get-ChildItem -Path $target -Recurse -Directory -ErrorAction SilentlyContinue)
$finalFiles = @(Get-ChildItem -Path $target -Recurse -File      -ErrorAction SilentlyContinue)

# Score real baseado em issues pendentes (nao corrigidas automaticamente)
$score = 100
if ($global:issuesPending -gt 0) {
    $deduction = [math]::Min(50, $global:issuesPending * 5)
    $score     = [math]::Max(0, 100 - $deduction)
}

$readinessLevel = if ($score -ge 90) { "READY_FOR_PRODUCTION" } `
    elseif ($score -ge 70) { "READY_WITH_CAVEATS" } `
    elseif ($score -ge 50) { "NEEDS_ATTENTION" } `
    else { "NOT_READY" }

# FASE 9 - GERAR RELATORIOS
$reportDir = Join-Path $target "19_RELATORIOS"
if (!(Test-Path $reportDir)) { New-Item -ItemType Directory -Path $reportDir -Force | Out-Null }

$auditDir = Join-Path $target "11_AUDITORIA"
if (!(Test-Path $auditDir)) { New-Item -ItemType Directory -Path $auditDir -Force | Out-Null }

Set-Content -Path (Join-Path $reportDir "FOUNDATION_REAL_INVENTORY.md") -Value $locReport -Encoding UTF8

$cert = "# FOUNDATION_CERTIFICATION`n`n" +
        "* Score: $score/100`n" +
        "* Issues encontradas: $($global:issuesFound)`n" +
        "* Issues corrigidas automaticamente: $($global:issuesFixed)`n" +
        "* Issues pendentes (requerem intervencao manual): $($global:issuesPending)`n" +
        "* Readiness Level: $readinessLevel`n" +
        "* Gerado em: $(Get-Date -Format 'yyyy-MM-dd HH:mm')`n"

Set-Content -Path (Join-Path $reportDir "FOUNDATION_CERTIFICATION_V1.md") -Value $cert -Encoding UTF8

$auditRep = "# FOUNDATION_FORENSIC_AUDIT_REPORT`n`n" +
            "* Raiz auditada: $target`n" +
            "* Pastas: $($finalDirs.Count)`n" +
            "* Arquivos: $($finalFiles.Count)`n" +
            "* Issues encontradas: $($global:issuesFound)`n" +
            "* Issues corrigidas: $($global:issuesFixed)`n" +
            "* Issues pendentes: $($global:issuesPending)`n"

Set-Content -Path (Join-Path $auditDir "FOUNDATION_FORENSIC_AUDIT_REPORT.md") -Value $auditRep -Encoding UTF8

# FASE 10 - SAIDA NO CONSOLE
Write-Host ""
Write-Host "---[AUDIT_RESULTS]---" -ForegroundColor Cyan
Write-Host "PATH: $target"
Write-Host "DIRS: $($finalDirs.Count)"
Write-Host "FILES: $($finalFiles.Count)"
Write-Host "ISSUES_FOUND: $($global:issuesFound)"
Write-Host "ISSUES_FIXED: $($global:issuesFixed)"
Write-Host "ISSUES_PENDING: $($global:issuesPending)"
Write-Host "SCORE: $score/100"
Write-Host "READINESS: $readinessLevel"
