param(
    [Parameter(Mandatory=$false)][string]$ProjectName,
    [Parameter(Mandatory=$false)][string]$ProjectType,
    [Parameter(Mandatory=$false)][string]$ProjectDescription,
    [Parameter(Mandatory=$false)][string]$ProjectClient,
    [Parameter(Mandatory=$false)][string]$ProjectPriority
)

if (-not $ProjectName) { $ProjectName = Read-Host "Nome do Projeto" }
if (-not $ProjectType) { $ProjectType = Read-Host "Tipo do Projeto (WEBSITE, SAAS, AI_AGENT, AUTOMATION, SYSTEM, LANDING_PAGE)" }
if (-not $ProjectDescription) { $ProjectDescription = Read-Host "DescriÃ§Ã£o" }
if (-not $ProjectClient) { $ProjectClient = Read-Host "Cliente" }
if (-not $ProjectPriority) { $ProjectPriority = Read-Host "Prioridade" }

$ProjectType = $ProjectType.ToUpper()

$validTypes = @("WEBSITE", "SAAS", "AI_AGENT", "AUTOMATION", "SYSTEM", "LANDING_PAGE")
if ($validTypes -notcontains $ProjectType) {
    Write-Host "Tipo de projeto invÃ¡lido! Usando SYSTEM por padrÃ£o."
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
    Write-Host "Projeto jÃ¡ existe!"
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
* **DescriÃ§Ã£o:** $ProjectDescription
* **Prioridade:** $ProjectPriority
* **Template Mestre:** $templateName
* **Agentes Designados:** $agentsList
"@

Set-Md "PROJECT_PLAN.md" @"
# PROJECT PLAN
- IntegraÃ§Ã£o com PROJECT_INTAKE_SYSTEM.
- Workflow Base: UNIVERSAL_PROJECT_PIPELINE.
"@

Set-Md "ARCHITECTURE.md" @"
# ARCHITECTURE
* Baseado no template: $templateName.
* DefiniÃ§Ãµes pendentes de arquitetura.
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
* DocumentaÃ§Ã£o tÃ©cnica do projeto gerada pelo DOCS_AGENT.
"@

Set-Md "STATUS.md" @"
# STATUS
* **Data de InÃ­cio:** $date
* **Fase Atual:** IDEIA (Intake System)
"@

Set-Md "CHANGELOG.md" @"
# CHANGELOG
## [$date]
- Projeto instanciado automaticamente via PROJECT_FACTORY_CLI.
"@

Write-Host "Projeto $ProjectName ($ProjectType) criado com sucesso em 15_PROJETOS!"
