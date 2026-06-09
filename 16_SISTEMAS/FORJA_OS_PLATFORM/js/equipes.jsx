/* ============================================================
   A FÁBRICA — Equipes (15) + página de equipe padronizada
   ============================================================ */

function EquipesCenter({ setView }) {
  const D = window.FORJA;
  const [openTeam, setOpenTeam] = useLocalStorage('forja.team.open', null);
  if (openTeam) {
    const t = D.equipes.find(e => e.id === openTeam);
    if (t) return <EquipePage team={t} onBack={() => setOpenTeam(null)} setView={setView} />;
  }
  const dev = D.equipes.filter(e => e.status === 'DEV').length;
  return (
    <div className="center">
      <PageHead icon="users" crumb="Operação" title="Equipes" status="DEV"
        sub={D.equipes.length + ' equipes · estrutura criada · agentes não implementados (Zero Ghost)'}>
        <button className="btn"><Icon name="plus" size={13}/> Nova equipe</button>
      </PageHead>
      <div className="center-body">
        <div className="card" style={{padding:'12px 16px', marginBottom:16, display:'flex', alignItems:'center', gap:12}}>
          <Icon name="shield" size={16} style={{color:'var(--accent-bright)'}}/>
          <span style={{fontSize:12.5}} className="muted">Esta página mostra <b style={{color:'var(--text-1)'}}>equipes</b>, não agentes individuais. Cada equipe abre sua própria página. {dev} equipes em estruturação ativa.</span>
        </div>
        <div className="team-grid">
          {D.equipes.map(t => (
            <button key={t.id} className="team-card" onClick={()=>setOpenTeam(t.id)}>
              <div className="team-card-top">
                <span className="ch-icon" style={{width:34,height:34}}><Icon name={t.icon} size={17}/></span>
                <div style={{minWidth:0,flex:1,textAlign:'left'}}>
                  <div className="team-card-name">{t.nome}</div>
                  <StatusPill status={t.status} size="sm" />
                </div>
                <Icon name="chevR" size={15} style={{color:'var(--text-3)'}}/>
              </div>
              <div className="team-card-sobre">{t.sobre}</div>
              <div className="team-card-foot">
                {t.skills.slice(0,3).map(s=><span key={s} className="tag">{s}</span>)}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function EquipePage({ team, onBack, setView }) {
  const t = team;
  const Section = ({ icon, title, children, status }) => (
    <div className="panel">
      <div className="panel-head"><Icon name={icon} size={14} style={{color:'var(--text-2)'}}/><h3>{title}</h3>{status && <StatusPill status={status} size="sm"/>}</div>
      <div className="panel-body">{children}</div>
    </div>
  );
  const TagList = ({ items }) => <div className="tags">{items.map(i=><span key={i} className="tag">{i}</span>)}</div>;

  return (
    <div className="center">
      <div className="center-head hud-grid">
        <div className="ch-top">
          <button className="btn ghost icon" onClick={onBack} title="Voltar"><Icon name="chevR" size={16} style={{transform:'rotate(180deg)'}}/></button>
          <div className="ch-icon"><Icon name={t.icon} size={19}/></div>
          <div className="ch-titles">
            <div className="ch-crumb">A FÁBRICA · Equipes</div>
            <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
              <h1 className="ch-title">Equipe {t.nome}</h1>
              <StatusPill status={t.status} />
            </div>
            <div className="ch-sub">{t.sobre}</div>
          </div>
          <div className="ch-actions">
            <button className="btn" onClick={()=>setView('missoes')}><Icon name="target" size={13}/> Missões</button>
            <button className="btn primary"><Icon name="play2" size={12}/> Ativar equipe</button>
          </div>
        </div>
      </div>

      <div className="center-body">
        <div className="card" style={{padding:'12px 16px', marginBottom:16, display:'flex', alignItems:'center', gap:12, borderColor:'var(--warn)', background:'var(--warn-soft)'}}>
          <Icon name="alert" size={16} style={{color:'var(--warn)'}}/>
          <span style={{fontSize:12.5}}>Estrutura operacional criada. Agentes e métricas <b>não implementados</b> — nenhum dado de execução é exibido (Zero Ghost Law).</span>
        </div>

        <div className="grid-2" style={{alignItems:'start', gap:14}}>
          <div className="col">
            <Section icon="book" title="Sobre & o que faz">
              <p style={{margin:0, fontSize:13, lineHeight:1.6}}>{t.sobre}</p>
            </Section>
            <Section icon="check" title="Responsabilidades">
              <ul className="bul">{t.responsabilidades.map(r=><li key={r}>{r}</li>)}</ul>
            </Section>
            <Section icon="target" title="Missões da equipe" status="NIMPL">
              <EmptyState icon="target" title="Sem missões atribuídas" sub="As missões aparecerão aqui quando a equipe for ativada." />
            </Section>
            <Section icon="activity" title="Métricas" status="NTEST">
              <div className="kv">
                <dt>Missões concluídas</dt><dd className="faint">— não medido</dd>
                <dt>Tempo médio</dt><dd className="faint">— não medido</dd>
                <dt>Taxa de sucesso</dt><dd className="faint">— não medido</dd>
                <dt>Custo</dt><dd className="faint">— não medido</dd>
              </div>
            </Section>
          </div>
          <div className="col">
            <Section icon="wrench" title="Ferramentas usadas">
              <TagList items={t.ferramentas} />
            </Section>
            <Section icon="zap" title="Skills">
              <TagList items={t.skills} />
            </Section>
            <Section icon="route" title="Workflows">
              <TagList items={t.workflows} />
            </Section>
            <Section icon="award" title="Validação & Auditoria" status="NTEST">
              <div className="kv">
                <dt>Validação</dt><dd><StatusPill status="NIMPL" size="sm"/></dd>
                <dt>Auditoria</dt><dd><StatusPill status="NTEST" size="sm"/></dd>
                <dt>Pendências</dt><dd>Definir agentes e ferramentas</dd>
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { EquipesCenter, EquipePage });
