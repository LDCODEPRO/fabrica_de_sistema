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

function HomeWorkspace({ setView }) {
  const D = window.FORJA;
  const teams = D.equipes;
  const [team, setTeam] = useLocalStorage('forja.ws.team', 'orquestrador');
  const [llm, setLLM] = useLocalStorage('forja.ws.llm', 'gemini');
  const [msgs, setMsgs] = useState(D.chatSeed);
  const [draft, setDraft] = useState('');
  const [pane, setPane] = useState('preview'); // preview | arquivos | terminal
  const bodyRef = useRef(null);
  const teamObj = teams.find(t=>t.id===team) || teams[0];
  const llmObj = D.llms.find(l=>l.id===llm) || D.llms[0];

  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [msgs]);

  const send = () => {
    const t = draft.trim(); if (!t) return;
    setMsgs(m => [...m, { de:'voce', txt:t }]);
    setDraft('');
    setTimeout(() => {
      setMsgs(m => [...m, { de:'sistema', preview:true, txt:
        `Pré-visualização da interface (Zero Ghost): a equipe "${teamObj.nome}" receberia esta instrução roteada via ${llmObj.nome}. ` +
        `Nenhum provedor LLM está configurado, então nenhuma execução real ocorre. Configure em LLMs → Configurações para ativar.` }]);
    }, 700);
  };

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
            <span className="pill" style={{marginLeft:'auto'}}><span className="zg-dot" style={{background:'var(--warn)'}}/> LLM não configurada</span>
          </div>

          <div className="ws-chat-body scroll-y" ref={bodyRef}>
            {msgs.map((m,i)=>(
              <div key={i} className={'cp-msg ' + (m.de==='voce'?'me':'ag')}>
                {m.de!=='voce' && <div className="cp-msg-who"><Icon name={m.preview?'eye':'flame'} size={12}/> {m.de==='sistema'?'Fábrica':teamObj.nome} {m.preview && <span className="pill" style={{padding:'0 6px'}}>preview</span>}</div>}
                <div className={'cp-bubble' + (m.preview?' preview':'')}>{m.txt}</div>
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
                <select value={llm} onChange={e=>setLLM(e.target.value)}>
                  {D.llms.map(l=><option key={l.id} value={l.id}>{l.nome} · não config.</option>)}
                </select>
              </label>
            </div>
            <div className="ws-input">
              <textarea rows={2} placeholder="Instrua a Fábrica… (Enter envia · Shift+Enter nova linha)" value={draft}
                onChange={e=>setDraft(e.target.value)}
                onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();} }} />
              <button className="btn primary icon" onClick={send} title="Enviar"><Icon name="send" size={14}/></button>
            </div>
            <div className="ws-hint">Roteia para <b>{teamObj.nome}</b> via <b>{llmObj.nome}</b> · <span className="faint">execução real requer LLM configurada</span></div>
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
                <div className="ws-files-head"><span className="eyebrow">PROJETO · a-fabrica</span><StatusPill status="DEV" size="sm"/></div>
                <FileTree nodes={D.arvore} />
              </div>
            )}
            {pane==='terminal' && (
              <div className="term ws-term">
                <div className="ln"><span className="t">$</span><span className="lv-acc">fabrica status</span></div>
                <div className="ln"><span className="t"> </span><span className="lv-info">plataforma: A FÁBRICA · build dev</span></div>
                <div className="ln"><span className="t"> </span><span className="lv-ok">workspace: pronto</span></div>
                <div className="ln"><span className="t"> </span><span className="lv-warn">llms: nenhuma configurada</span></div>
                <div className="ln"><span className="t"> </span><span className="lv-warn">runtime: em desenvolvimento</span></div>
                <div className="ln"><span className="t"> </span><span className="lv-info">zero-ghost: ativo · 0 violações</span></div>
                <div className="ln"><span className="t">$</span><span className="lv-acc blink">_</span></div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* rodapé do workspace: evidências / alertas reais */}
      <div className="ws-foot">
        <div className="ws-foot-col">
          <span className="eyebrow"><Icon name="doc" size={11}/> Evidências recentes</span>
          <span className="faint" style={{fontSize:11.5}}>Nenhuma evidência registrada ainda · <StatusPill status="NIMPL" size="sm"/></span>
        </div>
        <div className="ws-foot-col">
          <span className="eyebrow"><Icon name="alert" size={11}/> Alertas reais</span>
          <span style={{fontSize:11.5}}>2 itens precisam de configuração: <button className="lnk" onClick={()=>setView('llms')}>LLMs</button> · <button className="lnk" onClick={()=>setView('integracoes')}>Integrações</button></span>
        </div>
        <div className="ws-foot-col">
          <span className="eyebrow"><Icon name="target" size={11}/> Missão atual</span>
          <span className="faint" style={{fontSize:11.5}}>Nenhuma missão em andamento</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HomeWorkspace, FileTree });
