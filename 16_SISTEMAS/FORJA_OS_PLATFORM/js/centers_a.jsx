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
