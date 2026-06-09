/* ============================================================
   A FÁBRICA — Explorer (navegação por grupos · 19 módulos)
   ============================================================ */

function Explorer({ view, setView, onClose }) {
  const D = window.FORJA;
  const groups = NAV_GROUPS;
  const [open, setOpen] = useLocalStorage('forja.explorer.groups', {
    Trabalho: true, 'Negócio': true, 'Operação': true, Recursos: false,
    Garantia: false, Infra: false, Plataforma: false,
  });
  const toggle = (g) => setOpen(o => ({ ...o, [g]: !o[g] }));
  const byGroup = (g) => D.modulos.filter(m => m.grupo === g);
  const tone = (st) => (D.ST[st] || {}).tone || 'idle';

  return (
    <aside className="explorer">
      <div className="exp-head">
        <Icon name="layers" size={13} style={{color:'var(--accent-bright)'}} />
        <span className="exp-title">A FÁBRICA · PLATAFORMA</span>
        <button className="btn ghost icon sm" onClick={onClose} title="Fechar Explorer"><Icon name="x" size={13}/></button>
      </div>
      <div className="exp-body scroll-y">
        {groups.map(g => {
          const items = byGroup(g);
          if (!items.length) return null;
          const isOpen = open[g];
          return (
            <div key={g} className={'exp-group' + (isOpen?'':' collapsed')}>
              <div className="exp-group-head" onClick={() => toggle(g)}>
                <Icon name="chevD" size={11} className="ic-chev" />
                <span>{g}</span>
                <span className="exp-count">{items.length}</span>
              </div>
              {isOpen && <div className="exp-items">
                {items.map(m => (
                  <button key={m.id} className={'exp-item' + (view===m.id?' on':'')} onClick={()=>setView(m.id)}>
                    <Icon name={m.icon} size={12} style={{opacity:.75, flex:'none'}} />
                    <span className="truncate">{m.nome}</span>
                    <span className={'exp-st dot ' + tone(m.status)} title={(D.ST[m.status]||{}).label} />
                  </button>
                ))}
              </div>}
            </div>
          );
        })}

        <div className="exp-group" style={{marginTop:6, borderTop:'1px solid var(--border-faint)', paddingTop:6}}>
          <button className={'exp-item'+(view==='configuracoes'?' on':'')} onClick={()=>setView('configuracoes')} style={{padding:'6px 10px'}}>
            <Icon name="gear" size={12} style={{color:'var(--text-3)'}}/><span>Configurações</span>
          </button>
        </div>

        <div className="exp-legend">
          <div className="eyebrow" style={{marginBottom:6}}>ZERO GHOST · LEGENDA</div>
          <div className="exp-leg-row"><span className="dot ok"/> Implementado</div>
          <div className="exp-leg-row"><span className="dot warn"/> Em desenvolvimento / parcial</div>
          <div className="exp-leg-row"><span className="dot info"/> Não testado / aguardando config.</div>
          <div className="exp-leg-row"><span className="dot idle"/> Não implementado</div>
          <div className="exp-leg-row"><span className="dot err"/> Bloqueado</div>
        </div>
      </div>
    </aside>
  );
}

Object.assign(window, { Explorer });
