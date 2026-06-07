import { useEffect, useState } from 'react';
import { factoryApi } from '../services/api';
import { Activity, FolderKanban, Target, DollarSign, Cpu } from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    factoryApi.getDashboard()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse p-4">Carregando painel da fábrica...</div>;
  if (!data) return <div className="no-data p-4">DADO NÃO DISPONÍVEL</div>;

  return (
    <div className="animate-fade-in flex-col gap-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Saúde da Fábrica</h1>
          <p className="text-muted">Visão geral do Factory Engine OS</p>
        </div>
        <div className="glass-card px-4 py-2 flex items-center gap-2">
          <Activity className="text-status-success" size={20} />
          <span className="font-semibold text-status-success">SISTEMA OPERACIONAL</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="glass-card p-6 flex-col gap-4">
          <div className="flex justify-between items-center text-muted">
            <span>Projetos Ativos</span>
            <FolderKanban size={20} />
          </div>
          <div className="text-4xl font-bold text-gradient">
            {data.projects?.active ?? <span className="no-data">DADO NÃO DISPONÍVEL</span>}
          </div>
        </div>
        
        <div className="glass-card p-6 flex-col gap-4">
          <div className="flex justify-between items-center text-muted">
            <span>Projetos Concluídos</span>
            <Target size={20} />
          </div>
          <div className="text-4xl font-bold text-gradient">
            {data.projects?.completed ?? <span className="no-data">DADO NÃO DISPONÍVEL</span>}
          </div>
        </div>

        <div className="glass-card p-6 flex-col gap-4">
          <div className="flex justify-between items-center text-muted">
            <span>Custos Totais (USD)</span>
            <DollarSign size={20} />
          </div>
          <div className="text-4xl font-bold text-status-warning">
            ${data.costs?.total_usd !== undefined ? Number(data.costs.total_usd).toFixed(4) : <span className="no-data">DADO NÃO DISPONÍVEL</span>}
          </div>
        </div>

        <div className="glass-card p-6 flex-col gap-4">
          <div className="flex justify-between items-center text-muted">
            <span>IAs Ativas</span>
            <Cpu size={20} />
          </div>
          <div className="text-4xl font-bold text-accent">
            {data.llms ? Object.keys(data.llms).length : <span className="no-data">DADO NÃO DISPONÍVEL</span>}
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Status por IA</h2>
      <div className="grid grid-cols-3 gap-4">
        {data.llms && Object.keys(data.llms).length > 0 ? (
          Object.entries(data.llms).map(([name, status]: [string, any]) => (
            <div key={name} className="glass-card p-4 flex justify-between items-center">
              <span className="font-semibold">{name}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${status === 'ONLINE' || status === 'ACTIVE' ? 'bg-[var(--status-success)] text-black' : 'bg-[var(--border-glass)] text-white'}`}>
                {status}
              </span>
            </div>
          ))
        ) : (
          <div className="no-data">DADO NÃO DISPONÍVEL</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
