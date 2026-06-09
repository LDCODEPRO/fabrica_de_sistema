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
    { id: 'claude',   nome: 'Claude',    modelo: 'Claude Pro',            status: 'IMPL',   ativo: true,  conexao: ['Assinatura/CLI'],               ultimoTeste: 'agora', latencia: '120ms', custo: '0.00', uso: 'Principal', tipo: 'Assinatura', modoUso: 'Assistido', automacao: 'assisted', custoIncremental: 0, billing: 'Pago', ultimoHealth: 'agora', observacao: 'Uso via assinatura local' },
    { id: 'openai',   nome: 'OpenAI',    modelo: 'ChatGPT Plus',          status: 'IMPL',   ativo: true,  conexao: ['Assinatura/CLI'],               ultimoTeste: 'agora', latencia: '150ms', custo: '0.00', uso: 'Fallback 1', tipo: 'Assinatura', modoUso: 'Assistido', automacao: 'assisted', custoIncremental: 0, billing: 'Pago', ultimoHealth: 'agora', observacao: 'Uso via assinatura local' },
    { id: 'gemini',   nome: 'Gemini',    modelo: 'Gemini Advanced',       status: 'IMPL',   ativo: true,  conexao: ['Assinatura/CLI'],               ultimoTeste: 'agora', latencia: '180ms', custo: '0.00', uso: 'Fallback 2', tipo: 'Assinatura', modoUso: 'Direto', automacao: 'direct', custoIncremental: 0, billing: 'Pago', ultimoHealth: 'agora', observacao: 'Uso via assinatura local' },
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
