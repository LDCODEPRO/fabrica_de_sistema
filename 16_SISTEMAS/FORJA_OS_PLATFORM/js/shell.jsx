/* ============================================================
   FORJA — Shell: menu bar, activity bar, status bar
   ============================================================ */

const NAV = [
  { id: 'dashboard', label: 'Centro de Comandos', short: 'Comandos', icon: 'pulse' },
  { id: 'projects',  label: 'Projetos',           short: 'Projetos', icon: 'folder' },
  { id: 'missions',  label: 'Central de Missões', short: 'Missões', icon: 'target' },
  { id: 'agents',    label: 'Equipe Inteligente', short: 'Equipe', icon: 'cpu' },
  { id: 'llm',       label: 'Central de IA',      short: 'IA', icon: 'route' },
  { id: 'costs',     label: 'Controle de Custos', short: 'Custos', icon: 'dollar' },
  { id: 'deploy',    label: 'Central de Publicação', short: 'Publicações', icon: 'rocket' },
  { id: 'audit',     label: 'Central de Auditoria', short: 'Auditoria', icon: 'shield' },
  { id: 'knowledge', label: 'Central de Conhecimento', short: 'Conhecimento', icon: 'book' },
];

const MENUS = {
  'Arquivo': ['Novo projeto…', 'Nova missão…', 'Abrir projeto…', '—', 'Importar codebase', 'Exportar relatório', '—', 'Encerrar sessão'],
  'Editar': ['Desfazer', 'Refazer', '—', 'Recortar', 'Copiar', 'Colar', '—', 'Localizar…', 'Substituir…'],
  'Seleção': ['Selecionar tudo', 'Selecionar missões ativas', 'Selecionar agentes online', '—', 'Limpar seleção'],
  'Ver': ['Centro de comandos', 'Alternar assistente', 'Alternar explorador', '—', 'Modo foco', 'Tema claro/escuro'],
  'Acessar': ['Ir para projeto…', 'Ir para missão…', 'Ir para equipe…', '—', 'Centro de comandos ⌘K'],
  'Executar': ['Executar missão', 'Pausar toda a equipe', 'Publicar projeto…', '—', 'Atualizar conhecimento'],
  'Registros': ['Novo registro', 'Registros ao vivo', 'Fila de publicações', '—', 'Limpar registros'],
  'Ajuda': ['Documentação', 'Atalhos de teclado', 'Situação da plataforma', '—', 'Sobre a FORJA OS'],
};

/* ---------------- Top menu bar ---------------- */
function MenuBar({ theme, setTheme, onCommand, onToggleCopilot, onToggleExplorer }) {
  const [open, setOpen] = useState(null);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(null); };
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div className="menubar" ref={ref}>
      <div className="mb-brand">
        <span className="mb-mark"><Icon name="flame" size={14} /></span>
        <span className="mb-word">FORJA</span>
        <span className="mb-os">Sistema da Fábrica</span>
      </div>
      <nav className="mb-menus">
        {Object.keys(MENUS).map(m => (
          <div key={m} className="mb-item-wrap">
            <button className={'mb-item' + (open === m ? ' on' : '')}
              onMouseDown={(e) => { e.preventDefault(); setOpen(open === m ? null : m); }}
              onMouseEnter={() => open && setOpen(m)}>{m}</button>
            {open === m && (
              <div className="mb-dropdown">
                {MENUS[m].map((it, i) => it === '—'
                  ? <div key={i} className="mb-sep" />
                  : <button key={i} className="mb-opt" onClick={() => {
                      setOpen(null);
                      if (it.includes('Tema')) setTheme(theme === 'dark' ? 'light' : 'dark');
                      else if (it.includes('Centro de comandos')) onCommand();
                      else if (it.includes('assistente')) onToggleCopilot();
                    }}>
                      <span>{it}</span>
                    </button>)}
              </div>
            )}
          </div>
        ))}
      </nav>
      <div className="mb-title">
        <Icon name="git" size={12} style={{ opacity: .5 }} />
        <span className="mono">factory · main</span>
        <span className="mb-dot">·</span>
        <span className="muted">Operação diária</span>
      </div>
      <div className="mb-actions">
        <button className="mb-act" title="Centro de comandos (⌘K)" onClick={onCommand}><Icon name="command" size={14} /></button>
        <button className="mb-act" title="Notificações"><Icon name="bell" size={14} /><span className="mb-badge">3</span></button>
        <button className="mb-act" title="Tema" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={14} />
        </button>
        <button className="mb-act" title="Explorador (⌘B)" onClick={onToggleExplorer}><Icon name="panelL" size={14} /></button>
        <button className="mb-act" title="Assistente (⌘\)" onClick={onToggleCopilot}><Icon name="panelR" size={14} /></button>
        <div className="mb-avatar">AR</div>
      </div>
    </div>
  );
}

/* ---------------- Activity bar (nav primária) ---------------- */
function ActivityBar({ view, setView }) {
  return (
    <div className="activitybar">
      <div className="ab-group">
        {NAV.map(n => (
          <button key={n.id} className={'ab-btn' + (view === n.id ? ' on' : '')}
            onClick={() => setView(n.id)} title={n.label}>
            <Icon name={n.icon} size={20} stroke={view === n.id ? 2.2 : 1.8} />
            <span className="ab-tip">{n.label}</span>
          </button>
        ))}
      </div>
      <div className="ab-group">
        <button className={'ab-btn' + (view === 'settings' ? ' on' : '')} onClick={() => setView('settings')} title="Configurações">
          <Icon name="gear" size={20} stroke={1.8} />
          <span className="ab-tip">Configurações</span>
        </button>
      </div>
    </div>
  );
}

/* ---------------- Barra de estado (V2 · 8 serviços + saúde) ---------------- */
function StatusBar({ view, setView }) {
  const D = window.FORJA;
  const exec = D.missoes.filter(m => m.status === 'RUNNING').length;
  const online = D.agentes.filter(a => a.status === 'running').length;
  const [clock, setClock] = useState('');
  useEffect(() => {
    const t = () => { const d = new Date(); setClock(d.toTimeString().slice(0,8)); };
    t(); const id = setInterval(t, 1000); return () => clearInterval(id);
  }, []);
  const sCls = (s) => s==='ok'?'ok':s==='warn'?'warn':s==='err'?'err':'idle';
  return (
    <div className="statusbar">
      <div className="sb-left">
        <span className="sb-item acc"><Icon name="git" size={12} /> main</span>
        {D.services.map(s => (
          <span key={s.id} className="sb-svc" title={s.nome + ' · ' + s.ping}>
            <span className={'dot ' + sCls(s.status)} />
            <span className="sb-svc-nm">{s.nome}</span>
          </span>
        ))}
      </div>
      <div className="sb-right">
        <span className="sb-item blink-slow"><Icon name="activity" size={12}/> {exec} EM EXECUÇÃO</span>
        <span className="sb-item">{online}/{D.agentes.length} agentes</span>
        <span className="sb-item" onClick={()=>setView&&setView('costs')} style={{cursor:'pointer'}}><Icon name="dollar" size={12}/> R$ {D.custos.diario}</span>
        <span className="sb-item mono">{clock}</span>
        <span className="sb-item acc"><Icon name="flame" size={12} /> FORJA Operacional</span>
      </div>
    </div>
  );
}

Object.assign(window, { NAV, MENUS, MenuBar, ActivityBar, StatusBar });
