$target = $PSScriptRoot; if ([string]::IsNullOrWhiteSpace($target)) { $target = (Get-Location).Path }
$obsidianTarget = $target
$repoPath = $target

$intakeDir = Join-Path $target "16_SISTEMAS\PROJECT_INTAKE_SYSTEM"
if (!(Test-Path $intakeDir)) {
    New-Item -ItemType Directory -Force -Path $intakeDir | Out-Null
}

function Create-Md {
    param([string]$Path, [string]$Title, [string]$Content)
    $md = "# $Title`n`n$Content"
    Set-Content -Path $Path -Value $md -Encoding UTF8
}

$classifier = @"
## Classificação Automática de Projetos

Todo projeto entrante deve ser classificado em uma das seguintes categorias com base em suas características principais:

1. **WEBSITE:** Sites institucionais, blogs, portfólios.
2. **SAAS:** Software as a Service, sistemas com assinatura, multi-tenant.
3. **AI_AGENT:** Agentes autônomos, integrações com LLMs, automações inteligentes cognitivas.
4. **AUTOMATION:** Scripts, web scrapers, integrações via API (n8n, Zapier).
5. **SYSTEM:** Sistemas internos, ERPs, CRMs, painéis de controle complexos.
6. **LANDING_PAGE:** Páginas de conversão de página única, focadas em marketing.

*O Classificador define automaticamente o Template, o Workflow e os Agentes requeridos.*
"@
Create-Md -Path (Join-Path $intakeDir "PROJECT_CLASSIFIER.md") -Title "PROJECT CLASSIFIER" -Content $classifier

$workflow = @"
## Fluxo de Entrada Oficial (Intake Workflow)

1. **IDEIA:** Recebimento do briefing ou solicitação bruta.
2. **CLASSIFICAÇÃO:** Avaliação pelo `PROJECT_CLASSIFIER` (Definir o tipo de projeto).
3. **ESCOLHA DE TEMPLATE:** Seleção em `07_TEMPLATES` baseada na classificação.
4. **CRIAÇÃO DE PROJETO:** Instanciação da pasta do projeto em `15_PROJETOS`.
5. **DESIGNAÇÃO DE AGENTES:** Atribuição dos agentes necessários via `AGENTS_HIERARCHY`.
6. **INÍCIO DO PIPELINE:** Passagem de bastão para o `UNIVERSAL_PROJECT_PIPELINE`.
"@
Create-Md -Path (Join-Path $intakeDir "PROJECT_INTAKE_WORKFLOW.md") -Title "PROJECT INTAKE WORKFLOW" -Content $workflow

$checklist = @"
## Checklist de Admissão de Projeto

- [ ] Ideia/Briefing preenchido no Form.
- [ ] Projeto classificado com sucesso.
- [ ] Template mestre copiado e instanciado.
- [ ] Repositório/Pasta base criada em 15_PROJETOS.
- [ ] Agentes alocados (Ex: PROJECT_MANAGER, ARCHITECT, DEVELOPER, QA).
- [ ] Protocolo de Criação assinado.
- [ ] Passagem para a fase IDEIA do Universal Pipeline concluída.
"@
Create-Md -Path (Join-Path $intakeDir "PROJECT_INTAKE_CHECKLIST.md") -Title "PROJECT INTAKE CHECKLIST" -Content $checklist

$form = @"
## Formulário de Entrada de Projeto (Briefing)

* **Nome do Projeto:** [Nome]
* **Cliente/Solicitante:** [Nome/Departamento]
* **Objetivo Principal:** [O que o sistema deve fazer]
* **Público Alvo:** [Quem vai usar]
* **Escopo Inicial:** [Requisitos Mínimos]
* **Tecnologias Desejadas:** [Ex: Node, React, Python]
* **Prazo/Urgência:** [Data]
"@
Create-Md -Path (Join-Path $intakeDir "PROJECT_INTAKE_FORM.md") -Title "PROJECT INTAKE FORM" -Content $form

