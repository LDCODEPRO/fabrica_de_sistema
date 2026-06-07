import { useEffect, useState } from 'react';
import { factoryApi } from '../services/api';
import { Cpu, Server, Activity } from 'lucide-react';

const LlmHub = () => {
  const [llms, setLlms] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    factoryApi.getLlmStatus()
      .then(setLlms)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse p-4">Verificando LLMs...</div>;

  const entries = Object.entries(llms || {});

  return (
    <div className="animate-fade-in flex-col gap-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Cpu className="text-accent-secondary" />
            Central de IA (LLM Router)
          </h1>
          <p className="text-muted">Provedores de Inteligência Artificial conectados.</p>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="glass-card p-8 text-center text-muted no-data">
          DADO NÃO DISPONÍVEL
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {entries.map(([name, status]) => (
            <div key={name} className="glass-card p-6 flex justify-between items-center group">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${status === 'ONLINE' ? 'bg-[rgba(16,185,129,0.1)] text-status-success' : 'bg-[var(--bg-primary)] text-muted'}`}>
                  <Server size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold group-hover:text-accent-secondary transition-colors">{name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Activity size={14} className={status === 'ONLINE' ? 'text-status-success' : 'text-status-error'} />
                    <span className="text-xs text-muted font-mono">{status}</span>
                  </div>
                </div>
              </div>
              <div className={`w-3 h-3 rounded-full ${status === 'ONLINE' ? 'bg-status-success shadow-[0_0_10px_var(--status-success)]' : 'bg-status-error'}`}></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LlmHub;
