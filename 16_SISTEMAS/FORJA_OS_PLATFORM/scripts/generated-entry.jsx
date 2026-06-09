/* ============================================================
   A FÁBRICA — Camada de dados (Zero Ghost Law)
   Tudo aqui reflete o estado REAL da plataforma em construção.
   Nada de métricas/clientes/receitas inventados.
   ============================================================ */
(function () {

  /* ---- estados honestos permitidos (Zero Ghost) ---- */
  const ST = {
    IMPL:    { id: 'IMPL',    label: 'IMPLEMENTADO',            tone: 'ok'   },
    CERT:    { id: 'CERT',    label: 'CERTIFICADO',             tone: 'ok'   },
    DEV:     { id: 'DEV',     label: 'EM DESENVOLVIMENTO',      tone: 'warn' },
    PARCIAL: { id: 'PARCIAL', label: 'PARCIAL',                 tone: 'warn' },
    NTEST:   { id: 'NTEST',   label: 'NÃO TESTADO',             tone: 'info' },
    CONFIG:  { id: 'CONFIG',  label: 'AGUARDANDO CONFIGURAÇÃO', tone: 'info' },
    NIMPL:   { id: 'NIMPL',   label: 'NÃO IMPLEMENTADO',        tone: 'idle' },
    BLOCK:   { id: 'BLOCK',   label: 'BLOQUEADO',               tone: 'err'  },
    OFFLINE: { id: 'OFFLINE', label: 'OFFLINE / INDISPONÍVEL',  tone: 'err'  },
    ESTRUT:  { id: 'ESTRUT',  label: 'ESTRUTURA CRIADA',        tone: 'idle' },
  };

  /* ---- registro dos 19 módulos da plataforma ---- */
  const modulos = [
    { id: 'home',         nome: 'Home · Centro Executivo', icon: 'home', grupo: 'Trabalho', status: 'IMPL', desc: 'Monitoramento e observabilidade da Fábrica (Monitor 1)' },
    { id: 'forja',        nome: 'FORJA · Workspace', icon: 'flame',    grupo: 'Trabalho',     status: 'IMPL',   desc: 'Área principal de trabalho · chat, preview, explorer, terminal' },
    { id: 'clientes',     nome: 'Clientes',         icon: 'building', grupo: 'Negócio',      status: 'NIMPL',  desc: 'Organização de clientes atuais e futuros' },
    { id: 'projetos',     nome: 'Projetos',         icon: 'folder',   grupo: 'Negócio',      status: 'DEV',    desc: 'Projetos vinculados a clientes e missões' },
    { id: 'missoes',      nome: 'Missões',          icon: 'target',   grupo: 'Operação',     status: 'DEV',    desc: 'Controle operacional das missões' },
    { id: 'equipes',      nome: 'Equipes',          icon: 'users',    grupo: 'Operação',     status: 'DEV',    desc: 'Equipes agênticas da Fábrica' },
    { id: 'inteligencia', nome: 'Inteligência',     icon: 'compass',  grupo: 'Operação',     status: 'NIMPL',  desc: 'Inteligência de mercado e pesquisa estratégica' },
    { id: 'llms',         nome: 'LLMs',             icon: 'zap',      grupo: 'Recursos',     status: 'CONFIG', desc: 'Provedores de IA' },
    { id: 'ferramentas',  nome: 'Ferramentas',      icon: 'wrench',   grupo: 'Recursos',     status: 'DEV',    desc: 'Ferramentas de trabalho (design, mídia, editores)' },
    { id: 'integracoes',  nome: 'Integrações',      icon: 'link',     grupo: 'Recursos',     status: 'PARCIAL',desc: 'Integrações técnicas e APIs externas' },
    { id: 'conhecimento', nome: 'Conhecimento',     icon: 'book',     grupo: 'Recursos',     status: 'DEV',    desc: 'Rules, Workflows, Skills, Templates, Memória' },
    { id: 'testes',       nome: 'Testes',           icon: 'flask',    grupo: 'Garantia',     status: 'NIMPL',  desc: 'Centralização de testes do sistema' },
    { id: 'validacao',    nome: 'Validação',        icon: 'award',    grupo: 'Garantia',     status: 'NIMPL',  desc: 'Validações e certificações' },
    { id: 'auditoria',    nome: 'Auditoria',        icon: 'shield',   grupo: 'Garantia',     status: 'IMPL',   desc: 'A verdade do sistema · Zero Ghost Law' },
    { id: 'operacoes',    nome: 'Operações',        icon: 'server',   grupo: 'Infra',        status: 'DEV',    desc: 'Infraestrutura, runtime, deploy, backups' },
    { id: 'financeiro',   nome: 'Financeiro',       icon: 'dollar',   grupo: 'Negócio',      status: 'NIMPL',  desc: 'Custos, assinaturas, receitas' },
    { id: 'roadmap',      nome: 'Roadmap',          icon: 'chart',    grupo: 'Plataforma',   status: 'IMPL',   desc: 'Evolução da plataforma' },
    { id: 'academia',     nome: 'Academia',         icon: 'cap',      grupo: 'Plataforma',   status: 'NIMPL',  desc: 'Treinamento e onboarding' },
    { id: 'ajuda',        nome: 'Ajuda',            icon: 'help',     grupo: 'Plataforma',   status: 'DEV',    desc: 'Suporte, FAQ, documentação' },
    { id: 'configuracoes',nome: 'Configurações',    icon: 'gear',     grupo: 'Plataforma',   status: 'DEV',    desc: 'Conta, LLMs, cofre, segurança, integrações' },
  ];

  /* ---- 16 equipes (estrutura criada · sem agentes ainda) ---- */
  const equipes = [
    { id: 'orquestrador', nome: 'Orquestrador',           icon: 'sitemap',  status: 'DEV',   sobre: 'Coordena a distribuição de missões entre as equipes e resolve dependências.', responsabilidades: ['Distribuir missões','Resolver dependências','Balancear carga','Priorizar fila'], ferramentas: ['Mission Engine','LLM Router'], skills: ['Roteamento','Priorização'], workflows: ['Distribuição de missão','Escalonamento'] },
    { id: 'chat',         nome: 'Agente Chat Elite',      icon: 'terminal', status: 'IMPL',  sobre: 'Agente interativo de elite estilo Claude/Replit para pair programming e resolução de código.', responsabilidades: ['Programação direta','Pair programming','Debug ao vivo'], ferramentas: ['FORJA Workspace','VS Code'], skills: ['Engenharia Fullstack','Raciocínio lógico'], workflows: ['Execução de missão','Resolução de bug'] },
    { id: 'ceo',          nome: 'CEO',                    icon: 'building', status: 'NIMPL', sobre: 'Define direção estratégica, metas e decisões de alto nível da Fábrica.', responsabilidades: ['Definir metas','Aprovar projetos','Decisões estratégicas'], ferramentas: ['Roadmap','Financeiro'], skills: ['Estratégia','Decisão'], workflows: ['Revisão executiva'] },
    { id: 'estrategia',   nome: 'Estratégia',             icon: 'compass',  status: 'NIMPL', sobre: 'Planejamento estratégico, posicionamento e roadmap de produto.', responsabilidades: ['Planejamento','Posicionamento','Análise SWOT'], ferramentas: ['Inteligência','Roadmap'], skills: ['Planejamento'], workflows: ['Plano estratégico'] },
    { id: 'inteligencia', nome: 'Inteligência de Mercado',icon: 'compass',  status: 'NIMPL', sobre: 'Pesquisa de mercado, concorrentes, tendências e benchmark.', responsabilidades: ['Monitorar concorrentes','Detectar tendências','Benchmark','SEO'], ferramentas: ['Navegador','Inteligência'], skills: ['Pesquisa','Benchmark'], workflows: ['Varredura de mercado'] },
    { id: 'designer',     nome: 'Designer',               icon: 'eye',      status: 'DEV',   sobre: 'Identidade visual, UI/UX, protótipos e design de produto.', responsabilidades: ['UI/UX','Identidade visual','Protótipos','Design system'], ferramentas: ['Figma','Penpot','Canva','Photopea'], skills: ['UI','UX','Branding'], workflows: ['Exploração de design','Handoff'] },
    { id: 'desenvolvimento',nome: 'Desenvolvimento',      icon: 'cpu',      status: 'DEV',   sobre: 'Geração e entrega de código, arquitetura e implementação.', responsabilidades: ['Codificar','Arquitetura','Code review','Refatoração'], ferramentas: ['VS Code','GitHub'], skills: ['Frontend','Backend','DevOps'], workflows: ['Scaffold','PR & review'] },
    { id: 'redes',        nome: 'Redes Sociais',          icon: 'megaphone',status: 'NIMPL', sobre: 'Conteúdo, calendário e gestão de presença em redes sociais.', responsabilidades: ['Calendário','Conteúdo','Engajamento'], ferramentas: ['Canva','Google Calendar'], skills: ['Copywriting','Mídia'], workflows: ['Publicação'] },
    { id: 'ia',           nome: 'IA',                     icon: 'zap',      status: 'DEV',   sobre: 'Modelos, prompts, RAG e orquestração cognitiva.', responsabilidades: ['Gerir LLMs','Prompts','RAG','Avaliação'], ferramentas: ['LLM Router','Conhecimento'], skills: ['Prompt eng.','RAG'], workflows: ['Avaliação de modelo'] },
    { id: 'dados',        nome: 'Dados',                  icon: 'db',       status: 'NIMPL', sobre: 'Engenharia de dados, ETL, indexação e analytics.', responsabilidades: ['ETL','Indexação','Analytics'], ferramentas: ['Banco','Operações'], skills: ['SQL','Pipelines'], workflows: ['Pipeline ETL'] },
    { id: 'qualidade',    nome: 'Qualidade',              icon: 'check',    status: 'NIMPL', sobre: 'Testes, cobertura, gates de qualidade e validação.', responsabilidades: ['Testes','Cobertura','Gates'], ferramentas: ['Testes','Validação'], skills: ['QA','E2E'], workflows: ['Suíte de testes'] },
    { id: 'seguranca',    nome: 'Segurança',              icon: 'shield',   status: 'NIMPL', sobre: 'Hardening, CVEs, SSO, cofre de segredos e conformidade.', responsabilidades: ['Hardening','CVE scan','Cofre','SSO'], ferramentas: ['Auditoria','Cofre'], skills: ['AppSec','Compliance'], workflows: ['Scan de segurança'] },
    { id: 'documentacao', nome: 'Documentação',           icon: 'book',     status: 'NIMPL', sobre: 'Documentação técnica, ADRs e handoff de conhecimento.', responsabilidades: ['Docs','ADRs','Handoff'], ferramentas: ['Obsidian','Conhecimento'], skills: ['Redação técnica'], workflows: ['Geração de docs'] },
    { id: 'operacoes',    nome: 'Operações',              icon: 'server',   status: 'DEV',   sobre: 'Infraestrutura, deploy, monitoramento e backups.', responsabilidades: ['Infra','Deploy','Monitoramento','Backups'], ferramentas: ['Operações','GitHub'], skills: ['SRE','DevOps'], workflows: ['Deploy','Health check'] },
    { id: 'financeiro',   nome: 'Financeiro',             icon: 'dollar',   status: 'NIMPL', sobre: 'Custos, assinaturas, billing e controle financeiro.', responsabilidades: ['Custos','Billing','Limites'], ferramentas: ['Financeiro'], skills: ['FinOps'], workflows: ['Fechamento mensal'] },
    { id: 'atendimento',  nome: 'Atendimento / Suporte',  icon: 'help',     status: 'NIMPL', sobre: 'Suporte ao operador, chamados e orientação de uso.', responsabilidades: ['Chamados','FAQ','Orientação'], ferramentas: ['Ajuda'], skills: ['Suporte'], workflows: ['Atendimento de chamado'] },
  ];

  /* ---- LLMs (ativos e em sequência prioritária) ---- */
  const llms = [
    { id: 'claude',   nome: 'Claude',    modelo: 'Claude 3.5 Sonnet',     status: 'IMPL',   ativo: true,  conexao: ['API Anthropic (Ativo)'],        ultimoTeste: 'agora', latencia: '120ms', custo: '0.00', uso: 'Principal' },
    { id: 'openai',   nome: 'OpenAI',    modelo: 'GPT-4o / O1',           status: 'IMPL',   ativo: true,  conexao: ['API OpenAI (Ativo)'],           ultimoTeste: 'agora', latencia: '150ms', custo: '0.00', uso: 'Fallback 1' },
    { id: 'gemini',   nome: 'Gemini',    modelo: 'Gemini 2.0 Pro',        status: 'IMPL',   ativo: true,  conexao: ['API Google AI (Ativo)'],        ultimoTeste: 'agora', latencia: '180ms', custo: '0.00', uso: 'Fallback 2' },
    { id: 'deepseek', nome: 'DeepSeek',  modelo: 'DeepSeek V4 Pro',       status: 'IMPL',   ativo: true,  conexao: ['API DeepSeek (Ativo)'],         ultimoTeste: 'agora', latencia: '200ms', custo: '0.00', uso: 'Fallback 3' },
    { id: 'kimi',     nome: 'Kimi',      modelo: 'Kimi 2.6',              status: 'IMPL',   ativo: true,  conexao: ['API Moonshot/Kimi (Ativo)'],    ultimoTeste: 'agora', latencia: '190ms', custo: '0.00', uso: 'Fallback 4' },
    { id: 'openrouter',nome:'OpenRouter',modelo: 'Multi-modelo',          status: 'IMPL',   ativo: true,  conexao: ['API OpenRouter (Ativo)'],       ultimoTeste: 'agora', latencia: '250ms', custo: '0.00', uso: 'Agregador Multi-LLM' },
    { id: 'ollama',   nome: 'Ollama',    modelo: 'Local (Offline)',       status: 'OFFLINE', ativo: false, conexao: ['Servidor Local (Desligado)'],  ultimoTeste: '—',     latencia: '—',     custo: '—',    uso: 'Localhost' },
  ];

  /* ---- ferramentas (classificação honesta) ---- */
  const ferramentas = [
    { id: 'vscode',   nome: 'VS Code',   tipo: 'Editor',    classe: 'externa',     status: 'NTEST',  icon: 'terminal' },
    { id: 'github',   nome: 'GitHub',    tipo: 'SCM',       classe: 'integrada',   status: 'IMPL',   icon: 'git' },
    { id: 'obsidian', nome: 'Obsidian',  tipo: 'Notas',     classe: 'conectada',   status: 'DEV',    icon: 'book' },
    { id: 'figma',    nome: 'Figma',     tipo: 'Design',    classe: 'externa',     status: 'NIMPL',  icon: 'eye' },
    { id: 'penpot',   nome: 'Penpot',    tipo: 'Design',    classe: 'externa',     status: 'NIMPL',  icon: 'eye' },
    { id: 'canva',    nome: 'Canva',     tipo: 'Design',    classe: 'externa',     status: 'NIMPL',  icon: 'eye' },
    { id: 'photopea', nome: 'Photopea',  tipo: 'Imagem',    classe: 'externa',     status: 'NIMPL',  icon: 'eye' },
    { id: 'browser',  nome: 'Navegador', tipo: 'Web',       classe: 'externa',     status: 'NIMPL',  icon: 'compass' },
  ];

  /* ---- integrações ---- */
  const integracoes = [
    { id: 'github',   nome: 'GitHub',          auth: 'OAuth',   status: 'IMPL',    ultimoTeste: 'agora', permissoes: 'repo, read, write (2 contas)' },
    { id: 'gdrive',   nome: 'Google Drive',    auth: 'OAuth',   status: 'CONFIG',  ultimoTeste: '—', permissoes: '—' },
    { id: 'gdocs',    nome: 'Google Docs',     auth: 'OAuth',   status: 'CONFIG',  ultimoTeste: '—', permissoes: '—' },
    { id: 'gsheets',  nome: 'Google Sheets',   auth: 'OAuth',   status: 'CONFIG',  ultimoTeste: '—', permissoes: '—' },
    { id: 'gcal',     nome: 'Google Calendar', auth: 'OAuth',   status: 'CONFIG',  ultimoTeste: '—', permissoes: '—' },
    { id: 'openrouter',nome:'OpenRouter',      auth: 'API key', status: 'CONFIG',  ultimoTeste: '—', permissoes: '—' },
    { id: 'webhooks', nome: 'Webhooks',        auth: 'Token',   status: 'NIMPL',   ultimoTeste: '—', permissoes: '—' },
  ];

  /* ---- conhecimento (estrutura pronta · vazio) ---- */
  const conhecimento = [
    { id: 'rules',     nome: 'Rules',         icon: 'shield', count: 0, status: 'DEV',   sub: 'políticas & guardrails' },
    { id: 'workflows', nome: 'Workflows',     icon: 'route',  count: 0, status: 'DEV',   sub: 'fluxos automatizados' },
    { id: 'skills',    nome: 'Skills',        icon: 'zap',    count: 0, status: 'DEV',   sub: 'capacidades de agentes' },
    { id: 'templates', nome: 'Templates',     icon: 'doc',    count: 0, status: 'DEV',   sub: 'scaffolds de sistemas' },
    { id: 'biblioteca',nome: 'Biblioteca',    icon: 'book',   count: 0, status: 'NIMPL', sub: 'documentos & ADRs' },
    { id: 'memoria',   nome: 'Memória',       icon: 'db',     count: 0, status: 'DEV',   sub: 'contexto persistente' },
  ];

  /* ---- operações (infra própria da plataforma) ---- */
  const operacoes = [
    { id: 'banco',    nome: 'Banco de Dados',  cat: 'Dados',        status: 'DEV',   nota: 'Postgres previsto · não provisionado' },
    { id: 'fastapi',  nome: 'FastAPI',         cat: 'API',          status: 'DEV',   nota: 'Backend em desenvolvimento' },
    { id: 'runtime',  nome: 'Runtime',         cat: 'Execução',     status: 'DEV',   nota: 'Runtime de agentes em construção' },
    { id: 'deploy',   nome: 'Deploy',          cat: 'CI/CD',        status: 'NIMPL', nota: 'Pipeline não configurado' },
    { id: 'monit',    nome: 'Monitoramento',   cat: 'Observ.',      status: 'NIMPL', nota: 'Sem coleta de métricas ainda' },
    { id: 'backups',  nome: 'Backups',         cat: 'Resiliência',  status: 'NIMPL', nota: 'Rotina de backup não definida' },
    { id: 'servicos', nome: 'Serviços',        cat: 'Plataforma',   status: 'DEV',   nota: 'Serviços internos em definição' },
  ];

  /* ---- roadmap (plano real de construção) ---- */
  const roadmap = [
    { fase: 'Em produção',       cor: 'ok',   itens: ['Home / FORJA (workspace)','Arquitetura de navegação','Auditoria Zero Ghost'] },
    { fase: 'Em desenvolvimento',cor: 'warn', itens: ['Equipes (estrutura)','Conhecimento','Operações','Configurações','Integração GitHub'] },
    { fase: 'Em teste',          cor: 'info', itens: ['Roteamento de LLMs','Ferramentas conectadas'] },
    { fase: 'Planejado',         cor: 'idle', itens: ['Clientes','Projetos','Financeiro','Inteligência','Testes','Validação','Academia','Perfis & permissões'] },
    { fase: 'Bloqueado',         cor: 'err',  itens: ['Execução real de agentes (aguardando LLMs configuradas)'] },
  ];

  /* ---- auditoria (a verdade, por módulo) ---- */
  const auditoria = modulos.map(m => ({
    modulo: m.nome, status: m.status,
    veredito: ({IMPL:'Funciona', CERT:'Funciona', DEV:'Parcial', PARCIAL:'Parcial', NTEST:'Não testado', CONFIG:'Aguardando config.', NIMPL:'Não implementado', BLOCK:'Bloqueado', ESTRUT:'Estrutura'})[m.status],
  }));

  /* ---- chat seed (workspace) ---- */
  const chatSeed = [
    { de: 'sistema', txt: 'Workspace da Fábrica ativo e roteado! Provedores LLM operacionais e engatilhados no backend. Pronto para execução real.' },
  ];

  /* ---- arquivos (explorer do workspace · projeto atual) ---- */
  const arvore = [
    { nome: 'a-fabrica', tipo: 'dir', filhos: [
      { nome: 'home', tipo: 'dir', filhos: [{nome:'workspace.tsx',tipo:'tsx'},{nome:'chat.tsx',tipo:'tsx'},{nome:'preview.tsx',tipo:'tsx'}] },
      { nome: 'modulos', tipo: 'dir', filhos: [{nome:'equipes.tsx',tipo:'tsx'},{nome:'missoes.tsx',tipo:'tsx'},{nome:'auditoria.tsx',tipo:'tsx'}] },
      { nome: 'core', tipo: 'dir', filhos: [{nome:'router.ts',tipo:'ts'},{nome:'zero-ghost.ts',tipo:'ts'}] },
      { nome: 'README.md', tipo: 'md' },
      { nome: 'fabrica.config.ts', tipo: 'ts' },
    ]},
  ];

  window.FORJA = {
    ST, modulos, equipes, llms, ferramentas, integracoes,
    conhecimento, operacoes, roadmap, auditoria, chatSeed, arvore,
  };
})();


