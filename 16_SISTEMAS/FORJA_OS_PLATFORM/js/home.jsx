/* ============================================================
   A FÁBRICA — Home / FORJA · Workspace (estilo Cursor/VS Code)
   Chat central (agente + LLM) · Preview · Arquivos · Terminal
   ============================================================ */

function FileTree({ nodes, depth = 0 }) {
  const [open, setOpen] = useState(() => {
    const o = {}; (function walk(ns){ ns.forEach(n=>{ if(n.tipo==='dir'){o[n.nome]=depth<1; if(n.filhos) walk(n.filhos);} }); })(nodes);
    return o;
  });
  return (
    <div className="ftree">
      {nodes.map((n, i) => n.tipo === 'dir' ? (
        <div key={i}>
          <button className="ftree-row" style={{paddingLeft: 8 + depth*12}} onClick={()=>setOpen(o=>({...o,[n.nome]:!o[n.nome]}))}>
            <Icon name="chevR" size={11} style={{transform:open[n.nome]?'rotate(90deg)':'none', transition:'transform .12s', color:'var(--text-3)'}}/>
            <Icon name="folder" size={13} style={{color:'var(--accent-bright)'}}/>
            <span>{n.nome}</span>
          </button>
          {open[n.nome] && n.filhos && <FileTree nodes={n.filhos} depth={depth+1} />}
        </div>
      ) : (
        <button key={i} className="ftree-row file" style={{paddingLeft: 8 + depth*12 + 16}}>
          <Icon name="file" size={12} style={{color:'var(--text-3)'}}/>
          <span>{n.nome}</span>
          <span className="ftree-ext">{n.tipo}</span>
        </button>
      ))}
    </div>
  );
}

/* Árvore de arquivos REAIS do repositório (lazy via /api/files) */
function RealFiles() {
  const [data, setData] = useState({});   // path -> items[]
  const [open, setOpen] = useState({ '': true });
  const apiOn = !!(window.ForjaAPI && window.ForjaAPI.listFiles);

  const load = async (path) => {
    if (data[path] || !apiOn) return;
    try { const r = await window.ForjaAPI.listFiles(path); setData(d => ({ ...d, [path]: r.items || [] })); }
    catch { setData(d => ({ ...d, [path]: [] })); }
  };
  useEffect(() => { load(''); }, []);

  const toggle = (path) => { setOpen(o => ({ ...o, [path]: !o[path] })); load(path); };

  const renderLevel = (path, depth) => {
    const items = data[path];
    if (items == null) return <div className="faint" style={{padding:'6px 10px',fontSize:11}}>carregando…</div>;
    if (!items.length) return <div className="faint" style={{padding:'6px 10px',fontSize:11}}>vazio</div>;
    return items.map(it => it.tipo === 'dir' ? (
      <div key={it.path}>
        <button className="ftree-row" style={{paddingLeft:8+depth*12}} onClick={()=>toggle(it.path)}>
          <Icon name="chevR" size={11} style={{transform:open[it.path]?'rotate(90deg)':'none', transition:'transform .12s', color:'var(--text-3)'}}/>
          <Icon name="folder" size={13} style={{color:'var(--accent-bright)'}}/>
          <span>{it.nome}</span>
        </button>
        {open[it.path] && <div>{renderLevel(it.path, depth+1)}</div>}
      </div>
    ) : (
      <div key={it.path} className="ftree-row file" style={{paddingLeft:8+depth*12+16}}>
        <Icon name="file" size={12} style={{color:'var(--text-3)'}}/>
        <span>{it.nome}</span>
        <span className="ftree-ext">{it.tipo}</span>
      </div>
    ));
  };

  if (!apiOn) return <div className="faint" style={{padding:10,fontSize:11.5}}>Backend offline — arquivos reais indisponíveis.</div>;
  return <div className="ftree">{renderLevel('', 0)}</div>;
}

