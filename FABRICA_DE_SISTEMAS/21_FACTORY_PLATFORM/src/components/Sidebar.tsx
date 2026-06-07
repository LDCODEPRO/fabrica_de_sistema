
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Target, Users, Cpu, ShieldCheck, TerminalSquare } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const menuItems = [
    { path: '/', label: 'Painel Inicial', icon: <LayoutDashboard size={20} /> },
    { path: '/projects', label: 'Projetos', icon: <FolderKanban size={20} /> },
    { path: '/missions', label: 'Missões', icon: <Target size={20} /> },
    { path: '/team', label: 'Equipe', icon: <Users size={20} /> },
    { path: '/llm-hub', label: 'Central de IA', icon: <Cpu size={20} /> },
    { path: '/audits', label: 'Auditoria', icon: <ShieldCheck size={20} /> },
    { path: '/command-center', label: 'Command Center', icon: <TerminalSquare size={20} /> },
  ];

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <h2 className="text-gradient">Factory OS</h2>
        <div className="status-indicator">
          <span className="dot animate-pulse"></span>
          <span className="text-xs text-muted">ONLINE</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <p className="text-xs text-muted">V 1.0.0-REAL</p>
      </div>
    </aside>
  );
};

export default Sidebar;
