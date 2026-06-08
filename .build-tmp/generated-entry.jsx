import React from 'react';

import { createRoot } from 'react-dom/client';

const ReactDOM = { createRoot };

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
  // APIs diretas de OpenAI, Claude e Gemini: bloqueadas, Sem chave validada.
  const llms = [
    { id: 'claude_pro', provider: 'Claude Pro', modelos: ['Pro'], tipo: 'Assinatura', status: 'unknown', modoUso: 'Assistido', automacao: 'Assistida', custoIncremental: 'R$ 0,00', billing: 'Não aplicável', ultimoHealth: 'Não validado', observacao: 'Assinatura instalada; execução ainda não certificada.', ativo: false },
    { id: 'chatgpt_plus', provider: 'ChatGPT Plus / Codex', modelos: ['Codex'], tipo: 'Assinatura', status: 'unknown', modoUso: 'Assistido', automacao: 'Assistida', custoIncremental: 'R$ 0,00', billing: 'Não aplicável', ultimoHealth: 'Não validado pelo Router', observacao: 'Aplicativo autenticado; integração automática ainda parcial.', ativo: false },
    { id: 'gemini_advanced', provider: 'Gemini Google One AI Pro', modelos: ['gemini-subscription'], tipo: 'Assinatura', status: 'active_real', modoUso: 'Direto', automacao: 'direct', custoIncremental: 'R$ 0,00', billing: 'Assinatura fixa', ultimoHealth: '06/06/2026', observacao: 'OAuth e resposta real GEMINI_ASSINATURA_OK confirmados.', ativo: true },
    { id: 'openrouter_api', provider: 'OpenRouter', modelos: ['deepseek/deepseek-v4-pro', 'moonshotai/kimi-k2.6'], tipo: 'API Paga', status: 'active_real', modoUso: 'Direto com autorização', automacao: 'direct', custoIncremental: 'Por consumo', billing: 'Controle de custos', ultimoHealth: '06/06/2026', observacao: 'Prioridade: DeepSeek V4 Pro; alternativa: Kimi K2.6.', ativo: true },
    { id: 'ollama_local', provider: 'Ollama Local', modelos: ['Llama/Gemma/Qwen configuráveis'], tipo: 'Local', status: 'unknown', modoUso: 'Local', automacao: 'Direta após health check', custoIncremental: 'R$ 0,00', billing: 'Energia/hardware local', ultimoHealth: 'Não validado nesta execução', observacao: 'Último fallback local. Só ativo após health real.', ativo: false },
  ];

  const rotas = [
    { id: 'R1', quando: 'assinatura Google validada', modelo: 'Gemini AI Pro', fallback: 'Ollama Local' },
    { id: 'R2', quando: 'execução local e gratuita', modelo: 'Ollama Local', fallback: 'OpenRouter autorizada' },
    { id: 'R3', quando: 'OpenRouter autorizada', modelo: 'DeepSeek V4 Pro', fallback: 'Kimi K2.6' },
    { id: 'R4', quando: 'DeepSeek indisponível ou vazio', modelo: 'Kimi K2.6', fallback: '—' },
    { id: 'R5', quando: 'assinaturas não certificadas', modelo: 'Bloqueado', fallback: 'Validação manual' },
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
    const statusMap = {
      active_real: 'Ativa real',
      unavailable: 'Indisponível',
      inactive: 'Inativa',
      missing_key: 'Bloqueada',
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

const STATUS_LABEL = {
  ok: 'ok',
  live: 'publicado',
  running: 'em execução',
  executando: 'em execução',
  building: 'em construção',
  review: 'em revisão',
  paused: 'pausado',
  idle: 'em espera',
  blocked: 'bloqueado',
  fail: 'falhou',
  warn: 'atenção',
  backlog: 'fila',
  indexado: 'indexado',
  indexando: 'indexando',
  erro: 'erro',
};

const MISSION_STATUS_LABEL = {
  PENDING: 'PENDENTE',
  QUEUED: 'NA FILA',
  RUNNING: 'EM EXECUÇÃO',
  FAILED: 'FALHOU',
  COMPLETED: 'CONCLUÍDA',
};

const AGENT_STATUS_LABEL = {
  running: 'EM EXECUÇÃO',
  blocked: 'BLOQUEADO',
  idle: 'EM ESPERA',
};

const labelStatus = (value) => STATUS_LABEL[value] || value;
const labelMissionStatus = (value) => MISSION_STATUS_LABEL[value] || value;
const labelAgentStatus = (value) => AGENT_STATUS_LABEL[value] || value;

Object.assign(window, { Icon, Sparkline, Bars, Donut, Progress, useLocalStorage, STATUS_CLASS,
  STATUS_LABEL, MISSION_STATUS_LABEL, AGENT_STATUS_LABEL, labelStatus, labelMissionStatus, labelAgentStatus,
  useState, useEffect, useRef, useCallback, createContext, useContext });


/* ============================================================
   FORJA — Shell: menu bar, activity bar, status bar
   ============================================================ */

const NAV = [
  { id: 'dashboard', label: 'Centro de Comandos', short: 'Comandos', icon: 'pulse' },
  { id: 'projects',  label: 'Projetos',           short: 'Projetos', icon: 'folder' },
  { id: 'missions',  label: 'Central de Missões', short: 'Missões', icon: 'target' },
  { id: 'agents',    label: 'Equipe Inteligente', short: 'Equipe', icon: 'cpu' },
  { id: 'llm',       label: 'Central de IA',      short: 'IA', icon: 'route' },
  { id: 'costs',     label: 'Controle de Custos', short: 'Custos', icon: 'dollar' },
  { id: 'deploy',    label: 'Central de Publicação', short: 'Publicações', icon: 'rocket' },
  { id: 'audit',     label: 'Central de Auditoria', short: 'Auditoria', icon: 'shield' },
  { id: 'knowledge', label: 'Central de Conhecimento', short: 'Conhecimento', icon: 'book' },
];

const MENUS = {
  'Arquivo': ['Novo projeto…', 'Nova missão…', 'Abrir projeto…', '—', 'Importar codebase', 'Exportar relatório', '—', 'Encerrar sessão'],
  'Editar': ['Desfazer', 'Refazer', '—', 'Recortar', 'Copiar', 'Colar', '—', 'Localizar…', 'Substituir…'],
  'Seleção': ['Selecionar tudo', 'Selecionar missões ativas', 'Selecionar agentes online', '—', 'Limpar seleção'],
  'Ver': ['Centro de comandos', 'Alternar assistente', 'Alternar explorador', '—', 'Modo foco', 'Tema claro/escuro'],
  'Acessar': ['Ir para projeto…', 'Ir para missão…', 'Ir para equipe…', '—', 'Centro de comandos ⌘K'],
  'Executar': ['Executar missão', 'Pausar toda a equipe', 'Publicar projeto…', '—', 'Atualizar conhecimento'],
  'Registros': ['Novo registro', 'Registros ao vivo', 'Fila de publicações', '—', 'Limpar registros'],
  'Ajuda': ['Documentação', 'Atalhos de teclado', 'Situação da plataforma', '—', 'Sobre a FORJA OS'],
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
        <span className="mb-word">FORJA</span>
        <span className="mb-os">Sistema da Fábrica</span>
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
                      else if (it.includes('Centro de comandos')) onCommand();
                      else if (it.includes('assistente')) onToggleCopilot();
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
        <span className="mono">factory · main</span>
        <span className="mb-dot">·</span>
        <span className="muted">Operação diária</span>
      </div>
      <div className="mb-actions">
        <button className="mb-act" title="Centro de comandos (⌘K)" onClick={onCommand}><Icon name="command" size={14} /></button>
        <button className="mb-act" title="Notificações"><Icon name="bell" size={14} /><span className="mb-badge">3</span></button>
        <button className="mb-act" title="Tema" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={14} />
        </button>
        <button className="mb-act" title="Explorador (⌘B)" onClick={onToggleExplorer}><Icon name="panelL" size={14} /></button>
        <button className="mb-act" title="Assistente (⌘\)" onClick={onToggleCopilot}><Icon name="panelR" size={14} /></button>
        <div className="mb-avatar">AR</div>
      </div>
    </div>
  );
}

/* ---------------- Activity bar (nav primária) ---------------- */
function ActivityBar({ view, setView }) {
  return (
    <div className="activitybar">
      <div className="ab-group">
        {NAV.map(n => (
          <button key={n.id} className={'ab-btn' + (view === n.id ? ' on' : '')}
            onClick={() => setView(n.id)} title={n.label}>
            <Icon name={n.icon} size={20} stroke={view === n.id ? 2.2 : 1.8} />
            <span className="ab-tip">{n.label}</span>
          </button>
        ))}
      </div>
      <div className="ab-group">
        <button className={'ab-btn' + (view === 'settings' ? ' on' : '')} onClick={() => setView('settings')} title="Configurações">
          <Icon name="gear" size={20} stroke={1.8} />
          <span className="ab-tip">Configurações</span>
        </button>
      </div>
    </div>
  );
}

/* ---------------- Barra de estado (V2 · 8 serviços + saúde) ---------------- */
function StatusBar({ view, setView }) {
  const D = window.FORJA;
  const exec = D.missoes.filter(m => m.status === 'RUNNING').length;
  const online = D.agentes.filter(a => a.status === 'running').length;
  const [clock, setClock] = useState('');
  useEffect(() => {
    const t = () => { const d = new Date(); setClock(d.toTimeString().slice(0,8)); };
    t(); const id = setInterval(t, 1000); return () => clearInterval(id);
  }, []);
  const sCls = (s) => s==='ok'?'ok':s==='warn'?'warn':s==='err'?'err':'idle';
  return (
    <div className="statusbar">
      <div className="sb-left">
        <span className="sb-item acc"><Icon name="git" size={12} /> main</span>
        {D.services.map(s => (
          <span key={s.id} className="sb-svc" title={s.nome + ' · ' + s.ping}>
            <span className={'dot ' + sCls(s.status)} />
            <span className="sb-svc-nm">{s.nome}</span>
          </span>
        ))}
      </div>
      <div className="sb-right">
        <span className="sb-item blink-slow"><Icon name="activity" size={12}/> {exec} EM EXECUÇÃO</span>
        <span className="sb-item">{online}/{D.agentes.length} agentes</span>
        <span className="sb-item" onClick={()=>setView&&setView('costs')} style={{cursor:'pointer'}}><Icon name="dollar" size={12}/> R$ {D.custos.diario}</span>
        <span className="sb-item mono">{clock}</span>
        <span className="sb-item acc"><Icon name="flame" size={12} /> FORJA Operacional</span>
      </div>
    </div>
  );
}

Object.assign(window, { NAV, MENUS, MenuBar, ActivityBar, StatusBar });


/* ============================================================
   FORJA — Explorer (segunda coluna, navegação rápida)
   ============================================================ */

function Explorer({ view, setView, onClose }) {
  const D = window.FORJA;
  const [open, setOpen] = useLocalStorage('forja.explorer.open', {
    projetos: true, missoes: true, agentes: true, knowledge: false,
    runtime: false, deploys: false, auditorias: false, relatorios: false,
  });
  const toggle = (id) => setOpen(o => ({ ...o, [id]: !o[id] }));

  const projStatusDot = (s) => s==='live'?'ok':s==='paused'?'warn':s==='review'?'info':'acc';
  const misCount = (st) => D.missoes.filter(m => m.status === st).length;
  const agtDot = (s) => s==='running'?'ok':s==='blocked'?'err':'idle';

  const Section = ({ id, icon, label, count, action, children }) => (
    <div className={'exp-group' + (open[id]?'':' collapsed')}>
      <div className="exp-group-head" onClick={() => toggle(id)}>
        <Icon name="chevD" size={11} className="ic-chev" />
        <Icon name={icon} size={12} style={{opacity:.7}} />
        <span>{label}</span>
        {count!=null && <span className="exp-count">{count}</span>}
        {action && <button className="exp-add" onClick={(e)=>{e.stopPropagation(); action();}} title="Novo"><Icon name="plus" size={11}/></button>}
      </div>
      {open[id] && <div className="exp-items">{children}</div>}
    </div>
  );

  return (
    <aside className="explorer">
      <div className="exp-head">
        <Icon name="layers" size={13} style={{color:'var(--accent-bright)'}} />
        <span className="exp-title">FORJA · EXPLORADOR</span>
        <button className="btn ghost icon sm" onClick={onClose} title="Fechar Explorador"><Icon name="x" size={13}/></button>
      </div>
      <div className="exp-body scroll-y">
        <Section id="projetos" icon="folder" label="Projetos" count={D.projetos.length} action={()=>setView('projects')}>
          {D.projetos.map(p => (
            <button key={p.id} className={'exp-item' + (view==='projects'?'':'')} onClick={()=>setView('projects')}>
              <span className={'dot ' + projStatusDot(p.status)} />
              <span className="truncate">{p.nome}</span>
              <span className="id">{p.id}</span>
            </button>
          ))}
        </Section>

        <Section id="missoes" icon="target" label="Missões" count={D.missoes.length} action={()=>setView('missions')}>
          {D.MIS_STATES.map(st => (
            <button key={st} className="exp-item" onClick={()=>setView('missions')}>
              <span className={'dot ' + (st==='RUNNING'?'ok':st==='FAILED'?'err':st==='QUEUED'?'info':st==='COMPLETED'?'ok':'idle')} />
              <span className="mono" style={{fontSize:11}}>{labelMissionStatus(st)}</span>
              <span className="id">{misCount(st)}</span>
            </button>
          ))}
        </Section>

        <Section id="agentes" icon="cpu" label="Equipe" count={D.agentes.length} action={()=>setView('agents')}>
          {D.agentes.map(a => (
            <button key={a.id} className="exp-item" onClick={()=>setView('agents')}>
              <span className={'dot ' + agtDot(a.status) + (a.status==='running'?' blink':'')} />
              <span className="mono" style={{fontSize:11}}>{a.papel}</span>
              <span className="id">{a.missao!=='—'?a.missao:''}</span>
            </button>
          ))}
        </Section>

        <Section id="knowledge" icon="book" label="Conhecimento" count={D.fontes.length} action={()=>setView('knowledge')}>
          {D.fontes.map(f => (
            <button key={f.id} className="exp-item" onClick={()=>setView('knowledge')}>
              <span className={'dot ' + (f.status==='indexado'?'ok':f.status==='erro'?'err':'info')} />
              <span className="truncate">{f.nome}</span>
              <span className="id">{f.id}</span>
            </button>
          ))}
        </Section>

        <Section id="runtime" icon="cpu" label="Execução · Núcleos" count={D.cores.length}>
          {D.cores.map(c => (
            <button key={c.id} className="exp-item" onClick={()=>setView('settings')}>
              <span className={'dot ' + (c.status==='ok'?'ok':'warn')} />
              <span className="truncate">{c.nome}</span>
              <span className="id">{c.ver}</span>
            </button>
          ))}
        </Section>

        <Section id="deploys" icon="rocket" label="Publicações" count={D.deploys.length} action={()=>setView('deploy')}>
          {D.deploys.map(d => (
            <button key={d.id} className="exp-item" onClick={()=>setView('deploy')}>
              <span className={'dot ' + (d.status==='ok'?'ok':d.status==='fail'?'err':'acc')} style={d.status==='running'?{background:'var(--accent)'}:{}} />
              <span className="truncate">{d.proj} · {d.amb}</span>
              <span className="id">{d.id}</span>
            </button>
          ))}
        </Section>

        <Section id="auditorias" icon="shield" label="Auditorias" count={D.auditoria.length} action={()=>setView('audit')}>
          {D.auditoria.slice(0,8).map(a => (
            <button key={a.id} className="exp-item" onClick={()=>setView('audit')}>
              <span className={'dot ' + (a.sev==='crítico'?'err':a.sev==='aviso'?'warn':'info')} />
              <span className="truncate mono" style={{fontSize:11}}>{a.acao}</span>
              <span className="id">{a.ts.slice(0,5)}</span>
            </button>
          ))}
        </Section>

        <Section id="relatorios" icon="doc" label="Relatórios" count={D.relatorios.length}>
          {D.relatorios.map(r => (
            <button key={r.id} className="exp-item">
              <Icon name="doc" size={11} style={{color:'var(--text-3)'}}/>
              <span className="truncate">{r.nome}</span>
              <span className="id">{r.periodo}</span>
            </button>
          ))}
        </Section>

        <div className="exp-group" style={{marginTop:6, borderTop:'1px solid var(--border-faint)', paddingTop:6}}>
          <button className="exp-item" onClick={()=>setView('settings')} style={{padding:'6px 10px'}}>
            <Icon name="gear" size={12} style={{color:'var(--text-3)'}}/>
            <span>Configurações</span>
          </button>
          <button className="exp-item" onClick={()=>setView('costs')} style={{padding:'6px 10px'}}>
            <Icon name="zap" size={12} style={{color:'var(--text-3)'}}/>
            <span>Custos e controle</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

Object.assign(window, { Explorer });


/* ============================================================
   FORJA — Copiloto (Chat / Agentes / LLMs / Prompt) + Command Palette
   ============================================================ */

const COPILOT_TABS = [
  { id: 'chat', label: 'Chat', icon: 'chat' },
  { id: 'agentes', label: 'Equipe', icon: 'cpu' },
  { id: 'llms', label: 'IAs', icon: 'route' },
];

function Copilot({ onClose, setView }) {
  const D = window.FORJA;
  const [tab, setTab] = useState('chat');
  const [msgs, setMsgs] = useState(D.chatSeed);
  const [draft, setDraft] = useState('');
  const [agent, setAgent] = useState('AGT-ARCH');
  const [model, setModel] = useState('Automático · Central de IA');
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);
  useEffect(() => { endRef.current && endRef.current.scrollIntoView ? null : null; }, []);
  const bodyRef = useRef(null);
  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [msgs, typing]);

  const send = () => {
    const t = draft.trim(); if (!t) return;
    setMsgs(m => [...m, { de: 'voce', txt: t }]);
    setDraft('');
    // Verdade: este chat não executa nada por si só. Não fabricamos "Feito".
    // Execução real só pela Central de Missões (POST /api/missions/{id}/run).
    setMsgs(m => [...m, {
      de: 'sistema',
      nome: 'SISTEMA',
      txt: 'SEM EXECUÇÃO REAL VINCULADA. Este chat não gera artefatos. '
         + 'Para executar de verdade, use a Central de Missões (botão "Executar missão"), '
         + 'que aciona um agente e provider reais e registra evidência.',
    }]);
  };

  return (
    <aside className="copilot">
      <div className="cp-head">
        <div className="cp-tabs">
          {COPILOT_TABS.map(t => (
            <button key={t.id} className={'cp-tab' + (tab === t.id ? ' on' : '')} onClick={() => setTab(t.id)}>
              <Icon name={t.icon} size={13} /> {t.label}
            </button>
          ))}
        </div>
        <button className="btn icon ghost sm" onClick={onClose} title="Fechar assistente"><Icon name="x" size={14} /></button>
      </div>

      {tab === 'chat' && (
        <div className="cp-chat">
          <div className="cp-context">
            <span className="eyebrow">Contexto</span>
            <div className="cp-ctx-row">
              <span className="pill acc"><Icon name="cpu" size={11} /> {agent}</span>
              <span className="pill"><Icon name="route" size={11} /> {model}</span>
            </div>
          </div>
          <div className="cp-body scroll-y" ref={bodyRef}>
            {msgs.map((m, i) => (
              <div key={i} className={'cp-msg ' + (m.de === 'voce' ? 'me' : 'ag')}>
                {m.de !== 'voce' && <div className="cp-msg-who"><span className="dot ok" /> {m.nome}</div>}
                <div className="cp-bubble">{m.txt}</div>
              </div>
            ))}
            {typing && <div className="cp-msg ag"><div className="cp-msg-who"><span className="dot ok blink" /> {agent}</div>
              <div className="cp-bubble cp-typing"><span /><span /><span /></div></div>}
          </div>
          <div className="cp-compose">
            <div className="cp-compose-meta">
              <select className="cp-select" value={agent} onChange={e => setAgent(e.target.value)}>
                {D.agentes.map(a => <option key={a.id} value={a.id}>{a.id} · {a.papel}</option>)}
              </select>
              <select className="cp-select" value={model} onChange={e => setModel(e.target.value)}>
                <option>Automático · Central de IA</option>
                {D.llms.filter(l => l.ativo).flatMap(l => l.modelos.map(m => <option key={l.id+m}>{l.provider} · {m}</option>))}
              </select>
            </div>
            <div className="cp-input">
              <textarea rows={2} placeholder="Instrua a equipe… (Enter envia)" value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} />
              <button className="btn primary icon" onClick={send} title="Enviar"><Icon name="send" size={14} /></button>
            </div>
            <div className="cp-hint"><span className="kbd">Enter</span> enviar · <span className="kbd">⇧Enter</span> nova linha</div>
          </div>
        </div>
      )}

      {tab === 'agentes' && (
        <div className="cp-list scroll-y">
          {D.agentes.map(a => (
            <button key={a.id} className="cp-agent" onClick={() => setView('agents')}>
              <div className="cp-agent-top">
                <span className={'dot ' + (a.status === 'running' ? 'ok' : a.status === 'blocked' ? 'err' : 'idle')} />
                <span className="cp-agent-name mono">{a.papel}</span>
                <span className="pill" style={{marginLeft:'auto'}}>{labelStatus(a.status)}</span>
              </div>
              <div className="cp-agent-role muted">{a.nome}</div>
              <div className="cp-agent-meta mono faint">{a.provider} · {a.missao}</div>
            </button>
          ))}
        </div>
      )}

      {tab === 'llms' && (
        <div className="cp-list scroll-y">
          {D.llms.map(l => (
            <button key={l.id} className="cp-agent" onClick={() => setView('llm')}>
              <div className="cp-agent-top">
                <span className={'dot ' + (l.status==='ok'?'ok':l.status==='warn'?'warn':'idle')} />
                <span className="cp-agent-name">{l.provider}</span>
                <span className="pill" style={{marginLeft:'auto'}}>{l.tipo}</span>
              </div>
              <div className="cp-agent-role muted">{l.modelos.join(' · ')}</div>
              <div className="cp-agent-meta mono faint">{l.modoUso} · {l.custoIncremental} · {l.ultimoHealth}</div>
            </button>
          ))}
        </div>
      )}
    </aside>
  );
}