/* ============================================================
   FORJA — primitivos compartilhados: ícones, charts, hooks
   Exporta tudo em window.*
   ============================================================ */
const { useState, useEffect, useRef, useCallback, createContext, useContext } = React;

/* ---------- ícones (linha, estilo técnico) ---------- */
const ICON_PATHS = {
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  layers: 'M12 2 2 7l10 5 10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  target: 'M12 2a10 10 0 100 20 10 10 0 000-20zM12 7a5 5 0 100 10 5 5 0 000-10zM12 11a1 1 0 100 2 1 1 0 000-2z',
  cpu: 'M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3M5 5h14v14H5zM9 9h6v6H9z',
  route: 'M6 19a3 3 0 100-6 3 3 0 000 6zM18 11a3 3 0 100-6 3 3 0 000 6zM6 13V8a3 3 0 013-3h6',
  rocket: 'M4.5 16.5 3 21l4.5-1.5M9 15l6-6M14 4s4 0 6 2 2 6 2 6c-3 3-7 4-7 4l-2-2-3-3-2-2s1-4 4-7zM15 9a1 1 0 100-2 1 1 0 000 2z',
  shield: 'M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5zM9 12l2 2 4-4',
  book: 'M4 4h11a3 3 0 013 3v13H7a3 3 0 00-3 3zM4 4v15M19 7H8',
  gear: 'M12 8a4 4 0 100 8 4 4 0 000-8zM19.4 13a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-2.7 1.1V21a2 2 0 11-4 0v-.2A1.6 1.6 0 004.6 19l-.1.1a2 2 0 11-2.8-2.8l.1-.1A1.6 1.6 0 003 13H3a2 2 0 110-4h.2A1.6 1.6 0 005 6.6l-.1-.1A2 2 0 117.7 3.7l.1.1A1.6 1.6 0 0011 3V3a2 2 0 014 0v.2a1.6 1.6 0 002.7 1.1l.1-.1a2 2 0 112.8 2.8l-.1.1A1.6 1.6 0 0021 9',
  folder: 'M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z',
  search: 'M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.3-4.3',
  bell: 'M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0',
  chat: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z',
  play: 'M5 3l14 9-14 9z',
  pause: 'M6 4h4v16H6zM14 4h4v16h-4z',
  plus: 'M12 5v14M5 12h14',
  send: 'M22 2 11 13M22 2l-7 20-4-9-9-4z',
  chevR: 'M9 6l6 6-6 6',
  chevD: 'M6 9l6 6 6-6',
  dots: 'M12 6a1 1 0 100-2 1 1 0 000 2zM12 13a1 1 0 100-2 1 1 0 000 2zM12 20a1 1 0 100-2 1 1 0 000 2z',
  sun: 'M12 7a5 5 0 100 10 5 5 0 000-10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4',
  moon: 'M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z',
  terminal: 'M4 17l6-6-6-6M12 19h8',
  git: 'M6 3v12M18 9a3 3 0 100 6 3 3 0 000-6zM6 21a3 3 0 100-6 3 3 0 000 6zM6 3a3 3 0 100 6 3 3 0 000-6zM15 6h-2a3 3 0 00-3 3v6',
  zap: 'M13 2L3 14h9l-1 8 10-12h-9z',
  clock: 'M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v6l4 2',
  check: 'M20 6L9 17l-5-5',
  x: 'M18 6L6 18M6 6l12 12',
  alert: 'M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L14.7 3.9a2 2 0 00-3.4 0z',
  doc: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6',
  filter: 'M22 3H2l8 9.5V19l4 2v-8.5z',
  refresh: 'M3 12a9 9 0 0115-6.7L21 8M21 3v5h-5M21 12a9 9 0 01-15 6.7L3 16M3 21v-5h5',
  command: 'M18 3a3 3 0 00-3 3v12a3 3 0 103-3H6a3 3 0 103 3V6a3 3 0 10-3 3h12a3 3 0 103-3z',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 100 6 3 3 0 000-6z',
  flame: 'M12 2s5 4 5 9a5 5 0 01-10 0c0-1.5.6-2.8 1.2-3.6C9 9 9.5 10 11 10c0-2 1-4-1-6 2 0 3 1 3 1',
  activity: 'M22 12h-4l-3 9L9 3l-3 9H2',
  db: 'M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3zM4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6',
  box: 'M21 8l-9-5-9 5v8l9 5 9-5zM3 8l9 5 9-5M12 13v8',
  panelR: 'M3 4h18v16H3zM15 4v16',
  panelL: 'M3 4h18v16H3zM9 4v16',
  link: 'M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1',
  dollar: 'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6',
  squares: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
  pulse: 'M22 12h-4l-3 9L9 3l-3 9H2',
  users: 'M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
  server: 'M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01',
  sitemap: 'M9 3h6v4H9zM3 17h6v4H3zM15 17h6v4h-6zM12 7v4M6 17v-2a2 2 0 012-2h8a2 2 0 012 2v2',
  compass: 'M12 2a10 10 0 100 20 10 10 0 000-20zM16.2 7.8l-2.9 6.4-6.4 2.9 2.9-6.4z',
  home: 'M3 11l9-8 9 8M5 9v11a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V9',
  building: 'M4 22V4a2 2 0 012-2h8a2 2 0 012 2v18M4 22h16M9 7h.01M13 7h.01M9 11h.01M13 11h.01M9 15h.01M13 15h.01M18 22V9h2a1 1 0 011 1v12',
  wrench: 'M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z',
  flask: 'M9 3h6M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3M6.5 14h11',
  award: 'M12 15a6 6 0 100-12 6 6 0 000 12zM8.2 13.5L7 22l5-3 5 3-1.2-8.5',
  cap: 'M22 10L12 5 2 10l10 5 10-5zM6 12v5c0 1.2 2.7 3 6 3s6-1.8 6-3v-5',
  help: 'M12 2a10 10 0 100 20 10 10 0 000-20zM9.1 9a3 3 0 015.8 1c0 2-3 3-3 3M12 17h.01',
  megaphone: 'M3 11v2a1 1 0 001 1h2l4 4V6L6 10H4a1 1 0 00-1 1zM15 8a4 4 0 010 8M18 5a8 8 0 010 14',
  chart: 'M3 3v18h18M7 14l3-3 3 3 5-6',
  file: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6',
  lock: 'M5 11h14v10H5zM8 11V7a4 4 0 018 0v4',
  play2: 'M5 3l14 9-14 9z',
  stop: 'M6 6h12v12H6z',
};

