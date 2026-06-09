/* ============================================================
   A FÁBRICA — Command Palette (⌘K · Ctrl+Shift+P)
   ============================================================ */

function CommandPalette({ onClose, setView, setTheme, theme }) {
  const D = window.FORJA;
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current && inputRef.current.focus(); }, []);

  const navCmds = D.modulos.map(m => ({
    sec: 'Ir para', label: m.nome, icon: m.icon, status: m.status, run: () => setView(m.id),
  }));
  const acts = [
    { sec: 'Ações', label: 'Abrir Workspace (Home)', icon: 'flame', run: () => setView('home') },
    { sec: 'Ações', label: 'Ver a verdade do sistema (Auditoria)', icon: 'shield', run: () => setView('auditoria') },
    { sec: 'Ações', label: 'Configurar provedores LLM', icon: 'zap', run: () => setView('llms') },
    { sec: 'Ações', label: 'Conectar integrações', icon: 'link', run: () => setView('integracoes') },
    { sec: 'Ações', label: 'Ver Roadmap da plataforma', icon: 'chart', run: () => setView('roadmap') },
    { sec: 'Vista', label: 'Alternar tema (claro/escuro)', icon: theme==='dark'?'sun':'moon', run: () => setTheme(theme==='dark'?'light':'dark') },
  ];
  const cmds = [...navCmds, ...acts];
  const filtered = cmds.filter(c => c.label.toLowerCase().includes(q.toLowerCase()));
  useEffect(() => { setSel(0); }, [q]);
  const exec = (c) => { c && c.run(); onClose(); };

  return (
    <div className="cmd-scrim" onMouseDown={onClose}>
      <div className="cmd-palette" onMouseDown={e => e.stopPropagation()}>
        <div className="cmd-input">
          <Icon name="search" size={16} style={{ color: 'var(--text-3)' }} />
          <input ref={inputRef} value={q} placeholder="Buscar módulo ou ação…  (⌘K · Ctrl+Shift+P)"
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
                  {c.status && <span style={{marginLeft:'auto'}}><StatusPill status={c.status} size="sm" /></span>}
                  {!c.status && i === sel && <span className="kbd" style={{marginLeft:'auto'}}>↵</span>}
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CommandPalette });
