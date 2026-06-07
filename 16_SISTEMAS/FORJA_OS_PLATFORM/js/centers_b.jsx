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
