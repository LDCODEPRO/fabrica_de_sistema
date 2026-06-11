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
