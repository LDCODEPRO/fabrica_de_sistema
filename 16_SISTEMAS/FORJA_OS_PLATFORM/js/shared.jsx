/* ============================================================
   FORJA — primitivos compartilhados: ícones, charts, hooks
   Exporta tudo em window.*
   ============================================================ */
const { useState, useEffect, useRef, useCallback, createContext, useContext } = React;

/* ---------- ícones (linha, estilo técnico) ---------- */
const ICON_PATHS = {
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  layers: 'M12 2 2 7l10 5 10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  target: 'M12 2a10 10 0 100 20 10 10 0 000-20zM12 7a5 5 0 100 10 5 5 0 000-10zM12 11a1 1 0 100 2 1 1 0 000-2z',
  cpu: 'M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3M5 5h14v14H5zM9 9h6v6H9z',
  route: 'M6 19a3 3 0 100-6 3 3 0 000 6zM18 11a3 3 0 100-6 3 3 0 000 6zM6 13V8a3 3 0 013-3h6',
  rocket: 'M4.5 16.5 3 21l4.5-1.5M9 15l6-6M14 4s4 0 6 2 2 6 2 6c-3 3-7 4-7 4l-2-2-3-3-2-2s1-4 4-7zM15 9a1 1 0 100-2 1 1 0 000 2z',
  shield: 'M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5zM9 12l2 2 4-4',
  book: 'M4 4h11a3 3 0 013 3v13H7a3 3 0 00-3 3zM4 4v15M19 7H8',
  gear: 'M12 8a4 4 0 100 8 4 4 0 000-8zM19.4 13a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-2.7 1.1V21a2 2 0 11-4 0v-.2A1.6 1.6 0 004.6 19l-.1.1a2 2 0 11-2.8-2.8l.1-.1A1.6 1.6 0 003 13H3a2 2 0 110-4h.2A1.6 1.6 0 005 6.6l-.1-.1A2 2 0 117.7 3.7l.1.1A1.6 1.6 0 0011 3V3a2 2 0 014 0v.2a1.6 1.6 0 002.7 1.1l.1-.1a2 2 0 112.8 2.8l-.1.1A1.6 1.6 0 0021 9',
  folder: 'M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z',
  search: 'M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.3-4.3',
  bell: 'M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0',
  chat: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z',
  play: 'M5 3l14 9-14 9z',
  pause: 'M6 4h4v16H6zM14 4h4v16h-4z',
  plus: 'M12 5v14M5 12h14',
  send: 'M22 2 11 13M22 2l-7 20-4-9-9-4z',
  chevR: 'M9 6l6 6-6 6',
  chevD: 'M6 9l6 6 6-6',
  dots: 'M12 6a1 1 0 100-2 1 1 0 000 2zM12 13a1 1 0 100-2 1 1 0 000 2zM12 20a1 1 0 100-2 1 1 0 000 2z',
  sun: 'M12 7a5 5 0 100 10 5 5 0 000-10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4',
  moon: 'M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z',
  terminal: 'M4 17l6-6-6-6M12 19h8',
  git: 'M6 3v12M18 9a3 3 0 100 6 3 3 0 000-6zM6 21a3 3 0 100-6 3 3 0 000 6zM6 3a3 3 0 100 6 3 3 0 000-6zM15 6h-2a3 3 0 00-3 3v6',
  zap: 'M13 2L3 14h9l-1 8 10-12h-9z',
  clock: 'M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v6l4 2',
  check: 'M20 6L9 17l-5-5',
  x: 'M18 6L6 18M6 6l12 12',
  alert: 'M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L14.7 3.9a2 2 0 00-3.4 0z',
  doc: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6',
  filter: 'M22 3H2l8 9.5V19l4 2v-8.5z',
  refresh: 'M3 12a9 9 0 0115-6.7L21 8M21 3v5h-5M21 12a9 9 0 01-15 6.7L3 16M3 21v-5h5',
  command: 'M18 3a3 3 0 00-3 3v12a3 3 0 103-3H6a3 3 0 103 3V6a3 3 0 10-3 3h12a3 3 0 103-3z',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 100 6 3 3 0 000-6z',
  flame: 'M12 2s5 4 5 9a5 5 0 01-10 0c0-1.5.6-2.8 1.2-3.6C9 9 9.5 10 11 10c0-2 1-4-1-6 2 0 3 1 3 1',
  activity: 'M22 12h-4l-3 9L9 3l-3 9H2',
  db: 'M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3zM4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6',
  box: 'M21 8l-9-5-9 5v8l9 5 9-5zM3 8l9 5 9-5M12 13v8',
  panelR: 'M3 4h18v16H3zM15 4v16',
  panelL: 'M3 4h18v16H3zM9 4v16',
  link: 'M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1',
  dollar: 'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6',
  squares: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
  pulse: 'M22 12h-4l-3 9L9 3l-3 9H2',
  users: 'M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
  server: 'M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01',
  sitemap: 'M9 3h6v4H9zM3 17h6v4H3zM15 17h6v4h-6zM12 7v4M6 17v-2a2 2 0 012-2h8a2 2 0 012 2v2',
  compass: 'M12 2a10 10 0 100 20 10 10 0 000-20zM16.2 7.8l-2.9 6.4-6.4 2.9 2.9-6.4z',
  home: 'M3 11l9-8 9 8M5 9v11a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V9',
  building: 'M4 22V4a2 2 0 012-2h8a2 2 0 012 2v18M4 22h16M9 7h.01M13 7h.01M9 11h.01M13 11h.01M9 15h.01M13 15h.01M18 22V9h2a1 1 0 011 1v12',
  wrench: 'M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z',
  flask: 'M9 3h6M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3M6.5 14h11',
  award: 'M12 15a6 6 0 100-12 6 6 0 000 12zM8.2 13.5L7 22l5-3 5 3-1.2-8.5',
  cap: 'M22 10L12 5 2 10l10 5 10-5zM6 12v5c0 1.2 2.7 3 6 3s6-1.8 6-3v-5',
  help: 'M12 2a10 10 0 100 20 10 10 0 000-20zM9.1 9a3 3 0 015.8 1c0 2-3 3-3 3M12 17h.01',
  megaphone: 'M3 11v2a1 1 0 001 1h2l4 4V6L6 10H4a1 1 0 00-1 1zM15 8a4 4 0 010 8M18 5a8 8 0 010 14',
  chart: 'M3 3v18h18M7 14l3-3 3 3 5-6',
  file: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6',
  lock: 'M5 11h14v10H5zM8 11V7a4 4 0 018 0v4',
  play2: 'M5 3l14 9-14 9z',
  stop: 'M6 6h12v12H6z',
};