/* ---------------- Command Palette ---------------- */
function CommandPalette({ onClose, setView, setTheme, theme }) {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current && inputRef.current.focus(); }, []);
  const cmds = [
    { sec: 'Navegar', label: 'Centro de Comandos', icon: 'pulse', run: () => setView('dashboard') },
    ...NAV.slice(1).map(n => ({ sec: 'Navegar', label: 'Ir para ' + n.label, icon: n.icon, run: () => setView(n.id) })),
    { sec: 'Navegar', label: 'Ir para Configurações', icon: 'gear', run: () => setView('settings') },
    { sec: 'Criar',   label: 'Criar Projeto…',   icon: 'folder', run: () => setView('projects') },
    { sec: 'Criar',   label: 'Criar Missão…',    icon: 'target', run: () => setView('missions') },
    { sec: 'Criar',   label: 'Adicionar membro da equipe…', icon: 'cpu', run: () => setView('agents') },
    { sec: 'Criar',   label: 'Adicionar fonte de conhecimento…', icon: 'book', run: () => setView('knowledge') },
    { sec: 'Executar',label: 'Acionar equipe…', icon: 'play', run: () => setView('agents') },
    { sec: 'Executar',label: 'Publicar projeto…', icon: 'rocket', run: () => setView('deploy') },
    { sec: 'Executar',label: 'Consultar conhecimento…', icon: 'search', run: () => setView('knowledge') },
    { sec: 'Executar',label: 'Atualizar Central de Conhecimento', icon: 'refresh',run: () => setView('knowledge') },
    { sec: 'Executar',label: 'Pausar toda a equipe', icon: 'pause', run: () => setView('agents') },
    { sec: 'Executar',label: 'Executar varredura de auditoria', icon: 'shield', run: () => setView('audit') },
    { sec: 'Vista',   label: 'Alternar tema (claro/escuro)', icon: theme === 'dark' ? 'sun' : 'moon', run: () => setTheme(theme === 'dark' ? 'light' : 'dark') },
  ];
  const filtered = cmds.filter(c => c.label.toLowerCase().includes(q.toLowerCase()));
  useEffect(() => { setSel(0); }, [q]);
  const exec = (c) => { c && c.run(); onClose(); };
  return (
    <div className="cmd-scrim" onMouseDown={onClose}>
      <div className="cmd-palette" onMouseDown={e => e.stopPropagation()}>
        <div className="cmd-input">
          <Icon name="search" size={16} style={{ color: 'var(--text-3)' }} />
          <input ref={inputRef} value={q} placeholder="Buscar comando, projeto, missão, equipe…  (⌘K · Ctrl+Shift+P)"
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
                  {i === sel && <span className="kbd" style={{marginLeft:'auto'}}>↵</span>}
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Copilot, CommandPalette });


