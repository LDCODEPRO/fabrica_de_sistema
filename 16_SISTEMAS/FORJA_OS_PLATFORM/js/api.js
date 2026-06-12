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

  async function actAgent(agentKey, objective, clientId, sessionId) {
    return postJSON('/api/agents/' + encodeURIComponent(agentKey || 'orquestrador') + '/act', { objective: objective, client_id: clientId, session_id: sessionId });
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

  // POST /api/knowledge — adiciona nota de conhecimento real (vira .md no disco)
  async function addKnowledge(category, titulo, conteudo) {
    return postJSON('/api/knowledge', { category: category, titulo: titulo, conteudo: conteudo });
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
    createMission, getKnowledge, addKnowledge, getConfigKeys, setConfigKey, healthCheckServices,
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