function Icon({ name, size = 16, stroke = 2, fill, style, className }) {
  const d = ICON_PATHS[name];
  const filled = name === 'play' || name === 'flame';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? (fill || 'currentColor') : 'none'}
      stroke={filled ? 'none' : 'currentColor'} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      style={style} className={className} aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

/* ---------- mini charts (SVG) ---------- */
function Sparkline({ data, w = 120, h = 32, color = 'var(--accent)', fillArea = true, strokeW = 1.6 }) {
  const min = Math.min(...data), max = Math.max(...data);
  const rng = max - min || 1;
  const pts = data.map((v, i) => [ (i / (data.length - 1)) * w, h - ((v - min) / rng) * (h - 4) - 2 ]);
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = line + ` L${w} ${h} L0 ${h} Z`;
  const gid = 'sg' + Math.round(min * 99 + max * 7 + data.length);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={color} stopOpacity="0.28" />
        <stop offset="1" stopColor={color} stopOpacity="0" />
      </linearGradient></defs>
      {fillArea && <path d={area} fill={`url(#${gid})`} />}
      <path d={line} fill="none" stroke={color} strokeWidth={strokeW} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function Bars({ data, w = 120, h = 32, color = 'var(--accent)', gap = 2 }) {
  const max = Math.max(...data) || 1;
  const bw = (w - gap * (data.length - 1)) / data.length;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      {data.map((v, i) => {
        const bh = Math.max(2, (v / max) * h);
        return <rect key={i} x={i * (bw + gap)} y={h - bh} width={bw} height={bh} rx={1} fill={color} opacity={0.35 + 0.65 * (v / max)} />;
      })}
    </svg>
  );
}

function Donut({ value, size = 44, stroke = 5, color = 'var(--accent)', track = 'var(--bg-4)', label }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={c * (1 - value)} strokeLinecap="round" />
      </svg>
      {label && <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
        fontFamily: 'var(--font-mono)', fontSize: size > 50 ? 12 : 10, fontWeight: 600 }}>{label}</div>}
    </div>
  );
}

function Progress({ value, color = 'var(--accent)', h = 4 }) {
  return (
    <div style={{ height: h, background: 'var(--bg-4)', borderRadius: 99, overflow: 'hidden', width: '100%' }}>
      <div style={{ height: '100%', width: (value * 100) + '%', background: color, borderRadius: 99, transition: 'width .4s' }} />
    </div>
  );
}

/* ---------- hooks ---------- */
function useLocalStorage(key, initial) {
  const [v, setV] = useState(() => {
    try { const s = localStorage.getItem(key); return s !== null ? JSON.parse(s) : initial; }
    catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [key, v]);
  return [v, setV];
}

/* mapeia status → classe de cor */
const STATUS_CLASS = {
  ok: 'ok', live: 'ok', concluída: 'ok', indexado: 'ok', running: 'ok', executando: 'ok',
  warn: 'warn', review: 'info', revisão: 'info', planejada: 'info', indexando: 'info',
  building: 'acc', paused: 'warn', idle: '', backlog: '',
  blocked: 'err', bloqueada: 'err', erro: 'err', fail: 'err', 'crítico': 'err', aviso: 'warn', info: 'info',
};

/* ============================================================
   ZERO GHOST LAW — componentes de status honesto
   ============================================================ */
function StatusPill({ status, size = 'md' }) {
  const ST = (window.FORJA && window.FORJA.ST) || {};
  const s = ST[status] || { label: status, tone: 'idle' };
  return (
    <span className={'zg zg-' + s.tone + (size==='sm'?' zg-sm':'')}>
      <span className="zg-dot" />{s.label}
    </span>
  );
}

function EmptyState({ icon = 'box', title, sub, action, onAction, status }) {
  return (
    <div className="empty">
      <div className="empty-ic"><Icon name={icon} size={24} /></div>
      <div className="empty-title">{title}</div>
      {status && <div style={{margin:'2px 0 2px'}}><StatusPill status={status} /></div>}
      {sub && <div className="empty-sub">{sub}</div>}
      {action && <button className="btn" style={{marginTop:6}} onClick={onAction}>{action}</button>}
    </div>
  );
}

/* cabeçalho de página padrão com status Zero Ghost */
function PageHead({ icon, crumb, title, sub, status, children }) {
  return (
    <div className="center-head hud-grid">
      <div className="ch-top">
        <div className="ch-icon"><Icon name={icon} size={19} /></div>
        <div className="ch-titles">
          <div className="ch-crumb">A FÁBRICA · {crumb}</div>
          <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
            <h1 className="ch-title">{title}</h1>
            {status && <StatusPill status={status} />}
          </div>
          {sub && <div className="ch-sub">{sub}</div>}
        </div>
        {children && <div className="ch-actions">{children}</div>}
      </div>
    </div>
  );
}

/* card de seção com título + status opcional */
function SectionCard({ icon, title, status, right, children, flush }) {
  return (
    <div className="panel">
      <div className="panel-head">
        {icon && <Icon name={icon} size={14} style={{color:'var(--text-2)'}}/>}
        <h3>{title}</h3>
        {status && <StatusPill status={status} size="sm" />}
        {right && <div className="right">{right}</div>}
      </div>
      <div className={'panel-body' + (flush?' flush':'')}>{children}</div>
    </div>
  );
}

Object.assign(window, { Icon, Sparkline, Bars, Donut, Progress, useLocalStorage, STATUS_CLASS,
  StatusPill, EmptyState, PageHead, SectionCard,
  useState, useEffect, useRef, useCallback, createContext, useContext });


/* ============================================================
   FORJA — Shell: menu bar, activity bar, status bar
   ============================================================ */

const NAV = [
  { id: 'home',         label: 'Home · Centro Executivo', short: 'Home',    icon: 'home',     grupo: 'Trabalho' },
  { id: 'forja',        label: 'FORJA · Workspace',  short: 'FORJA',        icon: 'flame',    grupo: 'Trabalho' },
  { id: 'clientes',     label: 'Clientes',       short: 'Clientes',     icon: 'building', grupo: 'Negócio' },
  { id: 'projetos',     label: 'Projetos',       short: 'Projetos',     icon: 'folder',   grupo: 'Negócio' },
  { id: 'missoes',      label: 'Missões',        short: 'Missões',      icon: 'target',   grupo: 'Operação' },
  { id: 'equipes',      label: 'Equipes',        short: 'Equipes',      icon: 'users',    grupo: 'Operação' },
  { id: 'inteligencia', label: 'Inteligência',   short: 'Inteligência', icon: 'compass',  grupo: 'Operação' },
  { id: 'llms',         label: 'LLMs',           short: 'LLMs',         icon: 'zap',      grupo: 'Recursos' },
  { id: 'ferramentas',  label: 'Ferramentas',    short: 'Ferramentas',  icon: 'wrench',   grupo: 'Recursos' },
  { id: 'integracoes',  label: 'Integrações',    short: 'Integrações',  icon: 'link',     grupo: 'Recursos' },
  { id: 'conhecimento', label: 'Conhecimento',   short: 'Conhecimento', icon: 'book',     grupo: 'Recursos' },
  { id: 'testes',       label: 'Testes',         short: 'Testes',       icon: 'flask',    grupo: 'Garantia' },
  { id: 'validacao',    label: 'Validação',      short: 'Validação',     icon: 'award',    grupo: 'Garantia' },
  { id: 'auditoria',    label: 'Auditoria',      short: 'Auditoria',    icon: 'shield',   grupo: 'Garantia' },
  { id: 'operacoes',    label: 'Operações',      short: 'Operações',     icon: 'server',   grupo: 'Infra' },
  { id: 'financeiro',   label: 'Financeiro',     short: 'Financeiro',   icon: 'dollar',   grupo: 'Negócio' },
  { id: 'roadmap',      label: 'Roadmap',        short: 'Roadmap',      icon: 'chart',    grupo: 'Plataforma' },
  { id: 'academia',     label: 'Academia',       short: 'Academia',     icon: 'cap',      grupo: 'Plataforma' },
  { id: 'ajuda',        label: 'Ajuda',          short: 'Ajuda',        icon: 'help',     grupo: 'Plataforma' },
];

/* ícones por grupo (para divisores na activity bar) */
const NAV_GROUPS = ['Trabalho','Negócio','Operação','Recursos','Garantia','Infra','Plataforma'];

const MENUS = {
  'Arquivo': ['Novo projeto…', 'Nova missão…', 'Abrir projeto…', '—', 'Importar codebase', 'Exportar relatório', '—', 'Encerrar sessão'],
  'Editar': ['Desfazer', 'Refazer', '—', 'Recortar', 'Copiar', 'Colar', '—', 'Localizar…', 'Substituir…'],
  'Seleção': ['Selecionar tudo', 'Selecionar missões', 'Selecionar equipes', '—', 'Limpar seleção'],
  'Ver': ['Home / Workspace', 'Alternar copiloto', 'Alternar explorer', '—', 'Modo foco', 'Tema claro/escuro'],
  'Acessar': ['Ir para módulo…', 'Ir para equipe…', 'Ir para missão…', '—', 'Paleta de comandos ⌘K'],
  'Executar': ['Executar missão', 'Health check', 'Varredura Zero Ghost', '—', 'Reindexar conhecimento'],
  'Terminal': ['Novo terminal', 'Logs ao vivo', '—', 'Limpar console'],
  'Ajuda': ['Documentação', 'Atalhos de teclado', 'Status da plataforma', '—', 'Sobre A FÁBRICA'],
};

/* ---------------- Top menu bar ---------------- */
function MenuBar({ theme, setTheme, onCommand, onToggleCopilot, onToggleExplorer }) {
  const [open, setOpen] = useState(null);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(null); };
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div className="menubar" ref={ref}>
      <div className="mb-brand">
        <span className="mb-mark"><Icon name="flame" size={14} /></span>
        <span className="mb-word">A FÁBRICA</span>
        <span className="mb-os">powered by FORJA</span>
      </div>
      <nav className="mb-menus">
        {Object.keys(MENUS).map(m => (
          <div key={m} className="mb-item-wrap">
            <button className={'mb-item' + (open === m ? ' on' : '')}
              onMouseDown={(e) => { e.preventDefault(); setOpen(open === m ? null : m); }}
              onMouseEnter={() => open && setOpen(m)}>{m}</button>
            {open === m && (
              <div className="mb-dropdown">
                {MENUS[m].map((it, i) => it === '—'
                  ? <div key={i} className="mb-sep" />
                  : <button key={i} className="mb-opt" onClick={() => {
                      setOpen(null);
                      if (it.includes('Tema')) setTheme(theme === 'dark' ? 'light' : 'dark');
                      else if (it.includes('Paleta')) onCommand();
                      else if (it.includes('copiloto')) onToggleCopilot();
                    }}>
                      <span>{it}</span>
                    </button>)}
              </div>
            )}
          </div>
        ))}
      </nav>
      <div className="mb-title">
        <Icon name="git" size={12} style={{ opacity: .5 }} />
        <span className="mono">fabrica · main</span>
        <span className="mb-dot">·</span>
        <span className="muted">Monitor 1</span>
      </div>
      <div className="mb-actions">
        <button className="mb-act" title="Paleta de comandos (⌘K)" onClick={onCommand}><Icon name="command" size={14} /></button>
        <button className="mb-act" title="Notificações"><Icon name="bell" size={14} /><span className="mb-badge">3</span></button>
        <button className="mb-act" title="Tema" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={14} />
        </button>
        <button className="mb-act" title="Explorer (⌘B)" onClick={onToggleExplorer}><Icon name="panelL" size={14} /></button>
        <button className="mb-act" title="Copiloto (⌘\)" onClick={onToggleCopilot}><Icon name="panelR" size={14} /></button>
        <div className="mb-avatar">AR</div>
      </div>
    </div>
  );
}

/* ---------------- Activity bar (nav primária, agrupada) ---------------- */
function ActivityBar({ view, setView }) {
  let lastGroup = null;
  return (
    <div className="activitybar">
      <div className="ab-group">
        {NAV.map(n => {
          const showDiv = lastGroup && n.grupo !== lastGroup;
          lastGroup = n.grupo;
          return (
            <React.Fragment key={n.id}>
              {showDiv && <div className="ab-div" />}
              <button className={'ab-btn' + (view === n.id ? ' on' : '')}
                onClick={() => setView(n.id)} title={n.label + ' · ' + n.grupo}>
                <Icon name={n.icon} size={19} stroke={view === n.id ? 2.2 : 1.8} />
                <span className="ab-tip">{n.label}</span>
              </button>
            </React.Fragment>
          );
        })}
      </div>
      <div className="ab-group">
        <button className={'ab-btn' + (view === 'configuracoes' ? ' on' : '')} onClick={() => setView('configuracoes')} title="Configurações">
          <Icon name="gear" size={20} stroke={1.8} />
          <span className="ab-tip">Configurações</span>
        </button>
      </div>
    </div>
  );
}

