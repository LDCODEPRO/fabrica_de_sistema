/* ============================================================
   FORJA — App root V2 · estado global, router, montagem do shell
   ============================================================ */
function App() {
  const [theme, setTheme] = useLocalStorage('forja.theme', 'dark');
  const [view, setView] = useLocalStorage('forja.view', 'dashboard');
  const [copilotOpen, setCopilotOpen] = useLocalStorage('forja.copilot', true);
  const [explorerOpen, setExplorerOpen] = useLocalStorage('forja.explorer', true);
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);
  useEffect(() => {
    const h = (e) => {
      const cmd = e.metaKey || e.ctrlKey;
      if (cmd && e.key.toLowerCase() === 'k') { e.preventDefault(); setCmdOpen(o => !o); }
      else if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'p') { e.preventDefault(); setCmdOpen(o => !o); }
      else if (cmd && e.key.toLowerCase() === 'b') { e.preventDefault(); setExplorerOpen(o => !o); }
      else if (cmd && e.key === '\\') { e.preventDefault(); setCopilotOpen(o => !o); }
    };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, []);

  const CENTERS = {
    dashboard: FactoryCommandCenter,
    projects: ProjectCenter, missions: MissionCenter, agents: AgentCenter,
    llm: LLMCenter, costs: CostsCenter, deploy: DeployCenter,
    audit: AuditCenter, knowledge: KnowledgeCenter, settings: SettingsCenter,
  };
  const Current = CENTERS[view] || FactoryCommandCenter;

  const cols = [
    'var(--activitybar-w)',
    explorerOpen ? 'var(--explorer-w)' : null,
    'minmax(0,1fr)',
    copilotOpen ? 'var(--copilot-w)' : null,
  ].filter(Boolean).join(' ');

  return (
    <div className="os">
      <MenuBar theme={theme} setTheme={setTheme}
        onCommand={() => setCmdOpen(true)}
        onToggleCopilot={() => setCopilotOpen(o=>!o)}
        onToggleExplorer={() => setExplorerOpen(o=>!o)} />
      <div className="os-body" style={{ gridTemplateColumns: cols }}>
        <ActivityBar view={view} setView={setView} />
        {explorerOpen && <Explorer view={view} setView={setView} onClose={() => setExplorerOpen(false)} />}
        <main className="os-main"><Current setView={setView} theme={theme} setTheme={setTheme} /></main>
        {copilotOpen && <Copilot onClose={() => setCopilotOpen(false)} setView={setView} />}
      </div>
      <StatusBar view={view} setView={setView} />
      {cmdOpen && <CommandPalette onClose={() => setCmdOpen(false)} setView={setView} setTheme={setTheme} theme={theme} />}
    </div>
  );
}

// Boot: carrega dados REAIS do backend antes de renderizar.
// window.FORJA permanece como fallback caso o backend falhe.
async function bootForjaOS() {
  try {
    if (window.ForjaAPI && typeof window.ForjaAPI.hydrate === 'function') {
      await window.ForjaAPI.hydrate();
    }
  } catch (e) {
    console.warn('[FORJA] hydrate falhou, usando fallback window.FORJA:', e);
  }
  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
}
bootForjaOS();
