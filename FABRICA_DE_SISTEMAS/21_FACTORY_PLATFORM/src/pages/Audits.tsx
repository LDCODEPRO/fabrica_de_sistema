import { useEffect, useState } from 'react';
import { factoryApi } from '../services/api';
import { ShieldCheck, FileKey, Fingerprint } from 'lucide-react';

const Audits = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    factoryApi.getAudits()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse p-4">Carregando logs de auditoria...</div>;
  
  const audits = data?.audits || [];
  const evidences = data?.evidences || [];

  return (
    <div className="animate-fade-in flex-col gap-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <ShieldCheck className="text-status-success" />
            Auditoria e Segurança
          </h1>
          <p className="text-muted">Logs de sistema, rastreabilidade e evidências.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Audits Panel */}
        <div className="flex-col gap-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gradient">
            <Fingerprint size={20} />
            Eventos de Auditoria
          </h2>
          {audits.length === 0 ? (
            <div className="glass-card p-6 text-center no-data">DADO NÃO DISPONÍVEL</div>
          ) : (
            <div className="glass-card flex-col gap-0 overflow-hidden">
              {audits.map((audit: any, index: number) => (
                <div key={audit.id || index} className="p-4 border-b border-[var(--border-glass)] last:border-b-0 hover:bg-[rgba(255,255,255,0.02)]">
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-sm">{audit.action || 'Ação Desconhecida'}</span>
                    <span className="text-xs text-muted">{audit.created_at || 'Data Indisponível'}</span>
                  </div>
                  <p className="text-xs text-muted font-mono bg-[var(--bg-primary)] p-2 rounded mt-2">
                    {audit.metadata_json || 'Sem metadados'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Evidences Panel */}
        <div className="flex-col gap-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gradient">
            <FileKey size={20} />
            Sistema de Evidências
          </h2>
          {evidences.length === 0 ? (
            <div className="glass-card p-6 text-center no-data">DADO NÃO DISPONÍVEL</div>
          ) : (
            <div className="glass-card flex-col gap-0 overflow-hidden">
              {evidences.map((ev: any, index: number) => (
                <div key={ev.id || index} className="p-4 border-b border-[var(--border-glass)] last:border-b-0 flex items-center gap-4">
                  <ShieldCheck size={24} className="text-status-success" />
                  <div>
                    <h4 className="font-semibold text-sm">{ev.type || 'Tipo Desconhecido'}</h4>
                    <p className="text-xs text-muted mt-1">Ref: {ev.reference_id}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Audits;
