param(
    [Parameter(Mandatory=$false)][string]$ProjectName,
    [Parameter(Mandatory=$false)][switch]$Force,
    # Raiz da Fabrica (detectada automaticamente se omitida)
    [Parameter(Mandatory=$false)][string]$RootPath = ""
)

# ============================================================
# PROJECT_ORCHESTRATOR V1
# Lê um projeto criado pela PROJECT_FACTORY_CLI e gera missões
# automáticas para cada agente atribuído.
# ============================================================

# Resolucao dinamica de caminhos
# PSScriptRoot = 16_SISTEMAS\PROJECT_ORCHESTRATOR -> dois niveis acima = FABRICA_DE_SISTEMAS
if (-not $RootPath) {
    $RootPath = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
}
if (-not (Test-Path $RootPath)) {
    Write-Host "[ERRO] Raiz da Fabrica nao encontrada: $RootPath" -ForegroundColor Red
    exit 1
}

$PROJECTS_BASE    = Join-Path $RootPath "15_PROJETOS"
$ORCHESTRATOR_DIR = $PSScriptRoot
$TEMPLATES_DIR    = Join-Path $ORCHESTRATOR_DIR "templates"
$DATE = Get-Date -Format "yyyy-MM-dd"
$TIMESTAMP = Get-Date -Format "yyyy-MM-dd HH:mm"

# --- Selecionar projeto ---
if (-not $ProjectName) {
    $available = Get-ChildItem -Path $PROJECTS_BASE -Directory | Where-Object { $_.Name -ne "PROJETO_MODELO" } | Select-Object -ExpandProperty Name
    if ($available.Count -eq 0) {
        Write-Host "[ERRO] Nenhum projeto encontrado em $PROJECTS_BASE" -ForegroundColor Red
        exit 1
    }
    Write-Host "`n=== PROJECT_ORCHESTRATOR V1 ===" -ForegroundColor Cyan
    Write-Host "`nProjetos disponíveis:" -ForegroundColor Yellow
    $available | ForEach-Object { Write-Host "  - $_" }
    $ProjectName = Read-Host "`nNome do projeto a orquestrar"
}

$projectDir = Join-Path $PROJECTS_BASE $ProjectName
if (-not (Test-Path $projectDir)) {
    Write-Host "[ERRO] Projeto '$ProjectName' não encontrado em $PROJECTS_BASE" -ForegroundColor Red
    exit 1
}

$readmePath = Join-Path $projectDir "README.md"
if (-not (Test-Path $readmePath)) {
    Write-Host "[ERRO] README.md não encontrado no projeto '$ProjectName'" -ForegroundColor Red
    exit 1
}

# --- Ler metadados do README.md (UTF-8 seguro) ---
$readme = [System.IO.File]::ReadAllText($readmePath, [System.Text.Encoding]::UTF8)

function Extract-Field {
    param([string]$Content, [string]$Field)
    # Suporta tanto **Campo:** valor quanto **Campo**: valor
    $p1 = "\*\*" + $Field + ":\*\*\s*(.+)"
    $p2 = "\*\*" + $Field + "\*\*:\s*(.+)"
    if ($Content -match $p1 -or $Content -match $p2) {
        return $Matches[1].Trim()
    }
    return "NAO DEFINIDO"
}

$projectType     = Extract-Field $readme "Tipo"
$projectClient   = Extract-Field $readme "Cliente"
$projectDesc     = Extract-Field $readme "Descricao"
if ($projectDesc -eq "NAO DEFINIDO") { $projectDesc = Extract-Field $readme "Descrição" }
$projectPriority = Extract-Field $readme "Prioridade"
$projectTemplate = Extract-Field $readme "Template Mestre"
$agentsRaw       = Extract-Field $readme "Agentes Designados"

# Normalizar lista de agentes
$agents = $agentsRaw -split "," | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" }

Write-Host "`n[OK] Projeto lido: $ProjectName" -ForegroundColor Green
Write-Host "     Tipo: $projectType | Template: $projectTemplate | Agentes: $($agents.Count)"

# --- Verificar missões já geradas ---
$missionBoard = Join-Path $projectDir "MISSION_BOARD.md"
if ((Test-Path $missionBoard) -and -not $Force) {
    Write-Host "[AVISO] Missões já foram geradas para '$ProjectName'. Use -Force para regenerar." -ForegroundColor Yellow
    exit 0
}

# ============================================================
# Mapeamento de workflow por tipo de projeto
# ============================================================
$workflowMap = @{
    "WEBSITE"     = "WEBSITE_PIPELINE: Intake → Design → Desenvolvimento → QA → Deploy"
    "SAAS"        = "SAAS_PIPELINE: Intake → Arquitetura → Desenvolvimento → QA → Deploy → Docs"
    "AI_AGENT"    = "AI_AGENT_PIPELINE: Intake → Arquitetura → Desenvolvimento → Testes → Deploy → Docs"
    "AUTOMATION"  = "AUTOMATION_PIPELINE: Intake → Arquitetura → Script → QA → Deploy"
    "SYSTEM"      = "SYSTEM_PIPELINE: Intake → Arquitetura → Desenvolvimento → QA → Deploy → Docs"
    "LANDING_PAGE"= "LANDING_PAGE_PIPELINE: Intake → Design → Desenvolvimento → QA → Deploy"
}
$workflow = if ($workflowMap.ContainsKey($projectType)) { $workflowMap[$projectType] } else { "UNIVERSAL_PROJECT_PIPELINE" }