/* ---------------- Status bar (Zero Ghost · estado real) ---------------- */
function StatusBar({ view, setView }) {
  const D = window.FORJA;
  const impl = D.modulos.filter(m => m.status === 'IMPL' || m.status === 'CERT').length;
  const dev = D.modulos.filter(m => m.status === 'DEV' || m.status === 'PARCIAL').length;
  const [clock, setClock] = useState('');
  useEffect(() => {
    const t = () => { const d = new Date(); setClock(d.toTimeString().slice(0,8)); };
    t(); const id = setInterval(t, 1000); return () => clearInterval(id);
  }, []);
  return (
    <div className="statusbar">
      <div className="sb-left">
        <span className="sb-item acc"><Icon name="git" size={12} /> main</span>
        <span className="sb-svc" title="Lei Zero Ghost ativa"><span className="dot ok" /><span className="sb-svc-nm">Zero Ghost ativo</span></span>
        <span className="sb-svc"><span className="dot ok" /><span className="sb-svc-nm">{impl} impl.</span></span>
        <span className="sb-svc"><span className="dot warn" /><span className="sb-svc-nm">{dev} em desenv.</span></span>
        <span className="sb-svc"><span className="dot idle" /><span className="sb-svc-nm">{D.modulos.length} módulos</span></span>
      </div>
      <div className="sb-right">
        <span className="sb-item" onClick={()=>setView&&setView('llms')} style={{cursor:'pointer'}}><Icon name="zap" size={12}/> LLMs não configuradas</span>
        <span className="sb-item" onClick={()=>setView&&setView('auditoria')} style={{cursor:'pointer'}}><Icon name="shield" size={12}/> Auditoria</span>
        <span className="sb-item mono">{clock}</span>
        <span className="sb-item acc"><Icon name="flame" size={12} /> A FÁBRICA</span>
      </div>
    </div>
  );
}

Object.assign(window, { NAV, NAV_GROUPS, MENUS, MenuBar, ActivityBar, StatusBar });


/* ============================================================
   A FÁBRICA — Explorer (navegação por grupos · 19 módulos)
   ============================================================ */

function Explorer({ view, setView, onClose }) {
  const D = window.FORJA;
  const groups = NAV_GROUPS;
  const [open, setOpen] = useLocalStorage('forja.explorer.groups', {
    Trabalho: true, 'Negócio': true, 'Operação': true, Recursos: false,
    Garantia: false, Infra: false, Plataforma: false,
  });
  const toggle = (g) => setOpen(o => ({ ...o, [g]: !o[g] }));
  const byGroup = (g) => D.modulos.filter(m => m.grupo === g);
  const tone = (st) => (D.ST[st] || {}).tone || 'idle';

  return (
    <aside className="explorer">
      <div className="exp-head">
        <Icon name="layers" size={13} style={{color:'var(--accent-bright)'}} />
        <span className="exp-title">A FÁBRICA · PLATAFORMA</span>
        <button className="btn ghost icon sm" onClick={onClose} title="Fechar Explorer"><Icon name="x" size={13}/></button>
      </div>
      <div className="exp-body scroll-y">
        {groups.map(g => {
          const items = byGroup(g);
          if (!items.length) return null;
          const isOpen = open[g];
          return (
            <div key={g} className={'exp-group' + (isOpen?'':' collapsed')}>
              <div className="exp-group-head" onClick={() => toggle(g)}>
                <Icon name="chevD" size={11} className="ic-chev" />
                <span>{g}</span>
                <span className="exp-count">{items.length}</span>
              </div>
              {isOpen && <div className="exp-items">
                {items.map(m => (
                  <button key={m.id} className={'exp-item' + (view===m.id?' on':'')} onClick={()=>setView(m.id)}>
                    <Icon name={m.icon} size={12} style={{opacity:.75, flex:'none'}} />
                    <span className="truncate">{m.nome}</span>
                    <span className={'exp-st dot ' + tone(m.status)} title={(D.ST[m.status]||{}).label} />
                  </button>
                ))}
              </div>}
            </div>
          );
        })}

        <div className="exp-group" style={{marginTop:6, borderTop:'1px solid var(--border-faint)', paddingTop:6}}>
          <button className={'exp-item'+(view==='configuracoes'?' on':'')} onClick={()=>setView('configuracoes')} style={{padding:'6px 10px'}}>
            <Icon name="gear" size={12} style={{color:'var(--text-3)'}}/><span>Configurações</span>
          </button>
        </div>

        <div className="exp-legend">
          <div className="eyebrow" style={{marginBottom:6}}>ZERO GHOST · LEGENDA</div>
          <div className="exp-leg-row"><span className="dot ok"/> Implementado</div>
          <div className="exp-leg-row"><span className="dot warn"/> Em desenvolvimento / parcial</div>
          <div className="exp-leg-row"><span className="dot info"/> Não testado / aguardando config.</div>
          <div className="exp-leg-row"><span className="dot idle"/> Não implementado</div>
          <div className="exp-leg-row"><span className="dot err"/> Bloqueado</div>
        </div>
      </div>
    </aside>
  );
}

Object.assign(window, { Explorer });


/* ============================================================
   A FÁBRICA — Command Palette (⌘K · Ctrl+Shift+P)
   ============================================================ */

function CommandPalette({ onClose, setView, setTheme, theme }) {
  const D = window.FORJA;
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current && inputRef.current.focus(); }, []);

  const navCmds = D.modulos.map(m => ({
    sec: 'Ir para', label: m.nome, icon: m.icon, status: m.status, run: () => setView(m.id),
  }));
  const acts = [
    { sec: 'Ações', label: 'Abrir Workspace (Home)', icon: 'flame', run: () => setView('home') },
    { sec: 'Ações', label: 'Ver a verdade do sistema (Auditoria)', icon: 'shield', run: () => setView('auditoria') },
    { sec: 'Ações', label: 'Configurar provedores LLM', icon: 'zap', run: () => setView('llms') },
    { sec: 'Ações', label: 'Conectar integrações', icon: 'link', run: () => setView('integracoes') },
    { sec: 'Ações', label: 'Ver Roadmap da plataforma', icon: 'chart', run: () => setView('roadmap') },
    { sec: 'Vista', label: 'Alternar tema (claro/escuro)', icon: theme==='dark'?'sun':'moon', run: () => setTheme(theme==='dark'?'light':'dark') },
  ];
  const cmds = [...navCmds, ...acts];
  const filtered = cmds.filter(c => c.label.toLowerCase().includes(q.toLowerCase()));
  useEffect(() => { setSel(0); }, [q]);
  const exec = (c) => { c && c.run(); onClose(); };

  return (
    <div className="cmd-scrim" onMouseDown={onClose}>
      <div className="cmd-palette" onMouseDown={e => e.stopPropagation()}>
        <div className="cmd-input">
          <Icon name="search" size={16} style={{ color: 'var(--text-3)' }} />
          <input ref={inputRef} value={q} placeholder="Buscar módulo ou ação…  (⌘K · Ctrl+Shift+P)"
            onChange={e => setQ(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setSel(s => Math.min(s + 1, filtered.length - 1)); }
              else if (e.key === 'ArrowUp') { e.preventDefault(); setSel(s => Math.max(s - 1, 0)); }
              else if (e.key === 'Enter') { e.preventDefault(); exec(filtered[sel]); }
              else if (e.key === 'Escape') onClose();
            }} />
          <span className="kbd">esc</span>
        </div>
        <div className="cmd-list">
          {filtered.length === 0 && <div className="cmd-empty">Nenhum comando encontrado.</div>}
          {filtered.map((c, i) => {
            const prev = i > 0 ? filtered[i-1].sec : null;
            const showSec = c.sec && c.sec !== prev;
            return (
              <React.Fragment key={i}>
                {showSec && <div className="cmd-sec">{c.sec}</div>}
                <button className={'cmd-row' + (i === sel ? ' on' : '')}
                  onMouseEnter={() => setSel(i)} onClick={() => exec(c)}>
                  <Icon name={c.icon} size={15} />
                  <span>{c.label}</span>
                  {c.status && <span style={{marginLeft:'auto'}}><StatusPill status={c.status} size="sm" /></span>}
                  {!c.status && i === sel && <span className="kbd" style={{marginLeft:'auto'}}>↵</span>}
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CommandPalette });


/* ============================================================
   A FÁBRICA — Home / FORJA · Workspace (estilo Cursor/VS Code)
   Chat central (agente + LLM) · Preview · Arquivos · Terminal
   ============================================================ */

function FileTree({ nodes, depth = 0 }) {
  const [open, setOpen] = useState(() => {
    const o = {}; (function walk(ns){ ns.forEach(n=>{ if(n.tipo==='dir'){o[n.nome]=depth<1; if(n.filhos) walk(n.filhos);} }); })(nodes);
    return o;
  });
  return (
    <div className="ftree">
      {nodes.map((n, i) => n.tipo === 'dir' ? (
        <div key={i}>
          <button className="ftree-row" style={{paddingLeft: 8 + depth*12}} onClick={()=>setOpen(o=>({...o,[n.nome]:!o[n.nome]}))}>
            <Icon name="chevR" size={11} style={{transform:open[n.nome]?'rotate(90deg)':'none', transition:'transform .12s', color:'var(--text-3)'}}/>
            <Icon name="folder" size={13} style={{color:'var(--accent-bright)'}}/>
            <span>{n.nome}</span>
          </button>
          {open[n.nome] && n.filhos && <FileTree nodes={n.filhos} depth={depth+1} />}
        </div>
      ) : (
        <button key={i} className="ftree-row file" style={{paddingLeft: 8 + depth*12 + 16}}>
          <Icon name="file" size={12} style={{color:'var(--text-3)'}}/>
          <span>{n.nome}</span>
          <span className="ftree-ext">{n.tipo}</span>
        </button>
      ))}
    </div>
  );
}

function HomeWorkspace({ setView }) {
  const D = window.FORJA;
  const teams = D.equipes || [];
  const [team, setTeam] = useLocalStorage('forja.ws.team', 'orquestrador');
  const [llm, setLLM] = useLocalStorage('forja.ws.llm', 'gemini');
  const [msgs, setMsgs] = useState(D.chatSeed || []);
  const [draft, setDraft] = useState('');
  const [pane, setPane] = useState('preview'); // preview | arquivos | terminal
  const bodyRef = useRef(null);
  const teamObj = teams.find(t=>t.id===team) || teams[0] || {};
  const llmObj = (D.llms || []).find(l=>l.id===llm) || (D.llms || [])[0] || {};

  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [msgs]);

  const send = async () => {
    const t = draft.trim(); if (!t) return;
    setMsgs(m => [...m, { de:'voce', txt:t }]);
    setDraft('');
    
    // Mostra loading
    const loadingId = Date.now();
    setMsgs(m => [...m, { id: loadingId, de:'sistema', preview:true, loading:true, txt:'Processando pelo ' + teamObj.nome + '...' }]);

    try {
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: t, agent_key: team, agent_name: teamObj.nome, provider: llm })
      });
      const data = await res.json();
      
      setMsgs(m => {
        const withoutLoading = m.filter(msg => msg.id !== loadingId);
        return [...withoutLoading, {
          de: data.agent,
          preview: false,
          txt: data.message,
          provider: data.provider_used
        }];
      });
    } catch (err) {
      setMsgs(m => {
        const withoutLoading = m.filter(msg => msg.id !== loadingId);
        return [...withoutLoading, { de:'sistema', preview:true, error:true, txt: 'Erro ao conectar com o Agentic Core.' }];
      });
    }
  };

  return (
    <div className="ws">
      {/* faixa de contexto / instruções */}
      <div className="ws-context hud-grid">
        <div className="ws-ctx-left">
          <span className="ch-icon" style={{width:30,height:30}}><Icon name="flame" size={16}/></span>
          <div>
            <div className="ch-crumb">A FÁBRICA · WORKSPACE</div>
            <div style={{display:'flex',alignItems:'center',gap:9}}>
              <h1 style={{fontFamily:'var(--font-display)',fontSize:16,fontWeight:600,margin:0}}>Home / FORJA</h1>
              <StatusPill status="IMPL" size="sm" />
            </div>
          </div>
        </div>
        <div className="ws-ctx-right">
          <span className="pill"><Icon name="git" size={11}/> fabrica · main</span>
          <span className="pill"><Icon name="target" size={11}/> nenhuma missão ativa</span>
          <button className="btn sm" onClick={()=>setView('missoes')}><Icon name="plus" size={12}/> Nova missão</button>
        </div>
      </div>

      {/* corpo: chat (esq) + painel (dir) */}
      <div className="ws-body">
        {/* CHAT operacional */}
        <section className="ws-chat">
          <div className="ws-chat-head">
            <Icon name="chat" size={14} style={{color:'var(--accent-bright)'}}/>
            <span style={{fontWeight:600,fontSize:13}}>Chat operacional</span>
            <span className="pill" style={{marginLeft:'auto'}}><span className="zg-dot" style={{background:'var(--ok)'}}/> LLMs Online</span>
          </div>

          <div className="ws-chat-body scroll-y" ref={bodyRef}>
            {msgs.map((m,i)=>(
              <div key={i} className={'cp-msg ' + (m.de==='voce'?'me':'ag')}>
                {m.de!=='voce' && (
                  <div className="cp-msg-who">
                    <Icon name={m.preview?'eye':'flame'} size={12}/> 
                    {m.de==='sistema'?'Fábrica':(teams.find(x=>x.id===m.de)?.nome || m.de)} 
                    {m.preview && <span className="pill" style={{padding:'0 6px'}}>preview</span>}
                    {m.provider && <span className="pill" style={{padding:'0 6px', marginLeft: 4, background:'var(--panel-2)', color:'var(--text-3)'}}>via {m.provider}</span>}
                  </div>
                )}
                <div className={'cp-bubble' + (m.preview?' preview':'') + (m.loading?' pulse':'')}>{m.txt}</div>
              </div>
            ))}
          </div>

          <div className="ws-compose">
            <div className="ws-selectors">
              <label className="ws-sel">
                <span className="ws-sel-lb"><Icon name="users" size={11}/> Equipe</span>
                <select value={team} onChange={e=>setTeam(e.target.value)}>
                  {teams.map(t=><option key={t.id} value={t.id}>{t.nome}</option>)}
                </select>
              </label>
              <label className="ws-sel">
                <span className="ws-sel-lb"><Icon name="zap" size={11}/> Modelo</span>
                <select value={llm} onChange={e=>setLLM(e.target.value)}>
                  {(D.llms || []).map(l=><option key={l.id} value={l.id}>{l.nome || l.provider} · {l.ativo?'ativa':'inativa'}</option>)}
                </select>
              </label>
            </div>
            <div className="ws-input">
              <textarea rows={2} placeholder="Instrua a Fábrica… (Enter envia · Shift+Enter nova linha)" value={draft}
                onChange={e=>setDraft(e.target.value)}
                onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();} }} />
              <button className="btn primary icon" onClick={send} title="Enviar"><Icon name="send" size={14}/></button>
            </div>
            <div className="ws-hint">Roteia para <b>{teamObj.nome || 'Agente'}</b> via <b>{llmObj.nome || llmObj.provider || 'Padrão'}</b> · <span className="faint" style={{color:'var(--ok)'}}>Online e pronto</span></div>
          </div>
        </section>

        {/* PAINEL: preview / arquivos / terminal */}
        <section className="ws-panel">
          <div className="ws-tabs">
            {[['preview','Preview','eye'],['arquivos','Arquivos','folder'],['terminal','Terminal','terminal']].map(([id,lb,ic])=>(
              <button key={id} className={'ws-tab'+(pane===id?' on':'')} onClick={()=>setPane(id)}><Icon name={ic} size={12}/> {lb}</button>
            ))}
            <span style={{flex:1}}/>
            <button className="btn ghost icon sm" title="Abrir"><Icon name="link" size={13}/></button>
          </div>
          <div className="ws-panel-body">
            {pane==='preview' && (
              <div className="ws-preview-empty">
                <EmptyState icon="eye" title="Sem preview ativo"
                  status="NTEST"
                  sub="O preview do projeto/missão atual aparecerá aqui quando uma execução for iniciada. Nenhuma missão em andamento." />
              </div>
            )}
            {pane==='arquivos' && (
              <div className="ws-files scroll-y">
                <div className="ws-files-head"><span className="eyebrow">PROJETO · a-fabrica</span><StatusPill status="DEV" size="sm"/></div>
                <FileTree nodes={D.arvore || []} />
              </div>
            )}
            {pane==='terminal' && (
              <div className="term ws-term">
                <div className="ln"><span className="t">$</span><span className="lv-acc">fabrica status</span></div>
                <div className="ln"><span className="t"> </span><span className="lv-info">plataforma: A FÁBRICA · build dev</span></div>
                <div className="ln"><span className="t"> </span><span className="lv-ok">workspace: pronto</span></div>
                <div className="ln"><span className="t"> </span><span className="lv-ok">llms: conectadas e roteadas</span></div>
                <div className="ln"><span className="t"> </span><span className="lv-warn">runtime: em desenvolvimento</span></div>
                <div className="ln"><span className="t"> </span><span className="lv-info">zero-ghost: ativo · 0 violações</span></div>
                <div className="ln"><span className="t">$</span><span className="lv-acc blink">_</span></div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* rodapé do workspace: evidências / alertas reais */}
      <div className="ws-foot">
        <div className="ws-foot-col">
          <span className="eyebrow"><Icon name="doc" size={11}/> Evidências recentes</span>
          <span className="faint" style={{fontSize:11.5}}>Nenhuma evidência registrada ainda · <StatusPill status="NIMPL" size="sm"/></span>
        </div>
        <div className="ws-foot-col">
          <span className="eyebrow"><Icon name="alert" size={11}/> Alertas reais</span>
          <span style={{fontSize:11.5}}>2 itens precisam de configuração: <button className="lnk" onClick={()=>setView('llms')}>LLMs</button> · <button className="lnk" onClick={()=>setView('integracoes')}>Integrações</button></span>
        </div>
        <div className="ws-foot-col">
          <span className="eyebrow"><Icon name="target" size={11}/> Missão atual</span>
          <span className="faint" style={{fontSize:11.5}}>Nenhuma missão em andamento</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HomeWorkspace, FileTree });


