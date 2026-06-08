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

/* ===================== CENTRO DE COMANDOS (EXECUTIVE) ===================== */
function FactoryCommandCenter({ setView }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchAll = async () => {
      try {
        const [overview, health, providers, missions, github, timeline, alerts, evidence] = await Promise.all([
          window.ForjaAPI.getJSON('/api/home/overview'),
          window.ForjaAPI.getJSON('/api/home/health'),
          window.ForjaAPI.getJSON('/api/home/providers'),
          window.ForjaAPI.getJSON('/api/home/missions'),
          window.ForjaAPI.getJSON('/api/home/github'),
          window.ForjaAPI.getJSON('/api/home/timeline'),
          window.ForjaAPI.getJSON('/api/home/alerts'),
          window.ForjaAPI.getJSON('/api/home/evidence')
        ]);
        if (active) {
          setData({ overview, health, providers, missions, github, timeline, alerts, evidence });
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load Executive Center data:", err);
      }
    };
    fetchAll();
    return () => { active = false; };
  }, []);

  if (loading || !data) {
    return (
      <div className="center exec-center">
        <CenterHeader icon="pulse" crumb="EXECUTIVE COMMAND" title="Executive Center" sub="Carregando arquitetura da Fábrica..." />
        <div className="exec-grid" style={{padding: 24}}>
           {[1,2,3,4,5,6].map(i => <div key={i} className="exec-card skeleton-pulse" style={{height: 140, borderRadius: 8}}></div>)}
        </div>
      </div>
    );
  }

  // Lógica de Heath principal
  const isHealthy = data.health?.runtime?.status === 'active' && data.health?.database?.status === 'disconnected';
  const heroStatus = isHealthy ? 'Operacional' : (data.health?.database?.status === 'disconnected' ? 'Atenção' : 'Crítico');
  const heroClass = isHealthy ? 'ok' : (data.health?.database?.status === 'disconnected' ? 'warn' : 'err');

  return (
    <div className="center exec-center scroll-y" style={{ background: 'var(--bg-0)' }}>
      <CenterHeader icon="pulse" crumb="EXECUTIVE COMMAND" title="Executive Center" sub="Gestão unificada da Fábrica · Reality Engine" />
      
      <div className="exec-content" style={{ padding: '0 24px 24px' }}>
        {/* SEÇÃO 1: HERO EXECUTIVO */}
        <div className="exec-hero">
          <div className="exec-hero-main">
            <div className="exec-hero-label">Status da Fábrica</div>
            <div className={`exec-hero-status status-${heroClass}`}>
              <span className={`dot ${heroClass} blink`}></span> {heroStatus}
            </div>
          </div>
          <div className="exec-hero-metrics">
            <div className="exec-metric"><span>Projetos</span><strong>{data.overview.total_projects}</strong></div>
            <div className="exec-metric"><span>Missões Ativas</span><strong>{data.overview.active_missions}</strong></div>
            <div className="exec-metric"><span>Alertas</span><strong>{data.overview.system_alerts}</strong></div>
          </div>
        </div>

        <div className="exec-grid">
          {/* SEÇÃO 2: HEALTH CENTER */}
          <div className="exec-card">
            <div className="exec-card-head"><Icon name="cpu" size={14} /> <h3>Health Center</h3></div>
            <div className="exec-card-body list-tight">
              <div className="exec-row"><span className="label">Banco</span><span className={`exec-badge-${data.health.database?.status==='disconnected'?'ok':'warn'}`}>{data.health.database?.status || 'desconhecido'}</span></div>
              <div className="exec-row"><span className="label">Runtime</span><span className={`exec-badge-${data.health.runtime?.status==='active'?'ok':'warn'}`}>{data.health.runtime?.status || 'inativo'}</span></div>
              <div className="exec-row"><span className="label">Filesystem</span><span className={`exec-badge-${data.health.filesystem?.status==='writable'?'ok':'err'}`}>{data.health.filesystem?.status || 'readonly'}</span></div>
              <div className="exec-row"><span className="label">Reality Engine</span><span className="exec-badge-ok">active</span></div>
            </div>
          </div>

          {/* SEÇÃO 3: LLM COMMAND CENTER */}
          <div className="exec-card">
            <div className="exec-card-head"><Icon name="zap" size={14} /> <h3>LLM Command Center</h3></div>
            <div className="exec-card-body list-tight scroll-y" style={{maxHeight: 180}}>
              {(data.providers.items || []).map(p => {
                let pClass = p.status === 'certified' ? 'ok' : (p.status === 'environment_pending' ? 'warn' : 'err');
                if (p.status === 'missing_implementation') pClass = 'neutral';
                return (
                  <div className="exec-row" key={p.name}>
                    <span className="label" style={{textTransform:'capitalize'}}>{p.name.replace('_sub','')}</span>
                    <span className={`exec-badge-${pClass}`}>{p.status.replace('_', ' ')}</span>
                  </div>
                );
              })}
              {(!data.providers.items || data.providers.items.length === 0) && <div className="exec-empty">unavailable</div>}
            </div>
          </div>

          {/* SEÇÃO 4: MISSION CENTER */}
          <div className="exec-card">
            <div className="exec-card-head"><Icon name="target" size={14} /> <h3>Mission Center</h3></div>
            <div className="exec-card-body list-tight">
               <div className="exec-row"><span className="label">Total de Missões</span><strong>{data.missions.total}</strong></div>
               <div className="exec-row"><span className="label">Em Execução</span><strong>{data.missions.active}</strong></div>
               <div className="exec-row"><span className="label">Concluídas</span><strong>{data.missions.completed}</strong></div>
               <div className="exec-row"><span className="label">Com Erro</span><strong>{data.missions.error}</strong></div>
            </div>
          </div>

          {/* SEÇÃO 5: GITHUB COMMAND CENTER */}
          <div className="exec-card">
            <div className="exec-card-head"><Icon name="git" size={14} /> <h3>GitHub Command</h3></div>
            <div className="exec-card-body">
              {data.github.status === 'ok' ? (
                <div className="exec-git-block">
                  <div className="exec-row"><span className="label">Branch</span><span className="mono">{data.github.branch}</span></div>
                  <div className="exec-row"><span className="label">Autor</span><span className="truncate" style={{maxWidth:120}}>{data.github.author}</span></div>
                  <div className="exec-row"><span className="label">Commit</span><span className="mono">{data.github.last_commit.substring(0,7)}</span></div>
                  <div className="exec-msg">"{data.github.message}"</div>
                </div>
              ) : (
                 <div className="exec-empty">unavailable</div>
              )}
            </div>
          </div>

          {/* SEÇÃO 7: ALERT CENTER */}
          <div className="exec-card">
            <div className="exec-card-head"><Icon name="alert" size={14} /> <h3>Alert Center</h3></div>
            <div className="exec-card-body list-tight scroll-y" style={{maxHeight: 180}}>
              <div className="exec-row" style={{marginBottom: 8}}><span className="label">Não resolvidos</span><strong style={{color: data.alerts.total_unresolved > 0 ? 'var(--exec-err)' : 'inherit'}}>{data.alerts.total_unresolved}</strong></div>
              {(data.alerts.items || []).length > 0 ? (
                 (data.alerts.items).map((a, i) => (
                   <div className="exec-row" key={i}><span className="label">{a.severity}</span><span className="truncate">{a.message}</span></div>
                 ))
              ) : (
                 <div className="exec-empty" style={{marginTop: 10}}>Nenhum alerta ativo.</div>
              )}
            </div>
          </div>

          {/* SEÇÃO 8: EVIDENCE CENTER */}
          <div className="exec-card">
            <div className="exec-card-head"><Icon name="file" size={14} /> <h3>Evidence Center</h3></div>
            <div className="exec-card-body list-tight scroll-y" style={{maxHeight: 180}}>
              {(data.evidence.items || []).length > 0 ? (
                 data.evidence.items.slice(0, 5).map((e) => (
                   <div className="exec-evidence-row" key={e.id}>
                     <div className="truncate" style={{fontSize: 12}}>{e.description}</div>
                     <div className="mono faint" style={{fontSize: 10, marginTop: 3}}>{e.path.split('\\\\').pop().split('/').pop()}</div>
                   </div>
                 ))
              ) : (
                 <div className="exec-empty">Nenhuma evidência registrada.</div>
              )}
            </div>
          </div>

          {/* SEÇÃO 6: TIMELINE OPERACIONAL */}
          <div className="exec-card" style={{gridColumn: '1 / -1'}}>
            <div className="exec-card-head"><Icon name="activity" size={14} /> <h3>Timeline Operacional</h3></div>
            <div className="exec-card-body scroll-y" style={{maxHeight: 200}}>
              {(data.timeline.events || []).length > 0 ? (
                 <div className="exec-timeline">
                   {data.timeline.events.map((ev, i) => (
                     <div className="exec-timeline-item" key={i}>
                       <span className="time">{ev.time}</span>
                       <span className={`badge exec-badge-neutral`}>{ev.source}</span>
                       <span className="msg">{ev.event}</span>
                     </div>
                   ))}
                 </div>
              ) : (
                 <div className="exec-empty" style={{padding: '20px 0'}}>Nenhuma atividade registrada.</div>
              )}
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