# ============================================================
# Helper: gravar arquivo de missão
# ============================================================
function Write-Mission {
    param([string]$FileName, [string]$Content)
    $path = Join-Path $projectDir $FileName
    Set-Content -Path $path -Value $Content -Encoding UTF8
    Write-Host "  [+] $FileName gerado." -ForegroundColor Green
}

# ============================================================
# MISSION_BOARD.md
# ============================================================
$agentsList = $agents -join " | "

# Montar linhas da tabela de agentes antes do here-string
$agentTableRows = ($agents | ForEach-Object {
    $agentName = $_
    $missionFile = switch -Wildcard ($agentName) {
        "*ANALYST*"    { "ANALYST_TASK.md" }
        "*ARCHITECT*"  { "ARCHITECT_TASK.md" }
        "*DEVELOPER*"  { "DEVELOPER_TASK.md" }
        "*QA*"         { "QA_TASK.md" }
        "*DOCS*"       { "DOCS_TASK.md" }
        "*ORCHESTRAT*" { "-- (Coordenacao)" }
        "*DESIGNER*"   { "DESIGNER_TASK.md" }
        default        { "TASK_$agentName.md" }
    }
    "| $agentName | $missionFile | AGUARDANDO |"
}) -join "`n"

$missionBoardContent = @"
# MISSION BOARD — $ProjectName

| Campo              | Valor                                                                |
|--------------------|----------------------------------------------------------------------|
| **Projeto**        | $ProjectName                                                         |
| **Tipo**           | $projectType                                                         |
| **Cliente**        | $projectClient                                                       |
| **Prioridade**     | $projectPriority                                                     |
| **Template**       | $projectTemplate                                                     |
| **Workflow**       | $workflow                                                            |
| **Status**         | EM ORQUESTRACAO                                                      |
| **Etapa Atual**    | MISSOES GERADAS                                                      |
| **Proxima Etapa**  | EXECUCAO DOS AGENTES                                                 |
| **Bloqueios**      | Nenhum                                                               |
| **Data Criacao**   | $TIMESTAMP                                                           |

---

## Agentes Designados

| Agente              | Missao                  | Status     |
|---------------------|-------------------------|------------|
$agentTableRows

---

## Workflow

``````
$workflow
``````

## Log de Orquestracao

- [$TIMESTAMP] Projeto recebido pelo PROJECT_ORCHESTRATOR.
- [$TIMESTAMP] Metadados lidos com sucesso.
- [$TIMESTAMP] Missoes geradas para $($agents.Count) agentes.
- [$TIMESTAMP] Status: PRONTO PARA EXECUCAO.
"@

Write-Mission "MISSION_BOARD.md" $missionBoardContent

# ============================================================
# Geração condicional de missões por agente
# ============================================================
Write-Host "`n[GERANDO MISSÕES...]" -ForegroundColor Cyan

