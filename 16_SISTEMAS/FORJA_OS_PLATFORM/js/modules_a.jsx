/* ============================================================
   A FÁBRICA — Módulos A: Clientes, Projetos, Missões,
   Inteligência, LLMs, Ferramentas, Integrações, Conhecimento
   ============================================================ */

/* ---------- CLIENTES ---------- */
function ClientesCenter({ setView }) {
  return (
    <div className="center">
      <PageHead icon="building" crumb="Negócio" title="Clientes" status="NIMPL"
        sub="Organização de clientes atuais e futuros">
        <button className="btn primary"><Icon name="plus" size={13}/> Novo cliente</button>
      </PageHead>
      <div className="center-body">
        <EmptyState icon="building" title="Sem clientes cadastrados" status="NIMPL"
          sub="Nenhum cliente foi cadastrado. Cada cliente poderá ter dados gerais, projetos e missões vinculadas, status, entregas e histórico."
          action="Cadastrar primeiro cliente" onAction={()=>{}} />
        <div className="grid-3" style={{marginTop:18}}>
          {['Dados gerais','Projetos vinculados','Missões vinculadas','Entregas','Histórico','Status'].map(s=>(
            <div className="panel" key={s} style={{opacity:.7}}><div className="panel-body" style={{display:'flex',alignItems:'center',gap:10}}><Icon name="folder" size={14} style={{color:'var(--text-3)'}}/><span style={{fontSize:12.5}}>{s}</span><span style={{marginLeft:'auto'}}><StatusPill status="NIMPL" size="sm"/></span></div></div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- PROJETOS ---------- */
function ProjetosCenter({ setView }) {
  const estados = ['Planejado','Em andamento','Em teste','Validado','Entregue','Arquivado'];
  return (
    <div className="center">
      <PageHead icon="folder" crumb="Negócio" title="Projetos" status="DEV"
        sub="Projetos vinculados a clientes, missões, equipes e evidências">
        <button className="btn primary"><Icon name="plus" size={13}/> Novo projeto</button>
      </PageHead>
      <div className="center-body section-gap">
        <div className="kanban" style={{height:'auto'}}>
          {estados.map(e=>(
            <div className="kan-col" key={e}>
              <div className="kan-head"><span className="dot idle"/><span style={{fontWeight:600,fontSize:12}}>{e}</span><span className="count">0</span></div>
              <div className="kan-body"><div className="faint" style={{fontSize:11,padding:'10px 6px'}}>vazio</div></div>
            </div>
          ))}
        </div>
        <SectionCard icon="folder" title="Estrutura de um projeto" status="DEV">
          <div className="tags">{['Nome','Cliente','Status','Missões','Equipes','Documentos','Evidências','Auditorias','Entregas'].map(s=><span key={s} className="tag">{s}</span>)}</div>
        </SectionCard>
      </div>
    </div>
  );
}

/* ---------- MISSÕES ---------- */
function MissoesCenter({ setView }) {
  const cols = ['Planejamento','Desenvolvimento','Execução','Testes','Validação','Concluídas','Canceladas','Bloqueadas'];
  return (
    <div className="center">
      <PageHead icon="target" crumb="Operação" title="Missões" status="DEV"
        sub="Controle operacional · cada missão: objetivo, equipe, LLM, custo, tempo, evidências, logs, resultado">
        <button className="btn primary"><Icon name="plus" size={13}/> Nova missão</button>
      </PageHead>
      <div className="center-body section-gap">
        <div className="kanban" style={{height:'auto'}}>
          {cols.map((c,i)=>(
            <div className="kan-col" key={c}>
              <div className="kan-head"><span className={'dot '+(c==='Bloqueadas'?'err':c==='Concluídas'?'ok':'idle')}/><span style={{fontWeight:600,fontSize:11.5}}>{c}</span><span className="count">0</span></div>
              <div className="kan-body"><div className="faint" style={{fontSize:11,padding:'10px 6px'}}>vazio</div></div>
            </div>
          ))}
        </div>
        <div className="grid-2">
          <SectionCard icon="target" title="Campos de uma missão" status="DEV">
            <div className="tags">{['Objetivo','Status','Equipe responsável','LLM utilizada','Custo','Tempo','Evidências','Logs','Resultado'].map(s=><span key={s} className="tag">{s}</span>)}</div>
          </SectionCard>
          <SectionCard icon="doc" title="Histórico" status="NIMPL">
            <EmptyState icon="clock" title="Sem histórico" sub="Missões executadas aparecerão aqui." />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

/* ---------- INTELIGÊNCIA ---------- */
function InteligenciaCenter({ setView }) {
  const areas = [
    ['Concorrentes','compass'],['Tendências','chart'],['Benchmark','activity'],['SEO','search'],
    ['Oportunidades','zap'],['Análise visual','eye'],['Pesquisa de mercado','book'],['Relatórios estratégicos','doc'],
  ];
  return (
    <div className="center">
      <PageHead icon="compass" crumb="Operação" title="Inteligência" status="NIMPL"
        sub="Inteligência de mercado · apenas fontes públicas e autorizadas · sem dados fictícios">
        <button className="btn"><Icon name="refresh" size={13}/> Varrer mercado</button>
      </PageHead>
      <div className="center-body">
        <EmptyState icon="compass" title="Inteligência ainda não implementada" status="NIMPL"
          sub="As análises serão geradas a partir de fontes públicas autorizadas quando o módulo for ativado." />
        <div className="grid-3" style={{marginTop:18}}>
          {areas.map(([a,ic])=>(
            <div className="panel" key={a} style={{opacity:.7}}><div className="panel-body" style={{display:'flex',alignItems:'center',gap:10}}><Icon name={ic} size={14} style={{color:'var(--text-3)'}}/><span style={{fontSize:12.5}}>{a}</span><span style={{marginLeft:'auto'}}><StatusPill status="NIMPL" size="sm"/></span></div></div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- LLMs ---------- */
function LLMsCenter({ setView }) {
  const D = window.FORJA;
  const [sel, setSel] = useState(D.llms[0]);
  return (
    <div className="center">
      <PageHead icon="zap" crumb="Recursos" title="LLMs" status="CONFIG"
        sub="Provedores de IA · nenhum configurado · conecte por assinatura, API ou local">
        <button className="btn primary" onClick={()=>setView('configuracoes')}><Icon name="lock" size={13}/> Configurar no cofre</button>
      </PageHead>
      <div className="center-split wide">
        <div className="split-main">
          <div className="team-grid">
            {D.llms.map(l=>(
              <button key={l.id} className="team-card" onClick={()=>setSel(l)} style={sel.id===l.id?{borderColor:'var(--accent-line)',background:'var(--accent-soft)'}:null}>
                <div className="team-card-top">
                  <span className="ch-icon" style={{width:34,height:34}}><Icon name="zap" size={17}/></span>
                  <div style={{minWidth:0,flex:1,textAlign:'left'}}>
                    <div className="team-card-name">{l.nome}</div>
                    <StatusPill status={l.status} size="sm"/>
                  </div>
                </div>
                <div className="team-card-sobre">Modelo: {l.modelo}</div>
                <div className="kv" style={{fontSize:11,marginTop:4}}>
                  <dt>Último teste</dt><dd className="faint">{l.ultimoTeste}</dd>
                  <dt>Latência</dt><dd className="faint">{l.latencia}</dd>
                  <dt>Custo</dt><dd className="faint">{l.custo}</dd>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="split-side"><div className="detail">
          <div className="detail-head"><div className="ch-crumb">{sel.nome}</div><h2>{sel.nome}</h2><StatusPill status={sel.status}/></div>
          <div className="detail-block"><span className="eyebrow">Métodos de conexão</span>
            <div className="tags">{sel.conexao.map(c=><span key={c} className="tag">{c}</span>)}</div>
          </div>
          <div className="detail-block"><span className="eyebrow">Telemetria</span>
            <div className="kv">
              <dt>Modelo</dt><dd className="mono">{sel.modelo}</dd>
              <dt>Último teste</dt><dd className="faint">{sel.ultimoTeste}</dd>
              <dt>Latência</dt><dd className="faint">{sel.latencia}</dd>
              <dt>Custo</dt><dd className="faint">{sel.custo}</dd>
              <dt>Uso</dt><dd className="faint">{sel.uso}</dd>
            </div>
          </div>
          <div className="card" style={{padding:11, display:'flex',gap:9,alignItems:'center', borderColor:'var(--info)', background:'var(--info-soft)'}}>
            <Icon name="lock" size={15} style={{color:'var(--info)'}}/><span style={{fontSize:11.5}}>Chaves e tokens ficam no cofre seguro — nunca exibidos no painel.</span>
          </div>
          <button className="btn primary" style={{width:'100%'}} onClick={()=>setView('configuracoes')}><Icon name="plus" size={12}/> Conectar provedor</button>
        </div></div>
      </div>
    </div>
  );
}

/* ---------- FERRAMENTAS ---------- */
function FerramentasCenter({ setView }) {
  const D = window.FORJA;
  const classeTone = { 'integrada':'IMPL', 'conectada':'PARCIAL', 'externa':'NTEST', };
  return (
    <div className="center">
      <PageHead icon="wrench" crumb="Recursos" title="Ferramentas" status="DEV"
        sub="Ferramentas de trabalho · externa · conectada · integrada · não implementada">
        <button className="btn primary"><Icon name="plus" size={13}/> Adicionar</button>
      </PageHead>
      <div className="center-body">
        <div className="team-grid">
          {D.ferramentas.map(f=>(
            <div key={f.id} className="team-card" style={{cursor:'default'}}>
              <div className="team-card-top">
                <span className="ch-icon" style={{width:34,height:34}}><Icon name={f.icon} size={16}/></span>
                <div style={{minWidth:0,flex:1}}>
                  <div className="team-card-name">{f.nome}</div>
                  <span className="faint" style={{fontSize:11}}>{f.tipo}</span>
                </div>
                <StatusPill status={f.status} size="sm"/>
              </div>
              <div className="team-card-foot" style={{justifyContent:'space-between'}}>
                <span className="tag">{f.classe}</span>
                <button className="btn ghost sm" disabled style={{opacity:.5}}>Conectar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- INTEGRAÇÕES ---------- */
function IntegracoesCenter({ setView }) {
  const D = window.FORJA;
  return (
    <div className="center">
      <PageHead icon="link" crumb="Recursos" title="Integrações" status="PARCIAL"
        sub="Integrações técnicas e APIs · status, autenticação, permissões e logs">
        <button className="btn primary"><Icon name="plus" size={13}/> Nova integração</button>
      </PageHead>
      <div className="center-body">
        <SectionCard icon="link" title="Conexões" flush>
          <div className="tbl-wrap"><table className="tbl"><thead><tr><th>Integração</th><th>Auth</th><th>Permissões</th><th>Último teste</th><th>Status</th></tr></thead>
          <tbody>
            {D.integracoes.map(i=>(
              <tr key={i.id} style={{cursor:'default'}}>
                <td className="cell-strong">{i.nome}</td>
                <td className="mono muted" style={{fontSize:11}}>{i.auth}</td>
                <td className="muted">{i.permissoes}</td>
                <td className="faint" style={{fontSize:11}}>{i.ultimoTeste}</td>
                <td><StatusPill status={i.status} size="sm"/></td>
              </tr>
            ))}
          </tbody></table></div>
        </SectionCard>
        <div className="card" style={{padding:11, marginTop:14, display:'flex',gap:9,alignItems:'center', borderColor:'var(--info)', background:'var(--info-soft)'}}>
          <Icon name="lock" size={15} style={{color:'var(--info)'}}/><span style={{fontSize:12}}>OAuth, tokens e segredos ficam no cofre seguro — nunca no frontend, código ou GitHub.</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- CONHECIMENTO ---------- */
function ConhecimentoCenter({ setView }) {
  const D = window.FORJA;
  return (
    <div className="center">
      <PageHead icon="book" crumb="Recursos" title="Conhecimento" status="DEV"
        sub="Rules · Workflows · Skills · Templates · Biblioteca · Memória · estrutura pronta, vazia">
        <button className="btn primary"><Icon name="plus" size={13}/> Adicionar</button>
      </PageHead>
      <div className="center-body">
        <div className="team-grid">
          {D.conhecimento.map(c=>(
            <div key={c.id} className="team-card" style={{cursor:'default'}}>
              <div className="team-card-top">
                <span className="ch-icon" style={{width:34,height:34}}><Icon name={c.icon} size={16}/></span>
                <div style={{minWidth:0,flex:1}}>
                  <div className="team-card-name">{c.nome}</div>
                  <span className="faint" style={{fontSize:11}}>{c.sub}</span>
                </div>
                <StatusPill status={c.status} size="sm"/>
              </div>
              <div className="team-card-foot" style={{justifyContent:'space-between'}}>
                <span className="mono" style={{fontSize:18,fontWeight:600}}>{c.count}</span>
                <span className="faint" style={{fontSize:11}}>itens</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ClientesCenter, ProjetosCenter, MissoesCenter, InteligenciaCenter, LLMsCenter, FerramentasCenter, IntegracoesCenter, ConhecimentoCenter });
