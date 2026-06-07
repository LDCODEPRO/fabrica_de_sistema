
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Missions from './pages/Missions';
import Team from './pages/Team';
import LlmHub from './pages/LlmHub';
import Audits from './pages/Audits';
import CommandCenter from './pages/CommandCenter';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="missions" element={<Missions />} />
          <Route path="team" element={<Team />} />
          <Route path="llm-hub" element={<LlmHub />} />
          <Route path="audits" element={<Audits />} />
          <Route path="command-center" element={<CommandCenter />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
