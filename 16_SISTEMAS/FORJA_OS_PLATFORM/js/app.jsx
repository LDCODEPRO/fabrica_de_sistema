/* ============================================================
   A FÁBRICA — App root · estado global, router, shell
   ============================================================ */
function App() {
  const [theme, setTheme] = useLocalStorage('forja.theme', 'dark');
  const [view, setView] = useLocalStorage('forja.view', 'home');
  const [explorerOpen, setExplorerOpen] = useLocalStorage('forja.explorer', true);
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);
  useEffect(() => {
    const h = (e) => {
      const cmd = e.metaKey || e.ctrlKey;
      if (cmd && e.key.toLowerCase() === 'k') { e.preventDefault(); setCmdOpen(o => !o); }
      else if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'p') { e.preventDefault(); setCmdOpen(o => !o); }
      else if (cmd && e.key.toLowerCase() === 'b') { e.preventDefault(); setExplorerOpen(o => !o); }
    };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, []);

  const ROUTES = {
    home: ExecutiveHome,
    forja: HomeWorkspace,
    clientes: ClientesCenter,
    projetos: ProjetosCenter,
    missoes: MissoesCenter,
    equipes: EquipesCenter,
    inteligencia: InteligenciaCenter,
    llms: LLMsCenter,
    ferramentas: FerramentasCenter,
    integracoes: IntegracoesCenter,
    conhecimento: ConhecimentoCenter,
    testes: TestesCenter,
    validacao: ValidacaoCenter,
    auditoria: AuditoriaCenter,
    operacoes: OperacoesCenter,
    financeiro: FinanceiroCenter,
    roadmap: RoadmapCenter,
    academia: AcademiaCenter,
    ajuda: AjudaCenter,
    configuracoes: ConfiguracoesCenter,
  };
  const Current = ROUTES[view] || HomeWorkspace;

  const cols = [
    'var(--activitybar-w)',
    explorerOpen ? 'var(--explorer-w)' : null,
    'minmax(0,1fr)',
  ].filter(Boolean).join(' ');

  return (
    <div className="os">
      <MenuBar theme={theme} setTheme={setTheme}
        onCommand={() => setCmdOpen(true)}
        onToggleCopilot={() => setCmdOpen(true)}
        onToggleExplorer={() => setExplorerOpen(o=>!o)} />
      <div className="os-body" style={{ gridTemplateColumns: cols }}>
        <ActivityBar view={view} setView={setView} />
        {explorerOpen && <Explorer view={view} setView={setView} onClose={() => setExplorerOpen(false)} />}
        <main className="os-main"><Current setView={setView} theme={theme} setTheme={setTheme} /></main>
      </div>
      <StatusBar view={view} setView={setView} />
      {cmdOpen && <CommandPalette onClose={() => setCmdOpen(false)} setView={setView} setTheme={setTheme} theme={theme} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
