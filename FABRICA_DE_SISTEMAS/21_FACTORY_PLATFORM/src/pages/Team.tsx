import { useEffect, useState } from 'react';
import { factoryApi, type Agent } from '../services/api';
import { Users, Bot } from 'lucide-react';

const Team = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    factoryApi.getAgents()
      .then(res => setAgents(res.agents || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse p-4">Buscando equipe de agentes...</div>;

  return (
    <div className="animate-fade-in flex-col gap-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Users className="text-status-info" />
            Equipe Autônoma
          </h1>
          <p className="text-muted">Roster de Agentes operacionais na Factory Engine.</p>
        </div>
      </div>

      {agents.length === 0 ? (
        <div className="glass-card p-8 text-center text-muted no-data">
          DADO NÃO DISPONÍVEL
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div key={agent.id} className="glass-card p-6 flex-col items-center text-center gap-4 hover:border-status-info">
              <div className="w-16 h-16 rounded-full bg-[var(--bg-primary)] flex items-center justify-center border border-[var(--border-glass)] shadow-lg shadow-[var(--accent-glow)]">
                <Bot size={32} className="text-status-info" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{agent.role || 'ROLE DESCONHECIDA'}</h3>
                <p className="text-xs text-muted mt-1">ID: {agent.id}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full mt-2 font-bold
                  ${agent.status === 'IDLE' ? 'bg-[var(--border-glass)] text-white' : ''}
                  ${agent.status === 'WORKING' ? 'bg-[var(--status-info)] text-black' : ''}
                  ${agent.status === 'ERROR' ? 'bg-[var(--status-error)] text-white' : ''}
                  ${!['IDLE', 'WORKING', 'ERROR'].includes(agent.status) ? 'bg-[var(--bg-primary)] text-muted' : ''}
                `}>
                {agent.status || 'UNKNOWN'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Team;
