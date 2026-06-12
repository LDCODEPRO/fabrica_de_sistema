/* ============================================================
   FORJA — Shell: menu bar, activity bar, status bar
   ============================================================ */

/* Sequência objetiva do fluxo: Início → Negócio → Execução → IA/Recursos → Gestão → Plataforma */
const NAV = [
  // 1 · Início
  { id: 'home',         label: '1 · Início · Centro Executivo', short: 'Início', icon: 'home',  grupo: 'Início' },
  { id: 'forja',        label: 'FORJA · Workspace (chat/agentes)', short: 'FORJA', icon: 'flame', grupo: 'Início' },
  // 2 · Negócio: do cliente ao conteúdo
  { id: 'clientes',     label: '2 · Clientes',   short: 'Clientes',     icon: 'building', grupo: 'Negócio' },
  { id: 'projetos',     label: '3 · Projetos',   short: 'Projetos',     icon: 'folder',   grupo: 'Negócio' },
  { id: 'enviar',       label: '3.1 · Enviar projeto (upload)', short: 'Enviar', icon: 'box', grupo: 'Negócio' },
  { id: 'conteudo',     label: '4 · Conteúdo · Posts & Reels', short: 'Conteúdo', icon: 'megaphone', grupo: 'Negócio' },
  // 3 · Execução
  { id: 'missoes',      label: '5 · Missões',    short: 'Missões',      icon: 'target',   grupo: 'Execução' },
  { id: 'equipes',      label: 'Equipe Inteligente (agentes)', short: 'Equipes', icon: 'users', grupo: 'Execução' },
  { id: 'inteligencia', label: 'Inteligência de Mercado', short: 'Inteligência', icon: 'compass', grupo: 'Execução' },
  // 4 · IA & Recursos
  { id: 'llms',         label: 'IA · Provedores (LLMs)', short: 'IA',   icon: 'zap',      grupo: 'Recursos' },
  { id: 'integracoes',  label: 'Integrações da Fábrica', short: 'Integrações', icon: 'link', grupo: 'Recursos' },
  { id: 'conhecimento', label: 'Conhecimento',   short: 'Conhecimento', icon: 'book',     grupo: 'Recursos' },
  { id: 'ferramentas',  label: 'Ferramentas',    short: 'Ferramentas',  icon: 'wrench',   grupo: 'Recursos' },
  // 5 · Gestão
  { id: 'financeiro',   label: 'Financeiro',     short: 'Financeiro',   icon: 'dollar',   grupo: 'Gestão' },
  { id: 'operacoes',    label: 'Operações · Scheduler', short: 'Operações', icon: 'server', grupo: 'Gestão' },
  { id: 'auditoria',    label: 'Auditoria',      short: 'Auditoria',    icon: 'shield',   grupo: 'Gestão' },
  // 6 · Plataforma
  { id: 'roadmap',      label: 'Roadmap',        short: 'Roadmap',      icon: 'chart',    grupo: 'Plataforma' },
  { id: 'testes',       label: 'Testes',         short: 'Testes',       icon: 'flask',    grupo: 'Plataforma' },
  { id: 'validacao',    label: 'Validação',      short: 'Validação',     icon: 'award',    grupo: 'Plataforma' },
  { id: 'academia',     label: 'Academia',       short: 'Academia',     icon: 'cap',      grupo: 'Plataforma' },
  { id: 'ajuda',        label: 'Ajuda',          short: 'Ajuda',        icon: 'help',     grupo: 'Plataforma' },
];

/* ícones por grupo (para divisores na activity bar) */
const NAV_GROUPS = ['Início','Negócio','Execução','Recursos','Gestão','Plataforma'];

const MENUS = {
  'Arquivo': ['Novo projeto…', 'Nova missão…', 'Abrir projeto…', '—', 'Importar codebase', 'Exportar relatório', '—', 'Encerrar sessão'],
  'Editar': ['Desfazer', 'Refazer', '—', 'Recortar', 'Copiar', 'Colar', '—', 'Localizar…', 'Substituir…'],
  'Seleção': ['Selecionar tudo', 'Selecionar missões', 'Selecionar equipes', '—', 'Limpar seleção'],
  'Ver': ['Home / Workspace', 'Alternar copiloto', 'Alternar explorer', '—', 'Modo foco', 'Tema claro/escuro'],
  'Acessar': ['Ir para módulo…', 'Ir para equipe…', 'Ir para missão…', '—', 'Paleta de comandos ⌘K'],
  'Executar': ['Executar missão', 'Health check', 'Varredura Zero Ghost', '—', 'Reindexar conhecimento'],
  'Terminal': ['Novo terminal', 'Logs ao vivo', '—', 'Limpar console'],
  'Ajuda': ['Documentação', 'Atalhos de teclado', 'Status da plataforma', '—', 'Sobre A FÁBRICA'],
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
        <span className="mb-word">A FÁBRICA</span>
        <span className="mb-os">powered by FORJA</span>
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
                      else if (it.includes('Paleta')) onCommand();
                      else if (it.includes('copiloto')) onToggleCopilot();
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
        <span className="mono">fabrica · main</span>
        <span className="mb-dot">·</span>
        <span className="muted">Monitor 1</span>
      </div>
      <div className="mb-actions">
        <button className="mb-act" title="Paleta de comandos (⌘K)" onClick={onCommand}><Icon name="command" size={14} /></button>
        <button className="mb-act" title="Notificações"><Icon name="bell" size={14} /><span className="mb-badge">3</span></button>
        <button className="mb-act" title="Tema" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={14} />
        </button>
        <button className="mb-act" title="Explorer (⌘B)" onClick={onToggleExplorer}><Icon name="panelL" size={14} /></button>
        <button className="mb-act" title="Copiloto (⌘\)" onClick={onToggleCopilot}><Icon name="panelR" size={14} /></button>
        <div className="mb-avatar">AR</div>
      </div>
    </div>
  );
}

