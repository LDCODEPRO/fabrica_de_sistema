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