/* ============================================================
   A FÁBRICA — HOME · Centro Executivo de Observabilidade
   (Monitor 1) · Zero Ghost Law · somente dados reais
   FORJA permanece intacta (rota separada).
   ============================================================ */

/* count-up animado (respeita prefers-reduced-motion) */
function useCountUp(target, dur = 900) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setV(target); return; }
    let raf, start;
    const tick = (t) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, dur]);
  return v;
}

function CountUp({ value, dur }) { const v = useCountUp(value, dur); return <span>{v}</span>; }

/* medidor radial animado (dado real) */
function RadialGauge({ value, size = 132, stroke = 12, label, sub }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  const [off, setOff] = useState(c);
  useEffect(() => {
    const id = requestAnimationFrame(() => setOff(c * (1 - value)));
    return () => cancelAnimationFrame(id);
  }, [value, c]);
  const pct = useCountUp(Math.round(value * 100));
  const col = value >= 0.66 ? 'var(--ok)' : value >= 0.33 ? 'var(--warn)' : 'var(--accent)';
  return (
    <div className="rgauge" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id="rgg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--accent-bright)" />
            <stop offset="1" stopColor={col} />
          </linearGradient>
        </defs>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--bg-4)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="url(#rgg)" strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.16,1,.3,1)', filter: 'drop-shadow(0 0 6px var(--accent-glow))' }} />
      </svg>
      <div className="rgauge-c">
        <div className="rgauge-v">{pct}<span className="rgauge-pct">%</span></div>
        {label && <div className="rgauge-l">{label}</div>}
        {sub && <div className="rgauge-s">{sub}</div>}
      </div>
    </div>
  );
}

