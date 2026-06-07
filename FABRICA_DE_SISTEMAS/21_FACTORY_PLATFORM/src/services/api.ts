import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

// Tipagens básicas
export interface Project {
  id: string;
  name: string;
  status: string;
  priority: string;
  updated_at: string;
}

export interface Task {
  id: string;
  mission_id: string;
  status: string;
}

export interface Mission {
  id: string;
  project_id: string;
  goal: string;
  status: string;
  tasks?: Task[];
}

export interface Agent {
  id: string;
  role: string;
  status: string;
}

export const factoryApi = {
  getDashboard: () => api.get('/dashboard').then(res => res.data),
  getProjects: () => api.get('/projects').then(res => res.data),
  getMissions: () => api.get('/missions').then(res => res.data),
  getAgents: () => api.get('/agents').then(res => res.data),
  getLlmStatus: () => api.get('/llm/status').then(res => res.data),
  getAudits: () => api.get('/audits').then(res => res.data),
  createProject: (data: any) => api.post('/project/create', data).then(res => res.data),
  createMission: (data: any) => api.post('/mission/create', data).then(res => res.data),
};

export default api;
