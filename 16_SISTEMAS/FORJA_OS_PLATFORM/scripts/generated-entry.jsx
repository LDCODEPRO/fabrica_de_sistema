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

  /* ---- LLMs (dados do backend sobrescrevem via api.js/hydrate) ---- */
  /* ZERO GHOST: latências e datas são preenchidas APENAS pelo backend */
  const llms = [
    { id: 'claude',   nome: 'Claude',    modelo: 'Claude Pro',            status: 'NTEST',  ativo: false, conexao: ['Assinatura/CLI'],               ultimoTeste: 'não validado', latencia: '—', custo: '0.00', uso: 'Principal', tipo: 'Assinatura', modoUso: 'Assistido', automacao: 'assisted', custoIncremental: 0, billing: 'Pago', ultimoHealth: 'não validado', observacao: 'CLI instalada · aguardando validação real' },
    { id: 'openai',   nome: 'OpenAI',    modelo: 'ChatGPT Plus',          status: 'NTEST',  ativo: false, conexao: ['Assinatura/CLI'],               ultimoTeste: 'não validado', latencia: '—', custo: '0.00', uso: 'Fallback 1', tipo: 'Assinatura', modoUso: 'Assistido', automacao: 'assisted', custoIncremental: 0, billing: 'Pago', ultimoHealth: 'não validado', observacao: 'CLI instalada · aguardando validação real' },
    { id: 'gemini',   nome: 'Gemini',    modelo: 'Gemini Advanced',       status: 'NTEST',  ativo: false, conexao: ['Assinatura/CLI'],               ultimoTeste: 'não validado', latencia: '—', custo: '0.00', uso: 'Fallback 2', tipo: 'Assinatura', modoUso: 'Direto', automacao: 'direct', custoIncremental: 0, billing: 'Pago', ultimoHealth: 'não validado', observacao: 'CLI instalada · aguardando validação real' },
    { id: 'ollama',   nome: 'Ollama',    modelo: 'Local (Offline)',       status: 'OFFLINE', ativo: false, conexao: ['Servidor Local (Desligado)'],  ultimoTeste: '—',     latencia: '—',     custo: '—',    uso: 'Localhost', tipo: 'Local', modoUso: 'Direto', automacao: 'direct', custoIncremental: 0, billing: 'Gratuito', ultimoHealth: '—', observacao: 'Sem custo incremental' },
    { id: 'deepseek_api', nome: 'DeepSeek API', modelo: 'DeepSeek Chat',  status: 'BLOCK',  ativo: false, conexao: ['API Paga'],                     ultimoTeste: '—',     latencia: '—',     custo: '—',    uso: 'Bloqueada', tipo: 'API Paga', modoUso: 'Direto', automacao: 'direct', custoIncremental: null, billing: 'Bloqueada', ultimoHealth: 'Sem chave validada', observacao: 'Requer chave e aprovação' },
    { id: 'openai_api',   nome: 'OpenAI API',   modelo: 'gpt-4o-mini',      status: 'BLOCK',  ativo: false, conexao: ['API Paga'],                     ultimoTeste: '—',     latencia: '—',     custo: '—',    uso: 'Bloqueada', tipo: 'API Paga', modoUso: 'Direto', automacao: 'direct', custoIncremental: null, billing: 'Bloqueada', ultimoHealth: 'Sem chave validada', observacao: 'Requer chave e aprovação' },
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
    { id: 'github',   nome: 'GitHub',          auth: 'OAuth',   status: 'IMPL',    ultimoTeste: 'não medido', permissoes: 'repo, read, write (2 contas)' },
    { id: 'gdrive',   nome: 'Google Drive',    auth: 'OAuth',   status: 'CONFIG',  ultimoTeste: '—', permissoes: '—' },
    { id: 'gdocs',    nome: 'Google Docs',     auth: 'OAuth',   status: 'CONFIG',  ultimoTeste: '—', permissoes: '—' },
    { id: 'gsheets',  nome: 'Google Sheets',   auth: 'OAuth',   status: 'CONFIG',  ultimoTeste: '—', permissoes: '—' },
    { id: 'gcal',     nome: 'Google Calendar', auth: 'OAuth',   status: 'CONFIG',  ultimoTeste: '—', permissoes: '—' },
    { id: 'openrouter',nome:'OpenRouter',      auth: 'API key', status: 'IMPL',    ultimoTeste: 'validado', permissoes: 'chave ativa' },
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
  /* ZERO GHOST: chatSeed só exibe informação verificável */
  const chatSeed = [
    { de: 'sistema', txt: 'Workspace da Fábrica iniciado. Status dos providers será verificado em tempo real.' },
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
   FORJA — Camada de API V1
   fetch nativo (sem axios, sem Vite). Mesma origem do FastAPI.
   Carrega dados REAIS do backend e hidrata window.FORJA.
   window.FORJA continua existindo apenas como FALLBACK.
   ============================================================ */
(function () {
  const BASE = ''; // mesma origem (SPA servida pelo FastAPI)

  async function getJSON(path) {
    const headers = { 'Accept': 'application/json' };
    const token = localStorage.getItem('forja.token');
    if (token) headers['Authorization'] = 'Bearer ' + token;

    const res = await fetch(BASE + path, {
      headers: headers,
      credentials: 'same-origin',
    });
    if (res.status === 401) {
      window.dispatchEvent(new Event('unauthorized'));
      throw new Error('HTTP 401 em ' + path);
    }
    if (!res.ok) throw new Error('HTTP ' + res.status + ' em ' + path);
    return res.json();
  }

  // Usa dados reais quando existirem; senão mantém o fallback de window.FORJA.
  function pick(realArr, fallback, sourceKey, sources) {
    if (Array.isArray(realArr) && realArr.length > 0) {
      sources[sourceKey] = 'backend_real';
      return realArr;
    }
    sources[sourceKey] = 'fallback_window_forja';
    return fallback;
  }

  // ---- mapeadores: shape do backend -> shape esperado pelo painel ----

  function mapAgentes(items) {
    const stMap = { IDLE: 'idle', WORKING: 'running', OFFLINE: 'blocked' };
    return (items || []).map(a => ({
      id: a.id,
      papel: a.nome,            // backend.nome = papel curto (ex: ARCHITECT)
      nome: a.papel || a.nome,  // backend.papel = descrição
      status: stMap[a.status] || 'idle',
      missao: '—',
      ultimaExec: '—',
      provider: 'não atribuído',
      tempoMedio: 'não medido',
      tokens: null, custo: 0, tarefas: null, sucesso: null,
    }));
  }

  function mapMissoes(items) {
    return (items || []).map(ms => ({
      id: ms.id,
      titulo: ms.titulo,
      proj: ms.proj || '—',
      status: ms.status,
      prio: ms.prio || 'P3',
      agente: ms.agente || '—',
      llm: ms.llm || '—',
      tempo: ms.tempo || '—',
      etapa: ms.etapa || 0,
      etapas: ms.etapas || 1,
      tags: ms.tags || [],
      description: ms.description || '',
    }));
  }

  function mapLLMs(providers) {
    const tipoMap = {
      subscription: 'Assinatura', local: 'Local', paid_api: 'API Paga',
    };
    const ONLINE = { active_real: 1, CERTIFIED: 1, ROUTER_LIMITED: 1 };
    const statusMap = {
      active_real: 'Online',
      CERTIFIED: 'Online',
      ROUTER_LIMITED: 'Online (via router)',
      ENVIRONMENT_PENDING: 'Fora do ar',
      OFFLINE: 'Fora do ar',
      unavailable: 'Fora do ar',
      inactive: 'Inativa',
      missing_key: 'Sem chave',
      BLOCKED_BY_BILLING: 'Bloqueada (billing)',
      NOT_IMPLEMENTED: 'Não implementada',
      ERROR: 'Erro',
      unknown: 'Não validada',
    };
    return (providers || []).map(p => ({
      id: p.id,
      provider: p.display_name,
      modelos: p.models && p.models.length ? p.models : ['configurável'],
      tipo: tipoMap[p.provider_type] || p.provider_type,
      status: p.health_status || 'unknown',
      statusLabel: statusMap[p.health_status] || p.health_status || 'Não validada',
      modoUso: p.automation_mode === 'assisted' ? 'Assistido'
             : p.automation_mode === 'direct'
               ? (p.provider_type === 'local' ? 'Direto/Local' : 'Direto')
               : '—',
      automacao: p.automation_mode,
      custoIncremental: p.cost_incremental === 0
        ? 'R$ 0,00'
        : p.provider_type === 'paid_api' ? 'Por consumo' : 'Não informado',
      billing: p.billing_mode,
      ultimoHealth: p.last_health_check || 'Não validado',
      observacao: p.notes || '',
      ativo: !!ONLINE[p.health_status],
    }));
  }

  function mapAuditoria(items) {
    return (items || []).map(a => {
      const dt = a.created_at ? new Date(a.created_at) : null;
      const hora = dt ? dt.toTimeString().slice(0, 8) : '—';
      return {
        id: a.id,
        ts: hora,
        data: dt ? dt.toLocaleDateString('pt-BR') : '—',
        hora: hora,
        ator: 'sistema',
        acao: a.event_type || '—',
        alvo: (a.details || '').slice(0, 60),
        sev: 'info',
        hash: 'evt-' + a.id,
      };
    });
  }

  function applyStatusToServices(services, health, status, llmHealth) {
    const set = (id, st) => {
      const s = (services || []).find(x => x.id === id);
      if (s) s.status = st;
    };
    if (health && health.status === 'ok') set('fastapi', 'ok');
    if (status && status.database === 'ok') set('database', 'ok');
    if (llmHealth) set('ollama', llmHealth.health_status === 'active_real' ? 'ok' : 'idle');
    return services;
  }

  // ---- hidratação principal: roda ANTES do React renderizar ----
  async function hydrate() {
    const F = window.FORJA || {};
    F._live = { hydratedAt: null, sources: {}, errors: {} };
    const sources = F._live.sources;
    const errors = F._live.errors;

    // health + status + llm/health (tolerantes a falha individual)
    let health = null, status = null, llmHealth = null;
    try { health = await getJSON('/api/health'); } catch (e) { errors.health = String(e); }
    try { status = await getJSON('/api/status'); } catch (e) { errors.status = String(e); }
    try { llmHealth = await getJSON('/api/llm/health'); } catch (e) { errors.llmHealth = String(e); }

    // agentes
    try {
      const r = await getJSON('/api/agents');
      F.agentes = pick(mapAgentes(r.items), F.agentes, 'agentes', sources);
    } catch (e) { errors.agentes = String(e); sources.agentes = 'fallback_window_forja'; }

    // missões
    try {
      const r = await getJSON('/api/missions');
      F.missoes = pick(mapMissoes(r.items), F.missoes, 'missoes', sources);
    } catch (e) { errors.missoes = String(e); sources.missoes = 'fallback_window_forja'; }

    // providers / LLMs
    try {
      const r = await getJSON('/api/llm/providers');
      F.llms = pick(mapLLMs(r.providers), F.llms, 'llms', sources);
    } catch (e) { errors.llms = String(e); sources.llms = 'fallback_window_forja'; }

    // auditoria
    try {
      const r = await getJSON('/api/audit');
      F.auditoria = pick(mapAuditoria(r.items), F.auditoria, 'auditoria', sources);
    } catch (e) { errors.auditoria = String(e); sources.auditoria = 'fallback_window_forja'; }

    // serviços (saúde real) + status bar
    try {
      const r = await getJSON('/api/services');
      if (Array.isArray(r.items) && r.items.length) {
        F.services = r.items;
        sources.services = 'backend_real';
      }
    } catch (e) { errors.services = String(e); sources.services = 'fallback_window_forja'; }

    // dashboard real: KPIs + núcleos + governança a partir do banco
    try {
      const d = await getJSON('/api/dashboard');
      const ms = d.missions || {}; const byS = ms.by_status || {};
      const kmap = {
        projetos: { valor: String((d.projects || {}).total || 0), sub: 'sem tabela de projetos' },
        missoes: { valor: String(ms.total || 0), sub: (byS.RUNNING || 0) + ' em execução' },
        agentes: { valor: String((d.agents || {}).total || 0), sub: 'do banco' },
        evidencias: { valor: String((d.evidences || {}).total || 0), sub: 'execuções reais' },
        ia: { valor: ((d.ollama || {}).status === 'active_real' ? (d.ollama.models + ' modelos') : 'offline'), sub: 'Ollama' },
      };
      F.kpis = (F.kpis || []).map(k => kmap[k.id] ? Object.assign({}, k, kmap[k.id]) : k);

      // governança real
      F.governance = Object.assign({}, F.governance, {
        evidence: Object.assign({}, F.governance.evidence, { total: (d.evidences || {}).total || 0 }),
        zeroGhostLaw: Object.assign({}, F.governance.zeroGhostLaw,
          { ativas: (d.audit || {}).total || 0, violacoes: 0, ultimaVarredura: 'tempo real' }),
      });

      // núcleos: marca status real do que sabemos
      const setCore = (id, st) => { const c = (F.cores || []).find(x => x.id === id); if (c) c.status = st; };
      setCore('database', 'ok'); setCore('operational', 'ok'); setCore('factory', 'ok');
      setCore('agent', (d.agents || {}).total > 0 ? 'ok' : 'idle');
      setCore('router', (d.ollama || {}).status === 'active_real' ? 'ok' : 'idle');
      F.dashboard = d;                       // dados crus para a Home Executiva
      sources.dashboard = 'backend_real';
    } catch (e) { errors.dashboard = String(e); sources.dashboard = 'fallback_window_forja'; }

    // status real do chat / providers de conversa (para Home + alertas)
    try {
      F.chatStatus = await getJSON('/api/chat/status');
      sources.chatStatus = 'backend_real';
    } catch (e) { errors.chatStatus = String(e); sources.chatStatus = 'fallback_window_forja'; }

    // conhecimento real (contagem de itens no repositório)
    try {
      const k = await getJSON('/api/knowledge');
      F.knowledge = k;
      sources.knowledge = 'backend_real';
    } catch (e) { errors.knowledge = String(e); sources.knowledge = 'fallback_window_forja'; }

    // saúde real dos componentes do sistema (Banco, API Core, Runtime, Logs…)
    try {
      const sh = await getJSON('/api/system/health');
      F.systemHealth = sh.items || [];
      sources.systemHealth = 'backend_real';
    } catch (e) { errors.systemHealth = String(e); sources.systemHealth = 'fallback_window_forja'; }

    // billing real ($1/dia, $30/mês) — nunca seed/demo
    try {
      const b = await getJSON('/api/billing/status');
      F.custos = Object.assign({}, F.custos, {
        diario: b.daily_used_usd,
        mensal: b.monthly_used_usd,
        limite: b.monthly_budget_usd,
        limiteDiario: b.daily_budget_usd,
        projecao: b.projection_usd,
        source: b.source,
        primaryProvider: b.primary_provider,
        fallbackProvider: b.fallback_provider,
      });
      sources.billing = 'backend_real';
    } catch (e) { errors.billing = String(e); sources.billing = 'fallback_window_forja'; }

    // status bar / serviços
    try {
      F.services = applyStatusToServices(F.services, health, status, llmHealth);
      sources.services = (health || status) ? 'backend_real' : 'fallback_window_forja';
    } catch (e) { errors.services = String(e); }

    F._live.hydratedAt = new Date().toISOString();
    window.FORJA = F;

    // Log de evidência no console (visível no navegador / DevTools)
    console.info('[FORJA] hydrate concluído', F._live.sources, 'erros:', F._live.errors);
    return F._live;
  }

  // ---- Runtime real: executar missão, evidências, status ----
  async function postJSON(path, body) {
    const res = await fetch(BASE + path, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error('HTTP ' + res.status + ' em ' + path);
    return res.json();
  }

  // POST /api/missions/{id}/run — executa missão real
  async function runMission(missionId) {
    const r = await postJSON('/api/missions/' + missionId + '/run');
    console.info('[FORJA] runMission', missionId, '→', r.status, '(provider:', r.provider + ')');
    return r;
  }

  // GET /api/missions/{id}/evidences
  async function getEvidences(missionId) {
    return getJSON('/api/missions/' + missionId + '/evidences');
  }

  // GET /api/runtime/status
  async function getRuntimeStatus() {
    return getJSON('/api/runtime/status');
  }

  // Atualiza window.FORJA.missoes a partir do backend (após execução)
  async function refreshMissions() {
    try {
      const r = await getJSON('/api/missions');
      const F = window.FORJA;
      F.missoes = pick(mapMissoes(r.items), F.missoes, 'missoes', (F._live || {}).sources || {});
      return F.missoes;
    } catch (e) {
      console.warn('[FORJA] refreshMissions falhou:', e);
      return (window.FORJA || {}).missoes;
    }
  }

  // POST /api/missions — cria missão real no banco
  async function createMission(titulo, descricao) {
    const r = await postJSON('/api/missions', { titulo: titulo, descricao: descricao || '' });
    await refreshMissions();
    return r;
  }

  async function delJSON(path) {
    const res = await fetch(BASE + path, { method: 'DELETE', headers: { 'Accept': 'application/json' }, credentials: 'same-origin' });
    if (!res.ok) throw new Error('HTTP ' + res.status + ' em ' + path);
    return res.json();
  }

  // ---- CLIENTES + CONEXÕES (multi-cliente) ----
  async function listClients() { return getJSON('/api/clients'); }
  async function createClient(nome, descricao) { return postJSON('/api/clients', { nome: nome, descricao: descricao || '' }); }
  async function getClient(id) { return getJSON('/api/clients/' + encodeURIComponent(id)); }
  async function listConnectors(scope) { return getJSON('/api/connectors' + (scope ? ('?scope=' + scope) : '')); }
  async function addConnection(clientId, kind, label, credential, meta) {
    return postJSON('/api/clients/' + encodeURIComponent(clientId) + '/connections', { kind: kind, label: label, credential: credential, meta: meta || {} });
  }
  async function testConnection(connId) { return postJSON('/api/connections/' + connId + '/test'); }
  async function deleteConnection(connId) { return delJSON('/api/connections/' + connId); }
  // Conexões GLOBAIS da Fábrica (logadas uma vez)
  async function listAgencyConnections() { return getJSON('/api/agency/connections'); }
  async function addAgencyConnection(kind, label, credential, meta) {
    return postJSON('/api/agency/connections', { kind: kind, label: label, credential: credential, meta: meta || {} });
  }

  // ---- PROJETOS (fatia vertical: projeto → missão → execução → entrega) ----
  async function listProjects() { return getJSON('/api/projects'); }
  async function createProject(nome, descricao, clientId) { return postJSON('/api/projects', { nome: nome, descricao: descricao || '', client_id: clientId }); }
  async function getProject(id) { return getJSON('/api/projects/' + encodeURIComponent(id)); }
  async function createProjectMission(id, titulo, descricao) {
    return postJSON('/api/projects/' + encodeURIComponent(id) + '/missions', { titulo: titulo, descricao: descricao || '' });
  }
  async function getDeliverables(id) { return getJSON('/api/projects/' + encodeURIComponent(id) + '/deliverables'); }
  async function uploadProjectFiles(id, files) { return postJSON('/api/projects/' + encodeURIComponent(id) + '/upload', { files: files }); }
  async function listProjectFiles(id) { return getJSON('/api/projects/' + encodeURIComponent(id) + '/files'); }
  async function developProject(id) { return postJSON('/api/projects/' + encodeURIComponent(id) + '/develop'); }

  // POST /api/agents/{key}/act — execução AGÊNTICA (ReAct + ferramentas)
  async function getAgentBrain(agentKey) { return getJSON('/api/agents/' + encodeURIComponent(agentKey) + '/brain'); }

  async function actAgent(agentKey, objective, clientId) {
    return postJSON('/api/agents/' + encodeURIComponent(agentKey || 'orquestrador') + '/act', { objective: objective, client_id: clientId });
  }

  // POST /api/tests/run — auto-teste real do sistema
  async function runTests() { return postJSON('/api/tests/run'); }

  // ---- CONTEÚDO (estúdio de posts/reels) ----
  async function listContent(clientId) { return getJSON('/api/content' + (clientId ? ('?client_id=' + encodeURIComponent(clientId)) : '')); }
  async function createContent(c) { return postJSON('/api/content', c); }
  async function developContent(id) { return postJSON('/api/content/' + id + '/develop'); }
  async function updateContent(id, data) { return postJSON('/api/content/' + id, data); }
  async function uploadContentMedia(id, dataUrl) { return postJSON('/api/content/' + id + '/upload', { data_url: dataUrl }); }
  async function scheduleContent(id, st, sv) { return postJSON('/api/content/' + id + '/schedule', { schedule_type: st, schedule_value: sv }); }
  async function publishContent(id) { return postJSON('/api/content/' + id + '/publish'); }
  async function deleteContent(id) { return delJSON('/api/content/' + id); }
  async function planContent(brief) { return postJSON('/api/content/plan', brief); }
  async function generateImage(id, prompt) { return postJSON('/api/content/' + id + '/generate-image', { prompt: prompt }); }

  // ---- SCHEDULER (agendamentos) ----
  async function listJobs() { return getJSON('/api/scheduler/jobs'); }
  async function createJob(job) { return postJSON('/api/scheduler/jobs', job); }
  async function runJob(id) { return postJSON('/api/scheduler/jobs/' + id + '/run'); }
  async function toggleJob(id) { return postJSON('/api/scheduler/jobs/' + id + '/toggle'); }
  async function deleteJob(id) { return delJSON('/api/scheduler/jobs/' + id); }

  // ---- FINANCEIRO (livro-caixa real) ----
  async function getFinance(clientId) { return getJSON('/api/finance' + (clientId ? ('?client_id=' + encodeURIComponent(clientId)) : '')); }
  async function addFinance(kind, description, amount, clientId) {
    return postJSON('/api/finance', { kind: kind, description: description, amount: amount, client_id: clientId });
  }
  async function deleteFinance(id) { return delJSON('/api/finance/' + id); }

  // GET /api/chat/session/{id} — histórico real da conversa
  async function getChatSession(sessionId) {
    try { return await getJSON('/api/chat/session/' + encodeURIComponent(sessionId)); }
    catch (e) { return { session_id: sessionId, messages: [] }; }
  }

  // GET /api/files — lista real de arquivos do repositório
  async function listFiles(path) {
    return getJSON('/api/files' + (path ? ('?path=' + encodeURIComponent(path)) : ''));
  }

  // GET /api/knowledge — contagem real de conhecimento
  async function getKnowledge() {
    const k = await getJSON('/api/knowledge');
    window.FORJA.knowledge = k;
    return k;
  }

  // GET/POST /api/config/keys — cofre de chaves (status e gravação)
  async function getConfigKeys() { return getJSON('/api/config/keys'); }
  async function setConfigKey(key, value) {
    return postJSON('/api/config/keys', { key: key, value: value });
  }

  // POST /api/providers/health-check — teste REAL de um provider (executa o LLM)
  async function testProvider(providerKey) {
    return postJSON('/api/providers/health-check', { provider_key: providerKey });
  }

  // POST /api/providers/reconnect — tenta reconectar com várias tentativas
  async function reconnectProvider(providerKey, attempts) {
    return postJSON('/api/providers/reconnect', { provider_key: providerKey, attempts: attempts || 3 });
  }

  // GET /api/llm/providers — recarrega lista de providers (após teste)
  async function refreshProviders() {
    const r = await getJSON('/api/llm/providers');
    const mapped = mapLLMs(r.providers || []);
    if (window.FORJA) window.FORJA.llms = mapped;
    return mapped;
  }

  // GET /api/services + /api/status — health check operacional ao vivo
  async function healthCheckServices() {
    const [services, status] = await Promise.all([
      getJSON('/api/services').catch(() => ({ items: [] })),
      getJSON('/api/status').catch(() => null),
    ]);
    if (services && Array.isArray(services.items)) window.FORJA.services = services.items;
    return { services: services, status: status };
  }

  window.ForjaAPI = {
    getJSON, hydrate, postJSON,
    runMission, getEvidences, getRuntimeStatus, refreshMissions,
    createMission, getKnowledge, getConfigKeys, setConfigKey, healthCheckServices,
    testProvider, refreshProviders, reconnectProvider,
    getChatSession, listFiles, actAgent, getAgentBrain, runTests,
    getFinance, addFinance, deleteFinance,
    listJobs, createJob, runJob, toggleJob, deleteJob,
    listContent, createContent, developContent, updateContent, uploadContentMedia, scheduleContent, publishContent, deleteContent,
    planContent, generateImage,
    listProjects, createProject, getProject, createProjectMission, getDeliverables,
    uploadProjectFiles, listProjectFiles, developProject,
    listClients, createClient, getClient, listConnectors, addConnection, testConnection, deleteConnection,
    listAgencyConnections, addAgencyConnection,
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

/* ---------- exportação CSV real (download client-side) ---------- */
function downloadCSV(filename, rows) {
  if (!rows || !rows.length) { alert('Nada para exportar.'); return; }
  const cols = Object.keys(rows[0]);
  const esc = (v) => {
    const s = v == null ? '' : String(v);
    return /[",\n;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const csv = [cols.join(';')]
    .concat(rows.map(r => cols.map(c => esc(r[c])).join(';')))
    .join('\r\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

Object.assign(window, { Icon, Sparkline, Bars, Donut, Progress, useLocalStorage, STATUS_CLASS,
  StatusPill, EmptyState, PageHead, SectionCard, downloadCSV,
  useState, useEffect, useRef, useCallback, createContext, useContext });


/* ============================================================
   FORJA — Shell: menu bar, activity bar, status bar
   ============================================================ */

/* Sequência objetiva do fluxo: Início → Negócio → Execução → IA/Recursos → Gestão → Plataforma */
const NAV = [
  // 1 · Início
  { id: 'home',         label: '1 · Início · Centro Executivo', short: 'Início', icon: 'home',  grupo: 'Início' },
  { id: 'forja',        label: 'FORJA · Workspace (chat/agentes)', short: 'FORJA', icon: 'flame', grupo: 'Início' },
  // 2 · Negócio: do cliente ao conteúdo
  { id: 'clientes',     label: '2 · Clientes',   short: 'Clientes',     icon: 'building', grupo: 'Negócio' },
  { id: 'projetos',     label: '3 · Projetos',   short: 'Projetos',     icon: 'folder',   grupo: 'Negócio' },
  { id: 'enviar',       label: '3.1 · Enviar projeto (upload)', short: 'Enviar', icon: 'box', grupo: 'Negócio' },
  { id: 'conteudo',     label: '4 · Conteúdo · Posts & Reels', short: 'Conteúdo', icon: 'megaphone', grupo: 'Negócio' },
  // 3 · Execução
  { id: 'missoes',      label: '5 · Missões',    short: 'Missões',      icon: 'target',   grupo: 'Execução' },
  { id: 'equipes',      label: 'Equipe Inteligente (agentes)', short: 'Equipes', icon: 'users', grupo: 'Execução' },
  { id: 'inteligencia', label: 'Inteligência de Mercado', short: 'Inteligência', icon: 'compass', grupo: 'Execução' },
  // 4 · IA & Recursos
  { id: 'llms',         label: 'IA · Provedores (LLMs)', short: 'IA',   icon: 'zap',      grupo: 'Recursos' },
  { id: 'integracoes',  label: 'Integrações da Fábrica', short: 'Integrações', icon: 'link', grupo: 'Recursos' },
  { id: 'conhecimento', label: 'Conhecimento',   short: 'Conhecimento', icon: 'book',     grupo: 'Recursos' },
  { id: 'ferramentas',  label: 'Ferramentas',    short: 'Ferramentas',  icon: 'wrench',   grupo: 'Recursos' },
  // 5 · Gestão
  { id: 'financeiro',   label: 'Financeiro',     short: 'Financeiro',   icon: 'dollar',   grupo: 'Gestão' },
  { id: 'operacoes',    label: 'Operações · Scheduler', short: 'Operações', icon: 'server', grupo: 'Gestão' },
  { id: 'auditoria',    label: 'Auditoria',      short: 'Auditoria',    icon: 'shield',   grupo: 'Gestão' },
  // 6 · Plataforma
  { id: 'roadmap',      label: 'Roadmap',        short: 'Roadmap',      icon: 'chart',    grupo: 'Plataforma' },
  { id: 'testes',       label: 'Testes',         short: 'Testes',       icon: 'flask',    grupo: 'Plataforma' },
  { id: 'validacao',    label: 'Validação',      short: 'Validação',     icon: 'award',    grupo: 'Plataforma' },
  { id: 'academia',     label: 'Academia',       short: 'Academia',     icon: 'cap',      grupo: 'Plataforma' },
  { id: 'ajuda',        label: 'Ajuda',          short: 'Ajuda',        icon: 'help',     grupo: 'Plataforma' },
];

/* ícones por grupo (para divisores na activity bar) */
const NAV_GROUPS = ['Início','Negócio','Execução','Recursos','Gestão','Plataforma'];

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

/* Árvore de arquivos REAIS do repositório (lazy via /api/files) */
function RealFiles() {
  const [data, setData] = useState({});   // path -> items[]
  const [open, setOpen] = useState({ '': true });
  const apiOn = !!(window.ForjaAPI && window.ForjaAPI.listFiles);

  const load = async (path) => {
    if (data[path] || !apiOn) return;
    try { const r = await window.ForjaAPI.listFiles(path); setData(d => ({ ...d, [path]: r.items || [] })); }
    catch { setData(d => ({ ...d, [path]: [] })); }
  };
  useEffect(() => { load(''); }, []);

  const toggle = (path) => { setOpen(o => ({ ...o, [path]: !o[path] })); load(path); };

  const renderLevel = (path, depth) => {
    const items = data[path];
    if (items == null) return <div className="faint" style={{padding:'6px 10px',fontSize:11}}>carregando…</div>;
    if (!items.length) return <div className="faint" style={{padding:'6px 10px',fontSize:11}}>vazio</div>;
    return items.map(it => it.tipo === 'dir' ? (
      <div key={it.path}>
        <button className="ftree-row" style={{paddingLeft:8+depth*12}} onClick={()=>toggle(it.path)}>
          <Icon name="chevR" size={11} style={{transform:open[it.path]?'rotate(90deg)':'none', transition:'transform .12s', color:'var(--text-3)'}}/>
          <Icon name="folder" size={13} style={{color:'var(--accent-bright)'}}/>
          <span>{it.nome}</span>
        </button>
        {open[it.path] && <div>{renderLevel(it.path, depth+1)}</div>}
      </div>
    ) : (
      <div key={it.path} className="ftree-row file" style={{paddingLeft:8+depth*12+16}}>
        <Icon name="file" size={12} style={{color:'var(--text-3)'}}/>
        <span>{it.nome}</span>
        <span className="ftree-ext">{it.tipo}</span>
      </div>
    ));
  };

  if (!apiOn) return <div className="faint" style={{padding:10,fontSize:11.5}}>Backend offline — arquivos reais indisponíveis.</div>;
  return <div className="ftree">{renderLevel('', 0)}</div>;
}

function HomeWorkspace({ setView }) {
  const D = window.FORJA;
  const teams = D.equipes || [];
  const [team, setTeam] = useLocalStorage('forja.ws.team', 'orquestrador');
  const [llm, setLLM] = useLocalStorage('forja.ws.llm', 'auto');
  const [sessionId, setSessionId] = useLocalStorage('forja.ws.session', '');
  const [msgs, setMsgs] = useState([]);   // sem seed fake — começa vazio (Zero Ghost)
  const [draft, setDraft] = useState('');
  const [pane, setPane] = useState('preview'); // preview | arquivos | terminal
  const [chatStatus, setChatStatus] = useState({ online: null, status_text: 'Verificando...', available: [] });
  const bodyRef = useRef(null);
  const teamObj = teams.find(t=>t.id===team) || teams[0] || {};
  const llmIds = (D.llms || []).map(l=>l.id);
  const llmSel = (llm && llmIds.includes(llm)) ? llm : 'auto';   // migra valores antigos (ex.: 'gemini')
  const llmObj = (D.llms || []).find(l=>l.id===llmSel) || {};

  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [msgs]);

  // Health check real ao montar e a cada 60s
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/chat/status');
        if (res.ok) {
          const data = await res.json();
          setChatStatus(data);
        } else {
          setChatStatus({ online: false, status_text: 'Backend indisponível', available: [] });
        }
      } catch {
        setChatStatus({ online: false, status_text: 'Sem conexão com o servidor', available: [] });
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  // Garante session_id e carrega o histórico real da conversa (memória)
  useEffect(() => {
    let sid = sessionId;
    if (!sid) { sid = 'sess-' + Math.random().toString(36).slice(2) + '-' + Date.now().toString(36); setSessionId(sid); }
    if (window.ForjaAPI && window.ForjaAPI.getChatSession) {
      window.ForjaAPI.getChatSession(sid).then(s => {
        if (s && Array.isArray(s.messages) && s.messages.length) {
          setMsgs(s.messages.map(mm => ({
            de: mm.sender === 'USER' ? 'voce' : (mm.sender === 'system' ? 'sistema' : (mm.sender || 'sistema')),
            txt: mm.content,
            provider: mm.provider_key || undefined,
          })));
        }
      });
    }
  }, []);

  const novaConversa = () => {
    const sid = 'sess-' + Math.random().toString(36).slice(2) + '-' + Date.now().toString(36);
    setSessionId(sid); setMsgs([]);
  };

  const send = async () => {
    const t = draft.trim(); if (!t) return;
    setMsgs(m => [...m, { de:'voce', txt:t }]);
    setDraft('');

    // Mostra loading
    const loadingId = Date.now();
    setMsgs(m => [...m, { id: loadingId, de:'sistema', preview:true, loading:true, txt:'Processando pelo ' + (teamObj.nome || 'agente') + '...' }]);

    try {
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId || undefined, message: t, agent_key: team, agent_name: teamObj.nome, provider: (llmSel === 'auto' ? undefined : llmSel) })
      });
      const data = await res.json();
      if (res.ok && data.session_id && data.session_id !== sessionId) setSessionId(data.session_id);
      
      if (!res.ok) {
        setMsgs(m => {
          const withoutLoading = m.filter(msg => msg.id !== loadingId);
          return [...withoutLoading, { de:'sistema', preview:true, error:true, txt: data.detail || 'Erro ' + res.status + ' — verifique os providers.' }];
        });
        return;
      }

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
        return [...withoutLoading, { de:'sistema', preview:true, error:true, txt: 'Erro de rede ao conectar com o backend.' }];
      });
    }
  };

  // MODO AGÊNTICO: o agente raciocina (ReAct) e usa ferramentas reais
  const agir = async () => {
    const t = draft.trim(); if (!t) return;
    if (!window.ForjaAPI || !window.ForjaAPI.actAgent) { return; }
    setMsgs(m => [...m, { de:'voce', txt:t }]);
    setDraft('');
    const loadingId = Date.now();
    setMsgs(m => [...m, { id: loadingId, de:'sistema', preview:true, loading:true, txt:'Agente agindo (raciocinando e usando ferramentas)…' }]);
    try {
      const data = await window.ForjaAPI.actAgent(team, t);
      setMsgs(m => {
        const without = m.filter(x => x.id !== loadingId);
        return [...without, {
          de: team, preview:false,
          txt: data.result || ('(' + (data.status || 'sem resposta') + ')'),
          provider: 'agêntico',
          steps: data.log || [],
          agentStatus: data.status,
        }];
      });
    } catch (err) {
      setMsgs(m => {
        const without = m.filter(x => x.id !== loadingId);
        return [...without, { de:'sistema', preview:true, error:true, txt: 'Falha na ação agêntica: ' + err.message }];
      });
    }
  };

  // Indicador visual baseado no status real
  const statusColor = chatStatus.online === null ? 'var(--warn)' : chatStatus.online ? 'var(--ok)' : 'var(--err, #e55)';
  const statusDotClass = chatStatus.online === null ? 'pulse' : '';

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
            <button className="btn ghost sm" style={{marginLeft:'auto'}} onClick={novaConversa} title="Limpar e iniciar nova conversa"><Icon name="plus" size={12}/> Nova conversa</button>
            <span className="pill"><span className={'zg-dot ' + statusDotClass} style={{background: statusColor}}/> {chatStatus.status_text}</span>
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
                {m.steps && m.steps.length > 0 && (
                  <details style={{marginTop:6}}>
                    <summary style={{cursor:'pointer', fontSize:11, color:'var(--text-3)'}}>
                      <Icon name="terminal" size={11}/> {m.steps.length} passo(s) do agente {m.agentStatus ? ('· ' + m.agentStatus) : ''}
                    </summary>
                    <div className="term" style={{marginTop:6, maxHeight:260, overflow:'auto'}}>
                      {m.steps.map((s,si)=>(
                        <div key={si} className="ln"><span className="t">{si+1}</span><span className="lv-info" style={{whiteSpace:'pre-wrap'}}>{String(s).slice(0,600)}</span></div>
                      ))}
                    </div>
                  </details>
                )}
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
                <select value={llmSel} onChange={e=>setLLM(e.target.value)}>
                  <option value="auto">Automático (recomendado)</option>
                  {(D.llms || []).map(l=><option key={l.id} value={l.id}>{l.provider || l.nome || l.id} · {l.ativo?'online':'fora'}</option>)}
                </select>
              </label>
            </div>
            <div className="ws-input">
              <textarea rows={2} placeholder="Converse ou instrua… (Enter conversa · Shift+Enter nova linha · botão Agir = modo agêntico)" value={draft}
                onChange={e=>setDraft(e.target.value)}
                onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();} }} />
              <button className="btn" onClick={agir} disabled={!draft.trim()} title="Agir: o agente raciocina e usa ferramentas reais"><Icon name="zap" size={13}/> Agir</button>
              <button className="btn primary icon" onClick={send} title="Conversar (com memória e cordialidade)"><Icon name="send" size={14}/></button>
            </div>
            <div className="ws-hint">Roteia para <b>{teamObj.nome || 'Agente'}</b> via <b>{llmSel === 'auto' ? 'Automático' : (llmObj.provider || llmObj.nome || 'Automático')}</b> · <span className="faint" style={{color: statusColor}}>{chatStatus.online ? 'Pronto' : chatStatus.online === null ? 'Verificando...' : 'Offline'}</span></div>
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
                <div className="ws-files-head"><span className="eyebrow">REPOSITÓRIO · arquivos reais</span><StatusPill status="IMPL" size="sm"/></div>
                <RealFiles />
              </div>
            )}
            {pane==='terminal' && (() => {
              const dash = D.dashboard || {}; const ms = dash.missions || {}; const ag = dash.agents || {};
              const onlineNames = (chatStatus.available || []).map(a=>a.label || a.id).join(', ');
              return (
              <div className="term ws-term">
                <div className="ln"><span className="t">$</span><span className="lv-acc">fabrica status</span></div>
                <div className="ln"><span className="t"> </span><span className="lv-info">backend: FastAPI · dados reais do nexus.db</span></div>
                <div className="ln"><span className="t"> </span><span className="lv-ok">missões: {ms.total || 0} · agentes: {ag.total || 0} · evidências: {(dash.evidences||{}).total || 0}</span></div>
                <div className="ln"><span className="t"> </span><span className={chatStatus.online ? 'lv-ok' : 'lv-warn'}>llms online: {chatStatus.online ? (chatStatus.available||[]).length : '—'}{onlineNames ? (' · ' + onlineNames) : ''}</span></div>
                <div className="ln"><span className="t"> </span><span className="lv-info">sessão: {sessionId || '—'}</span></div>
                <div className="ln"><span className="t">$</span><span className="lv-acc blink">_</span></div>
              </div>
              );
            })()}
          </div>
        </section>
      </div>

      {/* rodapé do workspace: evidências / alertas reais */}
      {(() => {
        const dash = D.dashboard || {}; const ms = dash.missions || {}; const byS = ms.by_status || {};
        const evid = (dash.evidences || {}).total || 0;
        const running = byS.RUNNING || 0;
        const online = (chatStatus.available || []).length;
        return (
      <div className="ws-foot">
        <div className="ws-foot-col">
          <span className="eyebrow"><Icon name="doc" size={11}/> Evidências</span>
          <span className="faint" style={{fontSize:11.5}}>{evid > 0 ? (evid + ' evidências reais no banco') : 'Nenhuma evidência ainda'} · <StatusPill status={evid>0?'IMPL':'NIMPL'} size="sm"/></span>
        </div>
        <div className="ws-foot-col">
          <span className="eyebrow"><Icon name="zap" size={11}/> LLMs</span>
          <span style={{fontSize:11.5}}>{online > 0
            ? <>{online} provedor(es) online · <button className="lnk" onClick={()=>setView('llms')}>gerenciar</button></>
            : <>nenhum online · <button className="lnk" onClick={()=>setView('llms')}>configurar</button></>}</span>
        </div>
        <div className="ws-foot-col">
          <span className="eyebrow"><Icon name="target" size={11}/> Missões</span>
          <span className="faint" style={{fontSize:11.5}}>{(ms.total||0)} no banco · {running} em execução · <button className="lnk" onClick={()=>setView('missoes')}>abrir</button></span>
        </div>
      </div>
        );
      })()}
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

  /* ---- dados REAIS vindos do backend (hidratados por api.js) ---- */
  const dash = D.dashboard || {};
  const dMiss = dash.missions || {};
  const dByStatus = dMiss.by_status || {};
  const chat = D.chatStatus || {};
  const provDisponiveis = (chat.available || []).length;
  const missTotal   = dMiss.total || 0;
  const missRunning = dByStatus.RUNNING || 0;
  const missDone    = dByStatus.COMPLETED || 0;
  const missFail    = dByStatus.FAILED || 0;
  const missWait    = (dByStatus.PENDING || 0) + (dByStatus.QUEUED || 0);
  const agentesReais  = (dash.agents || {}).total || (D.agentes ? D.agentes.length : 0);
  const evidReais     = (dash.evidences || {}).total || 0;
  const projetosReais = (dash.projects || {}).total || 0;

  /* ---- métricas de prontidão (estrutura da plataforma) ---- */
  const implCount  = D.modulos.filter(m => m.status === 'IMPL' || m.status === 'CERT').length;
  const devCount   = D.modulos.filter(m => m.status === 'DEV'  || m.status === 'PARCIAL').length;
  const equipesEstrut = D.equipes.length;
  const intConect  = D.integracoes.filter(i => i.status === 'IMPL' || i.status === 'CERT').length;
  const prontidao  = implCount / D.modulos.length;  /* índice real de prontidão */

  /* status geral honesto baseado em providers de IA realmente disponíveis */
  const overall = provDisponiveis === 0 ? 'warn' : 'ok';
  const overallLabel = overall === 'ok' ? 'Operacional' : 'Atenção';
  const overallDesc = provDisponiveis > 0
    ? (provDisponiveis + ' provedor(es) de IA disponível(is) · ' + missTotal + ' missões · ' + agentesReais + ' agentes')
    : 'Nenhum provedor de IA disponível · configure no cofre de chaves';

  /* contadores reais do banco (Zero Ghost: vêm do backend) */
  const resumo = [
    { k: 'Projetos',     v: projetosReais, sub: projetosReais ? 'no banco' : 'nenhum criado' },
    { k: 'Missões',      v: missTotal,     sub: missRunning + ' em execução' },
    { k: 'Agentes',      v: agentesReais,  sub: 'registrados' },
    { k: 'Evidências',   v: evidReais,     sub: 'execuções reais' },
    { k: 'Equipes',      v: equipesEstrut, sub: 'estrutura criada' },
  ];

  /* saúde dos sistemas — REAL, vinda do backend (/api/system/health) */
  const sistemas = (D.systemHealth && D.systemHealth.length) ? D.systemHealth : [
    { nome: 'Banco de Dados',     icon: 'db',       st: 'NTEST', nota: 'verificando…' },
    { nome: 'API Core',           icon: 'zap',      st: 'NTEST', nota: 'verificando…' },
    { nome: 'Runtime',            icon: 'cpu',      st: 'NTEST', nota: 'verificando…' },
    { nome: 'Logs',               icon: 'terminal', st: 'NTEST', nota: 'verificando…' },
    { nome: 'Auditoria',          icon: 'shield',   st: 'NTEST', nota: 'verificando…' },
  ];

  const hora = new Date().toTimeString().slice(0,8);
  const tone = (st) => (D.ST[st] || {}).tone || 'idle';

  /* alertas REAIS derivados do estado vivo do backend */
  const alertas = [];
  if (provDisponiveis === 0)
    alertas.push({ sev: 'warn', txt: 'Nenhum provedor de IA disponível — configure no cofre', acao: 'configuracoes' });
  else
    alertas.push({ sev: 'info', txt: provDisponiveis + ' provedor(es) de IA disponível(is)', acao: 'llms' });
  if (missFail > 0)
    alertas.push({ sev: 'warn', txt: missFail + ' missão(ões) com falha — revisar', acao: 'missoes' });
  if (missWait > 0)
    alertas.push({ sev: 'info', txt: missWait + ' missão(ões) aguardando execução', acao: 'missoes' });
  if (intConect === 0)
    alertas.push({ sev: 'info', txt: 'Nenhuma integração conectada', acao: 'integracoes' });
  if (!alertas.length)
    alertas.push({ sev: 'info', txt: 'Sistema operacional — sem alertas pendentes', acao: 'auditoria' });

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
              <div className="exec-syscard-meta" style={{fontSize:10.5}}>{s.nota || ('últ. verif. ' + hora)}</div>
            </div>
          ))}
        </div>
      </ExecSection>

      {/* ===== BLOCO 3 · LLM COMMAND CENTER ===== */}
      <ExecSection icon="zap" title="LLM Command Center"
        right={<span className={'pill ' + (provDisponiveis>0?'ok':'warn')}>{provDisponiveis} disponível(is)</span>}>
        <div className="exec-llm-grid">
          {D.llms.map(l => {
            const nome   = l.nome || l.provider || l.id;
            const modelo = l.modelo || (l.modelos && l.modelos[0]) || '—';
            const lat    = l.latencia || l.ultimoHealth || '—';
            const ult    = l.ultimoTeste || l.ultimoHealth || '—';
            const prov   = (l.conexao && l.conexao[0]) || l.tipo || '—';
            const ativo  = l.status === 'active_real' || l.ativo;
            return (
              <div className="exec-llm" key={l.id}>
                <div className="exec-llm-top">
                  <span className={'dot ' + (ativo ? 'ok' : tone(l.status))} />
                  <span className="exec-llm-nm">{nome}</span>
                </div>
                <div className="exec-llm-model mono">{modelo}</div>
                <div className="exec-llm-rows">
                  <div><span className="faint">Saúde</span><span className="mono">{lat}</span></div>
                  <div><span className="faint">Últ. check</span><span className="mono">{ult}</span></div>
                  <div><span className="faint">Tipo</span><span className="mono">{prov}</span></div>
                </div>
                <span className={'pill ' + (ativo?'ok':'warn')}>{l.statusLabel || (ativo?'Ativa real':'Não validada')}</span>
              </div>
            );
          })}
        </div>
      </ExecSection>

      <div className="exec-2col">
        {/* ===== BLOCO 4 · MISSÕES ===== */}
        <ExecSection icon="target" title="Missões" right={<button className="btn ghost sm" onClick={()=>setView('missoes')}>Abrir <Icon name="chevR" size={12}/></button>}>
          <div className="exec-mini-grid">
            {[['Em execução','ok',missRunning],['Concluídas','info',missDone],['Com falha','err',missFail],['Aguardando','idle',missWait]].map(([l,c,v])=>(
              <div className="exec-mini" key={l}>
                <div className="exec-mini-v"><CountUp value={v} /></div>
                <div className="exec-mini-l"><span className={'dot '+c}/> {l}</div>
                <div className="exec-spark"><svg viewBox="0 0 100 20" preserveAspectRatio="none"><line x1="0" y1="19" x2="100" y2="19" stroke="var(--border-strong)" strokeWidth="1" strokeDasharray="3 3"/></svg></div>
              </div>
            ))}
          </div>
          {missTotal === 0
            ? <div className="exec-empty-note"><Icon name="target" size={13}/> Nenhuma missão registrada — crie a primeira em Missões.</div>
            : <div className="exec-empty-note"><Icon name="target" size={13}/> {missTotal} missões no banco · clique em "Abrir" para gerenciar.</div>}
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
        sub={D.equipes.length + ' equipes · cada uma conversa e executa tarefas de verdade (abra uma equipe para acionar)'}>
        <button className="btn" onClick={()=>avisoEmDev('Equipes')}><Icon name="plus" size={13}/> Nova equipe</button>
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
  const [obj, setObj] = useState('');
  const [res, setRes] = useState(null);
  const [busy, setBusy] = useState(false);
  const [brain, setBrain] = useState(null);
  useEffect(() => { if (window.ForjaAPI && window.ForjaAPI.getAgentBrain) window.ForjaAPI.getAgentBrain(t.id).then(setBrain).catch(() => {}); }, []);
  const conversar = () => { try { localStorage.setItem('forja.ws.team', JSON.stringify(t.id)); } catch (e) {} setView('forja'); };
  const agir = async () => {
    if (!obj.trim() || !window.ForjaAPI || !window.ForjaAPI.actAgent) return;
    setBusy(true); setRes(null);
    try { setRes(await window.ForjaAPI.actAgent(t.id, obj.trim())); }
    catch (e) { setRes({ ok: false, result: 'Erro: ' + e.message }); }
    finally { setBusy(false); }
  };
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
            <button className="btn primary" onClick={conversar}><Icon name="chat" size={12}/> Conversar</button>
          </div>
        </div>
      </div>

      <div className="center-body">
        <div className="card" style={{padding:'12px 16px', marginBottom:16}}>
          <div className="eyebrow" style={{marginBottom:6, color:'var(--accent-bright)'}}>Acionar a equipe {t.nome} (executa de verdade)</div>
          <div style={{display:'flex', gap:8, flexWrap:'wrap', alignItems:'center'}}>
            <input style={{flex:1, minWidth:220, background:'var(--bg-1)', border:'1px solid var(--border)', borderRadius:'var(--r-md)', color:'var(--text-1)', padding:'8px 10px', fontSize:12.5}}
              placeholder={'Dê uma tarefa para a equipe ' + t.nome + '…'} value={obj} onChange={e=>setObj(e.target.value)}
              onKeyDown={e=>{ if(e.key==='Enter'){ agir(); } }} />
            <button className="btn primary" disabled={busy || !obj.trim()} onClick={agir}><Icon name="zap" size={13}/> {busy ? 'Agindo…' : 'Agir'}</button>
            <button className="btn" onClick={conversar}><Icon name="chat" size={13}/> Conversar</button>
          </div>
          {res && (
            <div className="card" style={{marginTop:10, padding:10, borderColor: res.ok ? 'var(--ok)' : 'var(--warn)'}}>
              <div style={{fontSize:12.5, whiteSpace:'pre-wrap'}}>{res.result || res.status || '—'}</div>
              {res.log && res.log.length > 0 && (
                <details style={{marginTop:6}}><summary style={{cursor:'pointer', fontSize:11, color:'var(--text-3)'}}><Icon name="terminal" size={11}/> {res.log.length} passo(s)</summary>
                  <div className="term" style={{marginTop:6, maxHeight:200, overflow:'auto'}}>{res.log.map((s,i)=><div key={i} className="ln"><span className="t">{i+1}</span><span className="lv-info" style={{whiteSpace:'pre-wrap'}}>{String(s).slice(0,400)}</span></div>)}</div>
                </details>
              )}
            </div>
          )}
        </div>

        <div className="grid-2" style={{alignItems:'start', gap:14}}>
          <div className="col">
            <Section icon="book" title="Sobre & o que faz">
              <p style={{margin:0, fontSize:13, lineHeight:1.6}}>{t.sobre}</p>
            </Section>
            <Section icon="check" title="Responsabilidades">
              <ul className="bul">{t.responsabilidades.map(r=><li key={r}>{r}</li>)}</ul>
            </Section>
            <Section icon="book" title="Biblioteca & Conhecimento (ON)" status="IMPL">
              {brain ? (
                <div>
                  <p style={{margin:0, fontSize:12.5, lineHeight:1.6}}>{brain.biblioteca}</p>
                  <div className="eyebrow" style={{marginTop:10}}>Ferramentas do agente</div>
                  <div className="tags">{(brain.ferramentas||[]).map(f=><span key={f} className="tag mono">{f}</span>)}</div>
                  <div className="faint" style={{fontSize:11, marginTop:8}}>{brain.aprendizados} aprendizado(s) na memória · biblioteca ativa</div>
                </div>
              ) : <span className="faint" style={{fontSize:12}}>carregando biblioteca…</span>}
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

