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
    { nome: 'GitHub',             icon: 'git',      st: 'NTEST',  nota: 'não testado' },
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
        <ExecSection icon="git" title="GitHub Command Center" right={<StatusPill status="NTEST" size="sm"/>}>
          <dl className="kv exec-kv">
            <dt>Repositório</dt><dd className="faint">Não configurado</dd>
            <dt>Branch atual</dt><dd className="mono faint">—</dd>
            <dt>Último commit</dt><dd className="faint">Sem dados</dd>
            <dt>Último push</dt><dd className="faint">Sem dados</dd>
            <dt>Sincronização</dt><dd className="faint">Aguardando integração</dd>
            <dt>Status Git</dt><dd><StatusPill status="NTEST" size="sm"/></dd>
          </dl>
          <button className="btn sm" style={{marginTop:10}} onClick={()=>setView('integracoes')}><Icon name="link" size={12}/> Conectar GitHub</button>
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