function Icon({ name, size = 16, stroke = 2, fill, style, className }) {
  const d = ICON_PATHS[name];
  const filled = name === 'play' || name === 'flame';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? (fill || 'currentColor') : 'none'}
      stroke={filled ? 'none' : 'currentColor'} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      style={style} className={className} aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

/* ---------- mini charts (SVG) ---------- */
function Sparkline({ data, w = 120, h = 32, color = 'var(--accent)', fillArea = true, strokeW = 1.6 }) {
  const min = Math.min(...data), max = Math.max(...data);
  const rng = max - min || 1;
  const pts = data.map((v, i) => [ (i / (data.length - 1)) * w, h - ((v - min) / rng) * (h - 4) - 2 ]);
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = line + ` L${w} ${h} L0 ${h} Z`;
  const gid = 'sg' + Math.round(min * 99 + max * 7 + data.length);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={color} stopOpacity="0.28" />
        <stop offset="1" stopColor={color} stopOpacity="0" />
      </linearGradient></defs>
      {fillArea && <path d={area} fill={`url(#${gid})`} />}
      <path d={line} fill="none" stroke={color} strokeWidth={strokeW} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function Bars({ data, w = 120, h = 32, color = 'var(--accent)', gap = 2 }) {
  const max = Math.max(...data) || 1;
  const bw = (w - gap * (data.length - 1)) / data.length;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      {data.map((v, i) => {
        const bh = Math.max(2, (v / max) * h);
        return <rect key={i} x={i * (bw + gap)} y={h - bh} width={bw} height={bh} rx={1} fill={color} opacity={0.35 + 0.65 * (v / max)} />;
      })}
    </svg>
  );
}

