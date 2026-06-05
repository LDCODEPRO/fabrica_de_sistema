# 10_OPERATIONS

Scripts operacionais e de manutencao da Fabrica de Sistemas.

## Scripts disponiveis

| Script | Funcao |
|---|---|
| `audit_and_repair.ps1` | Audita a estrutura. Score real calculado, sem forja. |
| `build_foundation.ps1` | Constroi a estrutura base de pastas e arquivos. |
| `evolve_foundation.ps1` | Evolui a fundacao com novos componentes. |
| `setup_intake.ps1` | Configura o PROJECT_INTAKE_SYSTEM. |
| `setup_cli.ps1` | Configura o PROJECT_FACTORY_CLI. |
| `refactor.ps1` | Refatora PROJETO_001_LDCODE para arquitetura SoC. |
| `generate_reports.ps1` | Gera relatorios do PROJETO_001_LDCODE. |

Todos os scripts usam $PSScriptRoot — portaveis, sem paths hardcoded.