function ExecutiveHome({ setView }) {
  const D = window.FORJA;

  /* ---- métricas REAIS derivadas do estado da plataforma ---- */
  const implCount  = D.modulos.filter(m => m.status === 'IMPL' || m.status === 'CERT').length;
  const devCount   = D.modulos.filter(m => m.status === 'DEV'  || m.status === 'PARCIAL').length;
  const equipesEstrut = D.equipes.length;
  const intConect  = D.integracoes.filter(i => i.status === 'IMPL' || i.status === 'CERT').length;
  const llmAtivos  = D.llms.filter(l => l.status === 'IMPL' || l.status === 'CERT').length;
  const prontidao  = implCount / D.modulos.length;  /* índice real de prontidão */

  /* status geral honesto: nada crítico, mas há itens aguardando → Atenção */
  const overall = (llmAtivos === 0 || intConect === 0) ? 'warn' : (devCount > 0 ? 'warn' : 'ok');
  const overallLabel = overall === 'ok' ? 'Operacional' : overall === 'warn' ? 'Atenção' : 'Crítico';
  const overallDesc = 'Plataforma em construção · LLMs e integrações aguardando configuração';

  /* contadores reais (zero quando não há dado) */
  const resumo = [
    { k: 'Projetos',     v: 0,             sub: 'nenhum criado' },
    { k: 'Missões',      v: 0,             sub: 'nenhuma ativa' },
    { k: 'Artefatos',    v: 0,             sub: 'nenhum gerado' },
    { k: 'Equipes',      v: equipesEstrut, sub: 'estrutura criada' },
    { k: 'Integrações',  v: intConect,     sub: intConect ? 'conectadas' : 'nenhuma conectada' },
  ];

  /* saúde dos sistemas (real: derivado de operações + integrações) */
  const sistemas = [
    { nome: 'Banco de Dados',     icon: 'db',       st: 'DEV',    nota: 'não provisionado' },
    { nome: 'API Core',           icon: 'zap',      st: 'DEV',    nota: 'em desenvolvimento' },
    { nome: 'GitHub',             icon: 'git',      st: 'IMPL',   nota: '2 contas conectadas' },
    { nome: 'Sistema de Arquivos',icon: 'folder',   st: 'IMPL',   nota: 'operacional' },
    { nome: 'Scheduler',          icon: 'clock',    st: 'NIMPL',  nota: 'não configurado' },
    { nome: 'Runtime',            icon: 'cpu',      st: 'DEV',    nota: 'em desenvolvimento' },
    { nome: 'Logs',               icon: 'terminal', st: 'DEV',    nota: 'coletando local' },
    { nome: 'Auditoria',          icon: 'shield',   st: 'IMPL',   nota: 'operacional' },
  ];

  const hora = new Date().toTimeString().slice(0,8);
  const tone = (st) => (D.ST[st] || {}).tone || 'idle';

  /* alertas REAIS (derivados de configuração pendente) */
  const alertas = [
    { sev: 'warn', txt: 'Nenhum provedor LLM configurado', acao: 'llms' },
    { sev: 'warn', txt: 'GitHub não testado / não conectado', acao: 'integracoes' },
    { sev: 'info', txt: 'Banco de dados não provisionado', acao: 'operacoes' },
    { sev: 'info', txt: 'Backups não configurados', acao: 'operacoes' },
  ];

  const equipesView = D.equipes.slice(0, 9);

  return (
    <div className="exec scroll-y">
      {/* ===== BLOCO 1 · HERO EXECUTIVO ===== */}
      <section className={'exec-hero hud-grid glow-' + overall}>
        <div className="exec-hero-main">
          <div className="exec-eyebrow">A FÁBRICA · MONITOR 1 · CENTRO EXECUTIVO</div>
          <div className="exec-status">
            <span className={'exec-orb ' + overall} />
            <div>
              <div className="exec-status-l">{overallLabel}</div>
              <div className="exec-status-d">{overallDesc}</div>
            </div>
          </div>
          <div className="exec-hero-actions">
            <button className="btn primary" onClick={()=>setView('forja')}><Icon name="flame" size={13}/> Abrir FORJA</button>
            <button className="btn" onClick={()=>setView('auditoria')}><Icon name="shield" size={13}/> Ver auditoria</button>
            <span className="exec-clock mono"><span className="dot ok blink"/> live · {hora}</span>
          </div>
        </div>
        <div className="exec-hero-gauge">
          <RadialGauge value={prontidao} label="Prontidão" sub={implCount + '/' + D.modulos.length + ' módulos'} />
        </div>
        <div className="exec-hero-resumo">
          {resumo.map((r,i) => (
            <div className="exec-rkpi" key={r.k}>
              <div className="exec-rkpi-v"><CountUp value={r.v} dur={700 + i*120} /></div>
              <div className="exec-rkpi-k">{r.k}</div>
              <div className="exec-rkpi-s">{r.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== BLOCO 2 · SAÚDE DOS SISTEMAS ===== */}
      <ExecSection icon="activity" title="Saúde dos sistemas" hint="verificado às " hintMono={hora}>
        <div className="exec-grid">
          {sistemas.map(s => (
            <div className="exec-syscard" key={s.nome}>
              <div className="exec-syscard-top">
                <span className="exec-sysic"><Icon name={s.icon} size={15}/></span>
                <span className={'dot ' + tone(s.st)} />
              </div>
              <div className="exec-syscard-nm">{s.nome}</div>
              <div className="exec-syscard-st"><StatusPill status={s.st} size="sm"/></div>
              <div className="exec-syscard-meta mono">últ. verif. {hora}</div>
            </div>
          ))}
        </div>
      </ExecSection>

      {/* ===== BLOCO 3 · LLM COMMAND CENTER ===== */}
      <ExecSection icon="zap" title="LLM Command Center" right={<StatusPill status="CONFIG" size="sm"/>}>
        <div className="exec-llm-grid">
          {D.llms.map(l => (
            <div className="exec-llm" key={l.id}>
              <div className="exec-llm-top">
                <span className={'dot ' + tone(l.status)} />
                <span className="exec-llm-nm">{l.nome}</span>
              </div>
              <div className="exec-llm-model mono">{l.modelo}</div>
              <div className="exec-llm-rows">
                <div><span className="faint">Latência</span><span className="mono">{l.latencia}</span></div>
                <div><span className="faint">Últ. exec.</span><span className="mono">{l.ultimoTeste}</span></div>
                <div><span className="faint">Provider</span><span className="mono">{l.conexao[0]}</span></div>
              </div>
              <StatusPill status={l.status} size="sm"/>
            </div>
          ))}
        </div>
      </ExecSection>

      <div className="exec-2col">
        {/* ===== BLOCO 4 · MISSÕES ===== */}
        <ExecSection icon="target" title="Missões" right={<button className="btn ghost sm" onClick={()=>setView('missoes')}>Abrir <Icon name="chevR" size={12}/></button>}>
          <div className="exec-mini-grid">
            {[['Em execução','ok',0],['Concluídas','info',0],['Bloqueadas','err',0],['Aguardando','idle',0]].map(([l,c,v])=>(
              <div className="exec-mini" key={l}>
                <div className="exec-mini-v"><CountUp value={v} /></div>
                <div className="exec-mini-l"><span className={'dot '+c}/> {l}</div>
                <div className="exec-spark"><svg viewBox="0 0 100 20" preserveAspectRatio="none"><line x1="0" y1="19" x2="100" y2="19" stroke="var(--border-strong)" strokeWidth="1" strokeDasharray="3 3"/></svg></div>
              </div>
            ))}
          </div>
          <div className="exec-empty-note"><Icon name="target" size={13}/> Nenhuma missão registrada — crie a primeira na FORJA.</div>
        </ExecSection>

        {/* ===== BLOCO 6 · GITHUB COMMAND CENTER ===== */}
        <ExecSection icon="git" title="GitHub Command Center" right={<StatusPill status="IMPL" size="sm"/>}>
          <dl className="kv exec-kv" style={{marginBottom:10}}>
            <dt>Conta 1</dt><dd className="mono">CipolariCreator (Ativa)</dd>
            <dt>Conta 2</dt><dd className="mono">Servdia (Ativa)</dd>
            <dt>Branch atual</dt><dd className="mono faint">main</dd>
            <dt>Último commit</dt><dd className="faint">Sincronizado</dd>
            <dt>Sincronização</dt><dd className="faint" style={{color:'var(--ok)'}}>Operacional bidirecional</dd>
          </dl>
          <div className="exec-syscard-top" style={{marginTop:8, padding: '6px 10px', background:'var(--bg-3)', borderRadius:4}}>
            <span className="exec-sysic"><Icon name="shield" size={13}/></span>
            <span style={{fontSize:12, color:'var(--text-2)'}}>Acesso Total Autorizado</span>
            <span className="dot ok" style={{marginLeft:'auto'}}/>
          </div>
        </ExecSection>
      </div>

      {/* ===== BLOCO 5 · EQUIPES ===== */}
      <ExecSection icon="users" title="Equipes" right={<button className="btn ghost sm" onClick={()=>setView('equipes')}>Todas <Icon name="chevR" size={12}/></button>}>
        <div className="exec-team-grid">
          {equipesView.map(t => (
            <button className="exec-team" key={t.id} onClick={()=>{ localStorage.setItem('forja.team.open', JSON.stringify(t.id)); setView('equipes'); }}>
              <span className="exec-sysic"><Icon name={t.icon} size={14}/></span>
              <div style={{minWidth:0,flex:1,textAlign:'left'}}>
                <div className="exec-team-nm">{t.nome}</div>
                <div className="exec-team-act faint">Sem atividade</div>
              </div>
              <span className={'dot ' + tone(t.status)} />
            </button>
          ))}
        </div>
      </ExecSection>

      <div className="exec-2col">
        {/* ===== BLOCO 7 · TIMELINE OPERACIONAL ===== */}
        <ExecSection icon="activity" title="Timeline operacional">
          <div className="exec-timeline-empty">
            <EmptyState icon="clock" title="Nenhuma atividade registrada"
              sub="Eventos reais (projetos, missões, artefatos, commits, deploys) aparecerão aqui em ordem cronológica." />
          </div>
        </ExecSection>

        {/* ===== BLOCO 8 · ALERTAS REAIS ===== */}
        <ExecSection icon="alert" title="Alertas reais" right={<span className="pill warn">{alertas.length}</span>}>
          <div className="exec-alerts">
            {alertas.map((a,i)=>(
              <button key={i} className="exec-alert" onClick={()=>setView(a.acao)}>
                <span className={'dot ' + (a.sev==='warn'?'warn':a.sev==='err'?'err':'info')} />
                <span style={{flex:1,textAlign:'left',fontSize:12.5}}>{a.txt}</span>
                <Icon name="chevR" size={13} style={{color:'var(--text-3)'}}/>
              </button>
            ))}
          </div>
        </ExecSection>
      </div>

      {/* ===== BLOCO 9 · UTILIZAÇÃO DA FÁBRICA ===== */}
      <ExecSection icon="chart" title="Utilização da Fábrica" hint="período: desde o início · ">
        <div className="exec-util-grid">
          {[['Projetos',0],['Missões',0],['Artefatos',0],['Arquivos',0],['Deploys',0],['Integrações',intConect]].map(([l,v])=>(
            <div className="exec-util" key={l}>
              <div className="exec-util-v"><CountUp value={v} /></div>
              <div className="exec-util-l">{l}</div>
              <div className="exec-util-bar"><span style={{width: v>0? Math.min(100, v*8)+'%':'4%'}} /></div>
            </div>
          ))}
        </div>
        <div className="exec-empty-note"><Icon name="shield" size={13}/> Métricas reais · valores em zero até a primeira operação (Zero Ghost Law).</div>
      </ExecSection>

      <div className="exec-foot faint">A FÁBRICA · Monitor 1 · dados reais apenas · a FORJA permanece como área operacional</div>
    </div>
  );
}

/* seção executiva reutilizável */
function ExecSection({ icon, title, right, hint, hintMono, children }) {
  return (
    <section className="exec-sec">
      <div className="exec-sec-head">
        <Icon name={icon} size={14} style={{color:'var(--accent-bright)'}}/>
        <h2>{title}</h2>
        {hint && <span className="exec-sec-hint">{hint}{hintMono && <span className="mono">{hintMono}</span>}</span>}
        {right && <span className="exec-sec-right">{right}</span>}
      </div>
      <div className="exec-sec-body">{children}</div>
    </section>
  );
}

Object.assign(window, { ExecutiveHome, ExecSection, RadialGauge, CountUp });


/* ============================================================
   A FÁBRICA — Equipes (15) + página de equipe padronizada
   ============================================================ */

function EquipesCenter({ setView }) {
  const D = window.FORJA;
  const [openTeam, setOpenTeam] = useLocalStorage('forja.team.open', null);
  if (openTeam) {
    const t = D.equipes.find(e => e.id === openTeam);
    if (t) return <EquipePage team={t} onBack={() => setOpenTeam(null)} setView={setView} />;
  }
  const dev = D.equipes.filter(e => e.status === 'DEV').length;
  return (
    <div className="center">
      <PageHead icon="users" crumb="Operação" title="Equipes" status="DEV"
        sub={D.equipes.length + ' equipes · estrutura criada · agentes não implementados (Zero Ghost)'}>
        <button className="btn"><Icon name="plus" size={13}/> Nova equipe</button>
      </PageHead>
      <div className="center-body">
        <div className="card" style={{padding:'12px 16px', marginBottom:16, display:'flex', alignItems:'center', gap:12}}>
          <Icon name="shield" size={16} style={{color:'var(--accent-bright)'}}/>
          <span style={{fontSize:12.5}} className="muted">Esta página mostra <b style={{color:'var(--text-1)'}}>equipes</b>, não agentes individuais. Cada equipe abre sua própria página. {dev} equipes em estruturação ativa.</span>
        </div>
        <div className="team-grid">
          {D.equipes.map(t => (
            <button key={t.id} className="team-card" onClick={()=>setOpenTeam(t.id)}>
              <div className="team-card-top">
                <span className="ch-icon" style={{width:34,height:34}}><Icon name={t.icon} size={17}/></span>
                <div style={{minWidth:0,flex:1,textAlign:'left'}}>
                  <div className="team-card-name">{t.nome}</div>
                  <StatusPill status={t.status} size="sm" />
                </div>
                <Icon name="chevR" size={15} style={{color:'var(--text-3)'}}/>
              </div>
              <div className="team-card-sobre">{t.sobre}</div>
              <div className="team-card-foot">
                {t.skills.slice(0,3).map(s=><span key={s} className="tag">{s}</span>)}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function EquipePage({ team, onBack, setView }) {
  const t = team;
  const Section = ({ icon, title, children, status }) => (
    <div className="panel">
      <div className="panel-head"><Icon name={icon} size={14} style={{color:'var(--text-2)'}}/><h3>{title}</h3>{status && <StatusPill status={status} size="sm"/>}</div>
      <div className="panel-body">{children}</div>
    </div>
  );
  const TagList = ({ items }) => <div className="tags">{items.map(i=><span key={i} className="tag">{i}</span>)}</div>;

  return (
    <div className="center">
      <div className="center-head hud-grid">
        <div className="ch-top">
          <button className="btn ghost icon" onClick={onBack} title="Voltar"><Icon name="chevR" size={16} style={{transform:'rotate(180deg)'}}/></button>
          <div className="ch-icon"><Icon name={t.icon} size={19}/></div>
          <div className="ch-titles">
            <div className="ch-crumb">A FÁBRICA · Equipes</div>
            <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
              <h1 className="ch-title">Equipe {t.nome}</h1>
              <StatusPill status={t.status} />
            </div>
            <div className="ch-sub">{t.sobre}</div>
          </div>
          <div className="ch-actions">
            <button className="btn" onClick={()=>setView('missoes')}><Icon name="target" size={13}/> Missões</button>
            <button className="btn primary"><Icon name="play2" size={12}/> Ativar equipe</button>
          </div>
        </div>
      </div>

      <div className="center-body">
        <div className="card" style={{padding:'12px 16px', marginBottom:16, display:'flex', alignItems:'center', gap:12, borderColor:'var(--warn)', background:'var(--warn-soft)'}}>
          <Icon name="alert" size={16} style={{color:'var(--warn)'}}/>
          <span style={{fontSize:12.5}}>Estrutura operacional criada. Agentes e métricas <b>não implementados</b> — nenhum dado de execução é exibido (Zero Ghost Law).</span>
        </div>

        <div className="grid-2" style={{alignItems:'start', gap:14}}>
          <div className="col">
            <Section icon="book" title="Sobre & o que faz">
              <p style={{margin:0, fontSize:13, lineHeight:1.6}}>{t.sobre}</p>
            </Section>
            <Section icon="check" title="Responsabilidades">
              <ul className="bul">{t.responsabilidades.map(r=><li key={r}>{r}</li>)}</ul>
            </Section>
            <Section icon="target" title="Missões da equipe" status="NIMPL">
              <EmptyState icon="target" title="Sem missões atribuídas" sub="As missões aparecerão aqui quando a equipe for ativada." />
            </Section>
            <Section icon="activity" title="Métricas" status="NTEST">
              <div className="kv">
                <dt>Missões concluídas</dt><dd className="faint">— não medido</dd>
                <dt>Tempo médio</dt><dd className="faint">— não medido</dd>
                <dt>Taxa de sucesso</dt><dd className="faint">— não medido</dd>
                <dt>Custo</dt><dd className="faint">— não medido</dd>
              </div>
            </Section>
          </div>
          <div className="col">
            <Section icon="wrench" title="Ferramentas usadas">
              <TagList items={t.ferramentas} />
            </Section>
            <Section icon="zap" title="Skills">
              <TagList items={t.skills} />
            </Section>
            <Section icon="route" title="Workflows">
              <TagList items={t.workflows} />
            </Section>
            <Section icon="award" title="Validação & Auditoria" status="NTEST">
              <div className="kv">
                <dt>Validação</dt><dd><StatusPill status="NIMPL" size="sm"/></dd>
                <dt>Auditoria</dt><dd><StatusPill status="NTEST" size="sm"/></dd>
                <dt>Pendências</dt><dd>Definir agentes e ferramentas</dd>
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { EquipesCenter, EquipePage });


/* ============================================================
   A FÁBRICA — Módulos A: Clientes, Projetos, Missões,
   Inteligência, LLMs, Ferramentas, Integrações, Conhecimento
   ============================================================ */

/* ---------- CLIENTES ---------- */
function ClientesCenter({ setView }) {
  return (
    <div className="center">
      <PageHead icon="building" crumb="Negócio" title="Clientes" status="NIMPL"
        sub="Organização de clientes atuais e futuros">
        <button className="btn primary"><Icon name="plus" size={13}/> Novo cliente</button>
      </PageHead>
      <div className="center-body">
        <EmptyState icon="building" title="Sem clientes cadastrados" status="NIMPL"
          sub="Nenhum cliente foi cadastrado. Cada cliente poderá ter dados gerais, projetos e missões vinculadas, status, entregas e histórico."
          action="Cadastrar primeiro cliente" onAction={()=>{}} />
        <div className="grid-3" style={{marginTop:18}}>
          {['Dados gerais','Projetos vinculados','Missões vinculadas','Entregas','Histórico','Status'].map(s=>(
            <div className="panel" key={s} style={{opacity:.7}}><div className="panel-body" style={{display:'flex',alignItems:'center',gap:10}}><Icon name="folder" size={14} style={{color:'var(--text-3)'}}/><span style={{fontSize:12.5}}>{s}</span><span style={{marginLeft:'auto'}}><StatusPill status="NIMPL" size="sm"/></span></div></div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- PROJETOS ---------- */
function ProjetosCenter({ setView }) {
  const estados = ['Planejado','Em andamento','Em teste','Validado','Entregue','Arquivado'];
  return (
    <div className="center">
      <PageHead icon="folder" crumb="Negócio" title="Projetos" status="DEV"
        sub="Projetos vinculados a clientes, missões, equipes e evidências">
        <button className="btn primary"><Icon name="plus" size={13}/> Novo projeto</button>
      </PageHead>
      <div className="center-body section-gap">
        <div className="kanban" style={{height:'auto'}}>
          {estados.map(e=>(
            <div className="kan-col" key={e}>
              <div className="kan-head"><span className="dot idle"/><span style={{fontWeight:600,fontSize:12}}>{e}</span><span className="count">0</span></div>
              <div className="kan-body"><div className="faint" style={{fontSize:11,padding:'10px 6px'}}>vazio</div></div>
            </div>
          ))}
        </div>
        <SectionCard icon="folder" title="Estrutura de um projeto" status="DEV">
          <div className="tags">{['Nome','Cliente','Status','Missões','Equipes','Documentos','Evidências','Auditorias','Entregas'].map(s=><span key={s} className="tag">{s}</span>)}</div>
        </SectionCard>
      </div>
    </div>
  );
}

/* ---------- MISSÕES ---------- */
function MissoesCenter({ setView }) {
  const cols = ['Planejamento','Desenvolvimento','Execução','Testes','Validação','Concluídas','Canceladas','Bloqueadas'];
  return (
    <div className="center">
      <PageHead icon="target" crumb="Operação" title="Missões" status="DEV"
        sub="Controle operacional · cada missão: objetivo, equipe, LLM, custo, tempo, evidências, logs, resultado">
        <button className="btn primary"><Icon name="plus" size={13}/> Nova missão</button>
      </PageHead>
      <div className="center-body section-gap">
        <div className="kanban" style={{height:'auto'}}>
          {cols.map((c,i)=>(
            <div className="kan-col" key={c}>
              <div className="kan-head"><span className={'dot '+(c==='Bloqueadas'?'err':c==='Concluídas'?'ok':'idle')}/><span style={{fontWeight:600,fontSize:11.5}}>{c}</span><span className="count">0</span></div>
              <div className="kan-body"><div className="faint" style={{fontSize:11,padding:'10px 6px'}}>vazio</div></div>
            </div>
          ))}
        </div>
        <div className="grid-2">
          <SectionCard icon="target" title="Campos de uma missão" status="DEV">
            <div className="tags">{['Objetivo','Status','Equipe responsável','LLM utilizada','Custo','Tempo','Evidências','Logs','Resultado'].map(s=><span key={s} className="tag">{s}</span>)}</div>
          </SectionCard>
          <SectionCard icon="doc" title="Histórico" status="NIMPL">
            <EmptyState icon="clock" title="Sem histórico" sub="Missões executadas aparecerão aqui." />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

/* ---------- INTELIGÊNCIA ---------- */
function InteligenciaCenter({ setView }) {
  const areas = [
    ['Concorrentes','compass'],['Tendências','chart'],['Benchmark','activity'],['SEO','search'],
    ['Oportunidades','zap'],['Análise visual','eye'],['Pesquisa de mercado','book'],['Relatórios estratégicos','doc'],
  ];
  return (
    <div className="center">
      <PageHead icon="compass" crumb="Operação" title="Inteligência" status="NIMPL"
        sub="Inteligência de mercado · apenas fontes públicas e autorizadas · sem dados fictícios">
        <button className="btn"><Icon name="refresh" size={13}/> Varrer mercado</button>
      </PageHead>
      <div className="center-body">
        <EmptyState icon="compass" title="Inteligência ainda não implementada" status="NIMPL"
          sub="As análises serão geradas a partir de fontes públicas autorizadas quando o módulo for ativado." />
        <div className="grid-3" style={{marginTop:18}}>
          {areas.map(([a,ic])=>(
            <div className="panel" key={a} style={{opacity:.7}}><div className="panel-body" style={{display:'flex',alignItems:'center',gap:10}}><Icon name={ic} size={14} style={{color:'var(--text-3)'}}/><span style={{fontSize:12.5}}>{a}</span><span style={{marginLeft:'auto'}}><StatusPill status="NIMPL" size="sm"/></span></div></div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- LLMs ---------- */
function LLMsCenter({ setView }) {
  const D = window.FORJA;
  const [sel, setSel] = useState(D.llms[0]);
  return (
    <div className="center">
      <PageHead icon="zap" crumb="Recursos" title="LLMs" status="CONFIG"
        sub="Provedores de IA · nenhum configurado · conecte por assinatura, API ou local">
        <button className="btn primary" onClick={()=>setView('configuracoes')}><Icon name="lock" size={13}/> Configurar no cofre</button>
      </PageHead>
      <div className="center-split wide">
        <div className="split-main">
          <div className="team-grid">
            {D.llms.map(l=>(
              <button key={l.id} className="team-card" onClick={()=>setSel(l)} style={sel.id===l.id?{borderColor:'var(--accent-line)',background:'var(--accent-soft)'}:null}>
                <div className="team-card-top">
                  <span className="ch-icon" style={{width:34,height:34}}><Icon name="zap" size={17}/></span>
                  <div style={{minWidth:0,flex:1,textAlign:'left'}}>
                    <div className="team-card-name">{l.nome}</div>
                    <StatusPill status={l.status} size="sm"/>
                  </div>
                </div>
                <div className="team-card-sobre">Modelo: {l.modelo}</div>
                <div className="kv" style={{fontSize:11,marginTop:4}}>
                  <dt>Último teste</dt><dd className="faint">{l.ultimoTeste}</dd>
                  <dt>Latência</dt><dd className="faint">{l.latencia}</dd>
                  <dt>Custo</dt><dd className="faint">{l.custo}</dd>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="split-side"><div className="detail">
          <div className="detail-head"><div className="ch-crumb">{sel.nome}</div><h2>{sel.nome}</h2><StatusPill status={sel.status}/></div>
          <div className="detail-block"><span className="eyebrow">Métodos de conexão</span>
            <div className="tags">{sel.conexao.map(c=><span key={c} className="tag">{c}</span>)}</div>
          </div>
          <div className="detail-block"><span className="eyebrow">Telemetria</span>
            <div className="kv">
              <dt>Modelo</dt><dd className="mono">{sel.modelo}</dd>
              <dt>Último teste</dt><dd className="faint">{sel.ultimoTeste}</dd>
              <dt>Latência</dt><dd className="faint">{sel.latencia}</dd>
              <dt>Custo</dt><dd className="faint">{sel.custo}</dd>
              <dt>Uso</dt><dd className="faint">{sel.uso}</dd>
            </div>
          </div>
          <div className="card" style={{padding:11, display:'flex',gap:9,alignItems:'center', borderColor:'var(--info)', background:'var(--info-soft)'}}>
            <Icon name="lock" size={15} style={{color:'var(--info)'}}/><span style={{fontSize:11.5}}>Chaves e tokens ficam no cofre seguro — nunca exibidos no painel.</span>
          </div>
          <button className="btn primary" style={{width:'100%'}} onClick={()=>setView('configuracoes')}><Icon name="plus" size={12}/> Conectar provedor</button>
        </div></div>
      </div>
    </div>
  );
}

/* ---------- FERRAMENTAS ---------- */
function FerramentasCenter({ setView }) {
  const D = window.FORJA;
  const classeTone = { 'integrada':'IMPL', 'conectada':'PARCIAL', 'externa':'NTEST', };
  return (
    <div className="center">
      <PageHead icon="wrench" crumb="Recursos" title="Ferramentas" status="DEV"
        sub="Ferramentas de trabalho · externa · conectada · integrada · não implementada">
        <button className="btn primary"><Icon name="plus" size={13}/> Adicionar</button>
      </PageHead>
      <div className="center-body">
        <div className="team-grid">
          {D.ferramentas.map(f=>(
            <div key={f.id} className="team-card" style={{cursor:'default'}}>
              <div className="team-card-top">
                <span className="ch-icon" style={{width:34,height:34}}><Icon name={f.icon} size={16}/></span>
                <div style={{minWidth:0,flex:1}}>
                  <div className="team-card-name">{f.nome}</div>
                  <span className="faint" style={{fontSize:11}}>{f.tipo}</span>
                </div>
                <StatusPill status={f.status} size="sm"/>
              </div>
              <div className="team-card-foot" style={{justifyContent:'space-between'}}>
                <span className="tag">{f.classe}</span>
                <button className="btn ghost sm" disabled style={{opacity:.5}}>Conectar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- INTEGRAÇÕES ---------- */
function IntegracoesCenter({ setView }) {
  const D = window.FORJA;
  return (
    <div className="center">
      <PageHead icon="link" crumb="Recursos" title="Integrações" status="PARCIAL"
        sub="Integrações técnicas e APIs · status, autenticação, permissões e logs">
        <button className="btn primary"><Icon name="plus" size={13}/> Nova integração</button>
      </PageHead>
      <div className="center-body">
        <SectionCard icon="link" title="Conexões" flush>
          <div className="tbl-wrap"><table className="tbl"><thead><tr><th>Integração</th><th>Auth</th><th>Permissões</th><th>Último teste</th><th>Status</th></tr></thead>
          <tbody>
            {D.integracoes.map(i=>(
              <tr key={i.id} style={{cursor:'default'}}>
                <td className="cell-strong">{i.nome}</td>
                <td className="mono muted" style={{fontSize:11}}>{i.auth}</td>
                <td className="muted">{i.permissoes}</td>
                <td className="faint" style={{fontSize:11}}>{i.ultimoTeste}</td>
                <td><StatusPill status={i.status} size="sm"/></td>
              </tr>
            ))}
          </tbody></table></div>
        </SectionCard>
        <div className="card" style={{padding:11, marginTop:14, display:'flex',gap:9,alignItems:'center', borderColor:'var(--info)', background:'var(--info-soft)'}}>
          <Icon name="lock" size={15} style={{color:'var(--info)'}}/><span style={{fontSize:12}}>OAuth, tokens e segredos ficam no cofre seguro — nunca no frontend, código ou GitHub.</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- CONHECIMENTO ---------- */
function ConhecimentoCenter({ setView }) {
  const D = window.FORJA;
  return (
    <div className="center">
      <PageHead icon="book" crumb="Recursos" title="Conhecimento" status="DEV"
        sub="Rules · Workflows · Skills · Templates · Biblioteca · Memória · estrutura pronta, vazia">
        <button className="btn primary"><Icon name="plus" size={13}/> Adicionar</button>
      </PageHead>
      <div className="center-body">
        <div className="team-grid">
          {D.conhecimento.map(c=>(
            <div key={c.id} className="team-card" style={{cursor:'default'}}>
              <div className="team-card-top">
                <span className="ch-icon" style={{width:34,height:34}}><Icon name={c.icon} size={16}/></span>
                <div style={{minWidth:0,flex:1}}>
                  <div className="team-card-name">{c.nome}</div>
                  <span className="faint" style={{fontSize:11}}>{c.sub}</span>
                </div>
                <StatusPill status={c.status} size="sm"/>
              </div>
              <div className="team-card-foot" style={{justifyContent:'space-between'}}>
                <span className="mono" style={{fontSize:18,fontWeight:600}}>{c.count}</span>
                <span className="faint" style={{fontSize:11}}>itens</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ClientesCenter, ProjetosCenter, MissoesCenter, InteligenciaCenter, LLMsCenter, FerramentasCenter, IntegracoesCenter, ConhecimentoCenter });


/* ============================================================
   A FÁBRICA — Módulos B: Testes, Validação, Auditoria, Operações,
   Financeiro, Roadmap, Academia, Ajuda, Configurações
   ============================================================ */

/* ---------- TESTES ---------- */
function TestesCenter() {
  const secs = [['Executados','flask','NIMPL'],['Pendentes','clock','NIMPL'],['Aprovados','check','NIMPL'],['Reprovados','x','NIMPL'],['Histórico','doc','NIMPL']];
  return (
    <div className="center">
      <PageHead icon="flask" crumb="Garantia" title="Testes" status="NIMPL"
        sub="Centralização de testes do sistema · execução, status, histórico, logs e relatório">
        <button className="btn primary" disabled style={{opacity:.5}}><Icon name="play2" size={12}/> Rodar testes</button>
      </PageHead>
      <div className="center-body">
        <EmptyState icon="flask" title="Nenhum teste executado" status="NIMPL"
          sub="A suíte de testes ainda não foi implementada. Os resultados aparecerão por categoria quando ativada." />
        <div className="grid-3" style={{marginTop:18}}>
          {secs.map(([s,ic,st])=>(
            <div className="panel" key={s}><div className="panel-body" style={{display:'flex',alignItems:'center',gap:10}}><Icon name={ic} size={14} style={{color:'var(--text-3)'}}/><span style={{fontSize:12.5,flex:1}}>{s}</span><span className="mono faint">0</span><StatusPill status={st} size="sm"/></div></div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- VALIDAÇÃO ---------- */
function ValidacaoCenter() {
  const secs = [['Validações','award'],['Certificações','check'],['Aprovações','check'],['Evidências','doc'],['Pendências','alert']];
  return (
    <div className="center">
      <PageHead icon="award" crumb="Garantia" title="Validação" status="NIMPL"
        sub="Validações e certificações por módulo · evidências e pendências">
      </PageHead>
      <div className="center-body">
        <EmptyState icon="award" title="Sem validações registradas" status="NIMPL"
          sub="Certificações e aprovações aparecerão aqui conforme os módulos forem validados." />
        <div className="grid-3" style={{marginTop:18}}>
          {secs.map(([s,ic])=>(
            <div className="panel" key={s}><div className="panel-body" style={{display:'flex',alignItems:'center',gap:10}}><Icon name={ic} size={14} style={{color:'var(--text-3)'}}/><span style={{fontSize:12.5,flex:1}}>{s}</span><StatusPill status="NIMPL" size="sm"/></div></div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- AUDITORIA (a verdade) ---------- */
function AuditoriaCenter({ setView }) {
  const D = window.FORJA;
  const veredCount = (v) => D.auditoria.filter(a=>a.veredito===v).length;
  const buckets = [
    ['Funciona','ok'], ['Parcial','warn'], ['Não testado','info'],
    ['Aguardando config.','info'], ['Não implementado','idle'], ['Bloqueado','err'],
  ];
  return (
    <div className="center">
      <PageHead icon="shield" crumb="Garantia" title="Auditoria" status="IMPL"
        sub="A verdade do sistema · Zero Ghost Law · nunca esconde falhas">
        <button className="btn"><Icon name="doc" size={13}/> Exportar</button>
      </PageHead>
      <div className="center-body section-gap">
        <div className="card hud-grid" style={{padding:'16px 18px', display:'flex', alignItems:'center', gap:18, borderColor:'var(--accent-line)'}}>
          <div style={{width:46,height:46,borderRadius:'var(--r-md)',background:'var(--accent-soft)',display:'grid',placeItems:'center',color:'var(--accent-bright)',flex:'none',border:'1px solid var(--accent-line)'}}><Icon name="shield" size={22}/></div>
          <div style={{flex:1,minWidth:0}}>
            <div className="eyebrow" style={{color:'var(--accent-bright)'}}>ZERO GHOST LAW</div>
            <div style={{fontSize:15,fontWeight:600,marginTop:2}}>Nada falso é apresentado como real</div>
            <div className="muted" style={{fontSize:11.5,marginTop:3}}>Cada módulo declara seu estado honesto. {veredCount('Funciona')} funcionam · {veredCount('Parcial')} parciais · {veredCount('Não implementado')} não implementados.</div>
          </div>
        </div>

        <div className="kpi-grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))'}}>
          {buckets.map(([lb,tone])=>(
            <div className="kpi" key={lb}><div className="kpi-label"><span className={'dot '+tone}/> {lb}</div><div className="kpi-val">{veredCount(lb)}</div></div>
          ))}
        </div>

        <SectionCard icon="shield" title="Verdade por módulo" flush>
          <div className="tbl-wrap"><table className="tbl"><thead><tr><th>Módulo</th><th>Veredito</th><th>Status declarado</th></tr></thead>
          <tbody>
            {D.auditoria.map((a,i)=>(
              <tr key={i} style={{cursor:'default'}}>
                <td className="cell-strong">{a.modulo}</td>
                <td className="muted">{a.veredito}</td>
                <td><StatusPill status={a.status} size="sm"/></td>
              </tr>
            ))}
          </tbody></table></div>
        </SectionCard>
      </div>
    </div>
  );
}

/* ---------- OPERAÇÕES ---------- */
function OperacoesCenter({ setView }) {
  const D = window.FORJA;
  return (
    <div className="center">
      <PageHead icon="server" crumb="Infra" title="Operações" status="DEV"
        sub="Banco · FastAPI · Runtime · Deploy · Monitoramento · Backups · Serviços">
        <button className="btn"><Icon name="refresh" size={13}/> Health check</button>
      </PageHead>
      <div className="center-body">
        <SectionCard icon="server" title="Saúde da infraestrutura" flush>
          <div className="tbl-wrap"><table className="tbl"><thead><tr><th>Serviço</th><th>Categoria</th><th>Observação</th><th>Status</th></tr></thead>
          <tbody>
            {D.operacoes.map(o=>(
              <tr key={o.id} style={{cursor:'default'}}>
                <td className="cell-strong">{o.nome}</td>
                <td className="muted">{o.cat}</td>
                <td className="faint" style={{fontSize:11.5}}>{o.nota}</td>
                <td><StatusPill status={o.status} size="sm"/></td>
              </tr>
            ))}
          </tbody></table></div>
        </SectionCard>
      </div>
    </div>
  );
}

/* ---------- FINANCEIRO ---------- */
function FinanceiroCenter() {
  const cats = [['Custos de LLM','zap'],['Custos de APIs','link'],['Infraestrutura','server'],['Assinaturas','dollar'],['Despesas','chart'],['Limites & alertas','alert']];
  return (
    <div className="center">
      <PageHead icon="dollar" crumb="Negócio" title="Financeiro" status="NIMPL"
        sub="Custos, assinaturas e finanças · sem receitas inventadas">
      </PageHead>
      <div className="center-body section-gap">
        <div className="grid-2">
          <SectionCard icon="dollar" title="Receitas" status="NIMPL">
            <EmptyState icon="dollar" title="Sem receitas cadastradas" sub="Nenhuma receita registrada. A Fábrica está em uso próprio." />
          </SectionCard>
          <SectionCard icon="chart" title="Custos medidos" status="NTEST">
            <EmptyState icon="activity" title="Sem medição de custos" sub="Custos de LLM/API só aparecem após provedores configurados e em uso." />
          </SectionCard>
        </div>
        <SectionCard icon="dollar" title="Categorias financeiras (estrutura)" status="DEV">
          <div className="grid-3">
            {cats.map(([c,ic])=>(
              <div key={c} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',background:'var(--bg-1)',border:'1px solid var(--border)',borderRadius:'var(--r-md)'}}><Icon name={ic} size={14} style={{color:'var(--text-3)'}}/><span style={{fontSize:12.5,flex:1}}>{c}</span><StatusPill status="NIMPL" size="sm"/></div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

/* ---------- ROADMAP ---------- */
function RoadmapCenter() {
  const D = window.FORJA;
  return (
    <div className="center">
      <PageHead icon="chart" crumb="Plataforma" title="Roadmap" status="IMPL"
        sub="Evolução real da plataforma A FÁBRICA · estado honesto de cada item">
      </PageHead>
      <div className="center-body">
        <div className="kanban" style={{height:'auto'}}>
          {D.roadmap.map(col=>(
            <div className="kan-col" key={col.fase}>
              <div className="kan-head"><span className={'dot '+col.cor}/><span style={{fontWeight:600,fontSize:12}}>{col.fase}</span><span className="count">{col.itens.length}</span></div>
              <div className="kan-body">
                {col.itens.map(it=>(
                  <div key={it} className="kan-card" style={{cursor:'default'}}>
                    <div className="kan-card-title" style={{fontSize:12}}>{it}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- ACADEMIA ---------- */
function AcademiaCenter() {
  const secs = [['Treinamentos','cap'],['Vídeos','play2'],['Guias','book'],['Cursos','cap'],['Onboarding','flame'],['Docs p/ usuários','doc']];
  return (
    <div className="center">
      <PageHead icon="cap" crumb="Plataforma" title="Academia" status="NIMPL"
        sub="Treinamento e onboarding de operadores">
      </PageHead>
      <div className="center-body">
        <EmptyState icon="cap" title="Academia ainda não implementada" status="NIMPL"
          sub="Conteúdos de treinamento serão publicados aqui." />
        <div className="grid-3" style={{marginTop:18}}>
          {secs.map(([s,ic])=>(
            <div className="panel" key={s} style={{opacity:.7}}><div className="panel-body" style={{display:'flex',alignItems:'center',gap:10}}><Icon name={ic} size={14} style={{color:'var(--text-3)'}}/><span style={{fontSize:12.5,flex:1}}>{s}</span><StatusPill status="NIMPL" size="sm"/></div></div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- AJUDA ---------- */
function AjudaCenter() {
  const secs = [['Consultor','help'],['FAQ','book'],['Documentação','doc'],['Chamados','chat'],['Suporte','users']];
  return (
    <div className="center">
      <PageHead icon="help" crumb="Plataforma" title="Ajuda" status="DEV"
        sub="Suporte, FAQ, documentação e orientação de uso">
      </PageHead>
      <div className="center-body section-gap">
        <SectionCard icon="help" title="Consultor da Fábrica" status="DEV">
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <span className="ch-icon" style={{width:36,height:36}}><Icon name="chat" size={18}/></span>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500}}>Assistente de uso da plataforma</div><div className="muted" style={{fontSize:11.5}}>Tira dúvidas sobre módulos e fluxos. Requer LLM configurada.</div></div>
            <button className="btn" disabled style={{opacity:.5}}>Abrir</button>
          </div>
        </SectionCard>
        <div className="grid-3">
          {secs.map(([s,ic])=>(
            <div className="panel" key={s}><div className="panel-body" style={{display:'flex',alignItems:'center',gap:10}}><Icon name={ic} size={14} style={{color:'var(--text-3)'}}/><span style={{fontSize:12.5,flex:1}}>{s}</span><StatusPill status={s==='Documentação'?'DEV':'NIMPL'} size="sm"/></div></div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- CONFIGURAÇÕES ---------- */
function ConfiguracoesCenter({ setView, theme, setTheme }) {
  const secs = [
    ['Conta','building','DEV'],['Usuários','users','NIMPL'],['Permissões','lock','NIMPL'],['Assinaturas','dollar','NIMPL'],
    ['APIs','link','CONFIG'],['LLMs','zap','CONFIG'],['Billing','dollar','NIMPL'],['Segurança','shield','DEV'],
    ['Cofre','lock','DEV'],['Backup','box','NIMPL'],['Notificações','bell','DEV'],['Integrações','link','PARCIAL'],
    ['Personalização','eye','DEV'],['Licenciamento','award','NIMPL'],
  ];
  const perfis = ['Administrador','Operador','Consultor','Cliente'];
  return (
    <div className="center">
      <PageHead icon="gear" crumb="Plataforma" title="Configurações" status="DEV"
        sub="Conta, LLMs, cofre, segurança, integrações e personalização">
      </PageHead>
      <div className="center-body section-gap">
        <SectionCard icon="eye" title="Aparência" status="IMPL">
          <div style={{display:'flex',alignItems:'center',gap:14}}>
            <div style={{flex:1}}><div style={{fontWeight:500}}>Tema</div><div className="muted" style={{fontSize:11.5}}>Escuro recomendado para sessões longas</div></div>
            <div className="seg">
              <button className={theme==='dark'?'on':''} onClick={()=>setTheme&&setTheme('dark')}><Icon name="moon" size={12}/> Escuro</button>
              <button className={theme==='light'?'on':''} onClick={()=>setTheme&&setTheme('light')}><Icon name="sun" size={12}/> Claro</button>
            </div>
          </div>
        </SectionCard>

        <SectionCard icon="lock" title="Cofre de segredos" status="DEV">
          <div className="card" style={{padding:11, display:'flex',gap:9,alignItems:'center', borderColor:'var(--info)', background:'var(--info-soft)'}}>
            <Icon name="lock" size={15} style={{color:'var(--info)'}}/><span style={{fontSize:12}}>Toda chave/token/OAuth fica no cofre seguro. Nunca exibido no painel, em código ou no GitHub.</span>
          </div>
        </SectionCard>

        <SectionCard icon="gear" title="Áreas administrativas">
          <div className="grid-3">
            {secs.map(([s,ic,st])=>(
              <div key={s} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',background:'var(--bg-1)',border:'1px solid var(--border)',borderRadius:'var(--r-md)'}}><Icon name={ic} size={14} style={{color:'var(--text-3)'}}/><span style={{fontSize:12.5,flex:1}}>{s}</span><StatusPill status={st} size="sm"/></div>
            ))}
          </div>
        </SectionCard>

        <SectionCard icon="users" title="Perfis (arquitetura prevista)" status="NIMPL">
          <div className="tags">{perfis.map(p=><span key={p} className="tag">{p}</span>)}</div>
          <div className="muted" style={{fontSize:11.5,marginTop:8}}>Estrutura prevista. Permissões completas não implementadas nesta fase.</div>
        </SectionCard>
      </div>
    </div>
  );
}

Object.assign(window, { TestesCenter, ValidacaoCenter, AuditoriaCenter, OperacoesCenter, FinanceiroCenter, RoadmapCenter, AcademiaCenter, AjudaCenter, ConfiguracoesCenter });


/* ============================================================
   A FÁBRICA — App root · estado global, router, shell
   ============================================================ */
function App() {
  const [theme, setTheme] = useLocalStorage('forja.theme', 'dark');
  const [view, setView] = useLocalStorage('forja.view', 'home');
  const [explorerOpen, setExplorerOpen] = useLocalStorage('forja.explorer', true);
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);
  useEffect(() => {
    const h = (e) => {
      const cmd = e.metaKey || e.ctrlKey;
      if (cmd && e.key.toLowerCase() === 'k') { e.preventDefault(); setCmdOpen(o => !o); }
      else if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'p') { e.preventDefault(); setCmdOpen(o => !o); }
      else if (cmd && e.key.toLowerCase() === 'b') { e.preventDefault(); setExplorerOpen(o => !o); }
    };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, []);

  const ROUTES = {
    home: ExecutiveHome,
    forja: HomeWorkspace,
    clientes: ClientesCenter,
    projetos: ProjetosCenter,
    missoes: MissoesCenter,
    equipes: EquipesCenter,
    inteligencia: InteligenciaCenter,
    llms: LLMsCenter,
    ferramentas: FerramentasCenter,
    integracoes: IntegracoesCenter,
    conhecimento: ConhecimentoCenter,
    testes: TestesCenter,
    validacao: ValidacaoCenter,
    auditoria: AuditoriaCenter,
    operacoes: OperacoesCenter,
    financeiro: FinanceiroCenter,
    roadmap: RoadmapCenter,
    academia: AcademiaCenter,
    ajuda: AjudaCenter,
    configuracoes: ConfiguracoesCenter,
  };
  const Current = ROUTES[view] || HomeWorkspace;

  const cols = [
    'var(--activitybar-w)',
    explorerOpen ? 'var(--explorer-w)' : null,
    'minmax(0,1fr)',
  ].filter(Boolean).join(' ');

  return (
    <div className="os">
      <MenuBar theme={theme} setTheme={setTheme}
        onCommand={() => setCmdOpen(true)}
        onToggleCopilot={() => setCmdOpen(true)}
        onToggleExplorer={() => setExplorerOpen(o=>!o)} />
      <div className="os-body" style={{ gridTemplateColumns: cols }}>
        <ActivityBar view={view} setView={setView} />
        {explorerOpen && <Explorer view={view} setView={setView} onClose={() => setExplorerOpen(false)} />}
        <main className="os-main"><Current setView={setView} theme={theme} setTheme={setTheme} /></main>
      </div>
      <StatusBar view={view} setView={setView} />
      {cmdOpen && <CommandPalette onClose={() => setCmdOpen(false)} setView={setView} setTheme={setTheme} theme={theme} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