/* ---------------- Activity bar (nav primária, agrupada) ---------------- */
function ActivityBar({ view, setView }) {
  let lastGroup = null;
  return (
    <div className="activitybar">
      <div className="ab-group">
        {NAV.map(n => {
          const showDiv = lastGroup && n.grupo !== lastGroup;
          lastGroup = n.grupo;
          return (
            <React.Fragment key={n.id}>
              {showDiv && <div className="ab-div" />}
              <button className={'ab-btn' + (view === n.id ? ' on' : '')}
                onClick={() => setView(n.id)} title={n.label + ' · ' + n.grupo}>
                <Icon name={n.icon} size={19} stroke={view === n.id ? 2.2 : 1.8} />
                <span className="ab-tip">{n.label}</span>
              </button>
            </React.Fragment>
          );
        })}
      </div>
      <div className="ab-group">
        <button className={'ab-btn' + (view === 'configuracoes' ? ' on' : '')} onClick={() => setView('configuracoes')} title="Configurações">
          <Icon name="gear" size={20} stroke={1.8} />
          <span className="ab-tip">Configurações</span>
        </button>
      </div>
    </div>
  );
}

/* ---------------- Status bar (Zero Ghost · estado real) ---------------- */
function StatusBar({ view, setView }) {
  const D = window.FORJA;
  const impl = D.modulos.filter(m => m.status === 'IMPL' || m.status === 'CERT').length;
  const dev = D.modulos.filter(m => m.status === 'DEV' || m.status === 'PARCIAL').length;
  const [clock, setClock] = useState('');
  const [llmInfo, setLLMInfo] = useState({ online: null, count: 0 });
  useEffect(() => {
    const t = () => { const d = new Date(); setClock(d.toTimeString().slice(0,8)); };
    t(); const id = setInterval(t, 1000); return () => clearInterval(id);
  }, []);
  // Status REAL das LLMs no rodapé (Zero Ghost: nada de texto fixo)
  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch('/api/chat/status');
        if (res.ok) {
          const d = await res.json();
          setLLMInfo({ online: !!d.online, count: (d.available || []).length });
        } else setLLMInfo({ online: false, count: 0 });
      } catch { setLLMInfo({ online: false, count: 0 }); }
    };
    check(); const id = setInterval(check, 60000); return () => clearInterval(id);
  }, []);
  const llmLabel = llmInfo.online === null ? 'LLMs: verificando…'
    : llmInfo.online ? (llmInfo.count + ' LLM' + (llmInfo.count > 1 ? 's' : '') + ' online')
    : 'LLMs indisponíveis';
  return (
    <div className="statusbar">
      <div className="sb-left">
        <span className="sb-item acc"><Icon name="git" size={12} /> main</span>
        <span className="sb-svc" title="Lei Zero Ghost ativa"><span className="dot ok" /><span className="sb-svc-nm">Zero Ghost ativo</span></span>
        <span className="sb-svc"><span className="dot ok" /><span className="sb-svc-nm">{impl} impl.</span></span>
        <span className="sb-svc"><span className="dot warn" /><span className="sb-svc-nm">{dev} em desenv.</span></span>
        <span className="sb-svc"><span className="dot idle" /><span className="sb-svc-nm">{D.modulos.length} módulos</span></span>
      </div>
      <div className="sb-right">
        <span className="sb-item" onClick={()=>setView&&setView('llms')} style={{cursor:'pointer'}} title="IA · Provedores (LLMs)"><span className={'dot ' + (llmInfo.online === null ? 'idle' : llmInfo.online ? 'ok' : 'err')} style={{marginRight:4}} /><Icon name="zap" size={12}/> {llmLabel}</span>
        <span className="sb-item" onClick={()=>setView&&setView('auditoria')} style={{cursor:'pointer'}}><Icon name="shield" size={12}/> Auditoria</span>
        <span className="sb-item mono">{clock}</span>
        <span className="sb-item acc"><Icon name="flame" size={12} /> A FÁBRICA</span>
      </div>
    </div>
  );
}

Object.assign(window, { NAV, NAV_GROUPS, MENUS, MenuBar, ActivityBar, StatusBar });
