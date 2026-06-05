/* ============================================================
   FORJA — Explorer (segunda coluna, navegação rápida)
   ============================================================ */

function Explorer({ view, setView, onClose }) {
  const D = window.FORJA;
  const [open, setOpen] = useLocalStorage('forja.explorer.open', {
    projetos: true, missoes: true, agentes: true, knowledge: false,
    runtime: false, deploys: false, auditorias: false, relatorios: false,
  });
  const toggle = (id) => setOpen(o => ({ ...o, [id]: !o[id] }));

  const projStatusDot = (s) => s==='live'?'ok':s==='paused'?'warn':s==='review'?'info':'acc';
  const misCount = (st) => D.missoes.filter(m => m.status === st).length;
  const agtDot = (s) => s==='running'?'ok':s==='blocked'?'err':'idle';

  const Section = ({ id, icon, label, count, action, children }) => (
    <div className={'exp-group' + (open[id]?'':' collapsed')}>
      <div className="exp-group-head" onClick={() => toggle(id)}>
        <Icon name="chevD" size={11} className="ic-chev" />
        <Icon name={icon} size={12} style={{opacity:.7}} />
        <span>{label}</span>
        {count!=null && <span className="exp-count">{count}</span>}
        {action && <button className="exp-add" onClick={(e)=>{e.stopPropagation(); action();}} title="Novo"><Icon name="plus" size={11}/></button>}
      </div>
      {open[id] && <div className="exp-items">{children}</div>}
    </div>
  );

  return (
    <aside className="explorer">
      <div className="exp-head">
        <Icon name="layers" size={13} style={{color:'var(--accent-bright)'}} />
        <span className="exp-title">FORJA · EXPLORADOR</span>
        <button className="btn ghost icon sm" onClick={onClose} title="Fechar Explorador"><Icon name="x" size={13}/></button>
      </div>
      <div className="exp-body scroll-y">
        <Section id="projetos" icon="folder" label="Projetos" count={D.projetos.length} action={()=>setView('projects')}>
          {D.projetos.map(p => (
            <button key={p.id} className={'exp-item' + (view==='projects'?'':'')} onClick={()=>setView('projects')}>
              <span className={'dot ' + projStatusDot(p.status)} />
              <span className="truncate">{p.nome}</span>
              <span className="id">{p.id}</span>
            </button>
          ))}
        </Section>

        <Section id="missoes" icon="target" label="Missões" count={D.missoes.length} action={()=>setView('missions')}>
          {D.MIS_STATES.map(st => (
            <button key={st} className="exp-item" onClick={()=>setView('missions')}>
              <span className={'dot ' + (st==='RUNNING'?'ok':st==='FAILED'?'err':st==='QUEUED'?'info':st==='COMPLETED'?'ok':'idle')} />
              <span className="mono" style={{fontSize:11}}>{labelMissionStatus(st)}</span>
              <span className="id">{misCount(st)}</span>
            </button>
          ))}
        </Section>

        <Section id="agentes" icon="cpu" label="Equipe" count={D.agentes.length} action={()=>setView('agents')}>
          {D.agentes.map(a => (
            <button key={a.id} className="exp-item" onClick={()=>setView('agents')}>
              <span className={'dot ' + agtDot(a.status) + (a.status==='running'?' blink':'')} />
              <span className="mono" style={{fontSize:11}}>{a.papel}</span>
              <span className="id">{a.missao!=='—'?a.missao:''}</span>
            </button>
          ))}
        </Section>

        <Section id="knowledge" icon="book" label="Conhecimento" count={D.fontes.length} action={()=>setView('knowledge')}>
          {D.fontes.map(f => (
            <button key={f.id} className="exp-item" onClick={()=>setView('knowledge')}>
              <span className={'dot ' + (f.status==='indexado'?'ok':f.status==='erro'?'err':'info')} />
              <span className="truncate">{f.nome}</span>
              <span className="id">{f.id}</span>
            </button>
          ))}
        </Section>

        <Section id="runtime" icon="cpu" label="Execução · Núcleos" count={D.cores.length}>
          {D.cores.map(c => (
            <button key={c.id} className="exp-item" onClick={()=>setView('settings')}>
              <span className={'dot ' + (c.status==='ok'?'ok':'warn')} />
              <span className="truncate">{c.nome}</span>
              <span className="id">{c.ver}</span>
            </button>
          ))}
        </Section>

        <Section id="deploys" icon="rocket" label="Publicações" count={D.deploys.length} action={()=>setView('deploy')}>
          {D.deploys.map(d => (
            <button key={d.id} className="exp-item" onClick={()=>setView('deploy')}>
              <span className={'dot ' + (d.status==='ok'?'ok':d.status==='fail'?'err':'acc')} style={d.status==='running'?{background:'var(--accent)'}:{}} />
              <span className="truncate">{d.proj} · {d.amb}</span>
              <span className="id">{d.id}</span>
            </button>
          ))}
        </Section>

        <Section id="auditorias" icon="shield" label="Auditorias" count={D.auditoria.length} action={()=>setView('audit')}>
          {D.auditoria.slice(0,8).map(a => (
            <button key={a.id} className="exp-item" onClick={()=>setView('audit')}>
              <span className={'dot ' + (a.sev==='crítico'?'err':a.sev==='aviso'?'warn':'info')} />
              <span className="truncate mono" style={{fontSize:11}}>{a.acao}</span>
              <span className="id">{a.ts.slice(0,5)}</span>
            </button>
          ))}
        </Section>

        <Section id="relatorios" icon="doc" label="Relatórios" count={D.relatorios.length}>
          {D.relatorios.map(r => (
            <button key={r.id} className="exp-item">
              <Icon name="doc" size={11} style={{color:'var(--text-3)'}}/>
              <span className="truncate">{r.nome}</span>
              <span className="id">{r.periodo}</span>
            </button>
          ))}
        </Section>

        <div className="exp-group" style={{marginTop:6, borderTop:'1px solid var(--border-faint)', paddingTop:6}}>
          <button className="exp-item" onClick={()=>setView('settings')} style={{padding:'6px 10px'}}>
            <Icon name="gear" size={12} style={{color:'var(--text-3)'}}/>
            <span>Configurações</span>
          </button>
          <button className="exp-item" onClick={()=>setView('costs')} style={{padding:'6px 10px'}}>
            <Icon name="zap" size={12} style={{color:'var(--text-3)'}}/>
            <span>Custos e controle</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

Object.assign(window, { Explorer });
