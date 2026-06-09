/* ============================================================
   A FÁBRICA — Módulos B: Testes, Validação, Auditoria, Operações,
   Financeiro, Roadmap, Academia, Ajuda, Configurações
   ============================================================ */

/* ---------- TESTES ---------- */
function TestesCenter() {
  const secs = [['Executados','flask','NIMPL'],['Pendentes','clock','NIMPL'],['Aprovados','check','NIMPL'],['Reprovados','x','NIMPL'],['Histórico','doc','NIMPL']];
  return (
    <div className="center">
      <PageHead icon="flask" crumb="Garantia" title="Testes" status="NIMPL"
        sub="Centralização de testes do sistema · execução, status, histórico, logs e relatório">
        <button className="btn primary" disabled style={{opacity:.5}}><Icon name="play2" size={12}/> Rodar testes</button>
      </PageHead>
      <div className="center-body">
        <EmptyState icon="flask" title="Nenhum teste executado" status="NIMPL"
          sub="A suíte de testes ainda não foi implementada. Os resultados aparecerão por categoria quando ativada." />
        <div className="grid-3" style={{marginTop:18}}>
          {secs.map(([s,ic,st])=>(
            <div className="panel" key={s}><div className="panel-body" style={{display:'flex',alignItems:'center',gap:10}}><Icon name={ic} size={14} style={{color:'var(--text-3)'}}/><span style={{fontSize:12.5,flex:1}}>{s}</span><span className="mono faint">0</span><StatusPill status={st} size="sm"/></div></div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- VALIDAÇÃO ---------- */
function ValidacaoCenter() {
  const secs = [['Validações','award'],['Certificações','check'],['Aprovações','check'],['Evidências','doc'],['Pendências','alert']];
  return (
    <div className="center">
      <PageHead icon="award" crumb="Garantia" title="Validação" status="NIMPL"
        sub="Validações e certificações por módulo · evidências e pendências">
      </PageHead>
      <div className="center-body">
        <EmptyState icon="award" title="Sem validações registradas" status="NIMPL"
          sub="Certificações e aprovações aparecerão aqui conforme os módulos forem validados." />
        <div className="grid-3" style={{marginTop:18}}>
          {secs.map(([s,ic])=>(
            <div className="panel" key={s}><div className="panel-body" style={{display:'flex',alignItems:'center',gap:10}}><Icon name={ic} size={14} style={{color:'var(--text-3)'}}/><span style={{fontSize:12.5,flex:1}}>{s}</span><StatusPill status="NIMPL" size="sm"/></div></div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- AUDITORIA (a verdade) ---------- */
function AuditoriaCenter({ setView }) {
  const D = window.FORJA;
  const veredCount = (v) => D.auditoria.filter(a=>a.veredito===v).length;
  const buckets = [
    ['Funciona','ok'], ['Parcial','warn'], ['Não testado','info'],
    ['Aguardando config.','info'], ['Não implementado','idle'], ['Bloqueado','err'],
  ];
  return (
    <div className="center">
      <PageHead icon="shield" crumb="Garantia" title="Auditoria" status="IMPL"
        sub="A verdade do sistema · Zero Ghost Law · nunca esconde falhas">
        <button className="btn"><Icon name="doc" size={13}/> Exportar</button>
      </PageHead>
      <div className="center-body section-gap">
        <div className="card hud-grid" style={{padding:'16px 18px', display:'flex', alignItems:'center', gap:18, borderColor:'var(--accent-line)'}}>
          <div style={{width:46,height:46,borderRadius:'var(--r-md)',background:'var(--accent-soft)',display:'grid',placeItems:'center',color:'var(--accent-bright)',flex:'none',border:'1px solid var(--accent-line)'}}><Icon name="shield" size={22}/></div>
          <div style={{flex:1,minWidth:0}}>
            <div className="eyebrow" style={{color:'var(--accent-bright)'}}>ZERO GHOST LAW</div>
            <div style={{fontSize:15,fontWeight:600,marginTop:2}}>Nada falso é apresentado como real</div>
            <div className="muted" style={{fontSize:11.5,marginTop:3}}>Cada módulo declara seu estado honesto. {veredCount('Funciona')} funcionam · {veredCount('Parcial')} parciais · {veredCount('Não implementado')} não implementados.</div>
          </div>
        </div>

        <div className="kpi-grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))'}}>
          {buckets.map(([lb,tone])=>(
            <div className="kpi" key={lb}><div className="kpi-label"><span className={'dot '+tone}/> {lb}</div><div className="kpi-val">{veredCount(lb)}</div></div>
          ))}
        </div>

        <SectionCard icon="shield" title="Verdade por módulo" flush>
          <div className="tbl-wrap"><table className="tbl"><thead><tr><th>Módulo</th><th>Veredito</th><th>Status declarado</th></tr></thead>
          <tbody>
            {D.auditoria.map((a,i)=>(
              <tr key={i} style={{cursor:'default'}}>
                <td className="cell-strong">{a.modulo}</td>
                <td className="muted">{a.veredito}</td>
                <td><StatusPill status={a.status} size="sm"/></td>
              </tr>
            ))}
          </tbody></table></div>
        </SectionCard>
      </div>
    </div>
  );
}

/* ---------- OPERAÇÕES ---------- */
function OperacoesCenter({ setView }) {
  const D = window.FORJA;
  return (
    <div className="center">
      <PageHead icon="server" crumb="Infra" title="Operações" status="DEV"
        sub="Banco · FastAPI · Runtime · Deploy · Monitoramento · Backups · Serviços">
        <button className="btn"><Icon name="refresh" size={13}/> Health check</button>
      </PageHead>
      <div className="center-body">
        <SectionCard icon="server" title="Saúde da infraestrutura" flush>
          <div className="tbl-wrap"><table className="tbl"><thead><tr><th>Serviço</th><th>Categoria</th><th>Observação</th><th>Status</th></tr></thead>
          <tbody>
            {D.operacoes.map(o=>(
              <tr key={o.id} style={{cursor:'default'}}>
                <td className="cell-strong">{o.nome}</td>
                <td className="muted">{o.cat}</td>
                <td className="faint" style={{fontSize:11.5}}>{o.nota}</td>
                <td><StatusPill status={o.status} size="sm"/></td>
              </tr>
            ))}
          </tbody></table></div>
        </SectionCard>
      </div>
    </div>
  );
}

/* ---------- FINANCEIRO ---------- */
function FinanceiroCenter() {
  const cats = [['Custos de LLM','zap'],['Custos de APIs','link'],['Infraestrutura','server'],['Assinaturas','dollar'],['Despesas','chart'],['Limites & alertas','alert']];
  return (
    <div className="center">
      <PageHead icon="dollar" crumb="Negócio" title="Financeiro" status="NIMPL"
        sub="Custos, assinaturas e finanças · sem receitas inventadas">
      </PageHead>
      <div className="center-body section-gap">
        <div className="grid-2">
          <SectionCard icon="dollar" title="Receitas" status="NIMPL">
            <EmptyState icon="dollar" title="Sem receitas cadastradas" sub="Nenhuma receita registrada. A Fábrica está em uso próprio." />
          </SectionCard>
          <SectionCard icon="chart" title="Custos medidos" status="NTEST">
            <EmptyState icon="activity" title="Sem medição de custos" sub="Custos de LLM/API só aparecem após provedores configurados e em uso." />
          </SectionCard>
        </div>
        <SectionCard icon="dollar" title="Categorias financeiras (estrutura)" status="DEV">
          <div className="grid-3">
            {cats.map(([c,ic])=>(
              <div key={c} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',background:'var(--bg-1)',border:'1px solid var(--border)',borderRadius:'var(--r-md)'}}><Icon name={ic} size={14} style={{color:'var(--text-3)'}}/><span style={{fontSize:12.5,flex:1}}>{c}</span><StatusPill status="NIMPL" size="sm"/></div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

/* ---------- ROADMAP ---------- */
function RoadmapCenter() {
  const D = window.FORJA;
  return (
    <div className="center">
      <PageHead icon="chart" crumb="Plataforma" title="Roadmap" status="IMPL"
        sub="Evolução real da plataforma A FÁBRICA · estado honesto de cada item">
      </PageHead>
      <div className="center-body">
        <div className="kanban" style={{height:'auto'}}>
          {D.roadmap.map(col=>(
            <div className="kan-col" key={col.fase}>
              <div className="kan-head"><span className={'dot '+col.cor}/><span style={{fontWeight:600,fontSize:12}}>{col.fase}</span><span className="count">{col.itens.length}</span></div>
              <div className="kan-body">
                {col.itens.map(it=>(
                  <div key={it} className="kan-card" style={{cursor:'default'}}>
                    <div className="kan-card-title" style={{fontSize:12}}>{it}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- ACADEMIA ---------- */
function AcademiaCenter() {
  const secs = [['Treinamentos','cap'],['Vídeos','play2'],['Guias','book'],['Cursos','cap'],['Onboarding','flame'],['Docs p/ usuários','doc']];
  return (
    <div className="center">
      <PageHead icon="cap" crumb="Plataforma" title="Academia" status="NIMPL"
        sub="Treinamento e onboarding de operadores">
      </PageHead>
      <div className="center-body">
        <EmptyState icon="cap" title="Academia ainda não implementada" status="NIMPL"
          sub="Conteúdos de treinamento serão publicados aqui." />
        <div className="grid-3" style={{marginTop:18}}>
          {secs.map(([s,ic])=>(
            <div className="panel" key={s} style={{opacity:.7}}><div className="panel-body" style={{display:'flex',alignItems:'center',gap:10}}><Icon name={ic} size={14} style={{color:'var(--text-3)'}}/><span style={{fontSize:12.5,flex:1}}>{s}</span><StatusPill status="NIMPL" size="sm"/></div></div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- AJUDA ---------- */
function AjudaCenter() {
  const secs = [['Consultor','help'],['FAQ','book'],['Documentação','doc'],['Chamados','chat'],['Suporte','users']];
  return (
    <div className="center">
      <PageHead icon="help" crumb="Plataforma" title="Ajuda" status="DEV"
        sub="Suporte, FAQ, documentação e orientação de uso">
      </PageHead>
      <div className="center-body section-gap">
        <SectionCard icon="help" title="Consultor da Fábrica" status="DEV">
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <span className="ch-icon" style={{width:36,height:36}}><Icon name="chat" size={18}/></span>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500}}>Assistente de uso da plataforma</div><div className="muted" style={{fontSize:11.5}}>Tira dúvidas sobre módulos e fluxos. Requer LLM configurada.</div></div>
            <button className="btn" disabled style={{opacity:.5}}>Abrir</button>
          </div>
        </SectionCard>
        <div className="grid-3">
          {secs.map(([s,ic])=>(
            <div className="panel" key={s}><div className="panel-body" style={{display:'flex',alignItems:'center',gap:10}}><Icon name={ic} size={14} style={{color:'var(--text-3)'}}/><span style={{fontSize:12.5,flex:1}}>{s}</span><StatusPill status={s==='Documentação'?'DEV':'NIMPL'} size="sm"/></div></div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- CONFIGURAÇÕES ---------- */
function ConfiguracoesCenter({ setView, theme, setTheme }) {
  const secs = [
    ['Conta','building','DEV'],['Usuários','users','NIMPL'],['Permissões','lock','NIMPL'],['Assinaturas','dollar','NIMPL'],
    ['APIs','link','CONFIG'],['LLMs','zap','CONFIG'],['Billing','dollar','NIMPL'],['Segurança','shield','DEV'],
    ['Cofre','lock','DEV'],['Backup','box','NIMPL'],['Notificações','bell','DEV'],['Integrações','link','PARCIAL'],
    ['Personalização','eye','DEV'],['Licenciamento','award','NIMPL'],
  ];
  const perfis = ['Administrador','Operador','Consultor','Cliente'];
  return (
    <div className="center">
      <PageHead icon="gear" crumb="Plataforma" title="Configurações" status="DEV"
        sub="Conta, LLMs, cofre, segurança, integrações e personalização">
      </PageHead>
      <div className="center-body section-gap">
        <SectionCard icon="eye" title="Aparência" status="IMPL">
          <div style={{display:'flex',alignItems:'center',gap:14}}>
            <div style={{flex:1}}><div style={{fontWeight:500}}>Tema</div><div className="muted" style={{fontSize:11.5}}>Escuro recomendado para sessões longas</div></div>
            <div className="seg">
              <button className={theme==='dark'?'on':''} onClick={()=>setTheme&&setTheme('dark')}><Icon name="moon" size={12}/> Escuro</button>
              <button className={theme==='light'?'on':''} onClick={()=>setTheme&&setTheme('light')}><Icon name="sun" size={12}/> Claro</button>
            </div>
          </div>
        </SectionCard>

        <SectionCard icon="lock" title="Cofre de segredos" status="DEV">
          <div className="card" style={{padding:11, display:'flex',gap:9,alignItems:'center', borderColor:'var(--info)', background:'var(--info-soft)'}}>
            <Icon name="lock" size={15} style={{color:'var(--info)'}}/><span style={{fontSize:12}}>Toda chave/token/OAuth fica no cofre seguro. Nunca exibido no painel, em código ou no GitHub.</span>
          </div>
        </SectionCard>

        <SectionCard icon="gear" title="Áreas administrativas">
          <div className="grid-3">
            {secs.map(([s,ic,st])=>(
              <div key={s} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',background:'var(--bg-1)',border:'1px solid var(--border)',borderRadius:'var(--r-md)'}}><Icon name={ic} size={14} style={{color:'var(--text-3)'}}/><span style={{fontSize:12.5,flex:1}}>{s}</span><StatusPill status={st} size="sm"/></div>
            ))}
          </div>
        </SectionCard>

        <SectionCard icon="users" title="Perfis (arquitetura prevista)" status="NIMPL">
          <div className="tags">{perfis.map(p=><span key={p} className="tag">{p}</span>)}</div>
          <div className="muted" style={{fontSize:11.5,marginTop:8}}>Estrutura prevista. Permissões completas não implementadas nesta fase.</div>
        </SectionCard>
      </div>
    </div>
  );
}

Object.assign(window, { TestesCenter, ValidacaoCenter, AuditoriaCenter, OperacoesCenter, FinanceiroCenter, RoadmapCenter, AcademiaCenter, AjudaCenter, ConfiguracoesCenter });
