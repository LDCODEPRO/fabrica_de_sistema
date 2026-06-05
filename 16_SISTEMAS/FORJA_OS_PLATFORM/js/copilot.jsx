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
