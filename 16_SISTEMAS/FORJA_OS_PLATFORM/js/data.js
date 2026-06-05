/* ============================================================
   FORJA — Factory OS · Camada de dados V3 (HONESTA)
   Fallback sem números inventados. Valores reais vêm de api.js
   (backend FastAPI + nexus.db). O que não tem fonte real aparece
   como "sem dados reais" / 0 / "—", nunca como métrica fabricada.
   ============================================================ */
(function () {
  // ---- 7 núcleos (rótulos reais; métricas só quando houver fonte) ----
  const cores = [
    { id: 'foundation',  nome: 'Fundação da Fábrica',     papel: 'Base operacional',       status: 'idle', load: null, uptime: 'sem dados', ver: '—' },
    { id: 'operational', nome: 'Núcleo Operacional',      papel: 'Execução e coordenação', status: 'idle', load: null, uptime: 'sem dados', ver: '—' },
    { id: 'database',    nome: 'Banco Central',           papel: 'Dados e estado',         status: 'idle', load: null, uptime: 'sem dados', ver: '—' },
    { id: 'knowledge',   nome: 'Central de Conhecimento', papel: 'Base de consulta',       status: 'idle', load: null, uptime: 'sem dados', ver: '—' },
    { id: 'agent',       nome: 'Equipe Inteligente',      papel: 'Execução assistida',     status: 'idle', load: null, uptime: 'sem dados', ver: '—' },
    { id: 'router',      nome: 'Central de IA',           papel: 'Escolha de IA',          status: 'idle', load: null, uptime: 'sem dados', ver: '—' },
    { id: 'factory',     nome: 'Fábrica de Projetos',     papel: 'Criação de sistemas',    status: 'idle', load: null, uptime: 'sem dados', ver: '—' },
  ];

  // ---- serviços (status bar) — hidratados por /api/services ----
  const services = [
    { id: 'github',    nome: 'Repositório',   status: 'idle', ping: 'sem dados' },
    { id: 'database',  nome: 'Banco Central', status: 'idle', ping: 'sem dados' },
    { id: 'fastapi',   nome: 'FastAPI',       status: 'idle', ping: 'sem dados' },
    { id: 'router',    nome: 'Central de IA', status: 'idle', ping: 'sem dados' },
    { id: 'knowledge', nome: 'Conhecimento',  status: 'idle', ping: 'sem dados' },
    { id: 'mission',   nome: 'Missões',       status: 'idle', ping: 'sem dados' },
    { id: 'ollama',    nome: 'Ollama',        status: 'idle', ping: 'sem dados' },
    { id: 'deploy',    nome: 'Publicação',    status: 'idle', ping: 'sem dados' },
  ];

  // ---- projetos — não há tabela real; vazio honesto ----
  const projetos = [];

  // ---- missões — hidratadas por /api/missions ----
  const MIS_STATES = ['PENDING','QUEUED','RUNNING','FAILED','COMPLETED'];
  const missoes = [];

  // ---- agentes — hidratados por /api/agents (rótulos reais como fallback) ----
  const agentes = [];

  // ---- LLMs (config/política real, sem custo fabricado) ----
  const llms = [
    { id: 'claude_pro', provider: 'Claude Pro', modelos: ['Pro'], tipo: 'Assinatura', status: 'unknown', modoUso: 'Assistido', automacao: 'Assistida', custoIncremental: 'R$ 0,00', billing: 'Não aplicável', ultimoHealth: 'Não validado', observacao: '1ª na ordem oficial do roteador.', ativo: false },
    { id: 'chatgpt_plus', provider: 'ChatGPT Plus / GPT', modelos: ['Plus'], tipo: 'Assinatura', status: 'unknown', modoUso: 'Assistido', automacao: 'Assistida', custoIncremental: 'R$ 0,00', billing: 'Não aplicável', ultimoHealth: 'Não validado', observacao: 'Não confundir com OpenAI API.', ativo: false },
    { id: 'gemini_advanced', provider: 'Gemini Advanced', modelos: ['Advanced'], tipo: 'Assinatura', status: 'unknown', modoUso: 'Assistido', automacao: 'Assistida', custoIncremental: 'R$ 0,00', billing: 'Não aplicável', ultimoHealth: 'Não validado', observacao: 'Pesquisa e documentação assistidas.', ativo: false },
    { id: 'deepseek_v4_pro', provider: 'DeepSeek V4 Pro', modelos: ['V4 Pro'], tipo: 'Assinatura', status: 'unknown', modoUso: 'Assistido', automacao: 'Assistida', custoIncremental: 'R$ 0,00', billing: 'Não aplicável', ultimoHealth: 'Não validado', observacao: 'Provider após assinaturas.', ativo: false },
    { id: 'ollama_local', provider: 'Ollama Local', modelos: ['Llama/Gemma/Qwen configuráveis'], tipo: 'Local', status: 'unknown', modoUso: 'Local', automacao: 'Direta após health check', custoIncremental: 'R$ 0,00', billing: 'Energia/hardware local', ultimoHealth: 'Não validado nesta execução', observacao: 'Último fallback local. Só ativo após health real.', ativo: false },
  ];

  const rotas = [
    { id: 'R1', quando: 'assinatura primária', modelo: 'Claude Pro', fallback: 'ChatGPT Plus' },
    { id: 'R2', quando: 'validação/código', modelo: 'ChatGPT Plus', fallback: 'Gemini Advanced' },
    { id: 'R3', quando: 'pesquisa e documentação', modelo: 'Gemini Advanced', fallback: 'DeepSeek V4 Pro' },
    { id: 'R4', quando: 'após assinaturas', modelo: 'DeepSeek V4 Pro', fallback: 'Ollama Local' },
    { id: 'R5', quando: 'fallback local', modelo: 'Ollama Local', fallback: '—' },
  ];

  // ---- custos — billing real ($1/dia, $30/mês) via /api/billing/status ----
  const custos = {
    diario: 0, mensal: 0, limite: 30, limiteDiario: 1, projecao: 0,
    source: 'sem_dados_reais', primaryProvider: 'deepseek_v4_pro', fallbackProvider: 'ollama',
    deltaMes: 0,
    serieDiaria: [],
    serieMensal: [],
    byLLM: [
      { nome: 'Assinaturas', custo: 0, pct: 0, cor: 'var(--accent)', nota: 'R$ 0,00 incremental' },
      { nome: 'Ollama Local', custo: 0, pct: 0, cor: 'var(--ok)', nota: 'R$ 0,00 incremental' },
      { nome: 'APIs pagas', custo: 0, pct: 0, cor: 'var(--warn)', nota: 'bloqueadas sem autorização' },
    ],
    byProjeto: [{ proj: 'Sem custo medido', custo: 0, pct: 0 }],
    byAgente: [{ agente: 'Sem custo medido', custo: 0 }],
    alerts: [
      { nivel: 'info', txt: 'Assinaturas e local operam com R$ 0,00 incremental.' },
      { nivel: 'info', txt: 'Limite: $1,00/dia · $30,00/mês (Diretoria).' },
    ],
  };

  // ---- ambientes & deploys — sem dados reais ----
  const ambientes = [];
  const deploys = [];
  const pipeline = ['Origem','Construção','Testes','Segurança','Publicação','Conferência'];

  // ---- knowledge — sem indexação real medida ----
  const fontes = [];

  // ---- auditoria — hidratada por /api/audit ----
  const auditoria = [];

  // ---- governança — números reais (audit/evidências) via api.js; zero honesto ----
  const governance = {
    certificacoes: [],
    evidence: { total: 0, ultimaHora: 0, retencao: 'sem dados', integridade: null, assinatura: 'sem dados' },
    zeroGhostLaw: { ativas: 0, violacoes: 0, alertas: 0, ultimaVarredura: 'sem dados' },
    falhas: [],
    alertas: [],
  };

  // ---- KPIs — hidratados por /api/dashboard ----
  const kpis = [
    { id: 'projetos', label: 'Projetos ativos', valor: '0',  delta: 'sem dados', dir: 'flat', sub: 'sem tabela de projetos' },
    { id: 'missoes',  label: 'Missões',         valor: '0',  delta: 'real',      dir: 'flat', sub: 'do banco' },
    { id: 'agentes',  label: 'Equipe',          valor: '0',  delta: 'real',      dir: 'flat', sub: 'do banco' },
    { id: 'evidencias', label: 'Evidências',    valor: '0',  delta: 'real',      dir: 'flat', sub: 'execuções reais' },
    { id: 'custos',   label: 'Custo incremental IA', valor: '$0.00', delta: 'OK', dir: 'flat', sub: 'limite $30/mês' },
    { id: 'ia',       label: 'IA local',        valor: '—',  delta: 'health',    dir: 'flat', sub: 'Ollama' },
  ];

  const serieThroughput = [];
  const serieCusto = [];

  // ---- copilot: sem conversa fabricada ----
  const chatSeed = [];

  // ---- relatórios (rótulos de navegação) ----
  const relatorios = [
    { id: 'REL-CST', nome: 'Custos · billing real',  periodo: 'mensal' },
    { id: 'REL-AUD', nome: 'Auditoria · eventos reais', periodo: 'contínuo' },
    { id: 'REL-RUN', nome: 'Execuções · evidências',  periodo: 'contínuo' },
  ];

  window.FORJA = {
    cores, services, projetos, missoes, MIS_STATES, agentes, llms, rotas,
    custos, ambientes, deploys, pipeline, fontes, auditoria, governance,
    kpis, serieThroughput, serieCusto, chatSeed, relatorios,
  };
})();
