/* ============================================================
   FORJA — Factory OS · Camada de dados V2
   ============================================================ */
(function () {
  // ---- 7 cores ----
  const cores = [
    { id: 'foundation', nome: 'Fundação da Fábrica',    papel: 'Base operacional',          status: 'ok',   load: 0.34, uptime: '99.99%', ver: 'v4.2.1' },
    { id: 'operational', nome: 'Núcleo Operacional',    papel: 'Execução e coordenação',    status: 'ok',   load: 0.61, uptime: '99.97%', ver: 'v3.8.0' },
    { id: 'database',    nome: 'Banco Central',         papel: 'Dados e estado',            status: 'ok',   load: 0.48, uptime: '99.99%', ver: 'v5.1.2' },
    { id: 'knowledge',   nome: 'Central de Conhecimento', papel: 'Base de consulta',        status: 'warn', load: 0.79, uptime: '99.82%', ver: 'v2.6.4' },
    { id: 'agent',       nome: 'Equipe Inteligente',    papel: 'Execução assistida',        status: 'ok',   load: 0.55, uptime: '99.95%', ver: 'v3.0.7' },
    { id: 'router',      nome: 'Central de IA',         papel: 'Escolha de IA',             status: 'ok',   load: 0.42, uptime: '99.98%', ver: 'v1.9.3' },
    { id: 'factory',     nome: 'Fábrica de Projetos',   papel: 'Criação de sistemas',       status: 'ok',   load: 0.67, uptime: '99.91%', ver: 'v6.0.0' },
  ];

  // ---- serviços (status bar) ----
  const services = [
    { id: 'github',    nome: 'Repositório',      status: 'ok',   ping: '24ms' },
    { id: 'database',  nome: 'Banco Central',    status: 'ok',   ping: '8ms' },
    { id: 'fastapi',   nome: 'FastAPI',          status: 'ok',   ping: '12ms' },
    { id: 'router',    nome: 'Central de IA',    status: 'ok',   ping: '6ms' },
    { id: 'knowledge', nome: 'Conhecimento',     status: 'warn', ping: '482ms' },
    { id: 'mission',   nome: 'Missões',          status: 'ok',   ping: '14ms' },
    { id: 'ollama',    nome: 'Ollama',           status: 'idle', ping: '—' },
    { id: 'deploy',    nome: 'Publicação',       status: 'ok',   ping: '32ms' },
  ];

  // ---- projetos (V2 · prio, artefatos, agenteResp) ----
  const projetos = [
    { id: 'PRJ-001', nome: 'Portal Fábrica',       stack: 'Next.js · FastAPI · Postgres', status: 'building', prio: 'P1', prog: 72,  missoes: 14, agentes: 4, owner: 'A. Ramos', agenteResp: 'DESENVOLVEDOR',          artefatos: 412, atualizado: '3 min',  branch: 'agenda-v2',      cor: 'acc' },
    { id: 'PRJ-002', nome: 'ERP Forja',         stack: 'React · Django · Redis',       status: 'live',     prio: 'P3', prog: 100, missoes: 38, agentes: 2, owner: 'M. Costa', agenteResp: 'DESENVOLVEDOR',          artefatos: 1284,atualizado: '1 h',    branch: 'principal',      cor: 'ok' },
    { id: 'PRJ-003', nome: 'CRM Comercial',          stack: 'Vue · NestJS · Mongo',         status: 'review',   prio: 'P2', prog: 88,  missoes: 21, agentes: 3, owner: 'L. Dias',  agenteResp: 'ARQUITETO',              artefatos: 638, atualizado: '22 min', branch: 'versão-2.4',     cor: 'info' },
    { id: 'PRJ-004', nome: 'API Pagamentos',       stack: 'Go · gRPC · Postgres',         status: 'building', prio: 'P0', prog: 41,  missoes: 9,  agentes: 5, owner: 'J. Pinto', agenteResp: 'ARQUITETO',              artefatos: 218, atualizado: '8 min',  branch: 'pix',            cor: 'acc' },
    { id: 'PRJ-005', nome: 'Data Lake BI',         stack: 'Python · Airflow · DuckDB',    status: 'paused',   prio: 'P3', prog: 55,  missoes: 17, agentes: 0, owner: 'F. Lemos', agenteResp: 'ESPECIALISTA EM DADOS', artefatos: 304, atualizado: '2 d',    branch: 'etl',            cor: 'warn' },
    { id: 'PRJ-006', nome: 'Mobile Atendimento',   stack: 'React Native · Supabase',      status: 'building', prio: 'P2', prog: 63,  missoes: 12, agentes: 3, owner: 'C. Nunes', agenteResp: 'DESENVOLVEDOR',          artefatos: 256, atualizado: '14 min', branch: 'notificações',   cor: 'acc' },
    { id: 'PRJ-007', nome: 'Institucional',        stack: 'Astro · Tailwind',             status: 'live',     prio: 'P3', prog: 100, missoes: 6,  agentes: 1, owner: 'R. Alves', agenteResp: 'DESENVOLVEDOR',          artefatos: 84,  atualizado: '5 h',    branch: 'principal',      cor: 'ok' },
    { id: 'PRJ-008', nome: 'Acesso Único SSO',     stack: 'Rust · OAuth2 · Redis',        status: 'review',   prio: 'P1', prog: 91,  missoes: 11, agentes: 2, owner: 'T. Mota',  agenteResp: 'SEGURANÇA',              artefatos: 192, atualizado: '40 min', branch: 'versão-1.0',     cor: 'info' },
  ];

  // ---- missões (V2 · estados EN, llm, tempo) ----
  const MIS_STATES = ['PENDING','QUEUED','RUNNING','FAILED','COMPLETED'];
  const missoes = [
    { id: 'MIS-412', titulo: 'Gerar módulo de agendamento com horários dinâmicos', proj: 'PRJ-001', status: 'RUNNING',   prio: 'P1', agente: 'DESENVOLVEDOR',          llm: 'Claude Sonnet 4', tempo: '12 min', etapa: 4, etapas: 6, tags: ['estrutura','api'] },
    { id: 'MIS-411', titulo: 'Reorganizar repositórios para unidade de trabalho',  proj: 'PRJ-001', status: 'QUEUED',    prio: 'P2', agente: 'ARQUITETO',              llm: 'Claude Opus 4',    tempo: '—',      etapa: 6, etapas: 6, tags: ['revisão'] },
    { id: 'MIS-409', titulo: 'Integração PIX com recebimento idempotente',         proj: 'PRJ-004', status: 'RUNNING',   prio: 'P0', agente: 'ARQUITETO',              llm: 'Claude Opus 4',    tempo: '34 min', etapa: 2, etapas: 5, tags: ['pagamentos','crítico'] },
    { id: 'MIS-407', titulo: 'Testes ponta a ponta do fluxo de pagamento',         proj: 'PRJ-004', status: 'PENDING',   prio: 'P2', agente: 'AUDITOR',                llm: 'GPT-4o',           tempo: '—',      etapa: 0, etapas: 4, tags: ['qualidade','e2e'] },
    { id: 'MIS-404', titulo: 'Migrar busca semântica para índice HNSW',            proj: 'PRJ-003', status: 'FAILED',    prio: 'P1', agente: 'ESPECIALISTA EM DADOS', llm: 'Gemini 2.0 Pro',   tempo: '12 min', etapa: 1, etapas: 3, tags: ['conhecimento','infra'] },
    { id: 'MIS-401', titulo: 'Painel de métricas operacionais',                    proj: 'PRJ-002', status: 'COMPLETED', prio: 'P3', agente: 'DESENVOLVEDOR',          llm: 'Claude Sonnet 4', tempo: '47 min', etapa: 5, etapas: 5, tags: ['interface'] },
    { id: 'MIS-398', titulo: 'Notificações para iOS e Android',                    proj: 'PRJ-006', status: 'RUNNING',   prio: 'P2', agente: 'DESENVOLVEDOR',          llm: 'Claude Sonnet 4', tempo: '18 min', etapa: 3, etapas: 4, tags: ['mobile'] },
    { id: 'MIS-395', titulo: 'Reforço de SSO e rotação de chaves',                 proj: 'PRJ-008', status: 'QUEUED',    prio: 'P1', agente: 'SEGURANÇA',              llm: 'Claude Sonnet 4', tempo: '—',      etapa: 4, etapas: 4, tags: ['segurança'] },
    { id: 'MIS-390', titulo: 'Carga incremental noturna de dados',                 proj: 'PRJ-005', status: 'PENDING',   prio: 'P3', agente: 'ESPECIALISTA EM DADOS', llm: 'DeepSeek V3',      tempo: '—',      etapa: 0, etapas: 5, tags: ['dados'] },
    { id: 'MIS-388', titulo: 'Otimizar pacote e carregamento da página',           proj: 'PRJ-007', status: 'COMPLETED', prio: 'P3', agente: 'DESENVOLVEDOR',          llm: 'Claude Sonnet 4', tempo: '8 min',  etapa: 3, etapas: 3, tags: ['performance'] },
    { id: 'MIS-385', titulo: 'Componente de agenda acessível',                     proj: 'PRJ-001', status: 'PENDING',   prio: 'P2', agente: 'DESENVOLVEDOR',          llm: 'Claude Sonnet 4', tempo: '—',      etapa: 0, etapas: 3, tags: ['acessibilidade','interface'] },
    { id: 'MIS-380', titulo: 'Cache distribuído de sessões',                       proj: 'PRJ-008', status: 'RUNNING',   prio: 'P2', agente: 'ARQUITETO',              llm: 'Claude Opus 4',    tempo: '9 min',  etapa: 1, etapas: 3, tags: ['infra'] },
    { id: 'MIS-377', titulo: 'Verificação de dependências vulneráveis',            proj: 'PRJ-008', status: 'COMPLETED', prio: 'P2', agente: 'SEGURANÇA',              llm: 'Claude Haiku 4',   tempo: '3 min',  etapa: 2, etapas: 2, tags: ['segurança'] },
    { id: 'MIS-372', titulo: 'Preparar ambiente Kubernetes de produção',           proj: 'PRJ-004', status: 'QUEUED',    prio: 'P1', agente: 'OPERAÇÕES',              llm: 'Claude Sonnet 4', tempo: '—',      etapa: 0, etapas: 6, tags: ['infra','produção'] },
  ];

  // ---- agentes (V2 · 7 papéis) ----
  const agentes = [
    { id: 'AGT-ARCH', papel: 'ARQUITETO',              nome: 'Arquiteto da Fábrica',       status: 'idle',    missao: '—', ultimaExec: '—', provider: 'DeepSeek V4 Pro',   tempoMedio: 'não medido', tokens: null, custo: 0, tarefas: null, sucesso: null },
    { id: 'AGT-DEV',  papel: 'DESENVOLVEDOR',          nome: 'Desenvolvedor da Fábrica',   status: 'idle',    missao: '—', ultimaExec: '—', provider: 'Claude Pro',        tempoMedio: 'não medido', tokens: null, custo: 0, tarefas: null, sucesso: null },
    { id: 'AGT-QA',   papel: 'AUDITOR',                nome: 'Auditor de Qualidade',       status: 'idle',    missao: '—', ultimaExec: '—', provider: 'ChatGPT Plus',      tempoMedio: 'não medido', tokens: null, custo: 0, tarefas: null, sucesso: null },
    { id: 'AGT-SEC',  papel: 'SEGURANÇA',              nome: 'Especialista em Segurança',  status: 'idle',    missao: '—', ultimaExec: '—', provider: 'Claude Pro',        tempoMedio: 'não medido', tokens: null, custo: 0, tarefas: null, sucesso: null },
    { id: 'AGT-OPS',  papel: 'OPERAÇÕES',              nome: 'Operador de Publicações',    status: 'idle',    missao: '—', ultimaExec: '—', provider: 'Ollama Local',      tempoMedio: 'não medido', tokens: null, custo: 0, tarefas: null, sucesso: null },
    { id: 'AGT-DATA', papel: 'ESPECIALISTA EM DADOS',  nome: 'Especialista em Dados',      status: 'idle',    missao: '—', ultimaExec: '—', provider: 'Ollama Local',      tempoMedio: 'não medido', tokens: null, custo: 0, tarefas: null, sucesso: null },
    { id: 'AGT-AI',   papel: 'ESPECIALISTA EM IA',     nome: 'Especialista em IA',         status: 'idle',    missao: '—', ultimaExec: '—', provider: 'DeepSeek V4 Pro',   tempoMedio: 'não medido', tokens: null, custo: 0, tarefas: null, sucesso: null },
  ];

  // ---- LLMs (V2 · 5 provedores) ----
  const llms = [
    { id: 'deepseek_v4_pro', provider: 'DeepSeek V4 Pro', modelos: ['V4 Pro'], tipo: 'Assinatura', status: 'unknown', modoUso: 'Assistido', automacao: 'Assistida', custoIncremental: 'R$ 0,00', billing: 'Não aplicável', ultimoHealth: 'Não validado', observacao: 'Prioridade oficial. Não há automação direta validada nesta instalação.', ativo: false },
    { id: 'claude_pro', provider: 'Claude Pro', modelos: ['Pro'], tipo: 'Assinatura', status: 'unknown', modoUso: 'Assistido', automacao: 'Assistida', custoIncremental: 'R$ 0,00', billing: 'Não aplicável', ultimoHealth: 'Não validado', observacao: 'Assinatura não gera custo incremental por token.', ativo: false },
    { id: 'chatgpt_plus', provider: 'ChatGPT Plus / GPT', modelos: ['Plus'], tipo: 'Assinatura', status: 'unknown', modoUso: 'Assistido', automacao: 'Assistida', custoIncremental: 'R$ 0,00', billing: 'Não aplicável', ultimoHealth: 'Não validado', observacao: 'Não confundir com OpenAI API.', ativo: false },
    { id: 'gemini_advanced', provider: 'Gemini Advanced', modelos: ['Advanced'], tipo: 'Assinatura', status: 'unknown', modoUso: 'Assistido', automacao: 'Assistida', custoIncremental: 'R$ 0,00', billing: 'Não aplicável', ultimoHealth: 'Não validado', observacao: 'Pesquisa e documentação assistidas.', ativo: false },
    { id: 'ollama_local', provider: 'Ollama Local', modelos: ['Llama/Gemma/Qwen configuráveis'], tipo: 'Local', status: 'unknown', modoUso: 'Local', automacao: 'Direta após health check', custoIncremental: 'R$ 0,00', billing: 'Energia/hardware local', ultimoHealth: 'Não validado nesta execução', observacao: 'Só marcar ativo após /api/tags e geração real.', ativo: false },
    { id: 'openai_api', provider: 'OpenAI API', modelos: ['configurável'], tipo: 'API Paga', status: 'inactive', modoUso: 'API', automacao: 'Direta se autorizada', custoIncremental: 'Controlado pelo Billing Guard', billing: 'Token-based somente com base real', ultimoHealth: 'Sem chave validada', observacao: 'Bloqueada até autorização da Diretoria, Proteção de Segredos e health active_real.', ativo: false },
    { id: 'claude_api', provider: 'Claude API', modelos: ['configurável'], tipo: 'API Paga', status: 'inactive', modoUso: 'API', automacao: 'Direta se autorizada', custoIncremental: 'Controlado pelo Billing Guard', billing: 'Token-based somente com base real', ultimoHealth: 'Sem chave validada', observacao: 'Diferente de Claude Pro; bloqueada por padrão.', ativo: false },
    { id: 'gemini_api', provider: 'Gemini API', modelos: ['configurável'], tipo: 'API Paga', status: 'inactive', modoUso: 'API', automacao: 'Direta se autorizada', custoIncremental: 'Controlado pelo Billing Guard', billing: 'Token-based somente com base real', ultimoHealth: 'Sem chave validada', observacao: 'Diferente de Gemini Advanced; bloqueada por padrão.', ativo: false },
  ];

  const rotas = [
    { id: 'R1', quando: 'tarefa assistida complexa', modelo: 'DeepSeek V4 Pro', fallback: 'Claude Pro' },
    { id: 'R2', quando: 'engenharia assistida', modelo: 'Claude Pro', fallback: 'ChatGPT Plus' },
    { id: 'R3', quando: 'pesquisa e documentação', modelo: 'Gemini Advanced', fallback: 'ChatGPT Plus' },
    { id: 'R4', quando: 'automação real contínua', modelo: 'Ollama Local validado', fallback: 'API paga autorizada' },
    { id: 'R5', quando: 'API paga', modelo: 'bloqueada por padrão', fallback: 'Ollama Local validado' },
  ];

  // ---- custos (V2 · controle de custos) ----
  const custos = {
    diario: 0, mensal: 0, limite: 30, limiteDiario: 1, projecao: 0,
    source: 'sem_dados_reais', primaryProvider: 'deepseek_v4_pro', fallbackProvider: 'ollama',
    deltaMes: 0,
    serieDiaria: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    serieMensal: [0,0,0,0,0,0],
    byLLM: [
      { nome: 'Assinaturas', custo: 0, pct: 0, cor: 'var(--accent)', nota: 'R$ 0,00 incremental' },
      { nome: 'Ollama Local', custo: 0, pct: 0, cor: 'var(--ok)', nota: 'R$ 0,00 incremental' },
      { nome: 'APIs pagas', custo: 0, pct: 0, cor: 'var(--warn)', nota: 'bloqueadas sem autorização' },
    ],
    byProjeto: [
      { proj: 'Nenhum custo medido', custo: 0, pct: 0 },
    ],
    byAgente: [
      { agente: 'Nenhum custo medido', custo: 0 },
    ],
    alerts: [
      { nivel: 'info', txt: 'Assinaturas e local operam com R$ 0,00 incremental.' },
      { nivel: 'warn', txt: 'APIs pagas permanecem bloqueadas sem autorização da Diretoria.' },
    ],
  };

  // ---- ambientes & deploys ----
  const ambientes = [
    { id: 'dev',  nome: 'Desenvolvimento', status: 'ok',   ver: 'v6.0.0-rc4', deploy: '2 min',  saude: 1.0 },
    { id: 'stg',  nome: 'Homologação',     status: 'ok',   ver: 'v5.9.2',      deploy: '1 h',    saude: 0.98 },
    { id: 'prod', nome: 'Produção',        status: 'warn', ver: 'v5.9.1',      deploy: '6 h',    saude: 0.94 },
  ];
  const deploys = [
    { id: 'DPL-2207', proj: 'PRJ-001', amb: 'homologação', status: 'running', etapa: 'Construção', prog: 0.46, gatilho: 'DESENVOLVEDOR', commit: 'a3f91c2', quando: 'agora' },
    { id: 'DPL-2206', proj: 'PRJ-004', amb: 'desenvolvimento', status: 'ok', etapa: 'Publicado', prog: 1, gatilho: 'M. Costa', commit: '7b22e80', quando: '12 min' },
    { id: 'DPL-2205', proj: 'PRJ-008', amb: 'homologação', status: 'ok', etapa: 'Publicado', prog: 1, gatilho: 'CI', commit: 'c19af04', quando: '38 min' },
    { id: 'DPL-2204', proj: 'PRJ-002', amb: 'produção', status: 'ok', etapa: 'Publicado', prog: 1, gatilho: 'L. Dias', commit: 'f0d4a11', quando: '6 h' },
    { id: 'DPL-2203', proj: 'PRJ-003', amb: 'homologação', status: 'fail', etapa: 'Testes', prog: 0.7, gatilho: 'SEGURANÇA', commit: 'd88c3e9', quando: '7 h' },
  ];
  const pipeline = ['Origem','Construção','Testes','Segurança','Publicação','Conferência'];

  // ---- knowledge ----
  const fontes = [
    { id: 'KB-01', nome: 'Documentação técnica interna', tipo: 'Markdown', docs: 1240, chunks: 18402, status: 'indexado', tam: '82 MB', atualizado: '1 h' },
    { id: 'KB-02', nome: 'Código dos projetos',          tipo: 'Código',   docs: 9821, chunks: 142003, status: 'indexando', tam: '1.2 GB', atualizado: 'agora' },
    { id: 'KB-03', nome: 'Padrões & ADRs da Fábrica',    tipo: 'Markdown', docs: 86,   chunks: 1204, status: 'indexado', tam: '4 MB', atualizado: '3 h' },
    { id: 'KB-04', nome: 'Tickets de suporte (histórico)',tipo: 'JSON',     docs: 5400, chunks: 21800, status: 'indexado', tam: '210 MB', atualizado: '1 d' },
    { id: 'KB-05', nome: 'Especificações de clientes',   tipo: 'PDF',      docs: 312,  chunks: 8900, status: 'erro', tam: '540 MB', atualizado: '2 d' },
  ];

  // ---- auditoria ----
  const auditoria = [
    { id: 1, ts: '14:32:09', ator: 'ARQUITETO',         acao: 'publicacao.iniciada',  alvo: 'PRJ-004 → desenvolvimento', sev: 'info' },
    { id: 2, ts: '14:31:55', ator: 'A. Ramos',          acao: 'missao.aprovada',  alvo: 'MIS-411', sev: 'info' },
    { id: 3, ts: '14:30:12', ator: 'Central de IA',       acao: 'ia.alternativa',   alvo: 'Opus 4 → Sonnet 4', sev: 'aviso' },
    { id: 4, ts: '14:28:40', ator: 'ESPECIALISTA EM DADOS', acao: 'missao.bloqueada', alvo: 'MIS-404 (dependência)', sev: 'crítico' },
    { id: 5, ts: '14:27:03', ator: 'Central de Conhecimento', acao: 'indice.falhou', alvo: 'KB-05 (PDF corrompido)', sev: 'crítico' },
    { id: 6, ts: '14:25:19', ator: 'Integração contínua', acao: 'construcao.sucesso', alvo: 'PRJ-008 #DPL-2205', sev: 'info' },
    { id: 7, ts: '14:22:47', ator: 'M. Costa',           acao: 'config.alterada',  alvo: 'Central de IA · peso Sonnet', sev: 'aviso' },
    { id: 8, ts: '14:20:11', ator: 'DESENVOLVEDOR',      acao: 'arquivo.gerado',   alvo: 'PRJ-001 · agenda.tsx (+412)', sev: 'info' },
    { id: 9, ts: '14:18:55', ator: 'Fábrica de Projetos', acao: 'estrutura.concluída', alvo: 'PRJ-001 módulo agenda', sev: 'info' },
    { id: 10, ts: '14:15:30', ator: 'SEGURANÇA',          acao: 'teste.falhou',     alvo: 'PRJ-003 checkout.e2e', sev: 'aviso' },
    { id: 11, ts: '14:12:08', ator: 'A. Ramos',          acao: 'sessao.login',     alvo: 'IP 10.0.4.12', sev: 'info' },
    { id: 12, ts: '14:09:44', ator: 'Núcleo Operacional', acao: 'equipe.escalonada',alvo: 'ARQUITETO (+2 réplicas)', sev: 'info' },
  ];

  // ---- governança / Zero Ghost Law ----
  const governance = {
    certificacoes: [
      { nome: 'SOC 2 Type II',     status: 'ok',   validade: '14/08/2026', renova: '263 dias' },
      { nome: 'LGPD compliance',   status: 'ok',   validade: 'contínua',    renova: '—' },
      { nome: 'ISO 27001',         status: 'warn', validade: '47 dias',     renova: 'renovação pendente' },
      { nome: 'PCI DSS Level 1',   status: 'ok',   validade: '04/2026',     renova: '142 dias' },
    ],
    evidence: { total: 12842, ultimaHora: 318, retencao: '90 dias', integridade: 1.0, assinatura: 'SHA-256 · ed25519' },
    zeroGhostLaw: { ativas: 24, violacoes: 0, alertas: 2, ultimaVarredura: '2 min' },
    falhas: [
      { ts: '14:30', dado: 'Central de IA · alternativa Opus→Sonnet por limite',  sev: 'aviso' },
      { ts: '14:27', dado: 'Central de Conhecimento · falha no índice KB-05',     sev: 'crítico' },
      { ts: '13:48', dado: 'API Pagamentos · timeout de webhook PIX',             sev: 'aviso' },
    ],
    alertas: [
      { tipo: 'Custo',       nivel: 'aviso',    txt: 'Pico de gasto em busca semântica (+38% em 1h)' },
      { tipo: 'Segurança',   nivel: 'crítico',  txt: 'Tentativa de acesso não autorizado em SSO' },
      { tipo: 'Governança',  nivel: 'aviso',    txt: 'ISO 27001 requer renovação' },
    ],
  };

  // ---- métricas / KPIs ----
  const kpis = [
    { id: 'projetos',  label: 'Projetos ativos', valor: '8',       delta: '+2',  dir: 'up',   sub: 'este mês' },
    { id: 'missoes',   label: 'Missões ativas',  valor: '14',      delta: '+6',  dir: 'up',   sub: '4 em execução' },
    { id: 'agentes',   label: 'Equipe ativa',    valor: '4/7',     delta: '1 blq',dir: 'flat',sub: 'execução' },
    { id: 'deploys',   label: 'Publicações (24h)', valor: '12',    delta: '+3',  dir: 'up',   sub: '1 em curso' },
    { id: 'custos',    label: 'Custo incremental IA', valor: 'R$ 0',  delta: 'OK', dir: 'flat', sub: 'sem API paga autorizada' },
    { id: 'saude',     label: 'Saúde geral',     valor: '98%',     delta: 'OK',  dir: 'flat', sub: '6/7 núcleos OK' },
    { id: 'alertas',   label: 'Alertas críticos',valor: '2',       delta: '+1',  dir: 'up',   sub: 'requer ação' },
  ];

  const serieThroughput = [12,14,11,18,22,19,24,28,26,31,29,34,38,33,41,37,44,48,42,47,52,49,55,58];
  const serieCusto = [3.1,3.4,2.9,4.0,4.4,3.8,4.6,5.0,4.2,4.9,5.4,4.8,5.5,5.1,5.8,5.3,4.9,4.4,4.1,3.8,4.0,3.6,3.4,3.2];

  const chatSeed = [
    { de: 'agente', nome: 'ARQUITETO', txt: 'Missão MIS-409 (PIX) em execução. Recebimento idempotente gerado, rodando testes de contrato agora.' },
    { de: 'voce', txt: 'Garanta retry com backoff exponencial no consumidor.' },
    { de: 'agente', nome: 'ARQUITETO', txt: 'Feito. Retentativa progressiva até 5 tentativas, fila de falhas configurada. Cobertura de testes: 94%.' },
  ];

  // ---- relatórios (Explorer) ----
  const relatorios = [
    { id: 'REL-Q4', nome: 'Diretoria · Q4 2026',     periodo: 'trimestral' },
    { id: 'REL-MNS',nome: 'Operacional · mês',        periodo: 'mensal' },
    { id: 'REL-CST',nome: 'Custos · 30 dias',         periodo: 'mensal' },
    { id: 'REL-SLA',nome: 'SLA e disponibilidade',    periodo: 'mensal' },
    { id: 'REL-AUD',nome: 'Auditoria · 90 dias',      periodo: 'trimestral' },
  ];

  window.FORJA = {
    cores, services, projetos, missoes, MIS_STATES, agentes, llms, rotas,
    custos, ambientes, deploys, pipeline, fontes, auditoria, governance,
    kpis, serieThroughput, serieCusto, chatSeed, relatorios,
  };
})();