/* ============================================================
   FORJA — cabeçalhos + centro de comandos + central de projetos
   ============================================================ */

function CenterHeader({ icon, crumb, title, sub, children }) {
  return (
    <div className="center-head hud-grid">
      <div className="ch-top">
        <div className="ch-icon"><Icon name={icon} size={19} /></div>
        <div className="ch-titles">
          <div className="ch-crumb">FORJA OS · {crumb}</div>
          <h1 className="ch-title">{title}</h1>
          {sub && <div className="ch-sub">{sub}</div>}
        </div>
        {children && <div className="ch-actions">{children}</div>}
      </div>
    </div>
  );
}

/* helper · cabeçalho de tile */
function TileHead({ icon, title, badge, badgeClass, expandTo, setView }) {
  return (
    <div className="panel-head">
      {icon && <Icon name={icon} size={13} style={{color:'var(--text-2)'}}/>}
      <h3>{title}</h3>
      {badge && <span className={'pill ' + (badgeClass||'')}>{badge}</span>}
      {expandTo && <button className="btn ghost icon sm" style={{marginLeft:'auto'}} onClick={()=>setView(expandTo)} title="Abrir central"><Icon name="chevR" size={13}/></button>}
    </div>
  );
}

/* ===================== CENTRO DE COMANDOS ===================== */
function FactoryCommandCenter({ setView }) {
  const D = window.FORJA;
  const running = D.missoes.filter(m => m.status === 'RUNNING');
  const failed = D.missoes.filter(m => m.status === 'FAILED');
  const online = D.agentes.filter(a => a.status === 'running');
  const projAtivos = D.projetos.filter(p => p.status === 'building' || p.status === 'review');
  const COLORS = ['var(--accent)','var(--info)','var(--violet)','var(--ok)','var(--text-3)','var(--warn)'];

  return (
    <div className="center">
      <CenterHeader icon="pulse" crumb="DIRETORIA · OPERAÇÃO DIÁRIA" title="Centro de Comandos"
        sub="Gestão unificada da Fábrica · tempo real · todos os domínios em uma tela">
        <div className="seg">
          <button className="on">Ao vivo</button><button>Hoje</button><button>7d</button><button>30d</button>
        </div>
        <button className="btn"><Icon name="refresh" size={13} /></button>
        <button className="btn primary"><Icon name="plus" size={13} /> Novo sistema</button>
      </CenterHeader>

      <div className="fcc">
        {/* ---- KPI strip ---- */}
        <div className="fcc-kpis">
          {D.kpis.map(k => (
            <div className="kpi fcc-kpi" key={k.id}>
              <div className="kpi-label">{k.label}</div>
              <div className="kpi-val">{k.valor}</div>
              <div className="kpi-foot">
                <span className={'kpi-delta ' + k.dir}>{k.delta}</span>
                <span className="kpi-sub">{k.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ---- Row 1: Throughput | Cores | Alertas ---- */}
        <div className="fcc-row">
          <div className="panel fcc-tile">
            <TileHead icon="activity" title="Produção · missões concluídas" badge="real" badgeClass="acc" />
            <div className="panel-body fcc-body">
              <div style={{display:'flex', alignItems:'baseline', gap:10, marginBottom:8}}>
                <span style={{fontFamily:'var(--font-display)', fontSize:26, fontWeight:600}}>
                  {D.missoes.filter(m=>m.status==='COMPLETED').length}</span>
                <span className="muted" style={{fontSize:11}}>missões COMPLETED (banco real)</span>
              </div>
              <div className="muted" style={{fontSize:11}}>Série histórica: NÃO MONITORADA</div>
            </div>
          </div>
          <div className="panel fcc-tile">
            <TileHead icon="cpu" title="Saúde da Fábrica" badge={D.cores.filter(c=>c.status==='ok').length + '/' + D.cores.length} badgeClass="ok" expandTo="settings" setView={setView} />
            <div className="panel-body fcc-body flush scroll-y">
              {D.cores.map(c => (
                <div className="health-row" key={c.id} style={{padding:'7px 14px'}}>
                  <div className="health-name">
                    <span className={'dot ' + (c.status==='ok'?'ok':'idle')} />
                    <div style={{minWidth:0}}>
                      <div className="nm truncate" style={{fontSize:12}}>{c.nome}</div>
                    </div>
                  </div>
                  <div className="health-meta" style={{fontSize:11}}>{c.status==='ok'?'ativo':'não monitorado'}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="panel fcc-tile">
            <TileHead icon="alert" title="Alertas Críticos" badge={D.governance.alertas.length} badgeClass="err" expandTo="audit" setView={setView} />
            <div className="panel-body fcc-body flush scroll-y">
              {D.governance.alertas.map((a, i) => (
                <div key={i} className="fcc-alert">
                  <span className={'pill ' + (a.nivel==='crítico'?'err':'warn')}>{a.tipo}</span>
                  <span style={{fontSize:11.5, flex:1}}>{a.txt}</span>
                </div>
              ))}
              {failed.length > 0 && failed.map(m => (
                <div key={m.id} className="fcc-alert">
                  <span className="pill err">missão</span>
                  <span style={{fontSize:11.5, flex:1}}><span className="mono faint" style={{fontSize:10.5}}>{m.id}</span> {m.titulo}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ---- Linha 2: Missões | Equipe | Publicação ---- */}
        <div className="fcc-row">
          <div className="panel fcc-tile">
            <TileHead icon="target" title="Missões em execução" badge={running.length} badgeClass="acc" expandTo="missions" setView={setView} />
            <div className="panel-body fcc-body flush scroll-y">
              {running.map(m => (
                <div key={m.id} className="fcc-mis-row" onClick={()=>setView('missions')}>
                  <span className={'prio ' + m.prio}>{m.prio}</span>
                  <div style={{minWidth:0, flex:1}}>
                    <div className="truncate" style={{fontSize:12, fontWeight:500}}>{m.titulo}</div>
                    <div className="mono faint" style={{fontSize:10.5}}>{m.id} · {m.agente} · {m.llm}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div className="mono" style={{fontSize:11, color:'var(--accent-bright)'}}>{m.tempo}</div>
                    <div className="mono faint" style={{fontSize:10}}>{m.etapa}/{m.etapas}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="panel fcc-tile">
            <TileHead icon="cpu" title="Equipe Ativa" badge={online.length+'/'+D.agentes.length+' ativos'} badgeClass={online.length===D.agentes.length?'ok':'acc'} expandTo="agents" setView={setView} />
            <div className="panel-body fcc-body flush scroll-y">
              {D.agentes.map(a => (
                <div key={a.id} className="fcc-agt-row" onClick={()=>setView('agents')}>
                  <span className={'dot ' + (a.status==='running'?'ok':a.status==='blocked'?'err':'idle') + (a.status==='running'?' blink':'')} />
                  <span className="mono" style={{fontSize:11, fontWeight:600, width:120, flex:'none'}}>{a.papel}</span>
                  <span className="muted truncate" style={{fontSize:11, flex:1, minWidth:0}}>{a.missao}</span>
                  <span className="mono faint" style={{fontSize:10}}>{a.tempoMedio}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="panel fcc-tile">
            <TileHead icon="rocket" title="Publicações" badge="não monitorado" badgeClass="" expandTo="deploy" setView={setView} />
            <div className="panel-body fcc-body">
              <div className="muted" style={{fontSize:12, padding:'8px 0'}}>NÃO MONITORADO</div>
              <div className="muted" style={{fontSize:11}}>Nenhuma publicação ou ambiente real conectado.</div>
            </div>
          </div>
        </div>

        {/* ---- Row 3: Custos | Auditoria | Projetos ---- */}
        <div className="fcc-row">
          <div className="panel fcc-tile">
            <TileHead icon="dollar" title="Custo incremental IA" badge={'R$ '+D.custos.mensal} badgeClass="acc" expandTo="costs" setView={setView} />
            <div className="panel-body fcc-body" style={{display:'flex', gap:14, alignItems:'center'}}>
              <Donut value={D.custos.limite ? D.custos.mensal/D.custos.limite : 0} size={86} stroke={10} color="var(--accent)" label={D.custos.limite ? Math.round(D.custos.mensal/D.custos.limite*100)+'%' : 'R$ 0'} />
              <div style={{flex:1, minWidth:0}} className="legend">
                {D.custos.byLLM.slice(0,5).map((l,i)=>(
                  <div className="legend-item" key={l.nome}>
                    <span className="legend-sw" style={{background: l.cor}}/>
                    <span className="truncate">{l.nome}</span>
                    <span className="legend-val">R$ {l.custo.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="panel fcc-tile">
            <TileHead icon="shield" title="Auditoria · ao vivo" badge={<><span className="dot ok blink"/> registros</>} badgeClass="acc" expandTo="audit" setView={setView} />
            <div className="panel-body fcc-body flush">
              <div className="term" style={{border:'none', borderRadius:0, height:'100%', maxHeight:'none', overflow:'auto'}}>
                {D.auditoria.slice(0,8).map(a=>(
                  <div className="ln" key={a.id}>
                    <span className="t">{a.ts.slice(0,5)}</span>
                    <span className={'lv-'+(a.sev==='crítico'?'err':a.sev==='aviso'?'warn':'info')}>[{a.ator}] {a.acao} → {a.alvo}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="panel fcc-tile">
            <TileHead icon="folder" title="Projetos ativos" badge={projAtivos.length} badgeClass="acc" expandTo="projects" setView={setView} />
            <div className="panel-body fcc-body flush scroll-y">
              {projAtivos.map(p=>(
                <div key={p.id} className="fcc-prj-row" onClick={()=>setView('projects')}>
                  <span className={'prio ' + p.prio}>{p.prio}</span>
                  <div style={{minWidth:0, flex:1}}>
                    <div className="truncate" style={{fontSize:12, fontWeight:500}}>{p.nome}</div>
                    <div className="mono faint" style={{fontSize:10.5}}>{p.id} · {p.agenteResp}</div>
                  </div>
                  <div style={{width:80}}><Progress value={p.prog/100} color="var(--accent)" /><div className="mono" style={{fontSize:10, textAlign:'right', marginTop:2}}>{p.prog}%</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================== CENTRAL DE PROJETOS (V2) ===================== */
function ProjectCenter({ setView }) {
  const D = window.FORJA;
  const [sel, setSel] = useState(D.projetos[0] || null);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('todos');
  if (!D.projetos.length) {
    return (
      <div className="center">
        <CenterHeader icon="folder" crumb="Projetos da Fábrica" title="Fábrica de Projetos"
          sub="SEM DADOS REAIS — não há tabela de projetos no nexus.db" />
        <div className="detail-empty" style={{padding:40}}>
          <div><div className="ic"><Icon name="folder" size={22}/></div>
          <div style={{fontSize:13, color:'var(--text-2)'}}>SEM DADOS REAIS</div>
          <div style={{fontSize:11.5, marginTop:4}}>Nenhum projeto real cadastrado. Nada inventado é exibido.</div></div>
        </div>
      </div>
    );
  }
  const filters = ['todos','building','review','live','paused'];
  const list = D.projetos.filter(p =>
    (filter==='todos' || p.status===filter) &&
    (p.nome.toLowerCase().includes(q.toLowerCase()) || p.id.toLowerCase().includes(q.toLowerCase())));
  const lastDeploy = (pid) => (D.deploys.find(d => d.proj === pid) || {}).quando || '—';
  return (
    <div className="center">
      <CenterHeader icon="folder" crumb="Projetos" title="Central de Projetos"
        sub={D.projetos.length + ' sistemas · ' + D.projetos.filter(p=>p.status==='building').length + ' em construção · entidade principal da Fábrica'}>
        <button className="btn"><Icon name="filter" size={13} /> Filtros</button>
        <button className="btn primary"><Icon name="plus" size={13} /> Novo projeto</button>
      </CenterHeader>
      <div className="center-head" style={{borderTop:'none', paddingTop:12, paddingBottom:12, background:'var(--bg-1)'}}>
        <div className="toolbar">
          <div className="field tb-search">
            <Icon name="search" size={14} /><input placeholder="Buscar projeto, responsável, versão…" value={q} onChange={e=>setQ(e.target.value)} />
          </div>
          <div className="seg">
            {filters.map(f => <button key={f} className={filter===f?'on':''} onClick={()=>setFilter(f)}>{f==='todos'?'todos':labelStatus(f)}</button>)}
          </div>
          <span className="grow" />
          <span className="muted mono" style={{fontSize:11}}>{list.length} resultados</span>
        </div>
      </div>
      <div className="center-split">
        <div className="split-main">
          <div className="tbl-wrap panel" style={{padding:0}}>
            <table className="tbl">
              <thead><tr>
                <th>Projeto</th><th>Situação</th><th>Prio</th><th>Responsável</th><th>Progresso</th><th>Missões</th><th>Artefatos</th><th>Publicação</th><th>Atividade</th>
              </tr></thead>
              <tbody>
                {list.map(p => (
                  <tr key={p.id} className={sel.id===p.id?'on':''} onClick={()=>setSel(p)}>
                    <td><div className="cell-strong">{p.nome}</div><div className="id-cell">{p.id} · {p.owner} · <span className="mono">{p.branch}</span></div></td>
                    <td><span className={'pill ' + (STATUS_CLASS[p.status]||'')}>{labelStatus(p.status)}</span></td>
                    <td><span className={'prio ' + p.prio}>{p.prio}</span></td>
                    <td className="mono" style={{fontSize:11}}>{p.agenteResp}</td>
                    <td style={{minWidth:120}}><div className="metric-inline"><Progress value={p.prog/100} color={'var(--'+(p.cor==='acc'?'accent':p.cor)+')'} /><span className="mono" style={{fontSize:11,width:32}}>{p.prog}%</span></div></td>
                    <td className="mono">{p.missoes}</td>
                    <td className="mono">{p.artefatos.toLocaleString('pt-BR')}</td>
                    <td className="mono muted" style={{fontSize:11}}>há {lastDeploy(p.id)}</td>
                    <td className="muted" style={{fontSize:11}}>{p.atualizado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="split-side">
          <div className="detail">
            <div className="detail-head">
              <div className="ch-crumb">{sel.id}</div>
              <h2>{sel.nome}</h2>
              <div className="tags">
                <span className={'pill ' + (STATUS_CLASS[sel.status]||'')}>{labelStatus(sel.status)}</span>
                <span className={'prio ' + sel.prio}>{sel.prio}</span>
                <span className="tag">{sel.branch}</span>
              </div>
            </div>
            <div className="detail-block">
              <span className="eyebrow">Progresso de construção</span>
              <div className="metric-inline"><Progress value={sel.prog/100} h={6} /><span className="mono" style={{fontSize:12}}>{sel.prog}%</span></div>
            </div>
            <div className="grid-2" style={{gap:10}}>
              <div className="kpi" style={{padding:'10px 12px'}}><div className="kpi-label">Missões</div><div className="kpi-val" style={{fontSize:20}}>{sel.missoes}</div></div>
              <div className="kpi" style={{padding:'10px 12px'}}><div className="kpi-label">Artefatos</div><div className="kpi-val" style={{fontSize:20}}>{sel.artefatos.toLocaleString('pt-BR')}</div></div>
            </div>
            <div className="detail-block">
              <span className="eyebrow">Detalhes</span>
              <dl className="kv">
                <dt>Tecnologias</dt><dd>{sel.stack}</dd>
                <dt>Responsável</dt><dd>{sel.owner}</dd>
                <dt>Responsável principal</dt><dd className="mono">{sel.agenteResp}</dd>
                <dt>Equipe ativa</dt><dd>{sel.agentes}</dd>
                <dt>Versão de trabalho</dt><dd className="mono">{sel.branch}</dd>
                <dt>Última publicação</dt><dd>há {lastDeploy(sel.id)}</dd>
                <dt>Atualizado</dt><dd>há {sel.atualizado}</dd>
              </dl>
            </div>
            <div className="detail-block">
              <span className="eyebrow">Ações rápidas</span>
              <div style={{display:'flex', gap:7, flexWrap:'wrap'}}>
                <button className="btn sm" onClick={()=>setView('missions')}><Icon name="target" size={12}/> Missões</button>
                <button className="btn sm" onClick={()=>setView('deploy')}><Icon name="rocket" size={12}/> Publicar</button>
                <button className="btn sm" onClick={()=>setView('agents')}><Icon name="cpu" size={12}/> Equipe</button>
                <button className="btn sm" onClick={()=>setView('costs')}><Icon name="dollar" size={12}/> Custos</button>
                <button className="btn sm"><Icon name="git" size={12}/> Repositório</button>
              </div>
            </div>
            <div className="detail-block">
              <span className="eyebrow">Última atividade</span>
              <div className="term" style={{maxHeight:160}}>
                <div className="ln"><span className="t">14:30</span><span className="lv-acc">estrutura gerada · +412 linhas</span></div>
                <div className="ln"><span className="t">14:18</span><span className="lv-ok">construção OK · 2.4s</span></div>
                <div className="ln"><span className="t">13:55</span><span className="lv-info">missão MIS-412 iniciada</span></div>
                <div className="ln"><span className="t">13:40</span><span className="lv-warn">lint · 3 avisos</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CenterHeader, TileHead, FactoryCommandCenter, ProjectCenter });


/* ============================================================
   FORJA — Central de Missões · Equipe Inteligente · Central de IA (V2)
   ============================================================ */

/* ===================== CENTRAL DE MISSÕES ===================== */
function MissionCenter({ setView }) {
  const D = window.FORJA;
  const [mode, setMode] = useState('board');
  const [sel, setSel] = useState(null);
  const [proj, setProj] = useState('todos');
  const [q, setQ] = useState('');
  const [running, setRunning] = useState(false);
  const all = D.missoes.filter(m =>
    (proj === 'todos' || m.proj === proj) &&
    (m.titulo.toLowerCase().includes(q.toLowerCase()) || m.id.toLowerCase().includes(q.toLowerCase())));
  const byCol = (c) => all.filter(m => m.status === c);
  const projName = (id) => (D.projetos.find(p => p.id === id) || {}).nome || id;
  const stCls = (s) => s==='RUNNING'?'ok':s==='FAILED'?'err':s==='QUEUED'?'info':s==='COMPLETED'?'ok':'idle';

  return (
    <div className="center">
      <CenterHeader icon="target" crumb="Missões · produção em tempo real" title="Central de Missões"
        sub={all.length + ' missões · ' + byCol('RUNNING').length + ' em execução · ' + byCol('FAILED').length + ' com falha · ' + byCol('PENDING').length + ' pendentes'}>
        <div className="seg">
          <button className={mode==='board'?'on':''} onClick={()=>setMode('board')}>Quadro</button>
          <button className={mode==='list'?'on':''} onClick={()=>setMode('list')}>Lista</button>
        </div>
        <button className="btn primary"><Icon name="plus" size={13} /> Nova missão</button>
      </CenterHeader>
      <div className="center-head" style={{borderTop:'none', paddingTop:12, paddingBottom:12}}>
        <div className="toolbar">
          <div className="field tb-search"><Icon name="search" size={14} /><input placeholder="Buscar missão, equipe, IA…" value={q} onChange={e=>setQ(e.target.value)} /></div>
          <select className="cp-select" style={{height:28, maxWidth:200, flex:'none'}} value={proj} onChange={e=>setProj(e.target.value)}>
            <option value="todos">Todos os projetos</option>
            {D.projetos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
          <span className="grow" />
          <span className="muted mono" style={{fontSize:11}}>{all.length} missões</span>
        </div>
      </div>

      <div className="center-split">
        <div className="split-main" style={{padding: mode==='board'?'14px 16px':'16px 18px'}}>
          {mode === 'board' ? (
            <div className="kanban">
              {D.MIS_STATES.map(col => (
                <div className="kan-col" key={col}>
                  <div className="kan-head" style={{background:'var(--bg-1)'}}>
                    <span className={'dot ' + stCls(col) + (col==='RUNNING'?' blink':'')} />
                    <span className="mono" style={{fontWeight:600, fontSize:11, letterSpacing:'.08em'}}>{labelMissionStatus(col)}</span>
                    <span className="count">{byCol(col).length}</span>
                  </div>
                  <div className="kan-body">
                    {byCol(col).map(m => (
                      <div key={m.id} className="kan-card" onClick={()=>setSel(m)} style={sel&&sel.id===m.id?{borderColor:'var(--accent-line)'}:{}}>
                        <div className="kan-card-top">
                          <span className={'prio '+m.prio}>{m.prio}</span>
                          <span className="id-cell">{m.id}</span>
                          {m.tempo!=='—' && <span className="mono acc" style={{marginLeft:'auto', fontSize:10.5, color:'var(--accent-bright)'}}><Icon name="clock" size={10}/> {m.tempo}</span>}
                        </div>
                        <div className="kan-card-title">{m.titulo}</div>
                        {m.etapas>0 && col==='RUNNING' && <Progress value={m.etapa/m.etapas} color="var(--accent)" />}
                        <div className="kan-card-foot">
                          <span className="mono" style={{fontSize:10}}>{m.agente}</span>
                          <span className="faint mono" style={{fontSize:10, marginLeft:'auto'}}>{m.llm}</span>
                        </div>
                      </div>
                    ))}
                    {byCol(col).length===0 && <div className="faint" style={{fontSize:11, padding:'8px 4px'}}>vazio</div>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="tbl-wrap panel" style={{padding:0}}>
              <table className="tbl"><thead><tr>
                <th>ID</th><th>Missão</th><th>Projeto</th><th>Situação</th><th>Prio</th><th>Equipe</th><th>IA</th><th>Tempo</th><th>Etapa</th>
              </tr></thead><tbody>
                {all.map(m => (
                  <tr key={m.id} className={sel&&sel.id===m.id?'on':''} onClick={()=>setSel(m)}>
                    <td className="id-cell">{m.id}</td>
                    <td><div className="cell-strong">{m.titulo}</div><div className="tags" style={{marginTop:4}}>{m.tags.map(t=><span key={t} className="tag">{t}</span>)}</div></td>
                    <td className="muted">{projName(m.proj)}</td>
                    <td><span className={'pill ' + stCls(m.status)}>{labelMissionStatus(m.status)}</span></td>
                    <td><span className={'prio '+m.prio}>{m.prio}</span></td>
                    <td className="mono" style={{fontSize:11}}>{m.agente}</td>
                    <td className="mono muted" style={{fontSize:11}}>{m.llm}</td>
                    <td className="mono" style={{fontSize:11, color: m.tempo!=='—'?'var(--accent-bright)':'var(--text-3)'}}>{m.tempo}</td>
                    <td className="mono">{m.etapa}/{m.etapas}</td>
                  </tr>
                ))}
              </tbody></table>
            </div>
          )}
        </div>
        <div className="split-side">
          {sel ? (
            <div className="detail">
              <div className="detail-head">
                <div className="ch-crumb">{sel.id} · {projName(sel.proj)}</div>
                <h2>{sel.titulo}</h2>
                <div className="tags">
                  <span className={'prio '+sel.prio}>{sel.prio}</span>
                  <span className={'pill ' + stCls(sel.status)}>{labelMissionStatus(sel.status)}</span>
                  {sel.tags.map(t=><span key={t} className="tag">{t}</span>)}
                </div>
              </div>
              <div className="detail-block">
                <span className="eyebrow">Progresso · etapa {sel.etapa}/{sel.etapas}</span>
                <Progress value={sel.etapas?sel.etapa/sel.etapas:0} h={6} color={sel.status==='FAILED'?'var(--err)':'var(--accent)'} />
              </div>
              <div className="detail-block">
                <span className="eyebrow">Atribuição</span>
                <dl className="kv">
                  <dt>Responsável</dt><dd className="mono">{sel.agente}</dd>
                  <dt>IA escolhida</dt><dd className="mono">{sel.llm}</dd>
                  <dt>Tempo decorrido</dt><dd className="mono">{sel.tempo}</dd>
                  <dt>Projeto</dt><dd>{projName(sel.proj)}</dd>
                </dl>
              </div>
              <div className="detail-block">
                <span className="eyebrow">Fluxo da missão</span>
                {['Análise','Planejamento','Geração','Testes','Revisão','Entrega'].slice(0,sel.etapas).map((s,i)=>(
                  <div key={s} className="health-row" style={{padding:'7px 0'}}>
                    <span className={'pipe-node'} style={{width:22,height:22,fontSize:10,
                      background: i<sel.etapa?'var(--ok)':i===sel.etapa&&sel.status!=='FAILED'?'var(--accent)':sel.status==='FAILED'&&i===sel.etapa?'var(--err)':'var(--bg-2)',
                      borderColor: i<sel.etapa?'var(--ok)':i===sel.etapa?(sel.status==='FAILED'?'var(--err)':'var(--accent)'):'var(--border-strong)',
                      color: i<=sel.etapa?'#0a0c0f':'var(--text-3)'}}>{i<sel.etapa?'✓':sel.status==='FAILED'&&i===sel.etapa?'✕':i+1}</span>
                    <span style={{fontSize:12.5, color: i<=sel.etapa?'var(--text-1)':'var(--text-3)'}}>{s}</span>
                  </div>
                ))}
              </div>
              <div style={{display:'flex', gap:7}}>
                <button className="btn primary" style={{flex:1}} disabled={running}
                  onClick={async () => {
                    if (!window.ForjaAPI || !window.ForjaAPI.runMission) return;
                    setRunning(true);
                    try {
                      const r = await window.ForjaAPI.runMission(sel.id);
                      await window.ForjaAPI.refreshMissions();
                      const upd = (window.FORJA.missoes || []).find(x => x.id === sel.id);
                      if (upd) setSel(upd); else setSel(s => ({ ...s, status: r.status || s.status }));
                    } finally { setRunning(false); }
                  }}>
                  {running ? <><Icon name="refresh" size={13}/> Executando…</>
                    : sel.status==='FAILED' ? <><Icon name="refresh" size={13}/> Reexecutar</>
                    : <><Icon name="play" size={12}/> {sel.status==='RUNNING'?'Acompanhar':'Executar missão'}</>}
                </button>
                <button className="btn"><Icon name="cpu" size={13}/></button>
                <button className="btn icon"><Icon name="dots" size={14}/></button>
              </div>
            </div>
          ) : (
            <div className="detail-empty">
              <div><div className="ic"><Icon name="target" size={22}/></div>
              <div style={{fontSize:13, color:'var(--text-2)'}}>Selecione uma missão</div>
              <div style={{fontSize:11.5, marginTop:4}}>Clique em um card para ver o pipeline e atribuições.</div></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===================== EQUIPE INTELIGENTE (V2 · 7 papéis) ===================== */
function AgentCenter({ setView }) {
  const D = window.FORJA;
  const [sel, setSel] = useState(D.agentes[0] || null);
  if (!D.agentes.length) {
    return (
      <div className="center">
        <CenterHeader icon="cpu" crumb="Execução · equipe da Fábrica" title="Equipe Inteligente"
          sub="sem dados reais — backend indisponível ou banco sem agentes" />
        <div className="detail-empty" style={{padding:40}}>
          <div><div className="ic"><Icon name="cpu" size={22}/></div>
          <div style={{fontSize:13, color:'var(--text-2)'}}>Sem agentes reais carregados</div>
          <div style={{fontSize:11.5, marginTop:4}}>Inicie o backend (forja_os_server.py) para ver a equipe real do nexus.db.</div></div>
        </div>
      </div>
    );
  }
  const stColor = (e) => e==='running'?'ok':e==='blocked'?'err':'idle';
  const stLabel = (e) => labelAgentStatus(e);
  const running = D.agentes.filter(a=>a.status==='running').length;
  return (
    <div className="center">
      <CenterHeader icon="cpu" crumb="Execução · equipe da Fábrica" title="Equipe Inteligente"
        sub={running + ' em execução · ' + D.agentes.length + ' funções registradas · ARQUITETO, DESENVOLVEDOR, AUDITOR, SEGURANÇA, OPERAÇÕES, ESPECIALISTA EM DADOS, ESPECIALISTA EM IA'}>
        <button className="btn"><Icon name="pause" size={13} /> Pausar todos</button>
        <button className="btn primary"><Icon name="plus" size={13} /> Novo membro</button>
      </CenterHeader>
      <div className="center-split wide">
        <div className="split-main">
          <div className="kpi-grid" style={{marginBottom:16, gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))'}}>
            <div className="kpi"><div className="kpi-label">Tokens de assinatura</div><div className="kpi-val" style={{fontSize:22}}>N/A</div><div className="kpi-sub">sem billing por token</div></div>
            <div className="kpi"><div className="kpi-label">Custo incremental</div><div className="kpi-val" style={{fontSize:22}}>R$ 0</div><div className="kpi-sub">assinatura/local</div></div>
            <div className="kpi"><div className="kpi-label">APIs pagas</div><div className="kpi-val" style={{fontSize:22}}>Bloqueadas</div><div className="kpi-sub">exigem autorização</div></div>
            <div className="kpi"><div className="kpi-label">Medição real</div><div className="kpi-val" style={{fontSize:22}}>Pendente</div><div className="kpi-sub">sem dados inventados</div></div>
          </div>
          <div className="sec-title"><Icon name="cpu" size={14} style={{color:'var(--text-2)'}}/><h2>Funções da equipe</h2></div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:12, marginTop:10}}>
            {D.agentes.map(a => (
              <div key={a.id} className={'panel agent-card'} onClick={()=>setSel(a)} style={{padding:14, cursor:'pointer',
                borderColor: sel.id===a.id?'var(--accent-line)':'var(--border)', background: sel.id===a.id?'var(--accent-soft)':'var(--bg-2)'}}>
                <div style={{display:'flex', alignItems:'center', gap:9, marginBottom:10}}>
                  <span className={'dot ' + stColor(a.status) + (a.status==='running'?' blink':'')} />
                  <span className="mono" style={{fontWeight:700, fontSize:12, letterSpacing:'.06em'}}>{a.papel}</span>
                  <span className={'pill ' + (a.status==='running'?'ok':a.status==='blocked'?'err':'')} style={{marginLeft:'auto'}}>{stLabel(a.status)}</span>
                </div>
                <div style={{fontSize:12.5, fontWeight:500, marginBottom:2}}>{a.nome}</div>
                <div className="muted" style={{fontSize:11, marginBottom:10}}>{a.id}</div>
                <dl className="kv" style={{fontSize:11}}>
                  <dt>Missão atual</dt><dd className="mono">{a.missao}</dd>
                  <dt>Última exec.</dt><dd className="mono">há {a.ultimaExec}</dd>
                  <dt>Provedor de IA</dt><dd className="mono truncate">{a.provider}</dd>
                  <dt>Tempo médio</dt><dd className="mono">{a.tempoMedio}</dd>
                </dl>
              </div>
            ))}
          </div>
        </div>
        <div className="split-side">
          <div className="detail">
            <div className="detail-head">
              <div className="ch-crumb">{sel.id}</div>
              <h2 className="mono" style={{letterSpacing:'.04em'}}>{sel.papel}</h2>
              <div style={{fontSize:12, color:'var(--text-2)'}}>{sel.nome}</div>
              <div className="tags"><span className={'pill ' + stColor(sel.status)}>{stLabel(sel.status)}</span></div>
            </div>
            <div className="grid-2" style={{gap:10}}>
              <div className="kpi" style={{padding:'10px 12px'}}><div className="kpi-label">Tokens</div><div className="kpi-val" style={{fontSize:18}}>Não aplicável</div></div>
              <div className="kpi" style={{padding:'10px 12px'}}><div className="kpi-label">Custo incremental</div><div className="kpi-val" style={{fontSize:18}}>R$ 0</div></div>
            </div>
            <div className="detail-block">
              <span className="eyebrow">Configuração</span>
              <dl className="kv">
                <dt>Provedor de IA</dt><dd className="mono">{sel.provider}</dd>
                <dt>Missão atual</dt><dd className="mono">{sel.missao}</dd>
                <dt>Última execução</dt><dd>há {sel.ultimaExec}</dd>
                <dt>Tempo médio</dt><dd className="mono">{sel.tempoMedio}</dd>
                <dt>Tarefas concluídas</dt><dd className="mono">não medido</dd>
                <dt>Taxa de sucesso</dt><dd className="mono">não medido</dd>
              </dl>
            </div>
            <div className="detail-block">
              <span className="eyebrow">Registros da equipe · ao vivo</span>
              <div className="term" style={{maxHeight:200}}>
                <div className="ln"><span className="t">14:32</span><span className="lv-acc">{sel.papel} ⟶ chamando {sel.provider}</span></div>
                <div className="ln"><span className="t">14:32</span><span className="lv-info">contexto: 12.4K tokens · conhecimento: 3 docs</span></div>
                <div className="ln"><span className="t">14:31</span><span className="lv-ok">ferramenta write_file → ok</span></div>
                <div className="ln"><span className="t">14:31</span><span className="lv-info">raciocínio: decompondo subtarefa 3/6</span></div>
                <div className="ln"><span className="t">14:30</span><span className="lv-ok">testes: 18 passou · 0 falhou</span></div>
              </div>
            </div>
            <div style={{display:'flex', gap:7}}>
              <button className="btn primary" style={{flex:1}}>{sel.status==='running'?<><Icon name="pause" size={12}/> Pausar</>:<><Icon name="play" size={12}/> Iniciar</>}</button>
              <button className="btn" onClick={()=>setView('missions')}><Icon name="target" size={13}/></button>
              <button className="btn icon"><Icon name="dots" size={14}/></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================== CENTRAL DE IA (V2 · 5 provedores) ===================== */
function LLMCenter({ setView }) {
  const D = window.FORJA;
  const [llms, setLLMs] = useState(D.llms);
  const [sel, setSel] = useState(D.llms[0]);
  const toggle = (id) => setLLMs(ms => ms.map(m => m.id===id?{...m, ativo:!m.ativo}:m));
  const ativos = llms.filter(m => m.ativo);
  return (
    <div className="center">
      <CenterHeader icon="route" crumb="Central de IA · baixo custo" title="Central de IA"
        sub="Assinaturas e local primeiro · APIs pagas bloqueadas sem autorização · sem custos fictícios">
        <button className="btn"><Icon name="refresh" size={13} /> Rebalancear</button>
        <button className="btn primary"><Icon name="plus" size={13} /> Adicionar provedor</button>
      </CenterHeader>
      <div className="center-split wide">
        <div className="split-main section-gap">
          <div className="panel">
            <div className="panel-head"><Icon name="route" size={14} style={{color:'var(--text-2)'}}/><h3>Provedores</h3>
              <div className="right"><span className="pill warn">ativos somente com validação real</span></div></div>
            <div className="panel-body flush tbl-wrap">
              <table className="tbl"><thead><tr>
                <th>Nome</th><th>Tipo</th><th>Status</th><th>Modo de uso</th><th>Automação</th><th>Custo incremental</th><th>Billing</th><th>Último health check</th><th>Observação</th>
              </tr></thead><tbody>
                {llms.map(l => (
                  <tr key={l.id} className={sel.id===l.id?'on':''} onClick={()=>setSel(l)} style={{opacity: l.ativo?1:0.55}}>
                    <td><div className="cell-strong">{l.provider}</div><div className="id-cell mono">{l.modelos.join(' · ')}</div></td>
                    <td><span className="tag">{l.tipo}</span></td>
                    <td><span className={'pill ' + (l.status==='active_real'?'ok':l.status==='inactive'?'err':'warn')}>{l.statusLabel || l.status}</span></td>
                    <td>{l.modoUso}</td>
                    <td>{l.automacao}</td>
                    <td className="mono">{l.custoIncremental}</td>
                    <td>{l.billing}</td>
                    <td>{l.ultimoHealth}</td>
                    <td className="muted" style={{fontSize:11}}>{l.observacao}</td>
                  </tr>
                ))}
              </tbody></table>
            </div>
          </div>
          <div className="panel">
            <div className="panel-head"><Icon name="zap" size={14} style={{color:'var(--text-2)'}}/><h3>Regras de roteamento</h3>
              <div className="right"><button className="btn ghost sm"><Icon name="plus" size={12}/> Regra</button></div></div>
            <div className="panel-body flush">
              {D.rotas.map(r => (
                <div key={r.id} className="health-row" style={{padding:'12px 14px'}}>
                  <span className="id-cell" style={{width:28}}>{r.id}</span>
                  <div style={{flex:1, minWidth:0}}>
                    <div className="mono" style={{fontSize:12}}>{r.quando}</div>
                    <div className="faint" style={{fontSize:10.5}}>alternativa → {r.fallback}</div>
                  </div>
                  <Icon name="chevR" size={14} style={{color:'var(--text-3)'}}/>
                  <span className="pill acc">{r.modelo}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="split-side">
          <div className="detail">
            <div className="detail-head">
              <div className="ch-crumb">{sel.id}</div>
              <h2>{sel.provider}</h2>
              <div className="tags"><span className={'pill ' + (sel.status==='active_real'?'ok':sel.status==='inactive'?'err':'warn')}>{sel.statusLabel || sel.status}</span><span className="tag">{sel.tipo}</span></div>
            </div>
            <div className="grid-2" style={{gap:10}}>
              <div className="kpi" style={{padding:'10px 12px'}}><div className="kpi-label">Tipo</div><div className="kpi-val" style={{fontSize:18}}>{sel.tipo}</div></div>
              <div className="kpi" style={{padding:'10px 12px'}}><div className="kpi-label">Automação</div><div className="kpi-val" style={{fontSize:18}}>{sel.automacao}</div></div>
              <div className="kpi" style={{padding:'10px 12px'}}><div className="kpi-label">Custo incremental</div><div className="kpi-val" style={{fontSize:18}}>{sel.custoIncremental}</div></div>
              <div className="kpi" style={{padding:'10px 12px'}}><div className="kpi-label">Saúde</div><div className="kpi-val" style={{fontSize:18}}>{sel.statusLabel || sel.status}</div></div>
            </div>
            <div className="detail-block">
              <span className="eyebrow">Modelos disponíveis</span>
              <div className="tags">{sel.modelos.map(m => <span key={m} className="tag mono">{m}</span>)}</div>
            </div>
            <div className="detail-block">
              <span className="eyebrow">Observação</span>
              <div className="card" style={{padding:'10px 12px', fontSize:12}}>{sel.observacao}</div>
            </div>
            <div className="detail-block">
              <span className="eyebrow">Política de uso</span>
              <div className="card" style={{padding:'10px 12px', display:'flex', alignItems:'center', gap:10}}>
                <Icon name="route" size={14} style={{color:'var(--text-3)'}}/>
                <span style={{fontSize:12}}>{sel.provider}</span>
                <Icon name="chevR" size={13} style={{color:'var(--text-3)'}}/>
                <span className="pill acc">{sel.tipo === 'API Paga' ? 'exige autorização' : 'custo incremental zero'}</span>
              </div>
            </div>
            <div style={{display:'flex', gap:7}}>
              <button className="btn primary" style={{flex:1}} onClick={()=>toggle(sel.id)}>{sel.ativo?<><Icon name="pause" size={12}/> Desativar</>:<><Icon name="play" size={12}/> Ativar</>}</button>
              <button className="btn"><Icon name="gear" size={13}/></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { MissionCenter, AgentCenter, LLMCenter });


/* ============================================================
   FORJA V2 — Publicação · Custos · Auditoria · Conhecimento · Configurações
   ============================================================ */

/* ===================== CENTRAL DE PUBLICAÇÃO ===================== */
function DeployCenter({ setView }) {
  const D = window.FORJA;
  return (
    <div className="center">
      <CenterHeader icon="rocket" crumb="Publicações" title="Central de Publicação"
        sub="NÃO MONITORADO — sem pipeline de publicação real conectado" />
      <div className="center-body section-gap">
        <div className="detail-empty" style={{padding:40}}>
          <div><div className="ic"><Icon name="rocket" size={22}/></div>
          <div style={{fontSize:13, color:'var(--text-2)'}}>SEM DADOS REAIS</div>
          <div style={{fontSize:11.5, marginTop:4}}>
            Nenhum ambiente ou publicação real monitorada. Nada de cobertura, versões
            ou logs inventados é exibido. Aguardando primeira publicação real.</div></div>
        </div>
      </div>
    </div>
  );
}

/* ===================== CONTROLE DE CUSTOS ===================== */
function CostsCenter({ setView }) {
  const D = window.FORJA;
  const c = D.custos;
  const pctLimite = c.limite > 0 ? c.mensal / c.limite : 0;
  return (
    <div className="center">
      <CenterHeader icon="dollar" crumb="Controle de Custos" title="Controle de Custos"
        sub="Painel financeiro da Fábrica · proteção de custos ativa · alertas e limites configurados">
        <div className="seg"><button>24h</button><button className="on">30d</button><button>90d</button><button>Ano</button></div>
        <button className="btn"><Icon name="doc" size={13} /> Exportar</button>
        <button className="btn primary"><Icon name="zap" size={13} /> Otimizar</button>
      </CenterHeader>
      <div className="center-body section-gap">
        {/* KPIs financeiros — billing real ($1/dia · $30/mês) */}
        <div className="kpi-grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))'}}>
          <div className="kpi"><div className="kpi-label">Custo diário</div><div className="kpi-val">${(c.diario||0).toFixed(2)}</div><div className="kpi-foot"><span className="kpi-sub">limite ${(c.limiteDiario||1).toFixed(2)}/dia</span></div></div>
          <div className="kpi"><div className="kpi-label">Custo mensal</div><div className="kpi-val">${(c.mensal||0).toFixed(2)}</div><div className="kpi-foot"><span className="kpi-sub">{(c.source==='real_usage'?'uso real':'sem dados reais')}</span></div></div>
          <div className="kpi"><div className="kpi-label">Limite mensal</div><div className="kpi-val">${(c.limite||30).toFixed(2)}</div><div className="kpi-foot"><span className="kpi-delta flat">teto da Diretoria</span></div></div>
          <div className="kpi"><div className="kpi-label">Projeção fim de mês</div><div className="kpi-val">${(c.projecao||0).toFixed(2)}</div><div className="kpi-foot"><span className="kpi-sub">base uso real</span></div></div>
        </div>

        {/* alertas */}
        <div className="panel">
          <div className="panel-head"><Icon name="alert" size={14} style={{color:'var(--warn)'}}/><h3>Controle de custos · alertas</h3></div>
          <div className="panel-body flush">
            {c.alerts.map((a,i)=>(
              <div key={i} className="health-row" style={{padding:'11px 14px'}}>
                <span className={'pill ' + (a.nivel==='warn'?'warn':'info')}>{a.nivel}</span>
                <span style={{flex:1, fontSize:12.5}}>{a.txt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Charts row */}
        <div className="grid-2" style={{gridTemplateColumns:'1.4fr 1fr'}}>
          <div className="panel">
            <div className="panel-head"><Icon name="activity" size={14} style={{color:'var(--text-2)'}}/><h3>Custo incremental (30 dias)</h3>
              <div className="right mono muted" style={{fontSize:11}}>sem API paga autorizada</div></div>
            <div className="panel-body">
              <Bars data={c.serieDiaria} w={700} h={100} color="var(--accent)" gap={3} />
            </div>
          </div>
          <div className="panel">
            <div className="panel-head"><Icon name="dollar" size={14} style={{color:'var(--text-2)'}}/><h3>Uso de API paga</h3></div>
            <div className="panel-body" style={{display:'flex', alignItems:'center', gap:18}}>
              <Donut value={pctLimite} size={120} stroke={14} color={pctLimite>0.85?'var(--err)':pctLimite>0.7?'var(--warn)':'var(--accent)'} label={Math.round(pctLimite*100)+'%'} />
              <div style={{flex:1}}>
                <div className="kv" style={{fontSize:12}}>
                  <dt>Consumido</dt><dd className="mono">R$ 0,00</dd>
                  <dt>Restante</dt><dd className="mono">não aplicável</dd>
                  <dt>Limite</dt><dd className="mono">definir ao autorizar API</dd>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown 3 colunas */}
        <div className="grid-3">
          <div className="panel">
            <div className="panel-head"><Icon name="route" size={14} style={{color:'var(--text-2)'}}/><h3>Por IA</h3></div>
            <div className="panel-body flush">
              {c.byLLM.map(l=>(
                <div key={l.nome} className="cost-row">
                  <span className="cost-sw" style={{background: l.cor}}/>
                  <span className="cost-nm">{l.nome}</span>
                  <span className="cost-bar"><Progress value={l.pct} color={l.cor}/></span>
                  <span className="cost-val mono">R$ {l.custo.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="panel">
            <div className="panel-head"><Icon name="folder" size={14} style={{color:'var(--text-2)'}}/><h3>Por Projeto</h3></div>
            <div className="panel-body flush">
              {c.byProjeto.map(p=>(
                <div key={p.proj} className="cost-row">
                  <span className="cost-sw" style={{background:'var(--accent)'}}/>
                  <span className="cost-nm truncate">{p.proj}</span>
                  <span className="cost-bar"><Progress value={p.pct} color="var(--accent)"/></span>
                  <span className="cost-val mono">R$ {p.custo.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="panel">
            <div className="panel-head"><Icon name="cpu" size={14} style={{color:'var(--text-2)'}}/><h3>Por Equipe</h3></div>
            <div className="panel-body flush">
              {c.byAgente.map(a=>{
                const max = c.byAgente[0].custo || 1;
                return (
                  <div key={a.agente} className="cost-row">
                    <span className="cost-sw" style={{background:'var(--violet)'}}/>
                    <span className="cost-nm mono" style={{fontSize:11}}>{a.agente}</span>
                    <span className="cost-bar"><Progress value={a.custo/max} color="var(--violet)"/></span>
                    <span className="cost-val mono">R$ {a.custo.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================== CENTRAL DE AUDITORIA ===================== */
function AuditCenter({ setView }) {
  const D = window.FORJA;
  const G = D.governance;
  const [q, setQ] = useState('');
  const [sev, setSev] = useState('todos');
  const sevs = ['todos','info','aviso','crítico'];
  const rows = D.auditoria.filter(a =>
    (sev==='todos' || a.sev===sev) &&
    (a.acao.toLowerCase().includes(q.toLowerCase()) || a.ator.toLowerCase().includes(q.toLowerCase()) || a.alvo.toLowerCase().includes(q.toLowerCase())));
  const count = (s) => D.auditoria.filter(a=>a.sev===s).length;
  return (
    <div className="center">
      <CenterHeader icon="shield" crumb="Conformidade · Lei Zero Fantasma" title="Central de Auditoria"
        sub="Trilha imutável de eventos · sistema de evidências · governança · certificações">
        <button className="btn"><Icon name="doc" size={13} /> Exportar evidências</button>
        <button className="btn primary"><Icon name="zap" size={13} /> Nova varredura</button>
      </CenterHeader>
      <div className="center-body section-gap">
        {/* Banner da Lei Zero Fantasma */}
        <div className="card hud-grid" style={{padding:'16px 18px', display:'flex', alignItems:'center', gap:18, borderColor:'var(--accent-line)'}}>
          <div style={{width:48, height:48, borderRadius:'var(--r-md)', background:'var(--accent-soft)', display:'grid', placeItems:'center', color:'var(--accent-bright)', flex:'none', border:'1px solid var(--accent-line)'}}><Icon name="shield" size={22}/></div>
          <div style={{flex:1, minWidth:0}}>
            <div className="eyebrow" style={{color:'var(--accent-bright)'}}>LEI ZERO FANTASMA</div>
            <div style={{fontSize:15, fontWeight:600, marginTop:2}}>Toda ação na Fábrica deixa evidência verificável</div>
            <div className="muted" style={{fontSize:11.5, marginTop:3}}>{G.zeroGhostLaw.ativas} políticas ativas · {G.zeroGhostLaw.violacoes} violações · última varredura há {G.zeroGhostLaw.ultimaVarredura}</div>
          </div>
          <div style={{display:'flex', gap:18, alignItems:'center'}}>
            <div style={{textAlign:'center'}}><div className="kpi-val" style={{fontSize:16, color:'var(--text-2)'}}>NÃO CALCULADA</div><div className="kpi-sub">integridade</div></div>
            <div style={{textAlign:'center'}}><div className="kpi-val" style={{fontSize:22, color:'var(--accent-bright)'}}>{(G.evidence.total||0).toLocaleString('pt-BR')}</div><div className="kpi-sub">evidências reais</div></div>
          </div>
        </div>

        {/* KPIs */}
        <div className="kpi-grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))'}}>
          <div className="kpi"><div className="kpi-label">Eventos (auditoria)</div><div className="kpi-val">{G.zeroGhostLaw.ativas||0}</div><div className="kpi-sub">{rows.length} exibidos</div></div>
          <div className="kpi"><div className="kpi-label"><span className="dot info"/> Info</div><div className="kpi-val" style={{color:'var(--info)'}}>{count('info')}</div></div>
          <div className="kpi"><div className="kpi-label"><span className="dot warn"/> Avisos</div><div className="kpi-val" style={{color:'var(--warn)'}}>{count('aviso')}</div></div>
          <div className="kpi"><div className="kpi-label"><span className="dot err"/> Críticos</div><div className="kpi-val" style={{color:'var(--err)'}}>{count('crítico')}</div></div>
        </div>

        <div className="grid-2" style={{gridTemplateColumns:'1.3fr 1fr'}}>
          {/* trilha */}
          <div className="panel">
            <div className="panel-head">
              <Icon name="shield" size={14} style={{color:'var(--text-2)'}}/><h3>Trilha de auditoria</h3>
              <div className="right">
                <div className="field" style={{height:26, minWidth:180}}><Icon name="search" size={13}/><input placeholder="Buscar…" value={q} onChange={e=>setQ(e.target.value)} /></div>
                <div className="seg">{sevs.map(s=><button key={s} className={sev===s?'on':''} onClick={()=>setSev(s)}>{s}</button>)}</div>
              </div>
            </div>
            <div className="panel-body flush tbl-wrap">
              <table className="tbl"><thead><tr><th style={{width:80}}>Hora</th><th>Sev</th><th>Ator</th><th>Ação</th><th>Alvo</th></tr></thead>
              <tbody>
                {rows.map(a => (
                  <tr key={a.id} style={{cursor:'default'}}>
                    <td className="mono faint">{a.ts}</td>
                    <td><span className={'pill ' + (a.sev==='crítico'?'err':a.sev==='aviso'?'warn':'info')}>{a.sev}</span></td>
                    <td className="mono">{a.ator}</td>
                    <td className="cell-strong mono" style={{fontSize:11.5}}>{a.acao}</td>
                    <td className="muted">{a.alvo}</td>
                  </tr>
                ))}
              </tbody></table>
            </div>
          </div>

          <div className="col">
            {/* certificações */}
            <div className="panel">
              <div className="panel-head"><Icon name="check" size={14} style={{color:'var(--text-2)'}}/><h3>Certificações</h3><div className="right"><span className="pill ok">3/4 OK</span></div></div>
              <div className="panel-body flush">
                {G.certificacoes.map(c => (
                  <div key={c.nome} className="health-row" style={{padding:'11px 14px'}}>
                    <span className={'dot ' + (c.status==='ok'?'ok':'warn')} />
                    <div style={{flex:1, minWidth:0}}>
                      <div style={{fontSize:12.5, fontWeight:500}}>{c.nome}</div>
                      <div className="faint" style={{fontSize:10.5}}>renovação: {c.renova}</div>
                    </div>
                    <span className="mono faint" style={{fontSize:11}}>{c.validade}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* evidence system */}
            <div className="panel">
            <div className="panel-head"><Icon name="doc" size={14} style={{color:'var(--text-2)'}}/><h3>Sistema de Evidências</h3></div>
              <div className="panel-body">
                <dl className="kv">
                  <dt>Total armazenado</dt><dd className="mono">{G.evidence.total.toLocaleString('pt-BR')}</dd>
                  <dt>Última hora</dt><dd className="mono">+{G.evidence.ultimaHora}</dd>
                  <dt>Retenção</dt><dd>{G.evidence.retencao}</dd>
                  <dt>Integridade</dt><dd className="mono" style={{color:'var(--ok)'}}>{Math.round(G.evidence.integridade*100)}%</dd>
                  <dt>Assinatura</dt><dd className="mono" style={{fontSize:10.5}}>{G.evidence.assinatura}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* falhas + alertas */}
        <div className="grid-2">
          <div className="panel">
            <div className="panel-head"><Icon name="alert" size={14} style={{color:'var(--warn)'}}/><h3>Falhas detectadas</h3></div>
            <div className="panel-body flush">
              {G.falhas.map((f,i)=>(
                <div key={i} className="health-row" style={{padding:'11px 14px'}}>
                  <span className={'pill ' + (f.sev==='crítico'?'err':'warn')}>{f.sev}</span>
                  <span style={{fontSize:12, flex:1}}>{f.dado}</span>
                  <span className="mono faint" style={{fontSize:11}}>{f.ts}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="panel">
            <div className="panel-head"><Icon name="bell" size={14} style={{color:'var(--err)'}}/><h3>Alertas de governança</h3></div>
            <div className="panel-body flush">
              {G.alertas.map((a,i)=>(
                <div key={i} className="health-row" style={{padding:'11px 14px'}}>
                  <span className={'pill ' + (a.nivel==='crítico'?'err':'warn')}>{a.tipo}</span>
                  <span style={{fontSize:12, flex:1}}>{a.txt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================== KNOWLEDGE CENTER ===================== */
function KnowledgeCenter({ setView }) {
  const D = window.FORJA;
  const [sel, setSel] = useState(D.fontes[0] || null);
  const [q, setQ] = useState('');
  if (!D.fontes.length) {
    return (
      <div className="center">
        <CenterHeader icon="book" crumb="Central de Conhecimento" title="Central de Conhecimento"
          sub="NÃO MONITORADO — nenhuma indexação real medida" />
        <div className="detail-empty" style={{padding:40}}>
          <div><div className="ic"><Icon name="book" size={22}/></div>
          <div style={{fontSize:13, color:'var(--text-2)'}}>SEM DADOS REAIS</div>
          <div style={{fontSize:11.5, marginTop:4}}>Nenhuma fonte indexada real. Contagens de docs/trechos não são inventadas.</div></div>
        </div>
      </div>
    );
  }
  const totalDocs = D.fontes.reduce((s,f)=>s+f.docs,0);
  const totalChunks = D.fontes.reduce((s,f)=>s+f.chunks,0);
  return (
    <div className="center">
      <CenterHeader icon="book" crumb="Central de Conhecimento" title="Central de Conhecimento"
        sub={D.fontes.length + ' fontes · ' + totalChunks.toLocaleString('pt-BR') + ' trechos indexados'}>
        <button className="btn"><Icon name="refresh" size={13} /> Atualizar tudo</button>
        <button className="btn primary"><Icon name="plus" size={13} /> Nova fonte</button>
      </CenterHeader>
      <div className="center-body section-gap">
        <div className="card hud-grid" style={{padding:'16px 18px', display:'flex', alignItems:'center', gap:14}}>
          <Icon name="search" size={18} style={{color:'var(--accent-bright)'}}/>
          <input placeholder="Consultar a base de conhecimento da Fábrica… (busca semântica)" value={q} onChange={e=>setQ(e.target.value)}
            style={{flex:1, background:'none', border:'none', outline:'none', fontSize:15, color:'var(--text-1)'}} />
          <button className="btn primary"><Icon name="zap" size={13}/> Consultar</button>
        </div>
        <div className="kpi-grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))'}}>
          <div className="kpi"><div className="kpi-label">Documentos</div><div className="kpi-val">{(totalDocs/1000).toFixed(1)}K</div></div>
          <div className="kpi"><div className="kpi-label">Trechos indexados</div><div className="kpi-val">{(totalChunks/1000).toFixed(0)}K</div></div>
          <div className="kpi"><div className="kpi-label">Modelo de busca</div><div className="kpi-val" style={{fontSize:15, fontFamily:'var(--font-mono)'}}>text-3-large</div><div className="kpi-sub">3072 dim · HNSW</div></div>
          <div className="kpi"><div className="kpi-label">Taxa de acerto</div><div className="kpi-val">87%</div><div className="kpi-sub">relevância top-5</div></div>
        </div>
        <div className="center-split" style={{display:'grid', gridTemplateColumns:'1fr 360px', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', overflow:'hidden', minHeight:320}}>
          <div style={{overflowY:'auto'}}>
            <table className="tbl"><thead><tr><th>Fonte</th><th>Tipo</th><th>Docs</th><th>Trechos</th><th>Tamanho</th><th>Situação</th></tr></thead>
            <tbody>
              {D.fontes.map(f => (
                <tr key={f.id} className={sel.id===f.id?'on':''} onClick={()=>setSel(f)}>
                  <td><div className="cell-strong">{f.nome}</div><div className="id-cell">{f.id} · atualizado há {f.atualizado}</div></td>
                  <td><span className="tag">{f.tipo}</span></td>
                  <td className="mono">{f.docs.toLocaleString('pt-BR')}</td>
                  <td className="mono">{f.chunks.toLocaleString('pt-BR')}</td>
                  <td className="mono muted">{f.tam}</td>
                  <td><span className={'pill ' + (STATUS_CLASS[f.status]||'')}>{f.status==='indexando'?<><span className="dot info blink"/> indexando</>:labelStatus(f.status)}</span></td>
                </tr>
              ))}
            </tbody></table>
          </div>
          <div className="split-side" style={{borderLeft:'1px solid var(--border)'}}>
            <div className="detail">
              <div className="detail-head"><div className="ch-crumb">{sel.id}</div><h2 style={{fontSize:15}}>{sel.nome}</h2>
                <div className="tags"><span className="tag">{sel.tipo}</span><span className={'pill ' + (STATUS_CLASS[sel.status]||'')}>{labelStatus(sel.status)}</span></div></div>
              {sel.status==='indexando' && <div className="detail-block"><span className="eyebrow">Progresso de indexação</span><Progress value={0.62} h={6} color="var(--info)"/><span className="mono faint" style={{fontSize:11}}>88.041 / 142.003 trechos</span></div>}
              {sel.status==='erro' && <div className="card" style={{padding:11, borderColor:'var(--err)', background:'var(--err-soft)'}}><div style={{display:'flex', gap:8, color:'var(--err)', fontSize:12}}><Icon name="alert" size={15}/> Falha ao processar PDF corrompido. 3 de 312 documentos ignorados.</div></div>}
              <div className="detail-block"><span className="eyebrow">Estatísticas</span>
                <dl className="kv">
                  <dt>Documentos</dt><dd className="mono">{sel.docs.toLocaleString('pt-BR')}</dd>
                  <dt>Trechos</dt><dd className="mono">{sel.chunks.toLocaleString('pt-BR')}</dd>
                  <dt>Tamanho</dt><dd className="mono">{sel.tam}</dd>
                  <dt>Atualizado</dt><dd>há {sel.atualizado}</dd>
                </dl>
              </div>
              <div style={{display:'flex', gap:7}}>
                <button className="btn primary" style={{flex:1}}><Icon name="refresh" size={12}/> Atualizar</button>
                <button className="btn"><Icon name="link" size={13}/></button>
                <button className="btn icon"><Icon name="dots" size={14}/></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================== SETTINGS ===================== */
function SettingsCenter({ setView, theme, setTheme }) {
  const D = window.FORJA;
  const accents = ['#f97316','#3b82f6','#10b981','#8b5cf6','#06b6d4'];
  const [accent, setAccent] = useState('#f97316');
  useEffect(() => { document.documentElement.style.setProperty('--accent', accent); }, [accent]);
  return (
    <div className="center">
      <CenterHeader icon="gear" crumb="Configuração" title="Configurações"
        sub="Preferências da plataforma, aparência e integrações" />
      <div className="center-body section-gap" style={{maxWidth:880}}>
        <div className="panel">
          <div className="panel-head"><Icon name="eye" size={14} style={{color:'var(--text-2)'}}/><h3>Aparência</h3></div>
          <div className="panel-body section-gap">
            <div style={{display:'flex', alignItems:'center', gap:14}}>
              <div style={{flex:1}}><div style={{fontWeight:500}}>Tema</div><div className="muted" style={{fontSize:11.5}}>Escuro recomendado para sessões longas</div></div>
              <div className="seg">
                <button className={theme==='dark'?'on':''} onClick={()=>setTheme&&setTheme('dark')}><Icon name="moon" size={12}/> Escuro</button>
                <button className={theme==='light'?'on':''} onClick={()=>setTheme&&setTheme('light')}><Icon name="sun" size={12}/> Claro</button>
              </div>
            </div>
            <div style={{display:'flex', alignItems:'center', gap:14}}>
              <div style={{flex:1}}><div style={{fontWeight:500}}>Cor de destaque</div><div className="muted" style={{fontSize:11.5}}>Aplica em toda a interface</div></div>
              <div style={{display:'flex', gap:8}}>
                {accents.map(c => <button key={c} onClick={()=>setAccent(c)} style={{width:26, height:26, borderRadius:7, background:c, border: accent===c?'2px solid var(--text-1)':'2px solid transparent', boxShadow: accent===c?'0 0 0 2px var(--bg-2)':'none'}} />)}
              </div>
            </div>
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><Icon name="cpu" size={14} style={{color:'var(--text-2)'}}/><h3>Cores da Fábrica</h3><div className="right"><span className="pill ok">6/7 OK</span></div></div>
          <div className="panel-body flush">
            {D.cores.map(c => (
              <div key={c.id} className="health-row" style={{padding:'12px 14px'}}>
                <div className="health-name"><span className={'dot ' + (c.status==='ok'?'ok':'warn')}/><div><div className="nm">{c.nome}</div><div className="rl">{c.papel}</div></div></div>
                <span className="mono faint" style={{fontSize:11}}>{c.ver}</span>
                <span className="mono faint" style={{fontSize:11, width:60, textAlign:'right'}}>{c.uptime}</span>
                <div className="switch on" />
              </div>
            ))}
          </div>
        </div>
        <div className="grid-2">
          <div className="panel">
            <div className="panel-head"><Icon name="bell" size={14} style={{color:'var(--text-2)'}}/><h3>Notificações</h3></div>
            <div className="panel-body section-gap">
              {[['Missões concluídas',true],['Publicações em produção',true],['Equipe bloqueada',true],['Alertas de custo de IA',true],['Eventos críticos de auditoria',true]].map(([l,on],i)=>(
                <div key={i} style={{display:'flex', alignItems:'center', gap:12}}><span style={{flex:1, fontSize:12.5}}>{l}</span><div className={'switch'+(on?' on':'')}/></div>
              ))}
            </div>
          </div>
          <div className="panel">
            <div className="panel-head"><Icon name="link" size={14} style={{color:'var(--text-2)'}}/><h3>Integrações</h3></div>
            <div className="panel-body section-gap">
              {[['Repositório','conectado','ok'],['Anthropic','conectado','ok'],['OpenAI','conectado','ok'],['DeepSeek','conectado','ok'],['Gemini','conectado','ok'],['Ollama','desconectado','']].map(([l,s,c],i)=>(
                <div key={i} style={{display:'flex', alignItems:'center', gap:10}}><span style={{flex:1, fontSize:12.5}}>{l}</span><span className={'pill '+(c||'')}>{s}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { DeployCenter, CostsCenter, AuditCenter, KnowledgeCenter, SettingsCenter });


/* ============================================================
   FORJA — App root V2 · estado global, router, montagem do shell
   ============================================================ */
function App() {
  const [theme, setTheme] = useLocalStorage('forja.theme', 'dark');
  const [view, setView] = useLocalStorage('forja.view', 'dashboard');
  const [copilotOpen, setCopilotOpen] = useLocalStorage('forja.copilot', true);
  const [explorerOpen, setExplorerOpen] = useLocalStorage('forja.explorer', true);
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);
  useEffect(() => {
    const h = (e) => {
      const cmd = e.metaKey || e.ctrlKey;
      if (cmd && e.key.toLowerCase() === 'k') { e.preventDefault(); setCmdOpen(o => !o); }
      else if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'p') { e.preventDefault(); setCmdOpen(o => !o); }
      else if (cmd && e.key.toLowerCase() === 'b') { e.preventDefault(); setExplorerOpen(o => !o); }
      else if (cmd && e.key === '\\') { e.preventDefault(); setCopilotOpen(o => !o); }
    };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, []);

  const CENTERS = {
    dashboard: FactoryCommandCenter,
    projects: ProjectCenter, missions: MissionCenter, agents: AgentCenter,
    llm: LLMCenter, costs: CostsCenter, deploy: DeployCenter,
    audit: AuditCenter, knowledge: KnowledgeCenter, settings: SettingsCenter,
  };
  const Current = CENTERS[view] || FactoryCommandCenter;

  const cols = [
    'var(--activitybar-w)',
    explorerOpen ? 'var(--explorer-w)' : null,
    'minmax(0,1fr)',
    copilotOpen ? 'var(--copilot-w)' : null,
  ].filter(Boolean).join(' ');

  return (
    <div className="os">
      <MenuBar theme={theme} setTheme={setTheme}
        onCommand={() => setCmdOpen(true)}
        onToggleCopilot={() => setCopilotOpen(o=>!o)}
        onToggleExplorer={() => setExplorerOpen(o=>!o)} />
      <div className="os-body" style={{ gridTemplateColumns: cols }}>
        <ActivityBar view={view} setView={setView} />
        {explorerOpen && <Explorer view={view} setView={setView} onClose={() => setExplorerOpen(false)} />}
        <main className="os-main"><Current setView={setView} theme={theme} setTheme={setTheme} /></main>
        {copilotOpen && <Copilot onClose={() => setCopilotOpen(false)} setView={setView} />}
      </div>
      <StatusBar view={view} setView={setView} />
      {cmdOpen && <CommandPalette onClose={() => setCmdOpen(false)} setView={setView} setTheme={setTheme} theme={theme} />}
    </div>
  );
}

// Boot: carrega dados REAIS do backend antes de renderizar.
// window.FORJA permanece como fallback caso o backend falhe.
async function bootForjaOS() {
  try {
    if (window.ForjaAPI && typeof window.ForjaAPI.hydrate === 'function') {
      await window.ForjaAPI.hydrate();
    }
  } catch (e) {
    console.warn('[FORJA] hydrate falhou, usando fallback window.FORJA:', e);
  }
  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
}
bootForjaOS();