function Donut({ value, size = 44, stroke = 5, color = 'var(--accent)', track = 'var(--bg-4)', label }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={c * (1 - value)} strokeLinecap="round" />
      </svg>
      {label && <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
        fontFamily: 'var(--font-mono)', fontSize: size > 50 ? 12 : 10, fontWeight: 600 }}>{label}</div>}
    </div>
  );
}

function Progress({ value, color = 'var(--accent)', h = 4 }) {
  return (
    <div style={{ height: h, background: 'var(--bg-4)', borderRadius: 99, overflow: 'hidden', width: '100%' }}>
      <div style={{ height: '100%', width: (value * 100) + '%', background: color, borderRadius: 99, transition: 'width .4s' }} />
    </div>
  );
}

/* ---------- hooks ---------- */
function useLocalStorage(key, initial) {
  const [v, setV] = useState(() => {
    try { const s = localStorage.getItem(key); return s !== null ? JSON.parse(s) : initial; }
    catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [key, v]);
  return [v, setV];
}

/* mapeia status → classe de cor */
const STATUS_CLASS = {
  ok: 'ok', live: 'ok', concluída: 'ok', indexado: 'ok', running: 'ok', executando: 'ok',
  warn: 'warn', review: 'info', revisão: 'info', planejada: 'info', indexando: 'info',
  building: 'acc', paused: 'warn', idle: '', backlog: '',
  blocked: 'err', bloqueada: 'err', erro: 'err', fail: 'err', 'crítico': 'err', aviso: 'warn', info: 'info',
};

/* ============================================================
   ZERO GHOST LAW — componentes de status honesto
   ============================================================ */
function StatusPill({ status, size = 'md' }) {
  const ST = (window.FORJA && window.FORJA.ST) || {};
  const s = ST[status] || { label: status, tone: 'idle' };
  return (
    <span className={'zg zg-' + s.tone + (size==='sm'?' zg-sm':'')}>
      <span className="zg-dot" />{s.label}
    </span>
  );
}

function EmptyState({ icon = 'box', title, sub, action, onAction, status }) {
  return (
    <div className="empty">
      <div className="empty-ic"><Icon name={icon} size={24} /></div>
      <div className="empty-title">{title}</div>
      {status && <div style={{margin:'2px 0 2px'}}><StatusPill status={status} /></div>}
      {sub && <div className="empty-sub">{sub}</div>}
      {action && <button className="btn" style={{marginTop:6}} onClick={onAction}>{action}</button>}
    </div>
  );
}

/* cabeçalho de página padrão com status Zero Ghost */
function PageHead({ icon, crumb, title, sub, status, children }) {
  return (
    <div className="center-head hud-grid">
      <div className="ch-top">
        <div className="ch-icon"><Icon name={icon} size={19} /></div>
        <div className="ch-titles">
          <div className="ch-crumb">A FÁBRICA · {crumb}</div>
          <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
            <h1 className="ch-title">{title}</h1>
            {status && <StatusPill status={status} />}
          </div>
          {sub && <div className="ch-sub">{sub}</div>}
        </div>
        {children && <div className="ch-actions">{children}</div>}
      </div>
    </div>
  );
}

/* card de seção com título + status opcional */
function SectionCard({ icon, title, status, right, children, flush }) {
  return (
    <div className="panel">
      <div className="panel-head">
        {icon && <Icon name={icon} size={14} style={{color:'var(--text-2)'}}/>}
        <h3>{title}</h3>
        {status && <StatusPill status={status} size="sm" />}
        {right && <div className="right">{right}</div>}
      </div>
      <div className={'panel-body' + (flush?' flush':'')}>{children}</div>
    </div>
  );
}

/* ---------- exportação CSV real (download client-side) ---------- */
function downloadCSV(filename, rows) {
  if (!rows || !rows.length) { alert('Nada para exportar.'); return; }
  const cols = Object.keys(rows[0]);
  const esc = (v) => {
    const s = v == null ? '' : String(v);
    return /[",\n;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const csv = [cols.join(';')]
    .concat(rows.map(r => cols.map(c => esc(r[c])).join(';')))
    .join('\r\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

Object.assign(window, { Icon, Sparkline, Bars, Donut, Progress, useLocalStorage, STATUS_CLASS,
  StatusPill, EmptyState, PageHead, SectionCard, downloadCSV,
  useState, useEffect, useRef, useCallback, createContext, useContext });
