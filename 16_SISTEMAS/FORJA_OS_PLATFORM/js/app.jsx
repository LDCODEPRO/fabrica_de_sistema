/* ============================================================
   FORJA — App root V2 · estado global, router, montagem do shell
   ============================================================ */
function LoginScreen({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        throw new Error('Acesso negado. Verifique as credenciais.');
      }
      const data = await res.json();
      if (data.access_token) {
        localStorage.setItem('forja.token', data.access_token);
        onLoginSuccess();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-1)' }}>
      <form onSubmit={handleLogin} style={{ padding: '2rem', background: 'var(--bg-2)', borderRadius: '8px', border: '1px solid var(--border)', width: '320px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2 style={{ color: 'var(--text-1)', textAlign: 'center', margin: 0 }}>FORJA OS</h2>
        <p style={{ color: 'var(--text-2)', textAlign: 'center', fontSize: '0.9rem', margin: 0 }}>ACESSO RESTRITO</p>
        {error && <div style={{ color: '#ff4444', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}
        <input 
          type="text" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          placeholder="Usuário ou E-mail" 
          required
          style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-3)', color: 'var(--text-1)', border: '1px solid var(--border)', borderRadius: '4px' }} 
        />
        <input 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          placeholder="Senha" 
          required
          style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-3)', color: 'var(--text-1)', border: '1px solid var(--border)', borderRadius: '4px' }} 
        />
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.75rem', background: 'var(--accent)', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
          {loading ? 'AUTENTICANDO...' : 'ENTRAR'}
        </button>
      </form>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('forja.token'));
  const [theme, setTheme] = useLocalStorage('forja.theme', 'dark');
  const [view, setView] = useLocalStorage('forja.view', 'dashboard');
  const [copilotOpen, setCopilotOpen] = useLocalStorage('forja.copilot', true);
  const [explorerOpen, setExplorerOpen] = useLocalStorage('forja.explorer', true);
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const handleUnauthorized = () => {
      localStorage.removeItem('forja.token');
      setIsAuthenticated(false);
    };
    window.addEventListener('unauthorized', handleUnauthorized);
    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, []);

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

  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={() => {
      setIsAuthenticated(true);
      // Recarrega os dados após o login
      if (window.ForjaAPI && typeof window.ForjaAPI.hydrate === 'function') {
        window.ForjaAPI.hydrate().catch(e => console.warn('Hydrate falhou pós-login', e));
      }
    }} />;
  }

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
