/* ============================================================
   FORJA — Camada de API V1
   fetch nativo (sem axios, sem Vite). Mesma origem do FastAPI.
   Carrega dados REAIS do backend e hidrata window.FORJA.
   window.FORJA continua existindo apenas como FALLBACK.
   ============================================================ */
(function () {
  const BASE = ''; // mesma origem (SPA servida pelo FastAPI)

  async function getJSON(path) {
    const res = await fetch(BASE + path, {
      headers: { 'Accept': 'application/json' },
      credentials: 'same-origin',
    });
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
    }));
  }

  function mapLLMs(providers) {
    const tipoMap = {
      subscription: 'Assinatura', local: 'Local', paid_api: 'API Paga',
    };
    return (providers || []).map(p => ({
      id: p.id,
      provider: p.display_name,
      modelos: p.models && p.models.length ? p.models : ['configurável'],
      tipo: tipoMap[p.provider_type] || p.provider_type,
      status: p.health_status || 'unknown',
      modoUso: p.automation_mode === 'assisted' ? 'Assistido'
             : p.automation_mode === 'direct' ? 'Direto/Local' : '—',
      automacao: p.automation_mode,
      custoIncremental: (p.cost_incremental === 0 || p.cost_incremental === null)
        ? 'R$ 0,00' : ('R$ ' + p.cost_incremental),
      billing: p.billing_mode,
      ultimoHealth: p.last_health_check || 'Não validado',
      observacao: p.notes || '',
      ativo: p.health_status === 'active_real',
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
      sources.dashboard = 'backend_real';
    } catch (e) { errors.dashboard = String(e); sources.dashboard = 'fallback_window_forja'; }

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

  window.ForjaAPI = {
    getJSON, hydrate, postJSON,
    runMission, getEvidences, getRuntimeStatus, refreshMissions,
  };
})();