function HomeWorkspace({ setView }) {
  const D = window.FORJA;
  const teams = D.equipes || [];
  const [team, setTeam] = useLocalStorage('forja.ws.team', 'orquestrador');
  const [llm, setLLM] = useLocalStorage('forja.ws.llm', 'auto');
  const [sessionId, setSessionId] = useLocalStorage('forja.ws.session', '');
  const [msgs, setMsgs] = useState([]);   // sem seed fake — começa vazio (Zero Ghost)
  const [draft, setDraft] = useState('');
  const [pane, setPane] = useState('preview'); // preview | arquivos | terminal
  const [chatStatus, setChatStatus] = useState({ online: null, status_text: 'Verificando...', available: [] });
  const bodyRef = useRef(null);
  const teamObj = teams.find(t=>t.id===team) || teams[0] || {};
  const llmIds = (D.llms || []).map(l=>l.id);
  const llmSel = (llm && llmIds.includes(llm)) ? llm : 'auto';   // migra valores antigos (ex.: 'gemini')
  const llmObj = (D.llms || []).find(l=>l.id===llmSel) || {};

  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [msgs]);

  // Health check real ao montar e a cada 60s
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/chat/status');
        if (res.ok) {
          const data = await res.json();
          setChatStatus(data);
        } else {
          setChatStatus({ online: false, status_text: 'Backend indisponível', available: [] });
        }
      } catch {
        setChatStatus({ online: false, status_text: 'Sem conexão com o servidor', available: [] });
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  // Garante session_id e carrega o histórico real da conversa (memória)
  useEffect(() => {
    let sid = sessionId;
    if (!sid) { sid = 'sess-' + Math.random().toString(36).slice(2) + '-' + Date.now().toString(36); setSessionId(sid); }
    if (window.ForjaAPI && window.ForjaAPI.getChatSession) {
      window.ForjaAPI.getChatSession(sid).then(s => {
        if (s && Array.isArray(s.messages) && s.messages.length) {
          setMsgs(s.messages.map(mm => ({
            de: mm.sender === 'USER' ? 'voce' : (mm.sender === 'system' ? 'sistema' : (mm.sender || 'sistema')),
            txt: mm.content,
            provider: mm.provider_key || undefined,
          })));
        }
      });
    }
  }, []);

  const novaConversa = () => {
    const sid = 'sess-' + Math.random().toString(36).slice(2) + '-' + Date.now().toString(36);
    setSessionId(sid); setMsgs([]);
  };

  const send = async () => {
    const t = draft.trim(); if (!t) return;
    setMsgs(m => [...m, { de:'voce', txt:t }]);
    setDraft('');

    // Mostra loading
    const loadingId = Date.now();
    setMsgs(m => [...m, { id: loadingId, de:'sistema', preview:true, loading:true, txt:'Processando pelo ' + (teamObj.nome || 'agente') + '...' }]);

    try {
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId || undefined, message: t, agent_key: team, agent_name: teamObj.nome, provider: (llmSel === 'auto' ? undefined : llmSel) })
      });
      const data = await res.json();
      if (res.ok && data.session_id && data.session_id !== sessionId) setSessionId(data.session_id);
      
      if (!res.ok) {
        setMsgs(m => {
          const withoutLoading = m.filter(msg => msg.id !== loadingId);
          return [...withoutLoading, { de:'sistema', preview:true, error:true, txt: data.detail || 'Erro ' + res.status + ' — verifique os providers.' }];
        });
        return;
      }

      setMsgs(m => {
        const withoutLoading = m.filter(msg => msg.id !== loadingId);
        return [...withoutLoading, {
          de: data.agent,
          preview: false,
          txt: data.message,
          provider: data.provider_used
        }];
      });
    } catch (err) {
      setMsgs(m => {
        const withoutLoading = m.filter(msg => msg.id !== loadingId);
        return [...withoutLoading, { de:'sistema', preview:true, error:true, txt: 'Erro de rede ao conectar com o backend.' }];
      });
    }
  };

  // MODO AGÊNTICO: o agente raciocina (ReAct) e usa ferramentas reais
  const agir = async () => {
    const t = draft.trim(); if (!t) return;
    if (!window.ForjaAPI || !window.ForjaAPI.actAgent) { return; }
    setMsgs(m => [...m, { de:'voce', txt:t }]);
    setDraft('');
    const loadingId = Date.now();
    setMsgs(m => [...m, { id: loadingId, de:'sistema', preview:true, loading:true, txt:'Agente agindo (raciocinando e usando ferramentas)…' }]);
    try {
      const data = await window.ForjaAPI.actAgent(team, t);
      setMsgs(m => {
        const without = m.filter(x => x.id !== loadingId);
        return [...without, {
          de: team, preview:false,
          txt: data.result || ('(' + (data.status || 'sem resposta') + ')'),
          provider: 'agêntico',
          steps: data.log || [],
          agentStatus: data.status,
        }];
      });
    } catch (err) {
      setMsgs(m => {
        const without = m.filter(x => x.id !== loadingId);
        return [...without, { de:'sistema', preview:true, error:true, txt: 'Falha na ação agêntica: ' + err.message }];
      });
    }
  };

  // Indicador visual baseado no status real
  const statusColor = chatStatus.online === null ? 'var(--warn)' : chatStatus.online ? 'var(--ok)' : 'var(--err, #e55)';
  const statusDotClass = chatStatus.online === null ? 'pulse' : '';

  return (
    <div className="ws">
      {/* faixa de contexto / instruções */}
      <div className="ws-context hud-grid">
        <div className="ws-ctx-left">
          <span className="ch-icon" style={{width:30,height:30}}><Icon name="flame" size={16}/></span>
          <div>
            <div className="ch-crumb">A FÁBRICA · WORKSPACE</div>
            <div style={{display:'flex',alignItems:'center',gap:9}}>
              <h1 style={{fontFamily:'var(--font-display)',fontSize:16,fontWeight:600,margin:0}}>Home / FORJA</h1>
              <StatusPill status="IMPL" size="sm" />
            </div>
          </div>
        </div>
        <div className="ws-ctx-right">
          <span className="pill"><Icon name="git" size={11}/> fabrica · main</span>
          <span className="pill"><Icon name="target" size={11}/> nenhuma missão ativa</span>
          <button className="btn sm" onClick={()=>setView('missoes')}><Icon name="plus" size={12}/> Nova missão</button>
        </div>
      </div>

      {/* corpo: chat (esq) + painel (dir) */}
      <div className="ws-body">
        {/* CHAT operacional */}
        <section className="ws-chat">
          <div className="ws-chat-head">
            <Icon name="chat" size={14} style={{color:'var(--accent-bright)'}}/>
            <span style={{fontWeight:600,fontSize:13}}>Chat operacional</span>
            <button className="btn ghost sm" style={{marginLeft:'auto'}} onClick={novaConversa} title="Limpar e iniciar nova conversa"><Icon name="plus" size={12}/> Nova conversa</button>
            <span className="pill"><span className={'zg-dot ' + statusDotClass} style={{background: statusColor}}/> {chatStatus.status_text}</span>
          </div>

          <div className="ws-chat-body scroll-y" ref={bodyRef}>
            {msgs.map((m,i)=>(
              <div key={i} className={'cp-msg ' + (m.de==='voce'?'me':'ag')}>
                {m.de!=='voce' && (
                  <div className="cp-msg-who">
                    <Icon name={m.preview?'eye':'flame'} size={12}/> 
                    {m.de==='sistema'?'Fábrica':(teams.find(x=>x.id===m.de)?.nome || m.de)} 
                    {m.preview && <span className="pill" style={{padding:'0 6px'}}>preview</span>}
                    {m.provider && <span className="pill" style={{padding:'0 6px', marginLeft: 4, background:'var(--panel-2)', color:'var(--text-3)'}}>via {m.provider}</span>}
                  </div>
                )}
                <div className={'cp-bubble' + (m.preview?' preview':'') + (m.loading?' pulse':'')}>{m.txt}</div>
                {m.steps && m.steps.length > 0 && (
                  <details style={{marginTop:6}}>
                    <summary style={{cursor:'pointer', fontSize:11, color:'var(--text-3)'}}>
                      <Icon name="terminal" size={11}/> {m.steps.length} passo(s) do agente {m.agentStatus ? ('· ' + m.agentStatus) : ''}
                    </summary>
                    <div className="term" style={{marginTop:6, maxHeight:260, overflow:'auto'}}>
                      {m.steps.map((s,si)=>(
                        <div key={si} className="ln"><span className="t">{si+1}</span><span className="lv-info" style={{whiteSpace:'pre-wrap'}}>{String(s).slice(0,600)}</span></div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            ))}
          </div>

          <div className="ws-compose">
            <div className="ws-selectors">
              <label className="ws-sel">
                <span className="ws-sel-lb"><Icon name="users" size={11}/> Equipe</span>
                <select value={team} onChange={e=>setTeam(e.target.value)}>
                  {teams.map(t=><option key={t.id} value={t.id}>{t.nome}</option>)}
                </select>
              </label>
              <label className="ws-sel">
                <span className="ws-sel-lb"><Icon name="zap" size={11}/> Modelo</span>
                <select value={llmSel} onChange={e=>setLLM(e.target.value)}>
                  <option value="auto">Automático (recomendado)</option>
                  {(D.llms || []).map(l=><option key={l.id} value={l.id}>{l.provider || l.nome || l.id} · {l.ativo?'online':'fora'}</option>)}
                </select>
              </label>
            </div>
            <div className="ws-input">
              <textarea rows={2} placeholder="Converse ou instrua… (Enter conversa · Shift+Enter nova linha · botão Agir = modo agêntico)" value={draft}
                onChange={e=>setDraft(e.target.value)}
                onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();} }} />
              <button className="btn" onClick={agir} disabled={!draft.trim()} title="Agir: o agente raciocina e usa ferramentas reais"><Icon name="zap" size={13}/> Agir</button>
              <button className="btn primary icon" onClick={send} title="Conversar (com memória e cordialidade)"><Icon name="send" size={14}/></button>
            </div>
            <div className="ws-hint">Roteia para <b>{teamObj.nome || 'Agente'}</b> via <b>{llmSel === 'auto' ? 'Automático' : (llmObj.provider || llmObj.nome || 'Automático')}</b> · <span className="faint" style={{color: statusColor}}>{chatStatus.online ? 'Pronto' : chatStatus.online === null ? 'Verificando...' : 'Offline'}</span></div>
          </div>
        </section>

        {/* PAINEL: preview / arquivos / terminal */}
        <section className="ws-panel">
          <div className="ws-tabs">
            {[['preview','Preview','eye'],['arquivos','Arquivos','folder'],['terminal','Terminal','terminal']].map(([id,lb,ic])=>(
              <button key={id} className={'ws-tab'+(pane===id?' on':'')} onClick={()=>setPane(id)}><Icon name={ic} size={12}/> {lb}</button>
            ))}
            <span style={{flex:1}}/>
            <button className="btn ghost icon sm" title="Abrir"><Icon name="link" size={13}/></button>
          </div>
          <div className="ws-panel-body">
            {pane==='preview' && (
              <div className="ws-preview-empty">
                <EmptyState icon="eye" title="Sem preview ativo"
                  status="NTEST"
                  sub="O preview do projeto/missão atual aparecerá aqui quando uma execução for iniciada. Nenhuma missão em andamento." />
              </div>
            )}
            {pane==='arquivos' && (
              <div className="ws-files scroll-y">
                <div className="ws-files-head"><span className="eyebrow">REPOSITÓRIO · arquivos reais</span><StatusPill status="IMPL" size="sm"/></div>
                <RealFiles />
              </div>
            )}
            {pane==='terminal' && (() => {
              const dash = D.dashboard || {}; const ms = dash.missions || {}; const ag = dash.agents || {};
              const onlineNames = (chatStatus.available || []).map(a=>a.label || a.id).join(', ');
              return (
              <div className="term ws-term">
                <div className="ln"><span className="t">$</span><span className="lv-acc">fabrica status</span></div>
                <div className="ln"><span className="t"> </span><span className="lv-info">backend: FastAPI · dados reais do nexus.db</span></div>
                <div className="ln"><span className="t"> </span><span className="lv-ok">missões: {ms.total || 0} · agentes: {ag.total || 0} · evidências: {(dash.evidences||{}).total || 0}</span></div>
                <div className="ln"><span className="t"> </span><span className={chatStatus.online ? 'lv-ok' : 'lv-warn'}>llms online: {chatStatus.online ? (chatStatus.available||[]).length : '—'}{onlineNames ? (' · ' + onlineNames) : ''}</span></div>
                <div className="ln"><span className="t"> </span><span className="lv-info">sessão: {sessionId || '—'}</span></div>
                <div className="ln"><span className="t">$</span><span className="lv-acc blink">_</span></div>
              </div>
              );
            })()}
          </div>
        </section>
      </div>

      {/* rodapé do workspace: evidências / alertas reais */}
      {(() => {
        const dash = D.dashboard || {}; const ms = dash.missions || {}; const byS = ms.by_status || {};
        const evid = (dash.evidences || {}).total || 0;
        const running = byS.RUNNING || 0;
        const online = (chatStatus.available || []).length;
        return (
      <div className="ws-foot">
        <div className="ws-foot-col">
          <span className="eyebrow"><Icon name="doc" size={11}/> Evidências</span>
          <span className="faint" style={{fontSize:11.5}}>{evid > 0 ? (evid + ' evidências reais no banco') : 'Nenhuma evidência ainda'} · <StatusPill status={evid>0?'IMPL':'NIMPL'} size="sm"/></span>
        </div>
        <div className="ws-foot-col">
          <span className="eyebrow"><Icon name="zap" size={11}/> LLMs</span>
          <span style={{fontSize:11.5}}>{online > 0
            ? <>{online} provedor(es) online · <button className="lnk" onClick={()=>setView('llms')}>gerenciar</button></>
            : <>nenhum online · <button className="lnk" onClick={()=>setView('llms')}>configurar</button></>}</span>
        </div>
        <div className="ws-foot-col">
          <span className="eyebrow"><Icon name="target" size={11}/> Missões</span>
          <span className="faint" style={{fontSize:11.5}}>{(ms.total||0)} no banco · {running} em execução · <button className="lnk" onClick={()=>setView('missoes')}>abrir</button></span>
        </div>
      </div>
        );
      })()}
    </div>
  );
}

Object.assign(window, { HomeWorkspace, FileTree });