foreach ($agent in $agents) {
    switch -Wildcard ($agent) {

        "*ANALYST*" {
            Write-Mission "ANALYST_TASK.md" @"
# ANALYST_TASK — $ProjectName

**Agente:** ANALYST_AGENT
**Projeto:** $ProjectName
**Tipo:** $projectType
**Cliente:** $projectClient
**Data:** $DATE

---

## Missão

Analisar os requisitos do projeto e produzir um documento de análise completo.

## Entradas

- README.md (visão geral)
- PROJECT_PLAN.md (plano)
- Entrevista com stakeholders (se disponível)

## Tarefas

- [ ] Levantar requisitos funcionais
- [ ] Levantar requisitos não-funcionais
- [ ] Identificar riscos e dependências
- [ ] Definir critérios de aceitação
- [ ] Documentar premissas do projeto

## Saída Esperada

- ANALYSIS_REPORT.md com requisitos, riscos e critérios de aceitação.

## Status

AGUARDANDO
"@
        }

        "*ARCHITECT*" {
            Write-Mission "ARCHITECT_TASK.md" @"
# ARCHITECT_TASK — $ProjectName

**Agente:** ARCHITECT_AGENT
**Projeto:** $ProjectName
**Tipo:** $projectType
**Template:** $projectTemplate
**Data:** $DATE

---

## Missão

Definir a arquitetura técnica do projeto com base no tipo e template.

## Entradas

- README.md
- ARCHITECTURE.md (rascunho)
- Template: $projectTemplate

## Tarefas

- [ ] Definir stack tecnológica
- [ ] Desenhar arquitetura de alto nível
- [ ] Definir estrutura de pastas e módulos
- [ ] Especificar integrações externas
- [ ] Validar escalabilidade e segurança
- [ ] Documentar decisões arquiteturais (ADR)

## Saída Esperada

- ARCHITECTURE.md atualizado com diagrama e decisões.
- ADR.md com registros de decisão.

## Status

AGUARDANDO
"@
        }

        "*DEVELOPER*" {
            Write-Mission "DEVELOPER_TASK.md" @"
# DEVELOPER_TASK — $ProjectName

**Agente:** DEVELOPER_AGENT
**Projeto:** $ProjectName
**Tipo:** $projectType
**Template:** $projectTemplate
**Data:** $DATE

---

## Missão

Implementar o projeto conforme arquitetura definida pelo ARCHITECT_AGENT.

## Entradas

- ARCHITECTURE.md (aprovado)
- TASKS.md
- PROJECT_PLAN.md

## Tarefas

- [ ] Configurar ambiente de desenvolvimento
- [ ] Implementar estrutura base (scaffolding)
- [ ] Desenvolver funcionalidades core
- [ ] Escrever testes unitários
- [ ] Integrar componentes externos
- [ ] Preparar build para QA

## Saída Esperada

- Código-fonte implementado e testável.
- CHANGELOG.md atualizado.
- TASKS.md com progresso registrado.

## Status

AGUARDANDO
"@
        }

        "*QA*" {
            Write-Mission "QA_TASK.md" @"
# QA_TASK — $ProjectName

**Agente:** QA_AGENT
**Projeto:** $ProjectName
**Tipo:** $projectType
**Data:** $DATE

---

## Missão

Garantir a qualidade do projeto através de testes e auditorias.

## Entradas

- Código entregue pelo DEVELOPER_AGENT
- ARCHITECTURE.md
- Critérios de aceitação do ANALYST_TASK.md (se disponível)

## Tarefas

- [ ] Revisar código-fonte
- [ ] Executar testes funcionais
- [ ] Executar testes de regressão
- [ ] Validar contra critérios de aceitação
- [ ] Reportar bugs e bloqueios
- [ ] Emitir aprovação ou rejeição

## Saída Esperada

- QA.md atualizado com resultados dos testes.
- Lista de bugs (se houver) em QA_BUGS.md.
- Status: APROVADO ou REPROVADO.

## Status

AGUARDANDO
"@
        }

        "*DOCS*" {
            Write-Mission "DOCS_TASK.md" @"
# DOCS_TASK — $ProjectName

**Agente:** DOCS_AGENT
**Projeto:** $ProjectName
**Tipo:** $projectType
**Data:** $DATE

---

## Missão

Produzir documentação técnica e de usuário para o projeto.

## Entradas

- ARCHITECTURE.md
- Código-fonte (após aprovação do QA)
- README.md

## Tarefas

- [ ] Documentar API/interfaces (se aplicável)
- [ ] Criar guia de instalação e configuração
- [ ] Criar guia de uso
- [ ] Documentar variáveis de ambiente
- [ ] Gerar CHANGELOG final
- [ ] Revisar README.md para produção

## Saída Esperada

- DOCS.md completo e revisado.
- README.md finalizado para produção.

## Status

AGUARDANDO
"@
        }

        "*DESIGNER*" {
            Write-Mission "DESIGNER_TASK.md" @"
# DESIGNER_TASK — $ProjectName

**Agente:** SITE_DESIGNER / DESIGNER_AGENT
**Projeto:** $ProjectName
**Tipo:** $projectType
**Data:** $DATE

---

## Missão

Definir identidade visual e protótipos do projeto.

## Entradas

- README.md (briefing)
- Referências visuais do cliente (se disponível)

## Tarefas

- [ ] Definir paleta de cores e tipografia
- [ ] Criar wireframes das telas principais
- [ ] Criar protótipo navegável
- [ ] Validar identidade visual com cliente
- [ ] Exportar assets para o DEVELOPER_AGENT

## Saída Esperada

- DESIGN.md com decisões visuais.
- Assets exportados prontos para desenvolvimento.

## Status

AGUARDANDO
"@
        }

    }
}

# ============================================================
# Atualizar STATUS.md
# ============================================================
$statusPath = Join-Path $projectDir "STATUS.md"
$statusContent = if (Test-Path $statusPath) { Get-Content $statusPath -Raw } else { "# STATUS`n" }
$statusContent += "`n`n## Orquestração`n- [$TIMESTAMP] PROJECT_ORCHESTRATOR executado. Missões geradas para $($agents.Count) agentes."
Set-Content -Path $statusPath -Value $statusContent -Encoding UTF8

# ============================================================
# Resultado final
# ============================================================
Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host " PROJECT_ORCHESTRATOR — CONCLUÍDO" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host " Projeto   : $ProjectName"
Write-Host " Tipo      : $projectType"
Write-Host " Agentes   : $($agents.Count) designados"
Write-Host " Missões   : geradas em $projectDir"
Write-Host " Board     : MISSION_BOARD.md"
Write-Host "=====================================" -ForegroundColor Cyan