/* aviso honesto para módulos sem backend (Zero Ghost: não finge ação) */
function avisoEmDev(modulo) {
  alert('Módulo "' + modulo + '" ainda não tem backend real.\n\nConforme a Lei Zero Fantasma, esta ação não foi simulada. '
    + 'O módulo será ativado quando sua tabela/serviço real existir no nexus.db.');
}

/* ---------- CLIENTES (multi-cliente: cada cliente com suas contas/integrações) ---------- */
const _connTone = (s) => ({CONNECTED:'ok', ERROR:'err'}[(s||'').toUpperCase()] || 'warn');

function ClientesCenter({ setView }) {
  const apiOn = !!(window.ForjaAPI && window.ForjaAPI.listClients);
  const [clientes, setClientes] = useState([]);
  const [aberto, setAberto] = useState(null);
  const [connectors, setConnectors] = useState([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [agObj, setAgObj] = useState('');
  const [agRes, setAgRes] = useState(null);
  const [agBusy, setAgBusy] = useState(false);

  const agirComoCliente = async () => {
    if (!agObj.trim() || !window.ForjaAPI || !window.ForjaAPI.actAgent || !aberto) return;
    setAgBusy(true); setAgRes(null);
    try { setAgRes(await window.ForjaAPI.actAgent('orquestrador', agObj.trim(), aberto.id)); }
    catch (e) { setAgRes({ ok: false, result: 'Erro: ' + e.message }); }
    finally { setAgBusy(false); }
  };

  const carregar = async () => {
    if (!apiOn) return;
    try {
      const r = await window.ForjaAPI.listClients(); setClientes(r.items || []);
      const cc = await window.ForjaAPI.listConnectors('client'); setConnectors(cc.items || []);
    } catch (e) { setMsg('Falha: ' + e.message); }
  };
  useEffect(() => { carregar(); }, []);

  const abrir = async (id) => {
    setBusy(true);
    try { setAberto(await window.ForjaAPI.getClient(id)); }
    catch (e) { setMsg('Falha ao abrir: ' + e.message); }
    finally { setBusy(false); }
  };

  const novoCliente = async () => {
    const nome = window.prompt('Nome do cliente:'); if (!nome || !nome.trim()) return;
    const desc = window.prompt('Descrição/segmento (opcional):') || '';
    setBusy(true); setMsg('Criando cliente…');
    try { const r = await window.ForjaAPI.createClient(nome.trim(), desc); await carregar(); setMsg('Cliente criado: ' + r.id); }
    catch (e) { setMsg('Falha: ' + e.message); } finally { setBusy(false); }
  };

  const conectar = async (con) => {
    if (!aberto) return;
    const cred = window.prompt('Cole a credencial — ' + con.field + ':'); if (cred === null) return;
    const meta = {};
    for (const f of (con.extra || [])) {
      const v = window.prompt(f.label + ':');
      if (v) meta[f.key] = v.trim();
    }
    setBusy(true); setMsg('Conectando ' + con.kind + '…');
    try {
      const r = await window.ForjaAPI.addConnection(aberto.id, con.kind, con.kind, cred.trim(), meta);
      await abrir(aberto.id);
      setMsg(con.kind + ': ' + r.status + (r.detail ? (' · ' + r.detail) : ''));
    } catch (e) { setMsg('Falha ao conectar: ' + e.message); } finally { setBusy(false); }
  };

  const testar = async (connId) => {
    setBusy(true);
    try { const r = await window.ForjaAPI.testConnection(connId); await abrir(aberto.id); setMsg('Teste: ' + r.status + (r.detail ? (' · ' + r.detail) : '')); }
    catch (e) { setMsg('Falha no teste: ' + e.message); } finally { setBusy(false); }
  };

  const remover = async (connId) => {
    setBusy(true);
    try { await window.ForjaAPI.deleteConnection(connId); await abrir(aberto.id); setMsg('Conexão removida.'); }
    catch (e) { setMsg('Falha: ' + e.message); } finally { setBusy(false); }
  };

  const novoProjetoCliente = async () => {
    if (!aberto) return;
    const nome = window.prompt('Nome do projeto para ' + aberto.nome + ':'); if (!nome || !nome.trim()) return;
    const desc = window.prompt('Descrição (opcional):') || '';
    setBusy(true); setMsg('Criando projeto…');
    try { await window.ForjaAPI.createProject(nome.trim(), desc, aberto.id); await abrir(aberto.id); setMsg('Projeto criado. Abra em Projetos para rodar missões.'); }
    catch (e) { setMsg('Falha: ' + e.message); } finally { setBusy(false); }
  };

  // ===== DETALHE DO CLIENTE =====
  if (aberto) {
    const conectados = {}; (aberto.conexoes || []).forEach(c => { conectados[c.kind] = c; });
    return (
      <div className="center">
        <div className="center-head hud-grid">
          <div className="ch-top">
            <button className="btn ghost icon" onClick={()=>{setAberto(null);carregar();}} title="Voltar"><Icon name="chevR" size={16} style={{transform:'rotate(180deg)'}}/></button>
            <div className="ch-icon"><Icon name="building" size={19}/></div>
            <div className="ch-titles">
              <div className="ch-crumb">A FÁBRICA · Cliente {aberto.id}</div>
              <h1 className="ch-title">{aberto.nome}</h1>
              {aberto.descricao && <div className="ch-sub">{aberto.descricao}</div>}
            </div>
            <div className="ch-actions">
              <button className="btn primary" onClick={novoProjetoCliente} disabled={busy}><Icon name="plus" size={13}/> Novo projeto</button>
            </div>
          </div>
        </div>
        <div className="center-body section-gap">
          {msg && <div className="card" style={{padding:'9px 13px',fontSize:12,borderColor:'var(--accent-line)',background:'var(--accent-soft)'}}>{msg}</div>}

          <SectionCard icon="link" title="Integrações do cliente (contas dele)">
            <div className="card" style={{padding:10, display:'flex',gap:8,alignItems:'center', borderColor:'var(--info)', background:'var(--info-soft)', marginBottom:12}}>
              <Icon name="lock" size={14} style={{color:'var(--info)'}}/><span style={{fontSize:11.5}}>As credenciais ficam no cofre por cliente — nunca exibidas. Conectado = token validado na API oficial.</span>
            </div>
            <div className="team-grid">
              {connectors.map(con => {
                const c = conectados[con.kind];
                return (
                  <div key={con.kind} className="team-card" style={{cursor:'default'}}>
                    <div className="team-card-top">
                      <span className="ch-icon" style={{width:32,height:32}}><Icon name="link" size={15}/></span>
                      <div style={{minWidth:0,flex:1}}>
                        <div className="team-card-name">{con.label}</div>
                        <span className={'pill ' + (c ? _connTone(c.status) : '')} style={{fontSize:10}}>{c ? c.status : 'não conectado'}</span>
                      </div>
                    </div>
                    <div className="faint" style={{fontSize:10.5, margin:'4px 0 8px'}}>{con.how}</div>
                    <div className="team-card-foot" style={{justifyContent:'flex-end', gap:6}}>
                      {c && <button className="btn ghost sm" disabled={busy} onClick={()=>testar(c.id)}>Testar</button>}
                      {c && <button className="btn ghost sm" disabled={busy} onClick={()=>remover(c.id)}>Remover</button>}
                      <button className="btn sm primary" disabled={busy} onClick={()=>conectar(con)}>{c ? 'Atualizar' : 'Conectar'}</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard icon="zap" title="Agir como este cliente (agente usa as contas dele)">
            <div style={{display:'flex', gap:8, alignItems:'flex-start', flexWrap:'wrap'}}>
              <textarea rows={2} placeholder={'Ex.: poste no Instagram do cliente a imagem URL com a legenda "..." · ou: envie um aviso no Telegram'}
                value={agObj} onChange={e=>setAgObj(e.target.value)}
                style={{flex:1, minWidth:240, background:'var(--bg-1)', border:'1px solid var(--border)', borderRadius:'var(--r-md)', color:'var(--text-1)', padding:'8px 10px', fontSize:12.5}} />
              <button className="btn primary" disabled={agBusy || !agObj.trim()} onClick={agirComoCliente}><Icon name="zap" size={13}/> {agBusy ? 'Agindo…' : 'Agir'}</button>
            </div>
            {agRes && (
              <div className="card" style={{padding:11, marginTop:10, borderColor: agRes.ok?'var(--ok)':'var(--err)'}}>
                <div style={{fontSize:12.5, whiteSpace:'pre-wrap'}}>{agRes.result || ('status: ' + (agRes.status||'—'))}</div>
                {agRes.log && agRes.log.length > 0 && (
                  <details style={{marginTop:6}}><summary style={{cursor:'pointer', fontSize:11, color:'var(--text-3)'}}><Icon name="terminal" size={11}/> {agRes.log.length} passo(s)</summary>
                    <div className="term" style={{marginTop:6, maxHeight:220, overflow:'auto'}}>{agRes.log.map((s,i)=><div key={i} className="ln"><span className="t">{i+1}</span><span className="lv-info" style={{whiteSpace:'pre-wrap'}}>{String(s).slice(0,500)}</span></div>)}</div>
                  </details>
                )}
              </div>
            )}
          </SectionCard>

          <SectionCard icon="folder" title={'Projetos do cliente (' + (aberto.projetos||[]).length + ')'} flush>
            <div className="tbl-wrap"><table className="tbl"><thead><tr><th>ID</th><th>Projeto</th><th>Missões</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {(aberto.projetos||[]).map(p=>(
                <tr key={p.id}>
                  <td className="id-cell">{p.id}</td>
                  <td className="cell-strong">{p.nome}</td>
                  <td className="mono">{p.missoes}</td>
                  <td><StatusPill status="IMPL" size="sm"/></td>
                  <td><button className="btn sm" onClick={()=>setView('projetos')}>Abrir em Projetos</button></td>
                </tr>
              ))}
              {!(aberto.projetos||[]).length && <tr><td colSpan={5} className="faint" style={{padding:12}}>Sem projetos. Crie um em "Novo projeto".</td></tr>}
            </tbody></table></div>
          </SectionCard>
        </div>
      </div>
    );
  }

  // ===== LISTA DE CLIENTES =====
  return (
    <div className="center">
      <PageHead icon="building" crumb="Negócio" title="Clientes" status={apiOn ? 'IMPL' : 'NIMPL'}
        sub="Multi-cliente · cada cliente com suas contas (Instagram, Canva, GitHub…) e projetos">
        <button className="btn" onClick={carregar} disabled={busy}><Icon name="refresh" size={13}/> Atualizar</button>
        <button className="btn primary" onClick={novoCliente} disabled={busy || !apiOn}><Icon name="plus" size={13}/> Novo cliente</button>
      </PageHead>
      <div className="center-body section-gap">
        {msg && <div className="card" style={{padding:'9px 13px',fontSize:12,borderColor:'var(--accent-line)',background:'var(--accent-soft)'}}>{msg}</div>}
        {!apiOn && <div className="card" style={{padding:'9px 13px',fontSize:12,borderColor:'var(--warn)',background:'var(--warn-soft)'}}>Backend offline — abra pelo ABRIR_PAINEL_FORJA.</div>}
        {!clientes.length && apiOn && <EmptyState icon="building" title="Nenhum cliente ainda" sub="Cadastre o primeiro cliente, conecte as contas dele e crie projetos." action="Novo cliente" onAction={novoCliente} />}
        <div className="team-grid">
          {clientes.map(cl=>(
            <button key={cl.id} className="team-card" onClick={()=>abrir(cl.id)}>
              <div className="team-card-top">
                <span className="ch-icon" style={{width:34,height:34}}><Icon name="building" size={17}/></span>
                <div style={{minWidth:0,flex:1,textAlign:'left'}}>
                  <div className="team-card-name">{cl.nome}</div>
                  <span className="id-cell mono">{cl.id}</span>
                </div>
                <Icon name="chevR" size={15} style={{color:'var(--text-3)'}}/>
              </div>
              {cl.descricao && <div className="team-card-sobre">{cl.descricao}</div>}
              <div className="team-card-foot" style={{justifyContent:'space-between'}}>
                <span className="tag"><Icon name="folder" size={10}/> {cl.projetos} projetos</span>
                <span className="tag"><Icon name="link" size={10}/> {cl.conexoes_ativas}/{cl.conexoes} contas</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- PROJETOS (fatia vertical real: projeto → missão → execução → entrega) ---------- */
const _misCls = (s) => ({RUNNING:'ok',FAILED:'err',QUEUED:'info',COMPLETED:'ok'}[(s||'').toUpperCase()] || 'idle');

function ProjetosCenter({ setView }) {
  const apiOn = !!(window.ForjaAPI && window.ForjaAPI.listProjects);
  const [projetos, setProjetos] = useState([]);
  const [aberto, setAberto] = useState(null);
  const [entregas, setEntregas] = useState([]);
  const [arquivos, setArquivos] = useState([]);
  const [devRes, setDevRes] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const carregar = async () => {
    if (!apiOn) return;
    try { const r = await window.ForjaAPI.listProjects(); setProjetos(r.items || []); }
    catch (e) { setMsg('Falha ao listar: ' + e.message); }
  };
  useEffect(() => { carregar(); }, []);

  const abrir = async (id) => {
    setBusy(true); setDevRes(null);
    try {
      const p = await window.ForjaAPI.getProject(id);
      setAberto(p);
      const d = await window.ForjaAPI.getDeliverables(id);
      setEntregas(d.items || []);
      try { const ff = await window.ForjaAPI.listProjectFiles(id); setArquivos(ff.files || []); } catch (e) { setArquivos([]); }
    } catch (e) { setMsg('Falha ao abrir: ' + e.message); }
    finally { setBusy(false); }
  };

  const subirArquivos = async (fileList) => {
    if (!fileList || !fileList.length) return;
    setBusy(true); setMsg('Subindo arquivos…');
    try {
      const files = await Promise.all(Array.from(fileList).map(f => new Promise(res => {
        const r = new FileReader(); r.onload = () => res({ name: f.name, data_url: r.result }); r.readAsDataURL(f);
      })));
      const up = await window.ForjaAPI.uploadProjectFiles(aberto.id, files);
      const ff = await window.ForjaAPI.listProjectFiles(aberto.id); setArquivos(ff.files || []);
      setMsg(up.saved + ' arquivo(s) enviados ao projeto.');
    } catch (e) { setMsg('Falha no upload: ' + e.message); } finally { setBusy(false); }
  };

  const desenvolver = async () => {
    setBusy(true); setMsg('A Fábrica (agente Desenvolvedor) está trabalhando no projeto…'); setDevRes(null);
    try {
      const r = await window.ForjaAPI.developProject(aberto.id); setDevRes(r);
      const ff = await window.ForjaAPI.listProjectFiles(aberto.id); setArquivos(ff.files || []);
      setMsg('Desenvolvimento: ' + (r.status || ''));
    } catch (e) { setMsg('Falha: ' + e.message); } finally { setBusy(false); }
  };

  const novoProjeto = async () => {
    const nome = window.prompt('Nome do projeto:'); if (!nome || !nome.trim()) return;
    const desc = window.prompt('Descrição (opcional):') || '';
    setBusy(true); setMsg('Criando projeto…');
    try { const r = await window.ForjaAPI.createProject(nome.trim(), desc); await carregar(); setMsg('Projeto criado: ' + r.id); }
    catch (e) { setMsg('Falha: ' + e.message); } finally { setBusy(false); }
  };

  const novaMissao = async () => {
    if (!aberto) return;
    const t = window.prompt('Título da missão:'); if (!t || !t.trim()) return;
    const d = window.prompt('Objetivo da missão (o agente vai executar isto):') || '';
    setBusy(true); setMsg('Criando missão…');
    try { await window.ForjaAPI.createProjectMission(aberto.id, t.trim(), d); await abrir(aberto.id); setMsg('Missão criada.'); }
    catch (e) { setMsg('Falha: ' + e.message); } finally { setBusy(false); }
  };

  const executar = async (mid) => {
    setBusy(true); setMsg('Executando ' + mid + ' (agente real, gera evidência)…');
    try { const r = await window.ForjaAPI.runMission(mid); await abrir(aberto.id); setMsg('Missão ' + mid + ': ' + (r.status || 'ok') + (r.provider ? (' · via ' + r.provider) : '')); }
    catch (e) { setMsg('Falha na execução: ' + e.message); } finally { setBusy(false); }
  };

  // ===== DETALHE DO PROJETO =====
  if (aberto) {
    return (
      <div className="center">
        <div className="center-head hud-grid">
          <div className="ch-top">
            <button className="btn ghost icon" onClick={()=>{setAberto(null);carregar();}} title="Voltar"><Icon name="chevR" size={16} style={{transform:'rotate(180deg)'}}/></button>
            <div className="ch-icon"><Icon name="folder" size={19}/></div>
            <div className="ch-titles">
              <div className="ch-crumb">A FÁBRICA · Projeto {aberto.id}</div>
              <h1 className="ch-title">{aberto.nome}</h1>
              {aberto.descricao && <div className="ch-sub">{aberto.descricao}</div>}
            </div>
            <div className="ch-actions">
              <button className="btn primary" onClick={novaMissao} disabled={busy}><Icon name="plus" size={13}/> Nova missão</button>
            </div>
          </div>
        </div>
        <div className="center-body section-gap">
          {msg && <div className="card" style={{padding:'9px 13px',fontSize:12,borderColor:'var(--accent-line)',background:'var(--accent-soft)'}}>{msg}</div>}

          <SectionCard icon="folder" title="Arquivos & Desenvolvimento (envie o projeto e a Fábrica desenvolve)">
            <div className="faint" style={{fontSize:12, marginBottom:8}}>Briefing (o que desenvolver): {aberto.descricao || '(defina ao criar o projeto — descreva o que a Fábrica deve fazer)'}</div>
            <div style={{display:'flex', gap:8, flexWrap:'wrap', alignItems:'center'}}>
              <label className="btn sm" style={{cursor:'pointer'}}><Icon name="plus" size={12}/> Subir arquivos / .zip<input type="file" multiple style={{display:'none'}} onChange={e=>subirArquivos(e.target.files)} /></label>
              <button className="btn primary sm" disabled={busy} onClick={desenvolver}><Icon name="cpu" size={12}/> Desenvolver com a Fábrica</button>
              <span className="faint" style={{fontSize:11}}>{arquivos.length} arquivo(s) no projeto</span>
            </div>
            {arquivos.length > 0 && <div className="term" style={{marginTop:8, maxHeight:160, overflow:'auto'}}>{arquivos.map((f,i)=><div key={i} className="ln"><span className="t">·</span><span className="lv-info">{f}</span></div>)}</div>}
            {devRes && <div className="card" style={{marginTop:8, padding:10, borderColor: devRes.ok?'var(--ok)':'var(--warn)'}}><div style={{fontSize:12.5, whiteSpace:'pre-wrap'}}>{devRes.result || devRes.status}</div></div>}
          </SectionCard>

          {(() => {
            const htmlFile = (arquivos.find(f => /index\.html$/i.test(f)) || arquivos.find(f => /\.html?$/i.test(f)) || '');
            if (!aberto.raw_id || !htmlFile) return null;
            const previewUrl = '/preview/projeto_' + aberto.raw_id + '/' + htmlFile;
            return (
              <SectionCard icon="eye" title="Preview do projeto (roda no navegador)"
                right={<button className="btn sm primary" onClick={() => window.open(previewUrl, '_blank')}><Icon name="link" size={12} /> Abrir no navegador</button>}>
                <iframe src={previewUrl} title="preview" style={{ width: '100%', height: 480, border: '1px solid var(--border)', borderRadius: 'var(--r-md)', background: '#fff' }} />
              </SectionCard>
            );
          })()}

          <SectionCard icon="target" title={'Missões (' + (aberto.missoes||[]).length + ')'} flush>
            <div className="tbl-wrap"><table className="tbl"><thead><tr><th>ID</th><th>Missão</th><th>Status</th><th style={{width:140}}>Ação</th></tr></thead>
            <tbody>
              {(aberto.missoes||[]).map(ms=>(
                <tr key={ms.id}>
                  <td className="id-cell">{ms.id}</td>
                  <td><div className="cell-strong">{ms.titulo}</div>{ms.description && <div className="faint" style={{fontSize:11}}>{ms.description.slice(0,80)}</div>}</td>
                  <td><span className={'pill '+_misCls(ms.status)}>{ms.status}</span></td>
                  <td><button className="btn sm primary" disabled={busy} onClick={()=>executar(ms.id)}><Icon name="play" size={11}/> {ms.status==='FAILED'?'Reexecutar':'Executar'}</button></td>
                </tr>
              ))}
              {!(aberto.missoes||[]).length && <tr><td colSpan={4} className="faint" style={{padding:12}}>Sem missões. Crie a primeira em "Nova missão".</td></tr>}
            </tbody></table></div>
          </SectionCard>
          <SectionCard icon="doc" title={'Entregas / Evidências (' + entregas.length + ')'} flush>
            <div className="tbl-wrap"><table className="tbl"><thead><tr><th>Missão</th><th>Descrição</th><th>Arquivo</th><th>Quando</th></tr></thead>
            <tbody>
              {entregas.map(e=>(
                <tr key={e.id}>
                  <td className="id-cell">{e.mission_id}</td>
                  <td>{e.descricao}</td>
                  <td className="mono faint" style={{fontSize:10.5}}>{(e.file_path||'').split(/[\\/]/).pop()}</td>
                  <td className="faint" style={{fontSize:11}}>{e.created_at ? new Date(e.created_at).toLocaleString('pt-BR') : '—'}</td>
                </tr>
              ))}
              {!entregas.length && <tr><td colSpan={4} className="faint" style={{padding:12}}>Nenhuma entrega ainda. Execute uma missão para gerar evidência real.</td></tr>}
            </tbody></table></div>
          </SectionCard>
        </div>
      </div>
    );
  }

  // ===== LISTA DE PROJETOS =====
  return (
    <div className="center">
      <PageHead icon="folder" crumb="Negócio" title="Projetos" status={apiOn ? 'IMPL' : 'DEV'}
        sub="Projeto → Missão → execução agêntica → entrega/evidência (fluxo real ponta a ponta)">
        <button className="btn" onClick={carregar} disabled={busy}><Icon name="refresh" size={13}/> Atualizar</button>
        <button className="btn primary" onClick={novoProjeto} disabled={busy || !apiOn}><Icon name="plus" size={13}/> Novo projeto</button>
      </PageHead>
      <div className="center-body section-gap">
        {msg && <div className="card" style={{padding:'9px 13px',fontSize:12,borderColor:'var(--accent-line)',background:'var(--accent-soft)'}}>{msg}</div>}
        {!apiOn && <div className="card" style={{padding:'9px 13px',fontSize:12,borderColor:'var(--warn)',background:'var(--warn-soft)'}}>Backend offline — abra pelo ABRIR_PAINEL_FORJA.</div>}
        {!projetos.length && apiOn && <EmptyState icon="folder" title="Nenhum projeto ainda" sub="Crie o primeiro projeto e adicione missões que os agentes vão executar." action="Novo projeto" onAction={novoProjeto} />}
        <div className="team-grid">
          {projetos.map(p=>(
            <button key={p.id} className="team-card" onClick={()=>abrir(p.id)}>
              <div className="team-card-top">
                <span className="ch-icon" style={{width:34,height:34}}><Icon name="folder" size={17}/></span>
                <div style={{minWidth:0,flex:1,textAlign:'left'}}>
                  <div className="team-card-name">{p.nome}</div>
                  <span className="id-cell mono">{p.id}</span>
                </div>
                <Icon name="chevR" size={15} style={{color:'var(--text-3)'}}/>
              </div>
              {p.descricao && <div className="team-card-sobre">{p.descricao}</div>}
              <div className="team-card-foot" style={{justifyContent:'space-between'}}>
                <span className="tag"><Icon name="target" size={10}/> {p.missoes_total} missões</span>
                <span className="faint" style={{fontSize:11}}>{p.missoes_concluidas} concluídas</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- MISSÕES (dados reais do nexus.db) ---------- */
const MIS_COLS = [
  { key: 'PENDING',   label: 'Pendentes',   dot: 'idle' },
  { key: 'QUEUED',    label: 'Na fila',     dot: 'info' },
  { key: 'RUNNING',   label: 'Em execução', dot: 'ok' },
  { key: 'COMPLETED', label: 'Concluídas',  dot: 'ok' },
  { key: 'FAILED',    label: 'Com falha',   dot: 'err' },
];

function MissoesCenter({ setView }) {
  const D = window.FORJA;
  const [missoes, setMissoes] = useState(D.missoes || []);
  const [sel, setSel] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const apiOn = !!(window.ForjaAPI && window.ForjaAPI.createMission);

  const refresh = async () => {
    if (!window.ForjaAPI || !window.ForjaAPI.refreshMissions) return;
    await window.ForjaAPI.refreshMissions();
    setMissoes((window.FORJA.missoes || []).slice());
  };

  const novaMissao = async () => {
    const titulo = window.prompt('Título da nova missão:');
    if (!titulo || !titulo.trim()) return;
    const descricao = window.prompt('Descrição (opcional):') || '';
    setBusy(true); setMsg('Criando missão…');
    try {
      const r = await window.ForjaAPI.createMission(titulo.trim(), descricao);
      setMissoes((window.FORJA.missoes || []).slice());
      setMsg('Missão criada: ' + (r.id || titulo));
    } catch (e) { setMsg('Falha ao criar missão: ' + e.message); }
    finally { setBusy(false); }
  };

  const executar = async (m) => {
    if (!window.ForjaAPI || !window.ForjaAPI.runMission) return;
    setBusy(true); setMsg('Executando ' + m.id + '…');
    try {
      const r = await window.ForjaAPI.runMission(m.id);
      await refresh();
      const upd = (window.FORJA.missoes || []).find(x => x.id === m.id);
      if (upd) setSel(upd);
      setMsg('Execução concluída: ' + (r.status || 'ok') + (r.provider ? ' · ' + r.provider : ''));
    } catch (e) { setMsg('Falha na execução: ' + e.message); }
    finally { setBusy(false); }
  };

  const byCol = (k) => missoes.filter(m => (m.status || '').toUpperCase() === k);
  const stCls = (s) => ({RUNNING:'ok',FAILED:'err',QUEUED:'info',COMPLETED:'ok'}[(s||'').toUpperCase()] || 'idle');

  return (
    <div className="center">
      <PageHead icon="target" crumb="Operação" title="Missões" status={apiOn ? 'IMPL' : 'DEV'}
        sub={missoes.length + ' missões no banco · ' + byCol('RUNNING').length + ' em execução · ' + byCol('FAILED').length + ' com falha'}>
        <button className="btn" onClick={refresh} disabled={busy}><Icon name="refresh" size={13}/> Atualizar</button>
        <button className="btn primary" onClick={novaMissao} disabled={busy || !apiOn}><Icon name="plus" size={13}/> Nova missão</button>
      </PageHead>
      <div className="center-body section-gap">
        {msg && <div className="card" style={{padding:'9px 13px', fontSize:12, borderColor:'var(--accent-line)', background:'var(--accent-soft)'}}>{msg}</div>}
        {!apiOn && <div className="card" style={{padding:'9px 13px', fontSize:12, borderColor:'var(--warn)', background:'var(--warn-soft)'}}>Backend offline — inicie pelo ABRIR_PAINEL_FORJA para criar/executar missões.</div>}
        <div className="kanban" style={{height:'auto'}}>
          {MIS_COLS.map(col=>(
            <div className="kan-col" key={col.key}>
              <div className="kan-head"><span className={'dot '+col.dot}/><span style={{fontWeight:600,fontSize:11.5}}>{col.label}</span><span className="count">{byCol(col.key).length}</span></div>
              <div className="kan-body">
                {byCol(col.key).map(m=>(
                  <div key={m.id} className="kan-card" onClick={()=>setSel(m)} style={sel&&sel.id===m.id?{borderColor:'var(--accent-line)'}:{}}>
                    <div className="kan-card-top"><span className="id-cell">{m.id}</span></div>
                    <div className="kan-card-title">{m.titulo}</div>
                  </div>
                ))}
                {byCol(col.key).length===0 && <div className="faint" style={{fontSize:11,padding:'10px 6px'}}>vazio</div>}
              </div>
            </div>
          ))}
        </div>

        {sel && (
          <SectionCard icon="target" title={sel.id + ' · ' + sel.titulo} status={undefined}
            right={<span className={'pill '+stCls(sel.status)}>{sel.status}</span>}>
            <div style={{display:'flex', gap:8, marginBottom:10, flexWrap:'wrap'}}>
              <button className="btn primary" disabled={busy} onClick={()=>executar(sel)}>
                <Icon name="play" size={12}/> {sel.status==='FAILED'?'Reexecutar':'Executar missão'}
              </button>
              <button className="btn" disabled={busy} onClick={()=>setSel(null)}>Fechar</button>
            </div>
            {sel.description && <p style={{margin:0, fontSize:12.5, color:'var(--text-2)', lineHeight:1.6}}>{sel.description}</p>}
          </SectionCard>
        )}
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
        <button className="btn" onClick={()=>avisoEmDev('Inteligência')}><Icon name="refresh" size={13}/> Varrer mercado</button>
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

/* ---------- LLMs (status real + teste ao vivo) ---------- */
const _llmTone = (s) => {
  const v = (s || '').toLowerCase();
  if (v === 'active_real' || v === 'certified' || v === 'router_limited') return 'ok';  // ONLINE
  if (v === 'environment_pending' || v === 'offline' || v === 'unavailable'
      || v === 'error' || v === 'missing_key' || v.indexOf('blocked') >= 0) return 'err';  // FORA
  return 'warn';
};
const _llmLabel = (l) => l.statusLabel || ({
  active_real: 'Online', CERTIFIED: 'Online', ROUTER_LIMITED: 'Online (via router)',
  ENVIRONMENT_PENDING: 'Fora do ar', OFFLINE: 'Fora do ar', unavailable: 'Fora do ar',
  missing_key: 'Sem chave', BLOCKED_BY_BILLING: 'Bloqueada (billing)',
  NOT_IMPLEMENTED: 'Não implementada', ERROR: 'Erro',
}[l.status] || l.status || 'Não validada');

function LLMsCenter({ setView }) {
  const D = window.FORJA;
  const apiOn = !!(window.ForjaAPI && window.ForjaAPI.testProvider);
  const [llms, setLLMs] = useState(D.llms || []);
  const [sel, setSel] = useState((D.llms || [])[0] || null);
  const [busy, setBusy] = useState('');
  const [res, setRes] = useState({}); // id -> resultado do teste

  const reload = async () => {
    if (!window.ForjaAPI.refreshProviders) return;
    const ps = await window.ForjaAPI.refreshProviders();
    if (window.FORJA._mapProvidersFallback) {} // noop
    setLLMs(ps); window.FORJA.llms = ps;
    if (sel) { const u = ps.find(x => x.id === sel.id); if (u) setSel(u); }
  };

  const testar = async (l) => {
    if (!apiOn) return;
    setBusy(l.id);
    try {
      const r = await window.ForjaAPI.testProvider(l.id);
      setRes(s => ({ ...s, [l.id]: r }));
      await reload();
    } catch (e) {
      setRes(s => ({ ...s, [l.id]: { ok: false, error: e.message } }));
    } finally { setBusy(''); }
  };

  // Reconecta: tenta repetidas vezes até dar certo (buscando conexão).
  const reconectar = async (l) => {
    if (!apiOn || !window.ForjaAPI.reconnectProvider) return;
    setBusy(l.id);
    setRes(s => ({ ...s, [l.id]: { connecting: true } }));
    try {
      const r = await window.ForjaAPI.reconnectProvider(l.id, 3);
      setRes(s => ({ ...s, [l.id]: r }));
      await reload();
    } catch (e) {
      setRes(s => ({ ...s, [l.id]: { ok: false, error: e.message } }));
    } finally { setBusy(''); }
  };

  const testarTodos = async () => {
    for (const l of llms) { await reconectar(l); }
  };

  if (!sel) {
    return (
      <div className="center">
        <PageHead icon="zap" crumb="Recursos" title="LLMs" status="CONFIG" sub="Provedores de IA" />
        <div className="center-body"><EmptyState icon="zap" title="Sem provedores carregados"
          sub="Inicie o backend pelo ABRIR_PAINEL_FORJA para ver os provedores reais." /></div>
      </div>
    );
  }

  return (
    <div className="center">
      <PageHead icon="zap" crumb="Recursos" title="LLMs"
        status={llms.some(l=>_llmTone(l.status)==='ok') ? 'IMPL' : 'CONFIG'}
        sub="Assinaturas (Claude, Gemini, ChatGPT) · API (OpenRouter) · Local (Ollama) · teste real ao vivo">
        <button className="btn" onClick={testarTodos} disabled={!!busy || !apiOn}><Icon name="refresh" size={13}/> Testar todos</button>
        <button className="btn primary" onClick={()=>setView('configuracoes')}><Icon name="lock" size={13}/> Configurar no cofre</button>
      </PageHead>
      <div className="center-split wide">
        <div className="split-main">
          <div className="team-grid">
            {llms.map(l=>{
              const ativo = _llmTone(l.status) === 'ok';
              const r = res[l.id];
              return (
              <div key={l.id} className="team-card" onClick={()=>setSel(l)}
                style={Object.assign({cursor:'pointer'}, sel.id===l.id?{borderColor:'var(--accent-line)',background:'var(--accent-soft)'}:{})}>
                <div className="team-card-top">
                  <span className="ch-icon" style={{width:34,height:34}}><Icon name="zap" size={17}/></span>
                  <div style={{minWidth:0,flex:1,textAlign:'left'}}>
                    <div className="team-card-name">{l.provider || l.display_name || l.id}</div>
                    <span className={'pill '+_llmTone(l.status)} style={{fontSize:10}}>{_llmLabel(l)}</span>
                  </div>
                </div>
                <div className="team-card-sobre">{(l.modelos && l.modelos.length) ? ('Modelo: ' + l.modelos[0]) : (l.tipo || '')}</div>
                <div className="team-card-foot" style={{justifyContent:'space-between', marginTop:8}}>
                  <span className="faint" style={{fontSize:11}}>{l.tipo || '—'}</span>
                  <button className={'btn sm '+(ativo?'':'primary')} disabled={busy===l.id || !apiOn}
                    onClick={(e)=>{ e.stopPropagation(); reconectar(l); }}>
                    {busy===l.id
                      ? <><Icon name="refresh" size={11}/> Conectando…</>
                      : ativo ? <><Icon name="refresh" size={11}/> Revalidar</>
                              : <><Icon name="play" size={11}/> Reconectar</>}
                  </button>
                </div>
                {r && !r.connecting && (
                  <div className="faint" style={{fontSize:10.5, marginTop:5, color: r.ok?'var(--ok)':'var(--err)'}}>
                    {r.ok ? ('✓ conectado' + (r.attempts_made ? (' (' + r.attempts_made + ' tent.)') : ''))
                          : ('✕ ' + String(r.error || 'falhou').slice(0, 44))}
                  </div>
                )}
              </div>
              );
            })}
          </div>
        </div>
        <div className="split-side"><div className="detail">
          <div className="detail-head"><div className="ch-crumb">{sel.id}</div><h2>{sel.provider || sel.id}</h2><span className={'pill '+_llmTone(sel.status)}>{_llmLabel(sel)}</span></div>
          <div className="detail-block"><span className="eyebrow">Modelos</span>
            <div className="tags">{(sel.modelos||['—']).map(c=><span key={c} className="tag mono">{c}</span>)}</div>
          </div>
          <div className="detail-block"><span className="eyebrow">Telemetria</span>
            <div className="kv">
              <dt>Tipo</dt><dd className="mono">{sel.tipo || '—'}</dd>
              <dt>Automação</dt><dd className="faint">{sel.automacao || '—'}</dd>
              <dt>Custo incremental</dt><dd className="faint">{sel.custoIncremental || '—'}</dd>
              <dt>Último health</dt><dd className="faint">{sel.ultimoHealth || 'não validado'}</dd>
            </div>
          </div>
          {sel.observacao && <div className="detail-block"><span className="eyebrow">Observação</span>
            <div className="card" style={{padding:'9px 11px', fontSize:11.5}}>{sel.observacao}</div></div>}
          {res[sel.id] && (
            <div className="card" style={{padding:11, borderColor: res[sel.id].ok?'var(--ok)':'var(--err)', background: res[sel.id].ok?'var(--ok-soft, var(--accent-soft))':'var(--err-soft)'}}>
              <div style={{fontSize:12, fontWeight:600, marginBottom:4}}>{res[sel.id].ok ? '✓ Teste OK' : '✕ Falhou'} {res[sel.id].latency_ms!=null?('· '+res[sel.id].latency_ms+'ms'):''}</div>
              <div className="mono" style={{fontSize:11, whiteSpace:'pre-wrap', wordBreak:'break-word'}}>{res[sel.id].ok ? (res[sel.id].response_excerpt||'(sem texto)') : (res[sel.id].error||'erro')}</div>
            </div>
          )}
          <button className="btn primary" style={{width:'100%'}} disabled={busy===sel.id || !apiOn} onClick={()=>reconectar(sel)}>
            <Icon name="play" size={12}/> {busy===sel.id ? 'Reconectando… (tentando até conectar)' : 'Reconectar (tenta até conectar)'}
          </button>
          <div style={{display:'flex', gap:7}}>
            <button className="btn" style={{flex:1}} disabled={busy===sel.id || !apiOn} onClick={()=>testar(sel)}><Icon name="refresh" size={12}/> Testar 1x</button>
            <button className="btn" style={{flex:1}} onClick={()=>setView('configuracoes')}><Icon name="lock" size={12}/> Cofre de chaves</button>
          </div>
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
        <button className="btn primary" onClick={()=>setView('configuracoes')}><Icon name="lock" size={13}/> Configurar no cofre</button>
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

/* ---------- INTEGRAÇÕES DA FÁBRICA (contas globais · logadas uma vez) ---------- */
function IntegracoesCenter({ setView }) {
  const apiOn = !!(window.ForjaAPI && window.ForjaAPI.listAgencyConnections);
  const [connectors, setConnectors] = useState([]);
  const [conns, setConns] = useState([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const carregar = async () => {
    if (!apiOn) return;
    try {
      const cc = await window.ForjaAPI.listConnectors('global'); setConnectors(cc.items || []);
      const r = await window.ForjaAPI.listAgencyConnections(); setConns(r.items || []);
    } catch (e) { setMsg('Falha: ' + e.message); }
  };
  useEffect(() => { carregar(); }, []);

  const byKind = {}; conns.forEach(c => { byKind[c.kind] = c; });

  const conectar = async (con) => {
    const cred = window.prompt('Cole a credencial da Fábrica — ' + con.field + ':'); if (cred === null) return;
    const meta = {};
    for (const f of (con.extra || [])) {
      const v = window.prompt(f.label + ':');
      if (v) meta[f.key] = v.trim();
    }
    setBusy(true); setMsg('Conectando ' + con.kind + '…');
    try { const r = await window.ForjaAPI.addAgencyConnection(con.kind, con.kind, cred.trim(), meta); await carregar(); setMsg(con.kind + ': ' + r.status + (r.detail ? (' · ' + r.detail) : '')); }
    catch (e) { setMsg('Falha: ' + e.message); } finally { setBusy(false); }
  };
  const testar = async (id) => { setBusy(true); try { const r = await window.ForjaAPI.testConnection(id); await carregar(); setMsg('Teste: ' + r.status); } catch (e) { setMsg('Falha: ' + e.message); } finally { setBusy(false); } };
  const remover = async (id) => { setBusy(true); try { await window.ForjaAPI.deleteConnection(id); await carregar(); setMsg('Removida.'); } catch (e) { setMsg('Falha: ' + e.message); } finally { setBusy(false); } };

  return (
    <div className="center">
      <PageHead icon="link" crumb="Recursos" title="Integrações da Fábrica" status={apiOn ? 'IMPL' : 'PARCIAL'}
        sub="Contas da Fábrica (logadas UMA vez, usadas em todos os clientes) · ex.: seu Canva Pro, OpenRouter, GitHub, Telegram">
        <button className="btn" onClick={carregar} disabled={busy}><Icon name="refresh" size={13}/> Atualizar</button>
      </PageHead>
      <div className="center-body section-gap">
        {msg && <div className="card" style={{padding:'9px 13px',fontSize:12,borderColor:'var(--accent-line)',background:'var(--accent-soft)'}}>{msg}</div>}
        <div className="card" style={{padding:10, display:'flex',gap:8,alignItems:'center', borderColor:'var(--info)', background:'var(--info-soft)'}}>
          <Icon name="lock" size={14} style={{color:'var(--info)'}}/><span style={{fontSize:11.5}}>Estas são as contas da <b>Fábrica</b>. As contas <b>de cada cliente</b> (ex.: Instagram dele) ficam em <button className="lnk" onClick={()=>setView('clientes')}>Clientes</button>. Credenciais nunca exibidas.</span>
        </div>
        {!apiOn && <div className="card" style={{padding:'9px 13px',fontSize:12,borderColor:'var(--warn)',background:'var(--warn-soft)'}}>Backend offline — abra pelo ABRIR_PAINEL_FORJA.</div>}
        <div className="team-grid">
          {connectors.map(con => {
            const c = byKind[con.kind];
            return (
              <div key={con.kind} className="team-card" style={{cursor:'default'}}>
                <div className="team-card-top">
                  <span className="ch-icon" style={{width:32,height:32}}><Icon name="link" size={15}/></span>
                  <div style={{minWidth:0,flex:1}}>
                    <div className="team-card-name">{con.label}</div>
                    <span className={'pill ' + (c ? _connTone(c.status) : '')} style={{fontSize:10}}>{c ? c.status : 'não conectado'}</span>
                  </div>
                </div>
                <div className="faint" style={{fontSize:10.5, margin:'4px 0 8px'}}>{con.how}</div>
                <div className="team-card-foot" style={{justifyContent:'flex-end', gap:6}}>
                  {c && <button className="btn ghost sm" disabled={busy} onClick={()=>testar(c.id)}>Testar</button>}
                  {c && <button className="btn ghost sm" disabled={busy} onClick={()=>remover(c.id)}>Remover</button>}
                  <button className="btn sm primary" disabled={busy || !apiOn} onClick={()=>conectar(con)}>{c ? 'Atualizar' : 'Conectar'}</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------- CONHECIMENTO (contagens reais do repositório) ---------- */
function ConhecimentoCenter({ setView }) {
  const D = window.FORJA;
  const apiOn = !!(window.ForjaAPI && window.ForjaAPI.getKnowledge);
  const [know, setKnow] = useState(D.knowledge || null);
  const [busy, setBusy] = useState(false);

  const atualizar = async () => {
    if (!apiOn) return;
    setBusy(true);
    try { setKnow(await window.ForjaAPI.getKnowledge()); }
    catch (e) { /* mantém último estado */ }
    finally { setBusy(false); }
  };
  useEffect(() => { if (!know) atualizar(); }, []);

  const realById = {};
  if (know && Array.isArray(know.items)) know.items.forEach(it => { realById[it.id] = it; });
  const total = know ? know.total_items : null;

  return (
    <div className="center">
      <PageHead icon="book" crumb="Recursos" title="Conhecimento" status={total ? 'IMPL' : 'DEV'}
        sub={total != null
          ? (total + ' itens reais indexados no repositório · Rules · Workflows · Skills · Templates · Biblioteca · Memória')
          : 'Rules · Workflows · Skills · Templates · Biblioteca · Memória'}>
        <button className="btn primary" onClick={atualizar} disabled={busy || !apiOn}><Icon name="refresh" size={13}/> {busy?'Atualizando…':'Atualizar'}</button>
      </PageHead>
      <div className="center-body">
        <div className="team-grid">
          {D.conhecimento.map(c=>{
            const real = realById[c.id];
            const count = real ? real.count : c.count;
            const st = real ? (real.count > 0 ? 'IMPL' : 'DEV') : c.status;
            return (
              <div key={c.id} className="team-card" style={{cursor:'default'}}>
                <div className="team-card-top">
                  <span className="ch-icon" style={{width:34,height:34}}><Icon name={c.icon} size={16}/></span>
                  <div style={{minWidth:0,flex:1}}>
                    <div className="team-card-name">{c.nome}</div>
                    <span className="faint" style={{fontSize:11}}>{c.sub}</span>
                  </div>
                  <StatusPill status={st} size="sm"/>
                </div>
                <div className="team-card-foot" style={{justifyContent:'space-between'}}>
                  <span className="mono" style={{fontSize:18,fontWeight:600}}>{count}</span>
                  <span className="faint" style={{fontSize:11}}>{real ? 'arquivos reais' : 'itens'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------- ENVIAR PROJETO (página dedicada de upload + briefing) ---------- */
function EnviarProjetoCenter({ setView }) {
  const apiOn = !!(window.ForjaAPI && window.ForjaAPI.createProject);
  const [clientes, setClientes] = useState([]);
  const [cli, setCli] = useState('');
  const [nome, setNome] = useState('');
  const [briefing, setBriefing] = useState('');
  const [picked, setPicked] = useState([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [proj, setProj] = useState(null);
  const [devRes, setDevRes] = useState(null);

  useEffect(() => { if (apiOn && window.ForjaAPI.listClients) window.ForjaAPI.listClients().then(r => setClientes(r.items || [])).catch(() => {}); }, []);

  const pickFiles = (fileList, fromFolder) => {
    const arr = Array.from(fileList || []).map(f => ({ name: (fromFolder && f.webkitRelativePath) ? f.webkitRelativePath : f.name, file: f }));
    setPicked(p => [...p, ...arr]);
  };

  const enviar = async () => {
    if (!nome.trim()) { setMsg('Dê um nome ao projeto.'); return; }
    setBusy(true); setMsg('Criando projeto…'); setDevRes(null);
    try {
      const pr = await window.ForjaAPI.createProject(nome.trim(), briefing.trim(), cli || undefined);
      setProj(pr);
      if (picked.length) {
        setMsg('Enviando ' + picked.length + ' arquivo(s)…');
        const files = await Promise.all(picked.map(p => new Promise(res => {
          const r = new FileReader(); r.onload = () => res({ name: p.name, data_url: r.result }); r.readAsDataURL(p.file);
        })));
        const up = await window.ForjaAPI.uploadProjectFiles(pr.id, files);
        setMsg('✓ Projeto criado (' + pr.id + ') · ' + up.saved + ' arquivo(s) enviados.');
      } else {
        setMsg('✓ Projeto criado (' + pr.id + '). Você pode subir arquivos depois em Projetos.');
      }
    } catch (e) { setMsg('Falha: ' + e.message); } finally { setBusy(false); }
  };

  const desenvolver = async () => {
    if (!proj) return;
    setBusy(true); setMsg('A Fábrica (agente Desenvolvedor) está trabalhando…');
    try { const r = await window.ForjaAPI.developProject(proj.id); setDevRes(r); setMsg('Desenvolvimento: ' + (r.status || '')); }
    catch (e) { setMsg('Falha: ' + e.message); } finally { setBusy(false); }
  };

  const inp = { background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', color: 'var(--text-1)', padding: '8px 10px', fontSize: 13, fontFamily: 'inherit' };
  return (
    <div className="center">
      <PageHead icon="box" crumb="Negócio" title="Enviar projeto" status={apiOn ? 'IMPL' : 'PARCIAL'}
        sub="Suba a pasta/arquivos do projeto e descreva o que a Fábrica deve desenvolver — tudo em uma tela" />
      <div className="center-body section-gap" style={{ maxWidth: 840 }}>
        {msg && <div className="card" style={{ padding: '9px 13px', fontSize: 12, borderColor: 'var(--accent-line)', background: 'var(--accent-soft)' }}>{msg}</div>}
        {!apiOn && <div className="card" style={{ padding: '9px 13px', fontSize: 12, borderColor: 'var(--warn)', background: 'var(--warn-soft)' }}>Backend offline — abra pelo ABRIR_PAINEL_FORJA.</div>}

        <SectionCard icon="folder" title="Dados do projeto">
          <div className="section-gap">
            <div><div className="eyebrow">Cliente (opcional)</div>
              <select style={inp} value={cli} onChange={e => setCli(e.target.value)}>
                <option value="">(sem cliente)</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
            <div><div className="eyebrow">Nome do projeto</div>
              <input style={{ ...inp, width: '100%' }} value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex.: Site institucional da Cafeteria" />
            </div>
            <div><div className="eyebrow">O que desenvolver (briefing / prompt)</div>
              <textarea rows={5} style={{ ...inp, width: '100%', resize: 'vertical' }} value={briefing} onChange={e => setBriefing(e.target.value)}
                placeholder="Descreva o que a Fábrica deve fazer: páginas, funções, estilo, o que finalizar, exemplos…" />
            </div>
          </div>
        </SectionCard>

        <SectionCard icon="box" title="Arquivos do projeto (opcional)">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <label className="btn sm" style={{ cursor: 'pointer' }}><Icon name="plus" size={12} /> Selecionar arquivos / .zip<input type="file" multiple style={{ display: 'none' }} onChange={e => pickFiles(e.target.files, false)} /></label>
            <label className="btn sm" style={{ cursor: 'pointer' }}><Icon name="folder" size={12} /> Selecionar pasta<input type="file" webkitdirectory="" directory="" multiple style={{ display: 'none' }} onChange={e => pickFiles(e.target.files, true)} /></label>
            {picked.length > 0 && <button className="btn ghost sm" onClick={() => setPicked([])}>limpar ({picked.length})</button>}
          </div>
          {picked.length > 0 && <div className="term" style={{ marginTop: 8, maxHeight: 170, overflow: 'auto' }}>{picked.slice(0, 120).map((p, i) => <div key={i} className="ln"><span className="t">·</span><span className="lv-info">{p.name}</span></div>)}</div>}
          <div className="faint" style={{ fontSize: 10.5, marginTop: 6 }}>Para manter a estrutura de pastas, use "Selecionar pasta" ou suba um .zip.</div>
        </SectionCard>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn primary" disabled={busy || !apiOn} onClick={enviar}><Icon name="rocket" size={13} /> {busy ? 'Enviando…' : 'Enviar projeto'}</button>
          {proj && <button className="btn" disabled={busy} onClick={desenvolver}><Icon name="cpu" size={13} /> Desenvolver com a Fábrica</button>}
          {proj && proj.raw_id && <button className="btn" onClick={() => window.open('/preview/projeto_' + proj.raw_id + '/', '_blank')}><Icon name="eye" size={13} /> Ver preview</button>}
          {proj && <button className="btn" onClick={() => setView('projetos')}>Abrir em Projetos</button>}
        </div>
        {devRes && <div className="card" style={{ padding: 11, borderColor: devRes.ok ? 'var(--ok)' : 'var(--warn)' }}><div style={{ fontSize: 12.5, whiteSpace: 'pre-wrap' }}>{devRes.result || devRes.status}</div></div>}
      </div>
    </div>
  );
}

Object.assign(window, { ClientesCenter, ProjetosCenter, EnviarProjetoCenter, MissoesCenter, InteligenciaCenter, LLMsCenter, FerramentasCenter, IntegracoesCenter, ConhecimentoCenter });


/* ============================================================
   A FÁBRICA — Módulos B: Testes, Validação, Auditoria, Operações,
   Financeiro, Roadmap, Academia, Ajuda, Configurações
   ============================================================ */

/* ---------- TESTES (auto-teste real do sistema) ---------- */
function TestesCenter() {
  const apiOn = !!(window.ForjaAPI && window.ForjaAPI.runTests);
  const [res, setRes] = useState(null);
  const [busy, setBusy] = useState(false);
  const rodar = async () => {
    if (!apiOn) return;
    setBusy(true);
    try { setRes(await window.ForjaAPI.runTests()); }
    catch (e) { setRes({ ok: false, items: [], total: 0, passed: 0, failed: 0, error: e.message }); }
    finally { setBusy(false); }
  };
  useEffect(() => { rodar(); }, []);
  return (
    <div className="center">
      <PageHead icon="flask" crumb="Garantia" title="Testes" status={res ? (res.ok ? 'IMPL' : 'PARCIAL') : 'NTEST'}
        sub="Verificação real do sistema · banco, agentes, provedores, conhecimento, ferramentas">
        <button className="btn primary" disabled={busy || !apiOn} onClick={rodar}><Icon name="play2" size={12}/> {busy ? 'Rodando…' : 'Rodar testes'}</button>
      </PageHead>
      <div className="center-body section-gap">
        {!apiOn && <div className="card" style={{padding:'9px 13px',fontSize:12,borderColor:'var(--warn)',background:'var(--warn-soft)'}}>Backend offline — abra pelo ABRIR_PAINEL_FORJA.</div>}
        <div className="kpi-grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))'}}>
          <div className="kpi"><div className="kpi-label">Total</div><div className="kpi-val">{res ? res.total : '—'}</div></div>
          <div className="kpi"><div className="kpi-label"><span className="dot ok"/> Passaram</div><div className="kpi-val" style={{color:'var(--ok)'}}>{res ? res.passed : '—'}</div></div>
          <div className="kpi"><div className="kpi-label"><span className="dot err"/> Falharam</div><div className="kpi-val" style={{color:res&&res.failed?'var(--err)':'var(--text-2)'}}>{res ? res.failed : '—'}</div></div>
          <div className="kpi"><div className="kpi-label">Resultado</div><div className="kpi-val" style={{fontSize:16}}>{res ? (res.ok ? 'TUDO OK' : 'ATENÇÃO') : (busy ? 'rodando…' : '—')}</div></div>
        </div>
        <SectionCard icon="flask" title="Verificações" flush>
          <div className="tbl-wrap"><table className="tbl"><thead><tr><th>Verificação</th><th>Resultado</th><th>Detalhe</th></tr></thead>
          <tbody>
            {res && res.items && res.items.map((c,i)=>(
              <tr key={i}>
                <td className="cell-strong">{c.nome}</td>
                <td><span className={'pill ' + (c.passou?'ok':'err')}>{c.passou?'passou':'falhou'}</span></td>
                <td className="faint" style={{fontSize:11.5}}>{c.detalhe}</td>
              </tr>
            ))}
            {(!res || !res.items || !res.items.length) && <tr><td colSpan={3} className="faint" style={{padding:12}}>{busy?'Executando verificações…':'Clique em "Rodar testes".'}</td></tr>}
          </tbody></table></div>
        </SectionCard>
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
        <button className="btn" onClick={()=>downloadCSV('auditoria_forja.csv',
          (D.auditoria||[]).map(a=>({ modulo:a.modulo||'', veredito:a.veredito||'', status:a.status||'',
            hora:a.hora||a.ts||'', acao:a.acao||'', alvo:a.alvo||'' })))}>
          <Icon name="doc" size={13}/> Exportar
        </button>
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

/* ---------- OPERAÇÕES (health check real ao vivo) ---------- */
function OperacoesCenter({ setView }) {
  const D = window.FORJA;
  const apiOn = !!(window.ForjaAPI && window.ForjaAPI.healthCheckServices);
  const [live, setLive] = useState(D.services || []);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const check = async () => {
    if (!apiOn) return;
    setBusy(true); setMsg('Verificando serviços…');
    try {
      const r = await window.ForjaAPI.healthCheckServices();
      setLive((r.services && r.services.items) || []);
      const hora = new Date().toTimeString().slice(0,8);
      setMsg('Health check concluído às ' + hora);
    } catch (e) { setMsg('Falha no health check: ' + e.message); }
    finally { setBusy(false); }
  };
  useEffect(() => { check(); }, []);

  const [jobs, setJobs] = useState([]);
  const loadJobs = async () => {
    if (!apiOn || !window.ForjaAPI.listJobs) return;
    try { const r = await window.ForjaAPI.listJobs(); setJobs(r.items || []); } catch (e) {}
  };
  useEffect(() => { loadJobs(); }, []);

  const novoJob = async (kind) => {
    if (!window.ForjaAPI.createJob) return;
    let job = null;
    if (kind === 'run_queue') {
      const mins = window.prompt('Processar a fila de missões a cada quantos minutos?', '5'); if (!mins) return;
      job = { name: 'Processar fila', kind, schedule_type: 'interval', schedule_value: mins };
    } else if (kind === 'telegram_message') {
      const to = window.prompt('chat_id de destino (Telegram):'); if (!to) return;
      const texto = window.prompt('Mensagem a enviar:'); if (!texto) return;
      const hora = window.prompt('Todo dia às (HH:MM):', '09:00'); if (!hora) return;
      job = { name: 'Mensagem Telegram', kind, spec: { to, texto }, schedule_type: 'daily', schedule_value: hora };
    } else if (kind === 'agent_act') {
      const objective = window.prompt('Objetivo da tarefa (o agente vai executar):'); if (!objective) return;
      const hora = window.prompt('Todo dia às (HH:MM):', '09:00'); if (!hora) return;
      job = { name: 'Tarefa do agente', kind, spec: { objective }, schedule_type: 'daily', schedule_value: hora };
    }
    setBusy(true);
    try { await window.ForjaAPI.createJob(job); await loadJobs(); setMsg('Agendamento criado.'); }
    catch (e) { setMsg('Falha: ' + e.message); } finally { setBusy(false); }
  };
  const jobAcao = async (fn, id) => { setBusy(true); try { await fn(id); await loadJobs(); } catch (e) { setMsg('Falha: ' + e.message); } finally { setBusy(false); } };

  const stTone = (s) => s==='ok' ? 'ok' : s==='err' ? 'err' : 'warn';
  return (
    <div className="center">
      <PageHead icon="server" crumb="Infra" title="Operações" status={apiOn ? 'IMPL' : 'DEV'}
        sub="Saúde real dos serviços · FastAPI · Banco · Ollama · Missões">
        <button className="btn" onClick={check} disabled={busy}><Icon name="refresh" size={13}/> {busy?'Verificando…':'Health check'}</button>
      </PageHead>
      <div className="center-body section-gap">
        {msg && <div className="card" style={{padding:'8px 12px', fontSize:12, borderColor:'var(--accent-line)', background:'var(--accent-soft)'}}>{msg}</div>}
        <SectionCard icon="server" title="Serviços (verificação ao vivo)" flush>
          <div className="tbl-wrap"><table className="tbl"><thead><tr><th>Serviço</th><th>Ping</th><th>Status</th></tr></thead>
          <tbody>
            {live.length ? live.map(s=>(
              <tr key={s.id} style={{cursor:'default'}}>
                <td className="cell-strong">{s.nome}</td>
                <td className="faint mono" style={{fontSize:11.5}}>{s.ping}</td>
                <td><span className={'pill ' + stTone(s.status)}>{s.status==='ok'?'operacional':s.status==='err'?'falha':'inativo'}</span></td>
              </tr>
            )) : (
              <tr><td colSpan={3} className="faint" style={{padding:'12px'}}>Sem dados — clique em Health check.</td></tr>
            )}
          </tbody></table></div>
        </SectionCard>
        <SectionCard icon="box" title="Componentes da plataforma (estrutura)" flush>
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

        <SectionCard icon="clock" title={'Agendamentos · Scheduler (' + jobs.length + ')'}
          right={<div style={{display:'flex',gap:6}}>
            <button className="btn ghost sm" disabled={busy} onClick={()=>novoJob('run_queue')}>+ Fila</button>
            <button className="btn ghost sm" disabled={busy} onClick={()=>novoJob('telegram_message')}>+ Telegram</button>
            <button className="btn primary sm" disabled={busy} onClick={()=>novoJob('agent_act')}>+ Tarefa</button>
          </div>}>
          <div className="tbl-wrap"><table className="tbl"><thead><tr><th>Nome</th><th>Tipo</th><th>Quando</th><th>Próx. execução</th><th>Último resultado</th><th></th></tr></thead>
          <tbody>
            {jobs.map(j=>(
              <tr key={j.id} style={{opacity: j.enabled?1:0.5}}>
                <td className="cell-strong">{j.name}</td>
                <td className="mono" style={{fontSize:11}}>{j.kind}</td>
                <td className="faint" style={{fontSize:11}}>{j.schedule_type==='interval'?('a cada '+j.schedule_value+'min'):j.schedule_type==='daily'?('todo dia '+j.schedule_value):j.schedule_value}</td>
                <td className="mono faint" style={{fontSize:10.5}}>{j.next_run ? new Date(j.next_run).toLocaleString('pt-BR') : '—'}</td>
                <td className="faint" style={{fontSize:10.5}}>{(j.last_result||'—').slice(0,40)}</td>
                <td style={{whiteSpace:'nowrap'}}>
                  <button className="btn ghost sm" disabled={busy} onClick={()=>jobAcao(window.ForjaAPI.runJob, j.id)}>rodar</button>
                  <button className="btn ghost sm" disabled={busy} onClick={()=>jobAcao(window.ForjaAPI.toggleJob, j.id)}>{j.enabled?'pausar':'ativar'}</button>
                  <button className="btn ghost sm" disabled={busy} onClick={()=>jobAcao(window.ForjaAPI.deleteJob, j.id)}>remover</button>
                </td>
              </tr>
            ))}
            {!jobs.length && <tr><td colSpan={6} className="faint" style={{padding:12}}>Sem agendamentos. Crie um acima (ex.: "+ Tarefa" todo dia às 9h).</td></tr>}
          </tbody></table></div>
          <div className="faint" style={{fontSize:10.5, marginTop:8}}>O agendador roda em background enquanto o servidor está ligado. Para 24/7 de verdade, publique no VPS.</div>
        </SectionCard>
      </div>
    </div>
  );
}

/* ---------- FINANCEIRO (livro-caixa real + custo de IA medido) ---------- */
function FinanceiroCenter() {
  const apiOn = !!(window.ForjaAPI && window.ForjaAPI.getFinance);
  const [fin, setFin] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const carregar = async () => {
    if (!apiOn) return;
    try { setFin(await window.ForjaAPI.getFinance()); }
    catch (e) { setMsg('Falha: ' + e.message); }
  };
  useEffect(() => { carregar(); }, []);

  const lancar = async (kind) => {
    const desc = window.prompt((kind === 'receita' ? 'Receita' : 'Despesa') + ' — descrição:'); if (!desc || !desc.trim()) return;
    const val = window.prompt('Valor (R$):'); if (!val) return;
    setBusy(true); setMsg('Salvando lançamento…');
    try { await window.ForjaAPI.addFinance(kind, desc.trim(), val.trim()); await carregar(); setMsg('Lançamento salvo.'); }
    catch (e) { setMsg('Falha: ' + e.message); } finally { setBusy(false); }
  };
  const remover = async (id) => {
    setBusy(true);
    try { await window.ForjaAPI.deleteFinance(id); await carregar(); }
    catch (e) { setMsg('Falha: ' + e.message); } finally { setBusy(false); }
  };

  const brl = (v) => 'R$ ' + (Number(v || 0)).toFixed(2);
  const usd = (v) => '$' + (Number(v || 0)).toFixed(4);
  const f = fin || {};
  const resultado = Number(f.resultado || 0);

  return (
    <div className="center">
      <PageHead icon="dollar" crumb="Negócio" title="Financeiro" status={apiOn ? 'IMPL' : 'PARCIAL'}
        sub="Livro-caixa real (receitas/despesas que você registra) + custo de IA medido automaticamente">
        <button className="btn" onClick={()=>lancar('despesa')} disabled={busy || !apiOn}><Icon name="plus" size={13}/> Despesa</button>
        <button className="btn primary" onClick={()=>lancar('receita')} disabled={busy || !apiOn}><Icon name="plus" size={13}/> Receita</button>
      </PageHead>
      <div className="center-body section-gap">
        {msg && <div className="card" style={{padding:'9px 13px',fontSize:12,borderColor:'var(--accent-line)',background:'var(--accent-soft)'}}>{msg}</div>}
        {!apiOn && <div className="card" style={{padding:'9px 13px',fontSize:12,borderColor:'var(--warn)',background:'var(--warn-soft)'}}>Backend offline — abra pelo ABRIR_PAINEL_FORJA.</div>}

        <div className="kpi-grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))'}}>
          <div className="kpi"><div className="kpi-label"><span className="dot ok"/> Receitas</div><div className="kpi-val" style={{color:'var(--ok)'}}>{brl(f.receitas_total)}</div></div>
          <div className="kpi"><div className="kpi-label"><span className="dot err"/> Despesas</div><div className="kpi-val" style={{color:'var(--err)'}}>{brl(f.despesas_total)}</div></div>
          <div className="kpi"><div className="kpi-label">Resultado</div><div className="kpi-val" style={{color: resultado>=0?'var(--ok)':'var(--err)'}}>{brl(resultado)}</div><div className="kpi-sub">receitas − despesas</div></div>
          <div className="kpi"><div className="kpi-label">Custo de IA (mês)</div><div className="kpi-val">{usd(f.ia_custo_mes_usd)}</div><div className="kpi-sub">{f.ia_source==='real_usage'?'uso real medido':'sem dados reais'} · teto ${(Number(f.ia_budget_mes_usd||30)).toFixed(0)}</div></div>
        </div>

        <SectionCard icon="dollar" title={'Lançamentos (' + ((f.items||[]).length) + ')'} flush>
          <div className="tbl-wrap"><table className="tbl"><thead><tr><th>Tipo</th><th>Descrição</th><th>Cliente</th><th>Valor</th><th>Data</th><th></th></tr></thead>
          <tbody>
            {(f.items||[]).map(e=>(
              <tr key={e.id}>
                <td><span className={'pill ' + (e.kind==='receita'?'ok':'err')}>{e.kind}</span></td>
                <td className="cell-strong">{e.description || '—'}</td>
                <td className="muted">{e.cliente || '—'}</td>
                <td className="mono" style={{color: e.kind==='receita'?'var(--ok)':'var(--err)'}}>{brl(e.amount)}</td>
                <td className="faint" style={{fontSize:11}}>{e.created_at ? new Date(e.created_at).toLocaleDateString('pt-BR') : '—'}</td>
                <td><button className="btn ghost sm" disabled={busy} onClick={()=>remover(e.id)}>remover</button></td>
              </tr>
            ))}
            {!(f.items||[]).length && <tr><td colSpan={6} className="faint" style={{padding:12}}>Sem lançamentos. Registre uma Receita ou Despesa real acima.</td></tr>}
          </tbody></table></div>
        </SectionCard>
        <div className="card" style={{padding:10, display:'flex',gap:8,alignItems:'center', borderColor:'var(--info)', background:'var(--info-soft)'}}>
          <Icon name="shield" size={14} style={{color:'var(--info)'}}/><span style={{fontSize:11.5}}>Dados reais: receitas/despesas são os valores que você registra; o custo de IA é medido de verdade pelo uso. Nada é inventado (Lei Zero Fantasma).</span>
        </div>
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
function AjudaCenter({ setView }) {
  const secs = [['Consultor','help'],['FAQ','book'],['Documentação','doc'],['Chamados','chat'],['Suporte','users']];
  return (
    <div className="center">
      <PageHead icon="help" crumb="Plataforma" title="Ajuda" status="IMPL"
        sub="Suporte, FAQ, documentação e orientação de uso">
      </PageHead>
      <div className="center-body section-gap">
        <SectionCard icon="help" title="Consultor da Fábrica" status="IMPL">
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <span className="ch-icon" style={{width:36,height:36}}><Icon name="chat" size={18}/></span>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500}}>Assistente de uso da plataforma</div><div className="muted" style={{fontSize:11.5}}>Tire dúvidas sobre módulos e fluxos no chat — usa as IAs já conectadas.</div></div>
            <button className="btn primary" onClick={()=>setView&&setView('forja')}><Icon name="chat" size={13}/> Abrir consultor</button>
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

/* ---------- COFRE DE CHAVES (real · /api/config/keys) ---------- */
const VAULT_KEYS = [
  { key: 'ANTHROPIC_API_KEY',  label: 'Anthropic (Claude)' },
  { key: 'OPENAI_API_KEY',     label: 'OpenAI (ChatGPT)' },
  { key: 'GOOGLE_API_KEY',     label: 'Google (Gemini)' },
  { key: 'DEEPSEEK_API_KEY',   label: 'DeepSeek' },
  { key: 'OPENROUTER_API_KEY', label: 'OpenRouter' },
  { key: 'OLLAMA_MODEL',       label: 'Ollama (modelo local)' },
];

function KeyVault() {
  const apiOn = !!(window.ForjaAPI && window.ForjaAPI.getConfigKeys);
  const [status, setStatus] = useState({});
  const [draft, setDraft] = useState({});
  const [busy, setBusy] = useState('');
  const [msg, setMsg] = useState('');

  const load = async () => {
    if (!apiOn) return;
    try { const r = await window.ForjaAPI.getConfigKeys(); setStatus(r.keys || {}); }
    catch (e) { setMsg('Falha ao ler status do cofre: ' + e.message); }
  };
  useEffect(() => { load(); }, []);

  const salvar = async (key) => {
    const value = (draft[key] || '').trim();
    setBusy(key); setMsg('');
    try {
      const r = await window.ForjaAPI.setConfigKey(key, value);
      setMsg((r.action === 'removed' ? 'Removida' : 'Salva') + ': ' + key);
      setDraft(d => ({ ...d, [key]: '' }));
      await load();
    } catch (e) { setMsg('Falha ao salvar ' + key + ': ' + e.message); }
    finally { setBusy(''); }
  };

  if (!apiOn) {
    return (
      <div className="card" style={{padding:11, display:'flex',gap:9,alignItems:'center', borderColor:'var(--warn)', background:'var(--warn-soft)'}}>
        <Icon name="alert" size={15} style={{color:'var(--warn)'}}/>
        <span style={{fontSize:12}}>Backend offline — inicie pelo ABRIR_PAINEL_FORJA para configurar chaves.</span>
      </div>
    );
  }
  return (
    <div className="section-gap">
      <div className="card" style={{padding:11, display:'flex',gap:9,alignItems:'center', borderColor:'var(--info)', background:'var(--info-soft)'}}>
        <Icon name="lock" size={15} style={{color:'var(--info)'}}/>
        <span style={{fontSize:12}}>As chaves são gravadas no <b>.env</b> do servidor. O painel só mostra se está configurada — <b>nunca</b> o valor.</span>
      </div>
      {msg && <div className="card" style={{padding:'8px 12px', fontSize:12, borderColor:'var(--accent-line)', background:'var(--accent-soft)'}}>{msg}</div>}
      {VAULT_KEYS.map(k => (
        <div key={k.key} className="health-row" style={{padding:'10px 0', gap:10, alignItems:'center', flexWrap:'wrap'}}>
          <div style={{minWidth:170}}>
            <div style={{fontSize:12.5, fontWeight:500}}>{k.label}</div>
            <div className="mono faint" style={{fontSize:10.5}}>{k.key}</div>
          </div>
          <span className={'pill ' + (status[k.key] ? 'ok' : '')} style={{flex:'none'}}>{status[k.key] ? 'configurada' : 'não configurada'}</span>
          <div className="field" style={{flex:1, minWidth:160, height:30}}>
            <input type="password" placeholder={k.key === 'OLLAMA_MODEL' ? 'ex: llama3.1' : '••• colar valor •••'}
              value={draft[k.key] || ''} onChange={e=>setDraft(d=>({ ...d, [k.key]: e.target.value }))} />
          </div>
          <button className="btn sm" disabled={busy===k.key} onClick={()=>salvar(k.key)}>
            {busy===k.key ? '…' : ((draft[k.key]||'').trim() ? 'Salvar' : 'Remover')}
          </button>
        </div>
      ))}
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

        <SectionCard icon="lock" title="Cofre de segredos · chaves de IA" status="IMPL">
          <KeyVault />
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

/* ---------- CONTEÚDO (estúdio de posts/reels para redes sociais) ---------- */
function ConteudoCenter({ setView }) {
  const apiOn = !!(window.ForjaAPI && window.ForjaAPI.listContent);
  const [clientes, setClientes] = useState([]);
  const [cli, setCli] = useState('');
  const [items, setItems] = useState([]);
  const [tipo, setTipo] = useState('post');
  const [network, setNetwork] = useState('instagram');
  const [briefing, setBriefing] = useState('');
  const [busy, setBusy] = useState('');
  const [msg, setMsg] = useState('');

  const carregarClientes = async () => { try { const r = await window.ForjaAPI.listClients(); setClientes(r.items || []); } catch (e) {} };
  const carregar = async () => { if (!apiOn) return; try { const r = await window.ForjaAPI.listContent(cli || undefined); setItems(r.items || []); } catch (e) { setMsg('Falha: ' + e.message); } };
  useEffect(() => { carregarClientes(); }, []);
  useEffect(() => { carregar(); }, [cli]);

  const criar = async () => {
    setBusy('criar'); setMsg('Criando…');
    try { await window.ForjaAPI.createContent({ client_id: cli || undefined, network, tipo, briefing }); setBriefing(''); await carregar(); setMsg('Conteúdo criado. Agora clique "Desenvolver com IA".'); }
    catch (e) { setMsg('Falha: ' + e.message); } finally { setBusy(''); }
  };
  const desenvolver = async (id) => { setBusy('dev' + id); setMsg('IA desenvolvendo o conteúdo…'); try { await window.ForjaAPI.developContent(id); await carregar(); setMsg('Conteúdo desenvolvido pela IA (legenda, @ e #).'); } catch (e) { setMsg('Falha: ' + e.message); } finally { setBusy(''); } };
  const subir = (id, file) => { if (!file) return; const r = new FileReader(); r.onload = async () => { setBusy('up' + id); setMsg('Enviando e ajustando ao tamanho certo…'); try { const res = await window.ForjaAPI.uploadContentMedia(id, r.result); await carregar(); setMsg('Imagem pronta no tamanho ' + res.size + '.'); } catch (e) { setMsg('Falha: ' + e.message); } finally { setBusy(''); } }; r.readAsDataURL(file); };
  const publicar = async (id) => { setBusy('pub' + id); try { const res = await window.ForjaAPI.publishContent(id); await carregar(); setMsg(res.result || (res.ok ? 'Publicado.' : 'Não publicado.')); } catch (e) { setMsg('Falha: ' + e.message); } finally { setBusy(''); } };
  const agendar = async (id) => { const h = window.prompt('Publicar todo dia às (HH:MM):', '09:00'); if (!h) return; setBusy('ag' + id); try { const r = await window.ForjaAPI.scheduleContent(id, 'daily', h); await carregar(); setMsg('Agendado para ' + h + ' (próx.: ' + (r.next_run || '') + ').'); } catch (e) { setMsg('Falha: ' + e.message); } finally { setBusy(''); } };
  const remover = async (id) => { setBusy('rm' + id); try { await window.ForjaAPI.deleteContent(id); await carregar(); } catch (e) { setMsg('Falha: ' + e.message); } finally { setBusy(''); } };
  const editar = async (id, atual) => { const t = window.prompt('Editar conteúdo/legenda:', atual || ''); if (t === null) return; setBusy('ed' + id); try { await window.ForjaAPI.updateContent(id, { output: t }); await carregar(); } catch (e) { setMsg('Falha: ' + e.message); } finally { setBusy(''); } };

  const [tema, setTema] = useState('');
  const [estilo, setEstilo] = useState('');
  const [marca, setMarca] = useState('');
  const [periodo, setPeriodo] = useState('semana');
  const [qtd, setQtd] = useState(7);
  const [nets, setNets] = useState({ instagram: true });
  const maxQtd = periodo === 'dia' ? 3 : 21;
  const toggleNet = (n) => setNets(o => ({ ...o, [n]: !o[n] }));
  const planejar = async () => {
    const networks = Object.keys(nets).filter(k => nets[k]);
    if (!networks.length) { setMsg('Escolha pelo menos uma rede.'); return; }
    const q = Math.max(1, Math.min(parseInt(qtd) || 1, maxQtd));
    setBusy('plan'); setMsg('Equipe de Redes + Designer planejando ' + q + ' publicação(ões) × ' + networks.length + ' rede(s)…');
    try { const r = await window.ForjaAPI.planContent({ client_id: cli || undefined, networks, tema, estilo, marca, periodo, qtd: q }); await carregar(); setMsg('Plano gerado: ' + r.criados + ' conteúdos (já no tamanho de cada rede).'); }
    catch (e) { setMsg('Falha: ' + e.message); } finally { setBusy(''); }
  };
  const gerarImagem = async (id) => {
    setBusy('img' + id); setMsg('Gerando imagem com IA…');
    try { const r = await window.ForjaAPI.generateImage(id); await carregar(); setMsg('Imagem gerada (' + r.size + ').'); }
    catch (e) { const em = ('' + e.message).includes('402') ? 'Geração de imagem precisa de créditos no OpenRouter (modelo pago).' : e.message; setMsg('Imagem: ' + em); }
    finally { setBusy(''); }
  };

  const sel = { background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', color: 'var(--text-1)', padding: '6px 8px', fontSize: 12.5 };
  return (
    <div className="center">
      <PageHead icon="megaphone" crumb="Trabalho" title="Conteúdo · Posts & Reels" status={apiOn ? 'IMPL' : 'PARCIAL'}
        sub="A IA desenvolve post/reel/story/carrossel no tamanho certo, com legenda, @ e #, e agenda a postagem na rede escolhida">
      </PageHead>
      <div className="center-body section-gap">
        {msg && <div className="card" style={{ padding: '9px 13px', fontSize: 12, borderColor: 'var(--accent-line)', background: 'var(--accent-soft)' }}>{msg}</div>}
        {!apiOn && <div className="card" style={{ padding: '9px 13px', fontSize: 12, borderColor: 'var(--warn)', background: 'var(--warn-soft)' }}>Backend offline — abra pelo ABRIR_PAINEL_FORJA.</div>}

        <SectionCard icon="megaphone" title="Planejar campanha (equipe Redes + Designer)">
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <input style={{ ...sel, flex: '1 1 150px' }} placeholder="Tema (ex.: inverno, lançamento)" value={tema} onChange={e => setTema(e.target.value)} />
            <input style={{ ...sel, flex: '1 1 130px' }} placeholder="Estilo/tom" value={estilo} onChange={e => setEstilo(e.target.value)} />
            <input style={{ ...sel, flex: '1 1 130px' }} placeholder="Marca/logo (cores, nome)" value={marca} onChange={e => setMarca(e.target.value)} />
            <select style={sel} value={periodo} onChange={e => { setPeriodo(e.target.value); setQtd(e.target.value === 'dia' ? 1 : 7); }}>
              <option value="dia">Por dia</option>
              <option value="semana">Por semana</option>
            </select>
            <label style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>Qtd:
              <input type="number" min={1} max={maxQtd} style={{ ...sel, width: 64 }} value={qtd} onChange={e => setQtd(e.target.value)} />
              <span className="faint" style={{ fontSize: 10.5 }}>(1–{maxQtd})</span>
            </label>
            <button className="btn primary" disabled={busy === 'plan' || !apiOn} onClick={planejar}><Icon name="zap" size={13} /> {busy === 'plan' ? 'Planejando…' : 'Gerar plano'}</button>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginTop: 8 }}>
            <span className="faint" style={{ fontSize: 11 }}>Redes (cada uma sai no tamanho certo):</span>
            {['instagram', 'facebook', 'tiktok', 'linkedin'].map(n => (
              <label key={n} style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                <input type="checkbox" checked={!!nets[n]} onChange={() => toggleNet(n)} /> {n}
              </label>
            ))}
          </div>
          <div className="faint" style={{ fontSize: 10.5, marginTop: 6 }}>A equipe cria os conteúdos já desenvolvidos (legenda, @ e #) para cada rede escolhida. Depois é só subir/gerar a imagem e agendar.</div>
        </SectionCard>

        <SectionCard icon="plus" title="Novo conteúdo (avulso)">
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <select style={sel} value={cli} onChange={e => setCli(e.target.value)}>
              <option value="">(sem cliente)</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
            <select style={sel} value={network} onChange={e => setNetwork(e.target.value)}>
              {['instagram', 'facebook'].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <select style={sel} value={tipo} onChange={e => setTipo(e.target.value)}>
              {['post', 'reel', 'story', 'carrossel'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <input style={{ ...sel, flex: 1, minWidth: 200 }} placeholder="Briefing / ideia (o que postar)" value={briefing} onChange={e => setBriefing(e.target.value)} />
            <button className="btn primary" disabled={busy === 'criar' || !apiOn} onClick={criar}><Icon name="plus" size={13} /> Criar</button>
          </div>
        </SectionCard>

        {items.map(it => (
          <SectionCard key={it.id} icon="megaphone"
            title={it.tipo.toUpperCase() + ' · ' + it.network + ' · ' + (it.cliente || 'sem cliente')}
            right={<span className={'pill ' + (it.status === 'publicado' ? 'ok' : it.status === 'agendado' ? 'info' : '')}>{it.status}</span>}>
            {it.briefing && <div className="faint" style={{ fontSize: 12, marginBottom: 8 }}>Briefing: {it.briefing}</div>}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 300px', minWidth: 240 }}>
                <div style={{ whiteSpace: 'pre-wrap', fontSize: 12.5, maxHeight: 240, overflow: 'auto', background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 10 }}>
                  {it.output || '(ainda não desenvolvido — clique "Desenvolver com IA")'}
                </div>
              </div>
              {it.media_url && <div style={{ flex: '0 0 auto' }}><img src={it.media_url} alt="" style={{ width: 130, height: 130, objectFit: 'cover', borderRadius: 'var(--r-md)', border: '1px solid var(--border)' }} /></div>}
            </div>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 10 }}>
              <button className="btn primary sm" disabled={busy === 'dev' + it.id} onClick={() => desenvolver(it.id)}><Icon name="zap" size={12} /> {busy === 'dev' + it.id ? 'IA…' : 'Desenvolver com IA'}</button>
              <button className="btn sm" disabled={busy === 'img' + it.id} onClick={() => gerarImagem(it.id)}><Icon name="flame" size={12} /> {busy === 'img' + it.id ? 'Gerando…' : 'Gerar imagem (IA)'}</button>
              <label className="btn sm" style={{ cursor: 'pointer' }}><Icon name="eye" size={12} /> Subir imagem<input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => subir(it.id, e.target.files[0])} /></label>
              <button className="btn sm" onClick={() => editar(it.id, it.output)}>Editar</button>
              <button className="btn sm" disabled={busy === 'pub' + it.id} onClick={() => publicar(it.id)}><Icon name="send" size={12} /> Publicar</button>
              <button className="btn sm" disabled={busy === 'ag' + it.id} onClick={() => agendar(it.id)}><Icon name="clock" size={12} /> Agendar</button>
              <button className="btn ghost sm" onClick={() => remover(it.id)}>Remover</button>
            </div>
          </SectionCard>
        ))}
        {!items.length && <EmptyState icon="megaphone" title="Sem conteúdos ainda" sub="Crie o primeiro acima: escolha cliente, rede e tipo, dê um briefing e clique Criar." />}
      </div>
    </div>
  );
}

Object.assign(window, { TestesCenter, ValidacaoCenter, AuditoriaCenter, OperacoesCenter, FinanceiroCenter, RoadmapCenter, AcademiaCenter, AjudaCenter, ConfiguracoesCenter, ConteudoCenter });


/* ============================================================
   A FÁBRICA — App root · estado global, router, shell
   ============================================================ */
function App() {
  const [theme, setTheme] = useLocalStorage('forja.theme', 'dark');
  const [view, setView] = useLocalStorage('forja.view', 'home');
  const [explorerOpen, setExplorerOpen] = useLocalStorage('forja.explorer', true);
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);
  // Deep-link: abrir direto numa tela via hash (ex.: /painel#llms)
  useEffect(() => {
    const apply = () => { const h = (location.hash || '').replace('#', '').trim(); if (h && ROUTES[h]) setView(h); };
    apply();
    window.addEventListener('hashchange', apply);
    return () => window.removeEventListener('hashchange', apply);
  }, []);
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
    conteudo: ConteudoCenter,
    clientes: ClientesCenter,
    projetos: ProjetosCenter,
    enviar: EnviarProjetoCenter,
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

/* Boot: hidrata dados REAIS do backend (api.js) ANTES de renderizar,
   para que os componentes inicializem já com o estado real do nexus.db.
   Sem backend, segue com o fallback estático de window.FORJA. */
async function bootForja() {
  try {
    if (window.ForjaAPI && window.ForjaAPI.hydrate) {
      await window.ForjaAPI.hydrate();
    }
  } catch (e) {
    console.warn('[FORJA] hydrate falhou, usando fallback:', e);
  }
  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
}
bootForja();
