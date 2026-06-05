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
      return {
        data: dt ? dt.toLocaleDateString('pt-BR') : '—',
        hora: dt ? dt.toTimeString().slice(0, 8) : '—',
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
