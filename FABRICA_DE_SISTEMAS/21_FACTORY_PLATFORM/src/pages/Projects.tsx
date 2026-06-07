import { useEffect, useState } from 'react';
import { factoryApi, type Project } from '../services/api';
import { FolderKanban } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    factoryApi.getProjects()
      .then(res => setProjects(res.projects || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse p-4">Buscando projetos...</div>;

  return (
    <div className="animate-fade-in flex-col gap-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <FolderKanban className="text-accent" />
            Projetos da Fábrica
          </h1>
          <p className="text-muted">Lista de todos os softwares e plataformas em desenvolvimento.</p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="glass-card p-8 text-center text-muted no-data">
          DADO NÃO DISPONÍVEL
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {projects.map((proj) => (
            <div key={proj.id} className="glass-card p-6 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">{proj.name || 'Sem Nome'}</h3>
                <span className="text-sm text-muted">ID: {proj.id} | Última atualização: {proj.updated_at || 'Desconhecida'}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm px-3 py-1 rounded bg-[var(--border-glass)] border border-[var(--border-glass)]">
                  Prioridade: <span className="text-white">{proj.priority || 'NORMAL'}</span>
                </span>
                <span className={`text-sm px-3 py-1 rounded font-bold
                  ${proj.status === 'ACTIVE' ? 'text-status-success' : ''}
                  ${proj.status === 'PAUSED' ? 'text-status-warning' : ''}
                  ${proj.status === 'COMPLETED' ? 'text-accent' : ''}
                `}>
                  {proj.status || 'UNKNOWN'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