$protocol = @"
## Protocolo Oficial de Criação de Projetos

Nenhum projeto entra diretamente em produção. Todo e qualquer novo repositório ou pasta de código na Fábrica deve obrigatoriamente ser instanciado através deste Intake System.

* **Regra 1:** Zero código antes da classificação.
* **Regra 2:** Template obrigatório. Nenhum projeto começa vazio.
* **Regra 3:** Todo projeto deve ter um Agente Gerente alocado desde o Dia 1.
"@
Create-Md -Path (Join-Path $intakeDir "PROJECT_CREATION_PROTOCOL.md") -Title "PROJECT CREATION PROTOCOL" -Content $protocol

$assignment = @"
## Regras de Designação de Agentes

Dependendo da classificação, os agentes são atribuídos conforme abaixo:

* **WEBSITE/LANDING_PAGE:** SITE_DESIGNER, DEVELOPER_AGENT, QA_AGENT, DOCS_AGENT.
* **SAAS/SYSTEM:** ARCHITECT_AGENT, DEVELOPER_AGENT, QA_AGENT, DOCS_AGENT.
* **AI_AGENT/AUTOMATION:** ARCHITECT_AGENT, DEVELOPER_AGENT (Foco em Integração), QA_AGENT.
* *Todos os projetos* recebem um ORCHESTRATOR_AGENT ou PROJECT_MANAGER.
"@
Create-Md -Path (Join-Path $intakeDir "PROJECT_ASSIGNMENT_RULES.md") -Title "PROJECT ASSIGNMENT RULES" -Content $assignment

# Relatório Final
$reportDir = Join-Path $target "19_RELATORIOS"
$report = @"
# PROJECT_INTAKE_SYSTEM_REPORT

**1. Estrutura criada:**
Pasta raiz `16_SISTEMAS\PROJECT_INTAKE_SYSTEM` estabelecida, contendo 6 documentos oficiais de regulação.

**2. Fluxo definido:**
IDEIA -> CLASSIFICAÇÃO -> ESCOLHA DE TEMPLATE -> CRIAÇÃO DE PROJETO -> DESIGNAÇÃO DE AGENTES -> INÍCIO DO PIPELINE.

**3. Regras criadas:**
* Project Creation Protocol: Impede que qualquer código seja iniciado sem passar pela triagem.
* Project Assignment Rules: Define a locação automática de agentes conforme o tipo de projeto.

**4. Templates suportados:**
WEBSITE, SAAS, AI_AGENT, AUTOMATION, SYSTEM, LANDING_PAGE.

**5. Agentes envolvidos:**
ORCHESTRATOR_AGENT (ou Project Manager), ARCHITECT_AGENT, DEVELOPER_AGENT, SITE_DESIGNER, QA_AGENT, DOCS_AGENT.

**6. Próxima evolução recomendada:**
Criar um script de CLI (Command Line Interface) ou automação (Ex: `npm run create-project`) que leia o Intake Form e instancie as pastas físicas e repositórios automaticamente baseado nas respostas, eliminando o setup manual.
"@
Create-Md -Path (Join-Path $reportDir "PROJECT_INTAKE_SYSTEM_REPORT.md") -Title "PROJECT INTAKE SYSTEM REPORT" -Content $report

# FASE 9 - SAVE LAW (GIT e OBSIDIAN)
Write-Host "Sincronizando Obsidian..."
$foldersToSync = @("16_SISTEMAS", "19_RELATORIOS")
foreach ($f in $foldersToSync) {
    $src = Join-Path $target $f
    if (Test-Path $src) {
        Copy-Item -Path $src -Destination $obsidianTarget -Recurse -Force
    }
}

Write-Host "Comitando alterações no GitHub..."
Push-Location $repoPath
git config user.email "sistema@fabricadesistemas.com"
git config user.name "Fabrica De Sistemas"
git add .
git commit -m "feat(intake): implementa project intake system v1" | Out-Null
$gitStatus = git status
Pop-Location

Write-Host "Sistema de Intake concluído com sucesso."
