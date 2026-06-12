/* ============================================================
   A FÁBRICA — Módulos A: Clientes, Projetos, Missões,
   Inteligência, LLMs, Ferramentas, Integrações, Conhecimento
   ============================================================ */

/* aviso honesto para módulos sem backend (Zero Ghost: não finge ação) */
function avisoEmDev(modulo) {
  alert('Módulo "' + modulo + '" ainda não tem backend real.\n\nConforme a Lei Zero Fantasma, esta ação não foi simulada. '
    + 'O módulo será ativado quando sua tabela/serviço real existir no nexus.db.');
}

/* ---------- CLIENTES (multi-cliente: cada cliente com suas contas/integrações) ---------- */
const _connTone = (s) => ({CONNECTED:'ok', ERROR:'err'}[(s||'').toUpperCase()] || 'warn');

function ClientesCenter({ setView }) {
  const apiOn = !!(window.ForjaAPI && window.ForjaAPI.listClients);
  const [clientes, setClientes] = useState([]);
  const [aberto, setAberto] = useState(null);
  const [connectors, setConnectors] = useState([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [agObj, setAgObj] = useState('');
  const [agRes, setAgRes] = useState(null);
  const [agBusy, setAgBusy] = useState(false);

  const agirComoCliente = async () => {
    if (!agObj.trim() || !window.ForjaAPI || !window.ForjaAPI.actAgent || !aberto) return;
    setAgBusy(true); setAgRes(null);
    try { setAgRes(await window.ForjaAPI.actAgent('orquestrador', agObj.trim(), aberto.id)); }
    catch (e) { setAgRes({ ok: false, result: 'Erro: ' + e.message }); }
    finally { setAgBusy(false); }
  };

  const carregar = async () => {
    if (!apiOn) return;
    try {
      const r = await window.ForjaAPI.listClients(); setClientes(r.items || []);
      const cc = await window.ForjaAPI.listConnectors('client'); setConnectors(cc.items || []);
    } catch (e) { setMsg('Falha: ' + e.message); }
  };
  useEffect(() => { carregar(); }, []);

  const abrir = async (id) => {
    setBusy(true);
    try { setAberto(await window.ForjaAPI.getClient(id)); }
    catch (e) { setMsg('Falha ao abrir: ' + e.message); }
    finally { setBusy(false); }
  };

  const novoCliente = async () => {
    const nome = window.prompt('Nome do cliente:'); if (!nome || !nome.trim()) return;
    const desc = window.prompt('Descrição/segmento (opcional):') || '';
    setBusy(true); setMsg('Criando cliente…');
    try { const r = await window.ForjaAPI.createClient(nome.trim(), desc); await carregar(); setMsg('Cliente criado: ' + r.id); }
    catch (e) { setMsg('Falha: ' + e.message); } finally { setBusy(false); }
  };

  const conectar = async (con) => {
    if (!aberto) return;
    const cred = window.prompt('Cole a credencial — ' + con.field + ':'); if (cred === null) return;
    const meta = {};
    for (const f of (con.extra || [])) {
      const v = window.prompt(f.label + ':');
      if (v) meta[f.key] = v.trim();
    }
    setBusy(true); setMsg('Conectando ' + con.kind + '…');
    try {
      const r = await window.ForjaAPI.addConnection(aberto.id, con.kind, con.kind, cred.trim(), meta);
      await abrir(aberto.id);
      setMsg(con.kind + ': ' + r.status + (r.detail ? (' · ' + r.detail) : ''));
    } catch (e) { setMsg('Falha ao conectar: ' + e.message); } finally { setBusy(false); }
  };

  const testar = async (connId) => {
    setBusy(true);
    try { const r = await window.ForjaAPI.testConnection(connId); await abrir(aberto.id); setMsg('Teste: ' + r.status + (r.detail ? (' · ' + r.detail) : '')); }
    catch (e) { setMsg('Falha no teste: ' + e.message); } finally { setBusy(false); }
  };

  const remover = async (connId) => {
    setBusy(true);
    try { await window.ForjaAPI.deleteConnection(connId); await abrir(aberto.id); setMsg('Conexão removida.'); }
    catch (e) { setMsg('Falha: ' + e.message); } finally { setBusy(false); }
  };

  const novoProjetoCliente = async () => {
    if (!aberto) return;
    const nome = window.prompt('Nome do projeto para ' + aberto.nome + ':'); if (!nome || !nome.trim()) return;
    const desc = window.prompt('Descrição (opcional):') || '';
    setBusy(true); setMsg('Criando projeto…');
    try { await window.ForjaAPI.createProject(nome.trim(), desc, aberto.id); await abrir(aberto.id); setMsg('Projeto criado. Abra em Projetos para rodar missões.'); }
    catch (e) { setMsg('Falha: ' + e.message); } finally { setBusy(false); }
  };

  // ===== DETALHE DO CLIENTE =====
  if (aberto) {
    const conectados = {}; (aberto.conexoes || []).forEach(c => { conectados[c.kind] = c; });
    return (
      <div className="center">
        <div className="center-head hud-grid">
          <div className="ch-top">
            <button className="btn ghost icon" onClick={()=>{setAberto(null);carregar();}} title="Voltar"><Icon name="chevR" size={16} style={{transform:'rotate(180deg)'}}/></button>
            <div className="ch-icon"><Icon name="building" size={19}/></div>
            <div className="ch-titles">
              <div className="ch-crumb">A FÁBRICA · Cliente {aberto.id}</div>
              <h1 className="ch-title">{aberto.nome}</h1>
              {aberto.descricao && <div className="ch-sub">{aberto.descricao}</div>}
            </div>
            <div className="ch-actions">
              <button className="btn primary" onClick={novoProjetoCliente} disabled={busy}><Icon name="plus" size={13}/> Novo projeto</button>
            </div>
          </div>
        </div>
        <div className="center-body section-gap">
          {msg && <div className="card" style={{padding:'9px 13px',fontSize:12,borderColor:'var(--accent-line)',background:'var(--accent-soft)'}}>{msg}</div>}

          <SectionCard icon="link" title="Integrações do cliente (contas dele)">
            <div className="card" style={{padding:10, display:'flex',gap:8,alignItems:'center', borderColor:'var(--info)', background:'var(--info-soft)', marginBottom:12}}>
              <Icon name="lock" size={14} style={{color:'var(--info)'}}/><span style={{fontSize:11.5}}>As credenciais ficam no cofre por cliente — nunca exibidas. Conectado = token validado na API oficial.</span>
            </div>
            <div className="team-grid">
              {connectors.map(con => {
                const c = conectados[con.kind];
                return (
                  <div key={con.kind} className="team-card" style={{cursor:'default'}}>
                    <div className="team-card-top">
                      <span className="ch-icon" style={{width:32,height:32}}><Icon name="link" size={15}/></span>
                      <div style={{minWidth:0,flex:1}}>
                        <div className="team-card-name">{con.label}</div>
                        <span className={'pill ' + (c ? _connTone(c.status) : '')} style={{fontSize:10}}>{c ? c.status : 'não conectado'}</span>
                      </div>
                    </div>
                    <div className="faint" style={{fontSize:10.5, margin:'4px 0 8px'}}>{con.how}</div>
                    <div className="team-card-foot" style={{justifyContent:'flex-end', gap:6}}>
                      {c && <button className="btn ghost sm" disabled={busy} onClick={()=>testar(c.id)}>Testar</button>}
                      {c && <button className="btn ghost sm" disabled={busy} onClick={()=>remover(c.id)}>Remover</button>}
                      <button className="btn sm primary" disabled={busy} onClick={()=>conectar(con)}>{c ? 'Atualizar' : 'Conectar'}</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard icon="zap" title="Agir como este cliente (agente usa as contas dele)">
            <div style={{display:'flex', gap:8, alignItems:'flex-start', flexWrap:'wrap'}}>
              <textarea rows={2} placeholder={'Ex.: poste no Instagram do cliente a imagem URL com a legenda "..." · ou: envie um aviso no Telegram'}
                value={agObj} onChange={e=>setAgObj(e.target.value)}
                style={{flex:1, minWidth:240, background:'var(--bg-1)', border:'1px solid var(--border)', borderRadius:'var(--r-md)', color:'var(--text-1)', padding:'8px 10px', fontSize:12.5}} />
              <button className="btn primary" disabled={agBusy || !agObj.trim()} onClick={agirComoCliente}><Icon name="zap" size={13}/> {agBusy ? 'Agindo…' : 'Agir'}</button>
            </div>
            {agRes && (
              <div className="card" style={{padding:11, marginTop:10, borderColor: agRes.ok?'var(--ok)':'var(--err)'}}>
                <div style={{fontSize:12.5, whiteSpace:'pre-wrap'}}>{agRes.result || ('status: ' + (agRes.status||'—'))}</div>
                {agRes.log && agRes.log.length > 0 && (
                  <details style={{marginTop:6}}><summary style={{cursor:'pointer', fontSize:11, color:'var(--text-3)'}}><Icon name="terminal" size={11}/> {agRes.log.length} passo(s)</summary>
                    <div className="term" style={{marginTop:6, maxHeight:220, overflow:'auto'}}>{agRes.log.map((s,i)=><div key={i} className="ln"><span className="t">{i+1}</span><span className="lv-info" style={{whiteSpace:'pre-wrap'}}>{String(s).slice(0,500)}</span></div>)}</div>
                  </details>
                )}
              </div>
            )}
          </SectionCard>

          <SectionCard icon="folder" title={'Projetos do cliente (' + (aberto.projetos||[]).length + ')'} flush>
            <div className="tbl-wrap"><table className="tbl"><thead><tr><th>ID</th><th>Projeto</th><th>Missões</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {(aberto.projetos||[]).map(p=>(
                <tr key={p.id}>
                  <td className="id-cell">{p.id}</td>
                  <td className="cell-strong">{p.nome}</td>
                  <td className="mono">{p.missoes}</td>
                  <td><StatusPill status="IMPL" size="sm"/></td>
                  <td><button className="btn sm" onClick={()=>setView('projetos')}>Abrir em Projetos</button></td>
                </tr>
              ))}
              {!(aberto.projetos||[]).length && <tr><td colSpan={5} className="faint" style={{padding:12}}>Sem projetos. Crie um em "Novo projeto".</td></tr>}
            </tbody></table></div>
          </SectionCard>
        </div>
      </div>
    );
  }

  // ===== LISTA DE CLIENTES =====
  return (
    <div className="center">
      <PageHead icon="building" crumb="Negócio" title="Clientes" status={apiOn ? 'IMPL' : 'NIMPL'}
        sub="Multi-cliente · cada cliente com suas contas (Instagram, Canva, GitHub…) e projetos">
        <button className="btn" onClick={carregar} disabled={busy}><Icon name="refresh" size={13}/> Atualizar</button>
        <button className="btn primary" onClick={novoCliente} disabled={busy || !apiOn}><Icon name="plus" size={13}/> Novo cliente</button>
      </PageHead>
      <div className="center-body section-gap">
        {msg && <div className="card" style={{padding:'9px 13px',fontSize:12,borderColor:'var(--accent-line)',background:'var(--accent-soft)'}}>{msg}</div>}
        {!apiOn && <div className="card" style={{padding:'9px 13px',fontSize:12,borderColor:'var(--warn)',background:'var(--warn-soft)'}}>Backend offline — abra pelo ABRIR_PAINEL_FORJA.</div>}
        {!clientes.length && apiOn && <EmptyState icon="building" title="Nenhum cliente ainda" sub="Cadastre o primeiro cliente, conecte as contas dele e crie projetos." action="Novo cliente" onAction={novoCliente} />}
        <div className="team-grid">
          {clientes.map(cl=>(
            <button key={cl.id} className="team-card" onClick={()=>abrir(cl.id)}>
              <div className="team-card-top">
                <span className="ch-icon" style={{width:34,height:34}}><Icon name="building" size={17}/></span>
                <div style={{minWidth:0,flex:1,textAlign:'left'}}>
                  <div className="team-card-name">{cl.nome}</div>
                  <span className="id-cell mono">{cl.id}</span>
                </div>
                <Icon name="chevR" size={15} style={{color:'var(--text-3)'}}/>
              </div>
              {cl.descricao && <div className="team-card-sobre">{cl.descricao}</div>}
              <div className="team-card-foot" style={{justifyContent:'space-between'}}>
                <span className="tag"><Icon name="folder" size={10}/> {cl.projetos} projetos</span>
                <span className="tag"><Icon name="link" size={10}/> {cl.conexoes_ativas}/{cl.conexoes} contas</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- PROJETOS (fatia vertical real: projeto → missão → execução → entrega) ---------- */
const _misCls = (s) => ({RUNNING:'ok',FAILED:'err',QUEUED:'info',COMPLETED:'ok'}[(s||'').toUpperCase()] || 'idle');

function ProjetosCenter({ setView }) {
  const apiOn = !!(window.ForjaAPI && window.ForjaAPI.listProjects);
  const [projetos, setProjetos] = useState([]);
  const [aberto, setAberto] = useState(null);
  const [entregas, setEntregas] = useState([]);
  const [arquivos, setArquivos] = useState([]);
  const [devRes, setDevRes] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const carregar = async () => {
    if (!apiOn) return;
    try { const r = await window.ForjaAPI.listProjects(); setProjetos(r.items || []); }
    catch (e) { setMsg('Falha ao listar: ' + e.message); }
  };
  useEffect(() => { carregar(); }, []);

  const abrir = async (id) => {
    setBusy(true); setDevRes(null);
    try {
      const p = await window.ForjaAPI.getProject(id);
      setAberto(p);
      const d = await window.ForjaAPI.getDeliverables(id);
      setEntregas(d.items || []);
      try { const ff = await window.ForjaAPI.listProjectFiles(id); setArquivos(ff.files || []); } catch (e) { setArquivos([]); }
    } catch (e) { setMsg('Falha ao abrir: ' + e.message); }
    finally { setBusy(false); }
  };

  const subirArquivos = async (fileList) => {
    if (!fileList || !fileList.length) return;
    setBusy(true); setMsg('Subindo arquivos…');
    try {
      const files = await Promise.all(Array.from(fileList).map(f => new Promise(res => {
        const r = new FileReader(); r.onload = () => res({ name: f.name, data_url: r.result }); r.readAsDataURL(f);
      })));
      const up = await window.ForjaAPI.uploadProjectFiles(aberto.id, files);
      const ff = await window.ForjaAPI.listProjectFiles(aberto.id); setArquivos(ff.files || []);
      setMsg(up.saved + ' arquivo(s) enviados ao projeto.');
    } catch (e) { setMsg('Falha no upload: ' + e.message); } finally { setBusy(false); }
  };

  const desenvolver = async () => {
    setBusy(true); setMsg('A Fábrica (agente Desenvolvedor) está trabalhando no projeto…'); setDevRes(null);
    try {
      const r = await window.ForjaAPI.developProject(aberto.id); setDevRes(r);
      const ff = await window.ForjaAPI.listProjectFiles(aberto.id); setArquivos(ff.files || []);
      setMsg('Desenvolvimento: ' + (r.status || ''));
    } catch (e) { setMsg('Falha: ' + e.message); } finally { setBusy(false); }
  };

  const novoProjeto = async () => {
    const nome = window.prompt('Nome do projeto:'); if (!nome || !nome.trim()) return;
    const desc = window.prompt('Descrição (opcional):') || '';
    setBusy(true); setMsg('Criando projeto…');
    try { const r = await window.ForjaAPI.createProject(nome.trim(), desc); await carregar(); setMsg('Projeto criado: ' + r.id); }
    catch (e) { setMsg('Falha: ' + e.message); } finally { setBusy(false); }
  };

  const novaMissao = async () => {
    if (!aberto) return;
    const t = window.prompt('Título da missão:'); if (!t || !t.trim()) return;
    const d = window.prompt('Objetivo da missão (o agente vai executar isto):') || '';
    setBusy(true); setMsg('Criando missão…');
    try { await window.ForjaAPI.createProjectMission(aberto.id, t.trim(), d); await abrir(aberto.id); setMsg('Missão criada.'); }
    catch (e) { setMsg('Falha: ' + e.message); } finally { setBusy(false); }
  };

  const executar = async (mid) => {
    setBusy(true); setMsg('Executando ' + mid + ' (agente real, gera evidência)…');
    try { const r = await window.ForjaAPI.runMission(mid); await abrir(aberto.id); setMsg('Missão ' + mid + ': ' + (r.status || 'ok') + (r.provider ? (' · via ' + r.provider) : '')); }
    catch (e) { setMsg('Falha na execução: ' + e.message); } finally { setBusy(false); }
  };

  // ===== DETALHE DO PROJETO =====
  if (aberto) {
    return (
      <div className="center">
        <div className="center-head hud-grid">
          <div className="ch-top">
            <button className="btn ghost icon" onClick={()=>{setAberto(null);carregar();}} title="Voltar"><Icon name="chevR" size={16} style={{transform:'rotate(180deg)'}}/></button>
            <div className="ch-icon"><Icon name="folder" size={19}/></div>
            <div className="ch-titles">
              <div className="ch-crumb">A FÁBRICA · Projeto {aberto.id}</div>
              <h1 className="ch-title">{aberto.nome}</h1>
              {aberto.descricao && <div className="ch-sub">{aberto.descricao}</div>}
            </div>
            <div className="ch-actions">
              <button className="btn primary" onClick={novaMissao} disabled={busy}><Icon name="plus" size={13}/> Nova missão</button>
            </div>
          </div>
        </div>
        <div className="center-body section-gap">
          {msg && <div className="card" style={{padding:'9px 13px',fontSize:12,borderColor:'var(--accent-line)',background:'var(--accent-soft)'}}>{msg}</div>}

          <SectionCard icon="folder" title="Arquivos & Desenvolvimento (envie o projeto e a Fábrica desenvolve)">
            <div className="faint" style={{fontSize:12, marginBottom:8}}>Briefing (o que desenvolver): {aberto.descricao || '(defina ao criar o projeto — descreva o que a Fábrica deve fazer)'}</div>
            <div style={{display:'flex', gap:8, flexWrap:'wrap', alignItems:'center'}}>
              <label className="btn sm" style={{cursor:'pointer'}}><Icon name="plus" size={12}/> Subir arquivos / .zip<input type="file" multiple style={{display:'none'}} onChange={e=>subirArquivos(e.target.files)} /></label>
              <button className="btn primary sm" disabled={busy} onClick={desenvolver}><Icon name="cpu" size={12}/> Desenvolver com a Fábrica</button>
              <span className="faint" style={{fontSize:11}}>{arquivos.length} arquivo(s) no projeto</span>
            </div>
            {arquivos.length > 0 && <div className="term" style={{marginTop:8, maxHeight:160, overflow:'auto'}}>{arquivos.map((f,i)=><div key={i} className="ln"><span className="t">·</span><span className="lv-info">{f}</span></div>)}</div>}
            {devRes && <div className="card" style={{marginTop:8, padding:10, borderColor: devRes.ok?'var(--ok)':'var(--warn)'}}><div style={{fontSize:12.5, whiteSpace:'pre-wrap'}}>{devRes.result || devRes.status}</div></div>}
          </SectionCard>

          {(() => {
            const htmlFile = (arquivos.find(f => /index\.html$/i.test(f)) || arquivos.find(f => /\.html?$/i.test(f)) || '');
            if (!aberto.raw_id || !htmlFile) return null;
            const previewUrl = '/preview/projeto_' + aberto.raw_id + '/' + htmlFile;
            return (
              <SectionCard icon="eye" title="Preview do projeto (roda no navegador)"
                right={<button className="btn sm primary" onClick={() => window.open(previewUrl, '_blank')}><Icon name="link" size={12} /> Abrir no navegador</button>}>
                <iframe src={previewUrl} title="preview" style={{ width: '100%', height: 480, border: '1px solid var(--border)', borderRadius: 'var(--r-md)', background: '#fff' }} />
              </SectionCard>
            );
          })()}

          <SectionCard icon="target" title={'Missões (' + (aberto.missoes||[]).length + ')'} flush>
            <div className="tbl-wrap"><table className="tbl"><thead><tr><th>ID</th><th>Missão</th><th>Status</th><th style={{width:140}}>Ação</th></tr></thead>
            <tbody>
              {(aberto.missoes||[]).map(ms=>(
                <tr key={ms.id}>
                  <td className="id-cell">{ms.id}</td>
                  <td><div className="cell-strong">{ms.titulo}</div>{ms.description && <div className="faint" style={{fontSize:11}}>{ms.description.slice(0,80)}</div>}</td>
                  <td><span className={'pill '+_misCls(ms.status)}>{ms.status}</span></td>
                  <td><button className="btn sm primary" disabled={busy} onClick={()=>executar(ms.id)}><Icon name="play" size={11}/> {ms.status==='FAILED'?'Reexecutar':'Executar'}</button></td>
                </tr>
              ))}
              {!(aberto.missoes||[]).length && <tr><td colSpan={4} className="faint" style={{padding:12}}>Sem missões. Crie a primeira em "Nova missão".</td></tr>}
            </tbody></table></div>
          </SectionCard>
          <SectionCard icon="doc" title={'Entregas / Evidências (' + entregas.length + ')'} flush>
            <div className="tbl-wrap"><table className="tbl"><thead><tr><th>Missão</th><th>Descrição</th><th>Arquivo</th><th>Quando</th></tr></thead>
            <tbody>
              {entregas.map(e=>(
                <tr key={e.id}>
                  <td className="id-cell">{e.mission_id}</td>
                  <td>{e.descricao}</td>
                  <td className="mono faint" style={{fontSize:10.5}}>{(e.file_path||'').split(/[\\/]/).pop()}</td>
                  <td className="faint" style={{fontSize:11}}>{e.created_at ? new Date(e.created_at).toLocaleString('pt-BR') : '—'}</td>
                </tr>
              ))}
              {!entregas.length && <tr><td colSpan={4} className="faint" style={{padding:12}}>Nenhuma entrega ainda. Execute uma missão para gerar evidência real.</td></tr>}
            </tbody></table></div>
          </SectionCard>
        </div>
      </div>
    );
  }

  // ===== LISTA DE PROJETOS =====
  return (
    <div className="center">
      <PageHead icon="folder" crumb="Negócio" title="Projetos" status={apiOn ? 'IMPL' : 'DEV'}
        sub="Projeto → Missão → execução agêntica → entrega/evidência (fluxo real ponta a ponta)">
        <button className="btn" onClick={carregar} disabled={busy}><Icon name="refresh" size={13}/> Atualizar</button>
        <button className="btn primary" onClick={novoProjeto} disabled={busy || !apiOn}><Icon name="plus" size={13}/> Novo projeto</button>
      </PageHead>
      <div className="center-body section-gap">
        {msg && <div className="card" style={{padding:'9px 13px',fontSize:12,borderColor:'var(--accent-line)',background:'var(--accent-soft)'}}>{msg}</div>}
        {!apiOn && <div className="card" style={{padding:'9px 13px',fontSize:12,borderColor:'var(--warn)',background:'var(--warn-soft)'}}>Backend offline — abra pelo ABRIR_PAINEL_FORJA.</div>}
        {!projetos.length && apiOn && <EmptyState icon="folder" title="Nenhum projeto ainda" sub="Crie o primeiro projeto e adicione missões que os agentes vão executar." action="Novo projeto" onAction={novoProjeto} />}
        <div className="team-grid">
          {projetos.map(p=>(
            <button key={p.id} className="team-card" onClick={()=>abrir(p.id)}>
              <div className="team-card-top">
                <span className="ch-icon" style={{width:34,height:34}}><Icon name="folder" size={17}/></span>
                <div style={{minWidth:0,flex:1,textAlign:'left'}}>
                  <div className="team-card-name">{p.nome}</div>
                  <span className="id-cell mono">{p.id}</span>
                </div>
                <Icon name="chevR" size={15} style={{color:'var(--text-3)'}}/>
              </div>
              {p.descricao && <div className="team-card-sobre">{p.descricao}</div>}
              <div className="team-card-foot" style={{justifyContent:'space-between'}}>
                <span className="tag"><Icon name="target" size={10}/> {p.missoes_total} missões</span>
                <span className="faint" style={{fontSize:11}}>{p.missoes_concluidas} concluídas</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- MISSÕES (dados reais do nexus.db) ---------- */
const MIS_COLS = [
  { key: 'PENDING',   label: 'Pendentes',   dot: 'idle' },
  { key: 'QUEUED',    label: 'Na fila',     dot: 'info' },
  { key: 'RUNNING',   label: 'Em execução', dot: 'ok' },
  { key: 'COMPLETED', label: 'Concluídas',  dot: 'ok' },
  { key: 'FAILED',    label: 'Com falha',   dot: 'err' },
];

function MissoesCenter({ setView }) {
  const D = window.FORJA;
  const [missoes, setMissoes] = useState(D.missoes || []);
  const [sel, setSel] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const apiOn = !!(window.ForjaAPI && window.ForjaAPI.createMission);

  const refresh = async () => {
    if (!window.ForjaAPI || !window.ForjaAPI.refreshMissions) return;
    await window.ForjaAPI.refreshMissions();
    setMissoes((window.FORJA.missoes || []).slice());
  };

  const novaMissao = async () => {
    const titulo = window.prompt('Título da nova missão:');
    if (!titulo || !titulo.trim()) return;
    const descricao = window.prompt('Descrição (opcional):') || '';
    setBusy(true); setMsg('Criando missão…');
    try {
      const r = await window.ForjaAPI.createMission(titulo.trim(), descricao);
      setMissoes((window.FORJA.missoes || []).slice());
      setMsg('Missão criada: ' + (r.id || titulo));
    } catch (e) { setMsg('Falha ao criar missão: ' + e.message); }
    finally { setBusy(false); }
  };

  const executar = async (m) => {
    if (!window.ForjaAPI || !window.ForjaAPI.runMission) return;
    setBusy(true); setMsg('Executando ' + m.id + '…');
    try {
      const r = await window.ForjaAPI.runMission(m.id);
      await refresh();
      const upd = (window.FORJA.missoes || []).find(x => x.id === m.id);
      if (upd) setSel(upd);
      setMsg('Execução concluída: ' + (r.status || 'ok') + (r.provider ? ' · ' + r.provider : ''));
    } catch (e) { setMsg('Falha na execução: ' + e.message); }
    finally { setBusy(false); }
  };

  const byCol = (k) => missoes.filter(m => (m.status || '').toUpperCase() === k);
  const stCls = (s) => ({RUNNING:'ok',FAILED:'err',QUEUED:'info',COMPLETED:'ok'}[(s||'').toUpperCase()] || 'idle');

  return (
    <div className="center">
      <PageHead icon="target" crumb="Operação" title="Missões" status={apiOn ? 'IMPL' : 'DEV'}
        sub={missoes.length + ' missões no banco · ' + byCol('RUNNING').length + ' em execução · ' + byCol('FAILED').length + ' com falha'}>
        <button className="btn" onClick={refresh} disabled={busy}><Icon name="refresh" size={13}/> Atualizar</button>
        <button className="btn primary" onClick={novaMissao} disabled={busy || !apiOn}><Icon name="plus" size={13}/> Nova missão</button>
      </PageHead>
      <div className="center-body section-gap">
        {msg && <div className="card" style={{padding:'9px 13px', fontSize:12, borderColor:'var(--accent-line)', background:'var(--accent-soft)'}}>{msg}</div>}
        {!apiOn && <div className="card" style={{padding:'9px 13px', fontSize:12, borderColor:'var(--warn)', background:'var(--warn-soft)'}}>Backend offline — inicie pelo ABRIR_PAINEL_FORJA para criar/executar missões.</div>}
        <div className="kanban" style={{height:'auto'}}>
          {MIS_COLS.map(col=>(
            <div className="kan-col" key={col.key}>
              <div className="kan-head"><span className={'dot '+col.dot}/><span style={{fontWeight:600,fontSize:11.5}}>{col.label}</span><span className="count">{byCol(col.key).length}</span></div>
              <div className="kan-body">
                {byCol(col.key).map(m=>(
                  <div key={m.id} className="kan-card" onClick={()=>setSel(m)} style={sel&&sel.id===m.id?{borderColor:'var(--accent-line)'}:{}}>
                    <div className="kan-card-top"><span className="id-cell">{m.id}</span></div>
                    <div className="kan-card-title">{m.titulo}</div>
                  </div>
                ))}
                {byCol(col.key).length===0 && <div className="faint" style={{fontSize:11,padding:'10px 6px'}}>vazio</div>}
              </div>
            </div>
          ))}
        </div>

        {sel && (
          <SectionCard icon="target" title={sel.id + ' · ' + sel.titulo} status={undefined}
            right={<span className={'pill '+stCls(sel.status)}>{sel.status}</span>}>
            <div style={{display:'flex', gap:8, marginBottom:10, flexWrap:'wrap'}}>
              <button className="btn primary" disabled={busy} onClick={()=>executar(sel)}>
                <Icon name="play" size={12}/> {sel.status==='FAILED'?'Reexecutar':'Executar missão'}
              </button>
              <button className="btn" disabled={busy} onClick={()=>setSel(null)}>Fechar</button>
            </div>
            {sel.description && <p style={{margin:0, fontSize:12.5, color:'var(--text-2)', lineHeight:1.6}}>{sel.description}</p>}
          </SectionCard>
        )}
      </div>
    </div>
  );
}

/* ---------- INTELIGÊNCIA (real: aciona o agente MARKET_INTEL) ---------- */
function InteligenciaCenter({ setView }) {
  const areas = [
    ['Concorrentes','compass'],['Tendências','chart'],['Benchmark','activity'],['SEO','search'],
    ['Oportunidades','zap'],['Análise visual','eye'],['Pesquisa de mercado','book'],['Relatórios estratégicos','doc'],
  ];
  const apiOn = !!(window.ForjaAPI && window.ForjaAPI.chatMessage);
  const [busy, setBusy] = useState(false);
  const [relatorio, setRelatorio] = useState('');
  const [nicho, setNicho] = useState('');

  const varrer = async () => {
    const n = (nicho || '').trim() || window.prompt('Qual nicho/mercado deseja analisar?');
    if (!n || !n.trim()) return;
    setNicho(n); setBusy(true); setRelatorio('');
    try {
      const r = await window.ForjaAPI.chatMessage(
        'Faça uma análise de inteligência de mercado do nicho "' + n + '": panorama, '
        + 'concorrentes, tendências, oportunidades e ameaças. Separe FATO (com indício) '
        + 'de HIPÓTESE a validar.', 'inteligencia');
      setRelatorio((r && (r.message || r.response)) || 'Sem resposta do agente.');
    } catch (e) { setRelatorio('Falha ao varrer o mercado: ' + (e.message || e)); }
    finally { setBusy(false); }
  };

  return (
    <div className="center">
      <PageHead icon="compass" crumb="Operação" title="Inteligência" status={relatorio ? 'IMPL' : 'DEV'}
        sub="Inteligência de mercado · agente MARKET_INTEL · separa fato de hipótese">
        <input className="input" placeholder="nicho (ex.: aves exóticas)" value={nicho}
          onChange={e=>setNicho(e.target.value)} style={{maxWidth:200,marginRight:8}} />
        <button className="btn primary" onClick={varrer} disabled={busy || !apiOn}>
          <Icon name="refresh" size={13}/> {busy ? 'Analisando…' : 'Varrer mercado'}</button>
      </PageHead>
      <div className="center-body">
        {relatorio ? (
          <div className="card" style={{padding:'16px 18px',whiteSpace:'pre-wrap',lineHeight:1.55,fontSize:13.5}}>{relatorio}</div>
        ) : (
          <EmptyState icon="compass" title={busy ? 'Analisando o mercado…' : 'Pronto para varrer o mercado'} status={busy?'DEV':'IMPL'}
            sub={busy ? 'O agente de Inteligência de Mercado está pesquisando.' : 'Informe um nicho acima e clique em "Varrer mercado" para gerar o relatório real.'} />
        )}
        <div className="grid-3" style={{marginTop:18}}>
          {areas.map(([a,ic])=>(
            <div className="panel" key={a}><div className="panel-body" style={{display:'flex',alignItems:'center',gap:10}}><Icon name={ic} size={14} style={{color:'var(--accent-bright)'}}/><span style={{fontSize:12.5}}>{a}</span><span style={{marginLeft:'auto'}}><StatusPill status="IMPL" size="sm"/></span></div></div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- LLMs (status real + teste ao vivo) ---------- */
const _llmTone = (s) => {
  const v = (s || '').toLowerCase();
  if (v === 'active_real' || v === 'certified' || v === 'router_limited') return 'ok';  // ONLINE
  if (v === 'environment_pending' || v === 'offline' || v === 'unavailable'
      || v === 'error' || v === 'missing_key' || v.indexOf('blocked') >= 0) return 'err';  // FORA
  return 'warn';
};
const _llmLabel = (l) => l.statusLabel || ({
  active_real: 'Online', CERTIFIED: 'Online', ROUTER_LIMITED: 'Online (via router)',
  ENVIRONMENT_PENDING: 'Fora do ar', OFFLINE: 'Fora do ar', unavailable: 'Fora do ar',
  missing_key: 'Sem chave', BLOCKED_BY_BILLING: 'Bloqueada (billing)',
  NOT_IMPLEMENTED: 'Não implementada', ERROR: 'Erro',
}[l.status] || l.status || 'Não validada');

function LLMsCenter({ setView }) {
  const D = window.FORJA;
  const apiOn = !!(window.ForjaAPI && window.ForjaAPI.testProvider);
  const [llms, setLLMs] = useState(D.llms || []);
  const [sel, setSel] = useState((D.llms || [])[0] || null);
  const [busy, setBusy] = useState('');
  const [res, setRes] = useState({}); // id -> resultado do teste

  const reload = async () => {
    if (!window.ForjaAPI.refreshProviders) return;
    const ps = await window.ForjaAPI.refreshProviders();
    if (window.FORJA._mapProvidersFallback) {} // noop
    setLLMs(ps); window.FORJA.llms = ps;
    if (sel) { const u = ps.find(x => x.id === sel.id); if (u) setSel(u); }
  };

  const testar = async (l) => {
    if (!apiOn) return;
    setBusy(l.id);
    try {
      const r = await window.ForjaAPI.testProvider(l.id);
      setRes(s => ({ ...s, [l.id]: r }));
      await reload();
    } catch (e) {
      setRes(s => ({ ...s, [l.id]: { ok: false, error: e.message } }));
    } finally { setBusy(''); }
  };

  // Reconecta: tenta repetidas vezes até dar certo (buscando conexão).
  const reconectar = async (l) => {
    if (!apiOn || !window.ForjaAPI.reconnectProvider) return;
    setBusy(l.id);
    setRes(s => ({ ...s, [l.id]: { connecting: true } }));
    try {
      const r = await window.ForjaAPI.reconnectProvider(l.id, 3);
      setRes(s => ({ ...s, [l.id]: r }));
      await reload();
    } catch (e) {
      setRes(s => ({ ...s, [l.id]: { ok: false, error: e.message } }));
    } finally { setBusy(''); }
  };

  const testarTodos = async () => {
    for (const l of llms) { await reconectar(l); }
  };

  if (!sel) {
    return (
      <div className="center">
        <PageHead icon="zap" crumb="Recursos" title="LLMs" status="CONFIG" sub="Provedores de IA" />
        <div className="center-body"><EmptyState icon="zap" title="Sem provedores carregados"
          sub="Inicie o backend pelo ABRIR_PAINEL_FORJA para ver os provedores reais." /></div>
      </div>
    );
  }

  return (
    <div className="center">
      <PageHead icon="zap" crumb="Recursos" title="LLMs"
        status={llms.some(l=>_llmTone(l.status)==='ok') ? 'IMPL' : 'CONFIG'}
        sub="Assinaturas (Claude, Gemini, ChatGPT) · API (OpenRouter) · Local (Ollama) · teste real ao vivo">
        <button className="btn" onClick={testarTodos} disabled={!!busy || !apiOn}><Icon name="refresh" size={13}/> Testar todos</button>
        <button className="btn primary" onClick={()=>setView('configuracoes')}><Icon name="lock" size={13}/> Configurar no cofre</button>
      </PageHead>
      <div className="center-split wide">
        <div className="split-main">
          <div className="team-grid">
            {llms.map(l=>{
              const ativo = _llmTone(l.status) === 'ok';
              const r = res[l.id];
              return (
              <div key={l.id} className="team-card" onClick={()=>setSel(l)}
                style={Object.assign({cursor:'pointer'}, sel.id===l.id?{borderColor:'var(--accent-line)',background:'var(--accent-soft)'}:{})}>
                <div className="team-card-top">
                  <span className="ch-icon" style={{width:34,height:34}}><Icon name="zap" size={17}/></span>
                  <div style={{minWidth:0,flex:1,textAlign:'left'}}>
                    <div className="team-card-name">{l.provider || l.display_name || l.id}</div>
                    <span className={'pill '+_llmTone(l.status)} style={{fontSize:10}}>{_llmLabel(l)}</span>
                  </div>
                </div>
                <div className="team-card-sobre">{(l.modelos && l.modelos.length) ? ('Modelo: ' + l.modelos[0]) : (l.tipo || '')}</div>
                <div className="team-card-foot" style={{justifyContent:'space-between', marginTop:8}}>
                  <span className="faint" style={{fontSize:11}}>{l.tipo || '—'}</span>
                  <button className={'btn sm '+(ativo?'':'primary')} disabled={busy===l.id || !apiOn}
                    onClick={(e)=>{ e.stopPropagation(); reconectar(l); }}>
                    {busy===l.id
                      ? <><Icon name="refresh" size={11}/> Conectando…</>
                      : ativo ? <><Icon name="refresh" size={11}/> Revalidar</>
                              : <><Icon name="play" size={11}/> Reconectar</>}
                  </button>
                </div>
                {r && !r.connecting && (
                  <div className="faint" style={{fontSize:10.5, marginTop:5, color: r.ok?'var(--ok)':'var(--err)'}}>
                    {r.ok ? ('✓ conectado' + (r.attempts_made ? (' (' + r.attempts_made + ' tent.)') : ''))
                          : ('✕ ' + String(r.error || 'falhou').slice(0, 44))}
                  </div>
                )}
              </div>
              );
            })}
          </div>
        </div>
        <div className="split-side"><div className="detail">
          <div className="detail-head"><div className="ch-crumb">{sel.id}</div><h2>{sel.provider || sel.id}</h2><span className={'pill '+_llmTone(sel.status)}>{_llmLabel(sel)}</span></div>
          <div className="detail-block"><span className="eyebrow">Modelos</span>
            <div className="tags">{(sel.modelos||['—']).map(c=><span key={c} className="tag mono">{c}</span>)}</div>
          </div>
          <div className="detail-block"><span className="eyebrow">Telemetria</span>
            <div className="kv">
              <dt>Tipo</dt><dd className="mono">{sel.tipo || '—'}</dd>
              <dt>Automação</dt><dd className="faint">{sel.automacao || '—'}</dd>
              <dt>Custo incremental</dt><dd className="faint">{sel.custoIncremental || '—'}</dd>
              <dt>Último health</dt><dd className="faint">{sel.ultimoHealth || 'não validado'}</dd>
            </div>
          </div>
          {sel.observacao && <div className="detail-block"><span className="eyebrow">Observação</span>
            <div className="card" style={{padding:'9px 11px', fontSize:11.5}}>{sel.observacao}</div></div>}
          {res[sel.id] && (
            <div className="card" style={{padding:11, borderColor: res[sel.id].ok?'var(--ok)':'var(--err)', background: res[sel.id].ok?'var(--ok-soft, var(--accent-soft))':'var(--err-soft)'}}>
              <div style={{fontSize:12, fontWeight:600, marginBottom:4}}>{res[sel.id].ok ? '✓ Teste OK' : '✕ Falhou'} {res[sel.id].latency_ms!=null?('· '+res[sel.id].latency_ms+'ms'):''}</div>
              <div className="mono" style={{fontSize:11, whiteSpace:'pre-wrap', wordBreak:'break-word'}}>{res[sel.id].ok ? (res[sel.id].response_excerpt||'(sem texto)') : (res[sel.id].error||'erro')}</div>
            </div>
          )}
          <button className="btn primary" style={{width:'100%'}} disabled={busy===sel.id || !apiOn} onClick={()=>reconectar(sel)}>
            <Icon name="play" size={12}/> {busy===sel.id ? 'Reconectando… (tentando até conectar)' : 'Reconectar (tenta até conectar)'}
          </button>
          <div style={{display:'flex', gap:7}}>
            <button className="btn" style={{flex:1}} disabled={busy===sel.id || !apiOn} onClick={()=>testar(sel)}><Icon name="refresh" size={12}/> Testar 1x</button>
            <button className="btn" style={{flex:1}} onClick={()=>setView('configuracoes')}><Icon name="lock" size={12}/> Cofre de chaves</button>
          </div>
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
        <button className="btn primary" onClick={()=>setView('configuracoes')}><Icon name="lock" size={13}/> Configurar no cofre</button>
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

/* ---------- INTEGRAÇÕES DA FÁBRICA (contas globais · logadas uma vez) ---------- */
function IntegracoesCenter({ setView }) {
  const apiOn = !!(window.ForjaAPI && window.ForjaAPI.listAgencyConnections);
  const [connectors, setConnectors] = useState([]);
  const [conns, setConns] = useState([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const carregar = async () => {
    if (!apiOn) return;
    try {
      const cc = await window.ForjaAPI.listConnectors('global'); setConnectors(cc.items || []);
      const r = await window.ForjaAPI.listAgencyConnections(); setConns(r.items || []);
    } catch (e) { setMsg('Falha: ' + e.message); }
  };
  useEffect(() => { carregar(); }, []);

  const byKind = {}; conns.forEach(c => { byKind[c.kind] = c; });

  const conectar = async (con) => {
    const cred = window.prompt('Cole a credencial da Fábrica — ' + con.field + ':'); if (cred === null) return;
    const meta = {};
    for (const f of (con.extra || [])) {
      const v = window.prompt(f.label + ':');
      if (v) meta[f.key] = v.trim();
    }
    setBusy(true); setMsg('Conectando ' + con.kind + '…');
    try { const r = await window.ForjaAPI.addAgencyConnection(con.kind, con.kind, cred.trim(), meta); await carregar(); setMsg(con.kind + ': ' + r.status + (r.detail ? (' · ' + r.detail) : '')); }
    catch (e) { setMsg('Falha: ' + e.message); } finally { setBusy(false); }
  };
  const testar = async (id) => { setBusy(true); try { const r = await window.ForjaAPI.testConnection(id); await carregar(); setMsg('Teste: ' + r.status); } catch (e) { setMsg('Falha: ' + e.message); } finally { setBusy(false); } };
  const remover = async (id) => { setBusy(true); try { await window.ForjaAPI.deleteConnection(id); await carregar(); setMsg('Removida.'); } catch (e) { setMsg('Falha: ' + e.message); } finally { setBusy(false); } };

  return (
    <div className="center">
      <PageHead icon="link" crumb="Recursos" title="Integrações da Fábrica" status={apiOn ? 'IMPL' : 'PARCIAL'}
        sub="Contas da Fábrica (logadas UMA vez, usadas em todos os clientes) · ex.: seu Canva Pro, OpenRouter, GitHub, Telegram">
        <button className="btn" onClick={carregar} disabled={busy}><Icon name="refresh" size={13}/> Atualizar</button>
      </PageHead>
      <div className="center-body section-gap">
        {msg && <div className="card" style={{padding:'9px 13px',fontSize:12,borderColor:'var(--accent-line)',background:'var(--accent-soft)'}}>{msg}</div>}
        <div className="card" style={{padding:10, display:'flex',gap:8,alignItems:'center', borderColor:'var(--info)', background:'var(--info-soft)'}}>
          <Icon name="lock" size={14} style={{color:'var(--info)'}}/><span style={{fontSize:11.5}}>Estas são as contas da <b>Fábrica</b>. As contas <b>de cada cliente</b> (ex.: Instagram dele) ficam em <button className="lnk" onClick={()=>setView('clientes')}>Clientes</button>. Credenciais nunca exibidas.</span>
        </div>
        {!apiOn && <div className="card" style={{padding:'9px 13px',fontSize:12,borderColor:'var(--warn)',background:'var(--warn-soft)'}}>Backend offline — abra pelo ABRIR_PAINEL_FORJA.</div>}
        <div className="team-grid">
          {connectors.map(con => {
            const c = byKind[con.kind];
            return (
              <div key={con.kind} className="team-card" style={{cursor:'default'}}>
                <div className="team-card-top">
                  <span className="ch-icon" style={{width:32,height:32}}><Icon name="link" size={15}/></span>
                  <div style={{minWidth:0,flex:1}}>
                    <div className="team-card-name">{con.label}</div>
                    <span className={'pill ' + (c ? _connTone(c.status) : '')} style={{fontSize:10}}>{c ? c.status : 'não conectado'}</span>
                  </div>
                </div>
                <div className="faint" style={{fontSize:10.5, margin:'4px 0 8px'}}>{con.how}</div>
                <div className="team-card-foot" style={{justifyContent:'flex-end', gap:6}}>
                  {c && <button className="btn ghost sm" disabled={busy} onClick={()=>testar(c.id)}>Testar</button>}
                  {c && <button className="btn ghost sm" disabled={busy} onClick={()=>remover(c.id)}>Remover</button>}
                  <button className="btn sm primary" disabled={busy || !apiOn} onClick={()=>conectar(con)}>{c ? 'Atualizar' : 'Conectar'}</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------- CONHECIMENTO (contagens reais do repositório) ---------- */
function ConhecimentoCenter({ setView }) {
  const D = window.FORJA;
  const apiOn = !!(window.ForjaAPI && window.ForjaAPI.getKnowledge);
  const [know, setKnow] = useState(D.knowledge || null);
  const [busy, setBusy] = useState(false);

  const atualizar = async () => {
    if (!apiOn) return;
    setBusy(true);
    try { setKnow(await window.ForjaAPI.getKnowledge()); }
    catch (e) { /* mantém último estado */ }
    finally { setBusy(false); }
  };
  useEffect(() => { if (!know) atualizar(); }, []);

  const adicionar = async () => {
    if (!window.ForjaAPI || !window.ForjaAPI.addKnowledge) return;
    const titulo = window.prompt('Título da nota de conhecimento:'); if (!titulo || !titulo.trim()) return;
    const categoria = (window.prompt('Categoria (rules, workflows, skills, templates, library, memory):', 'library') || 'library').trim();
    const conteudo = window.prompt('Conteúdo da nota:'); if (!conteudo || !conteudo.trim()) return;
    setBusy(true);
    try {
      const r = await window.ForjaAPI.addKnowledge(categoria, titulo, conteudo);
      await atualizar();
      alert('Conhecimento adicionado: ' + (r.file || titulo));
    } catch (e) { alert('Falha ao adicionar: ' + (e.message || e)); }
    finally { setBusy(false); }
  };

  const realById = {};
  if (know && Array.isArray(know.items)) know.items.forEach(it => { realById[it.id] = it; });
  const total = know ? know.total_items : null;

  return (
    <div className="center">
      <PageHead icon="book" crumb="Recursos" title="Conhecimento" status={total ? 'IMPL' : 'DEV'}
        sub={total != null
          ? (total + ' itens reais indexados no repositório · Rules · Workflows · Skills · Templates · Biblioteca · Memória')
          : 'Rules · Workflows · Skills · Templates · Biblioteca · Memória'}>
        <button className="btn" onClick={adicionar} disabled={busy || !apiOn}><Icon name="plus" size={13}/> Adicionar</button>
        <button className="btn primary" onClick={atualizar} disabled={busy || !apiOn}><Icon name="refresh" size={13}/> {busy?'Atualizando…':'Atualizar'}</button>
      </PageHead>
      <div className="center-body">
        <div className="team-grid">
          {D.conhecimento.map(c=>{
            const real = realById[c.id];
            const count = real ? real.count : c.count;
            const st = real ? (real.count > 0 ? 'IMPL' : 'DEV') : c.status;
            return (
              <div key={c.id} className="team-card" style={{cursor:'default'}}>
                <div className="team-card-top">
                  <span className="ch-icon" style={{width:34,height:34}}><Icon name={c.icon} size={16}/></span>
                  <div style={{minWidth:0,flex:1}}>
                    <div className="team-card-name">{c.nome}</div>
                    <span className="faint" style={{fontSize:11}}>{c.sub}</span>
                  </div>
                  <StatusPill status={st} size="sm"/>
                </div>
                <div className="team-card-foot" style={{justifyContent:'space-between'}}>
                  <span className="mono" style={{fontSize:18,fontWeight:600}}>{count}</span>
                  <span className="faint" style={{fontSize:11}}>{real ? 'arquivos reais' : 'itens'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------- ENVIAR PROJETO (página dedicada de upload + briefing) ---------- */
function EnviarProjetoCenter({ setView }) {
  const apiOn = !!(window.ForjaAPI && window.ForjaAPI.createProject);
  const [clientes, setClientes] = useState([]);
  const [cli, setCli] = useState('');
  const [nome, setNome] = useState('');
  const [briefing, setBriefing] = useState('');
  const [picked, setPicked] = useState([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [proj, setProj] = useState(null);
  const [devRes, setDevRes] = useState(null);

  useEffect(() => { if (apiOn && window.ForjaAPI.listClients) window.ForjaAPI.listClients().then(r => setClientes(r.items || [])).catch(() => {}); }, []);

  const pickFiles = (fileList, fromFolder) => {
    const arr = Array.from(fileList || []).map(f => ({ name: (fromFolder && f.webkitRelativePath) ? f.webkitRelativePath : f.name, file: f }));
    setPicked(p => [...p, ...arr]);
  };

  const enviar = async () => {
    if (!nome.trim()) { setMsg('Dê um nome ao projeto.'); return; }
    setBusy(true); setMsg('Criando projeto…'); setDevRes(null);
    try {
      const pr = await window.ForjaAPI.createProject(nome.trim(), briefing.trim(), cli || undefined);
      setProj(pr);
      if (picked.length) {
        setMsg('Enviando ' + picked.length + ' arquivo(s)…');
        const files = await Promise.all(picked.map(p => new Promise(res => {
          const r = new FileReader(); r.onload = () => res({ name: p.name, data_url: r.result }); r.readAsDataURL(p.file);
        })));
        const up = await window.ForjaAPI.uploadProjectFiles(pr.id, files);
        setMsg('✓ Projeto criado (' + pr.id + ') · ' + up.saved + ' arquivo(s) enviados.');
      } else {
        setMsg('✓ Projeto criado (' + pr.id + '). Você pode subir arquivos depois em Projetos.');
      }
    } catch (e) { setMsg('Falha: ' + e.message); } finally { setBusy(false); }
  };

  const desenvolver = async () => {
    if (!proj) return;
    setBusy(true); setMsg('A Fábrica (agente Desenvolvedor) está trabalhando…');
    try { const r = await window.ForjaAPI.developProject(proj.id); setDevRes(r); setMsg('Desenvolvimento: ' + (r.status || '')); }
    catch (e) { setMsg('Falha: ' + e.message); } finally { setBusy(false); }
  };

  const inp = { background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', color: 'var(--text-1)', padding: '8px 10px', fontSize: 13, fontFamily: 'inherit' };
  return (
    <div className="center">
      <PageHead icon="box" crumb="Negócio" title="Enviar projeto" status={apiOn ? 'IMPL' : 'PARCIAL'}
        sub="Suba a pasta/arquivos do projeto e descreva o que a Fábrica deve desenvolver — tudo em uma tela" />
      <div className="center-body section-gap" style={{ maxWidth: 840 }}>
        {msg && <div className="card" style={{ padding: '9px 13px', fontSize: 12, borderColor: 'var(--accent-line)', background: 'var(--accent-soft)' }}>{msg}</div>}
        {!apiOn && <div className="card" style={{ padding: '9px 13px', fontSize: 12, borderColor: 'var(--warn)', background: 'var(--warn-soft)' }}>Backend offline — abra pelo ABRIR_PAINEL_FORJA.</div>}

        <SectionCard icon="folder" title="Dados do projeto">
          <div className="section-gap">
            <div><div className="eyebrow">Cliente (opcional)</div>
              <select style={inp} value={cli} onChange={e => setCli(e.target.value)}>
                <option value="">(sem cliente)</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
            <div><div className="eyebrow">Nome do projeto</div>
              <input style={{ ...inp, width: '100%' }} value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex.: Site institucional da Cafeteria" />
            </div>
            <div><div className="eyebrow">O que desenvolver (briefing / prompt)</div>
              <textarea rows={5} style={{ ...inp, width: '100%', resize: 'vertical' }} value={briefing} onChange={e => setBriefing(e.target.value)}
                placeholder="Descreva o que a Fábrica deve fazer: páginas, funções, estilo, o que finalizar, exemplos…" />
            </div>
          </div>
        </SectionCard>

        <SectionCard icon="box" title="Arquivos do projeto (opcional)">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <label className="btn sm" style={{ cursor: 'pointer' }}><Icon name="plus" size={12} /> Selecionar arquivos / .zip<input type="file" multiple style={{ display: 'none' }} onChange={e => pickFiles(e.target.files, false)} /></label>
            <label className="btn sm" style={{ cursor: 'pointer' }}><Icon name="folder" size={12} /> Selecionar pasta<input type="file" webkitdirectory="" directory="" multiple style={{ display: 'none' }} onChange={e => pickFiles(e.target.files, true)} /></label>
            {picked.length > 0 && <button className="btn ghost sm" onClick={() => setPicked([])}>limpar ({picked.length})</button>}
          </div>
          {picked.length > 0 && <div className="term" style={{ marginTop: 8, maxHeight: 170, overflow: 'auto' }}>{picked.slice(0, 120).map((p, i) => <div key={i} className="ln"><span className="t">·</span><span className="lv-info">{p.name}</span></div>)}</div>}
          <div className="faint" style={{ fontSize: 10.5, marginTop: 6 }}>Para manter a estrutura de pastas, use "Selecionar pasta" ou suba um .zip.</div>
        </SectionCard>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn primary" disabled={busy || !apiOn} onClick={enviar}><Icon name="rocket" size={13} /> {busy ? 'Enviando…' : 'Enviar projeto'}</button>
          {proj && <button className="btn" disabled={busy} onClick={desenvolver}><Icon name="cpu" size={13} /> Desenvolver com a Fábrica</button>}
          {proj && proj.raw_id && <button className="btn" onClick={() => window.open('/preview/projeto_' + proj.raw_id + '/', '_blank')}><Icon name="eye" size={13} /> Ver preview</button>}
          {proj && <button className="btn" onClick={() => setView('projetos')}>Abrir em Projetos</button>}
        </div>
        {devRes && <div className="card" style={{ padding: 11, borderColor: devRes.ok ? 'var(--ok)' : 'var(--warn)' }}><div style={{ fontSize: 12.5, whiteSpace: 'pre-wrap' }}>{devRes.result || devRes.status}</div></div>}
      </div>
    </div>
  );
}

Object.assign(window, { ClientesCenter, ProjetosCenter, EnviarProjetoCenter, MissoesCenter, InteligenciaCenter, LLMsCenter, FerramentasCenter, IntegracoesCenter, ConhecimentoCenter });
