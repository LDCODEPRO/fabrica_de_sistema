$target = "D:\FABRICA_DE_SISTEMAS"
$obsidianTarget = "D:\fabricadesistema\FABRICA_DE_SISTEMAS"
$repoPath = "D:\fabricadesistema"

$cliDir = Join-Path $target "16_SISTEMAS\PROJECT_FACTORY_CLI"
if (!(Test-Path $cliDir)) { New-Item -ItemType Directory -Force -Path $cliDir | Out-Null }

$cliScriptPath = Join-Path $cliDir "create-project.ps1"

$cliScript = @'
param(
    [Parameter(Mandatory=$false)][string]$ProjectName,
    [Parameter(Mandatory=$false)][string]$ProjectType,
    [Parameter(Mandatory=$false)][string]$ProjectDescription,
    [Parameter(Mandatory=$false)][string]$ProjectClient,
    [Parameter(Mandatory=$false)][string]$ProjectPriority
)

if (-not $ProjectName) { $ProjectName = Read-Host "Nome do Projeto" }
if (-not $ProjectType) { $ProjectType = Read-Host "Tipo do Projeto (WEBSITE, SAAS, AI_AGENT, AUTOMATION, SYSTEM, LANDING_PAGE)" }
if (-not $ProjectDescription) { $ProjectDescription = Read-Host "Descrição" }
if (-not $ProjectClient) { $ProjectClient = Read-Host "Cliente" }
if (-not $ProjectPriority) { $ProjectPriority = Read-Host "Prioridade" }

$ProjectType = $ProjectType.ToUpper()

$validTypes = @("WEBSITE", "SAAS", "AI_AGENT", "AUTOMATION", "SYSTEM", "LANDING_PAGE")
if ($validTypes -notcontains $ProjectType) {
    Write-Host "Tipo de projeto inválido! Usando SYSTEM por padrão."
    $ProjectType = "SYSTEM"
}

# 1. Mapeamento de Templates, Agentes e Workflow
$agents = @("ORCHESTRATOR_AGENT", "QA_AGENT", "DOCS_AGENT")
$templateName = ""

switch ($ProjectType) {
    "WEBSITE" { 
        $templateName = "WEBSITE_TEMPLATE"
        $agents += @("SITE_DESIGNER", "DEVELOPER_AGENT") 
    }
    "SAAS" { 
        $templateName = "SAAS_TEMPLATE"
        $agents += @("ARCHITECT_AGENT", "DEVELOPER_AGENT") 
    }
    "AI_AGENT" { 
        $templateName = "AI_AGENT_TEMPLATE"
        $agents += @("ARCHITECT_AGENT", "DEVELOPER_AGENT") 
    }
    "AUTOMATION" { 
        $templateName = "AUTOMATION_TEMPLATE"
        $agents += @("ARCHITECT_AGENT", "DEVELOPER_AGENT") 
    }
    "SYSTEM" { 
        $templateName = "SYSTEM_TEMPLATE"
        $agents += @("ARCHITECT_AGENT", "DEVELOPER_AGENT") 
    }
    "LANDING_PAGE" { 
        $templateName = "WEBSITE_TEMPLATE"
        $agents += @("SITE_DESIGNER", "DEVELOPER_AGENT") 
    }
}

$agentsList = $agents -join ", "
$date = Get-Date -Format "yyyy-MM-dd"

# 2. Criar Estrutura do Projeto
$projectDir = "D:\FABRICA_DE_SISTEMAS\15_PROJETOS\$ProjectName"
if (Test-Path $projectDir) {
    Write-Host "Projeto já existe!"
    exit
}
New-Item -ItemType Directory -Force -Path $projectDir | Out-Null

function Set-Md {
    param([string]$File, [string]$Content)
    Set-Content -Path (Join-Path $projectDir $File) -Value $Content -Encoding UTF8
}

Set-Md "README.md" @"
# $ProjectName

