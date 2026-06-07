import { useState } from 'react';
import { factoryApi } from '../services/api';
import { TerminalSquare, Send, PlusCircle, Target } from 'lucide-react';

const CommandCenter = () => {
  const [projectIdea, setProjectIdea] = useState('');
  const [missionGoal, setMissionGoal] = useState('');
  const [projectId, setProjectId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectIdea) return;
    setLoading(true);
    setMessage('');
    try {
      const res = await factoryApi.createProject({
        idea: projectIdea,
        scope: "Auto-generated scope",
        objectives: "Auto-generated objectives",
        timeline: "1 week",
        technologies: ["react", "fastapi"]
      });
      setMessage(`Projeto Criado: ${res.project_id}`);
      setProjectIdea('');
    } catch (err: any) {
      setMessage(`Erro: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!missionGoal || !projectId) return;
    setLoading(true);
    setMessage('');
    try {
      const res = await factoryApi.createMission({
        project_id: projectId,
        goal: missionGoal
      });
      setMessage(`Missão Criada: ${res.mission_id}`);
      setMissionGoal('');
      setProjectId('');
    } catch (err: any) {
      setMessage(`Erro: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in flex-col gap-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <TerminalSquare className="text-accent" />
            Centro de Comandos
          </h1>
          <p className="text-muted">Ações diretas na Factory Engine (Criar Projetos e Missões).</p>
        </div>
      </div>

      {message && (
        <div className="glass-card p-4 mb-6 border-status-info text-status-info">
          {message}
        </div>
      )}

      <div className="grid grid-cols-2 gap-8">
        {/* Create Project */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <PlusCircle size={20} />
            Novo Projeto
          </h2>
          <form onSubmit={handleCreateProject} className="flex-col gap-4 flex">
            <div>
              <label className="text-sm text-muted mb-1 block">Ideia Central do Projeto</label>
              <textarea
                value={projectIdea}
                onChange={e => setProjectIdea(e.target.value)}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-glass)] text-white p-3 rounded-lg focus:outline-none focus:border-[var(--accent-primary)]"
                rows={4}
                placeholder="Ex: Uma plataforma de e-commerce de sapatos..."
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary flex justify-center items-center gap-2"
            >
              {loading ? 'Processando...' : 'Inicializar Projeto'}
              <Send size={16} />
            </button>
          </form>
        </div>

        {/* Create Mission */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Target size={20} />
            Nova Missão
          </h2>
          <form onSubmit={handleCreateMission} className="flex-col gap-4 flex">
            <div>
              <label className="text-sm text-muted mb-1 block">Project ID Alvo</label>
              <input
                type="text"
                value={projectId}
                onChange={e => setProjectId(e.target.value)}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-glass)] text-white p-3 rounded-lg focus:outline-none focus:border-[var(--accent-primary)]"
                placeholder="Ex: proj-uuid-1234"
                required
              />
            </div>
            <div>
              <label className="text-sm text-muted mb-1 block">Objetivo da Missão</label>
              <textarea
                value={missionGoal}
                onChange={e => setMissionGoal(e.target.value)}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-glass)] text-white p-3 rounded-lg focus:outline-none focus:border-[var(--accent-primary)]"
                rows={2}
                placeholder="Ex: Criar o layout da landing page..."
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary flex justify-center items-center gap-2"
            >
              {loading ? 'Processando...' : 'Despachar Missão'}
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommandCenter;
