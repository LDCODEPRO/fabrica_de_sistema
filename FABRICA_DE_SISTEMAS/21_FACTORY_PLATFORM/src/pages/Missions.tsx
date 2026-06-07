import { useEffect, useState } from 'react';
import { factoryApi, type Mission } from '../services/api';
import { Target, CheckCircle2, CircleDashed } from 'lucide-react';

const Missions = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    factoryApi.getMissions()
      .then(res => setMissions(res.missions || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse p-4">Buscando missões em andamento...</div>;

  return (
    <div className="animate-fade-in flex-col gap-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Target className="text-status-warning" />
            Central de Missões
          </h1>
          <p className="text-muted">Acompanhamento da execução de tarefas e missões dos agentes.</p>
        </div>
      </div>

      {missions.length === 0 ? (
        <div className="glass-card p-8 text-center text-muted no-data">
          DADO NÃO DISPONÍVEL
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {missions.map((m) => (
            <div key={m.id} className="glass-card p-6 flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">{m.goal || 'Sem Objetivo Declarado'}</h3>
                  <span className="text-xs text-muted">Missão ID: {m.id} | Projeto ID: {m.project_id}</span>
                </div>
                <span className={`text-sm px-3 py-1 rounded font-bold
                  ${m.status === 'COMPLETED' ? 'text-status-success' : 'text-status-warning'}
                `}>
                  {m.status || 'PENDING'}
                </span>
              </div>
              
              <div className="mt-4 pt-4 border-t border-[var(--border-glass)]">
                <h4 className="text-sm font-semibold mb-3 text-muted">TASKS DA MISSÃO</h4>
                {!m.tasks || m.tasks.length === 0 ? (
                  <div className="no-data">Nenhuma task vinculada (DADO NÃO DISPONÍVEL)</div>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {m.tasks.map(t => (
                      <li key={t.id} className="flex items-center gap-3 text-sm bg-[var(--bg-primary)] p-2 rounded border border-[var(--border-glass)]">
                        {t.status === 'COMPLETED' ? (
                          <CheckCircle2 size={16} className="text-status-success" />
                        ) : (
                          <CircleDashed size={16} className="text-muted animate-spin-slow" />
                        )}
                        <span>Task ID: {t.id}</span>
                        <span className="ml-auto text-xs text-muted bg-[var(--bg-secondary)] px-2 py-1 rounded">
                          {t.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Missions;