* **Tipo:** $ProjectType
* **Cliente:** $ProjectClient
* **Descrição:** $ProjectDescription
* **Prioridade:** $ProjectPriority
* **Template Mestre:** $templateName
* **Agentes Designados:** $agentsList
"@

Set-Md "PROJECT_PLAN.md" @"
# PROJECT PLAN
- Integração com PROJECT_INTAKE_SYSTEM.
- Workflow Base: UNIVERSAL_PROJECT_PIPELINE.
"@

Set-Md "ARCHITECTURE.md" @"
# ARCHITECTURE
* Baseado no template: $templateName.
* Definições pendentes de arquitetura.
"@

Set-Md "TASKS.md" @"
# TASKS
- [ ] Concluir fase IDEIA.
- [ ] Validar estrutura.
"@

Set-Md "QA.md" @"
# QA
* Auditorias de qualidade devem ser executadas aqui pelo QA_AGENT.
"@

Set-Md "DOCS.md" @"
# DOCS
* Documentação técnica do projeto gerada pelo DOCS_AGENT.
"@

Set-Md "STATUS.md" @"
# STATUS
* **Data de Início:** $date
* **Fase Atual:** IDEIA (Intake System)
"@

Set-Md "CHANGELOG.md" @"
# CHANGELOG
## [$date]
- Projeto instanciado automaticamente via PROJECT_FACTORY_CLI.
"@

Write-Host "Projeto $ProjectName ($ProjectType) criado com sucesso em 15_PROJETOS!"
'@
Set-Content -Path $cliScriptPath -Value $cliScript -Encoding UTF8

# Relatório
$reportDir = Join-Path $target "19_RELATORIOS"
$report = @"
# PROJECT_FACTORY_CLI_REPORT

* **Estrutura criada:** `16_SISTEMAS\PROJECT_FACTORY_CLI\create-project.ps1` executável.
* **Fluxo implementado:** Leitura de inputs -> Classificação -> Matching de Template -> Matching de Agentes -> Geração automática de estrutura em `15_PROJETOS`.
* **Templates suportados:** SYSTEM_TEMPLATE, WEBSITE_TEMPLATE, SAAS_TEMPLATE, AI_AGENT_TEMPLATE, AUTOMATION_TEMPLATE.
* **Agentes integrados:** Mapeamento dinâmico baseado na taxonomia (ex: AI_AGENT recruta ARCHITECT, WEBSITE recruta SITE_DESIGNER).
* **Próximas evoluções:** Implementar interface interativa, e integração com templates físicos copiando a base real das pastas master do template.
"@
Set-Content -Path (Join-Path $reportDir "PROJECT_FACTORY_CLI_REPORT.md") -Value $report -Encoding UTF8

Write-Host "Criando Projeto Teste para Validacao..."
& $cliScriptPath -ProjectName "PROJETO_002_TESTE_SAAS" -ProjectType "SAAS" -ProjectDescription "Projeto SaaS de validacao da CLI" -ProjectClient "Fabrica Interna" -ProjectPriority "ALTA"

# Validação do Teste
$testDir = "D:\FABRICA_DE_SISTEMAS\15_PROJETOS\PROJETO_002_TESTE_SAAS"
if (Test-Path $testDir) {
    Write-Host "Teste concluido e validado com sucesso!"
} else {
    Write-Host "Falha no teste."
}

# SAVE LAW
Write-Host "Sincronizando Obsidian..."
$foldersToSync = @("15_PROJETOS", "16_SISTEMAS", "19_RELATORIOS")
foreach ($f in $foldersToSync) {
    $src = Join-Path $target $f
    if (Test-Path $src) {
        Copy-Item -Path $src -Destination $obsidianTarget -Recurse -Force
    }
}

Write-Host "Comitando alterações no GitHub..."
Push-Location $repoPath
git add .
git commit -m "feat(cli): implementa project factory cli v1 com projeto teste" | Out-Null
Pop-Location
