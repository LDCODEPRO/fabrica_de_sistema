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
  // Conta vereditos pelos MÓDULOS (estado declarado), não pelo log de auditoria —
  // o log vindo da API são eventos e não tem campo "veredito" (contava 0 sempre).
  const VERED = {IMPL:'Funciona', CERT:'Funciona', DEV:'Parcial', PARCIAL:'Parcial', NTEST:'Não testado', CONFIG:'Aguardando config.', NIMPL:'Não implementado', BLOCK:'Bloqueado', ESTRUT:'Estrutura'};
  const veredCount = (v) => (D.modulos||[]).filter(m=>VERED[m.status]===v).length;
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
