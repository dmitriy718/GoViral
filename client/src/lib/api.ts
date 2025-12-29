import axios from 'axios';
import { auth } from './firebase';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const generateContent = async (keywords: string[], tone: string, postType: string, platform: string = 'twitter') => {
  const response = await api.post('/posts/generate', { keywords, tone, postType, platform });
  return response.data.suggestions;
};

export const savePost = async (content: string, postType: string, scheduledAt?: Date) => {
  const response = await api.post('/posts', {
    content,
    platform: 'twitter', // default
    postType,
    scheduledAt
  });
  return response.data;
};

// Competitors
export const addCompetitor = async (handle: string) => {
  const response = await api.post('/competitors', { handle });
  return response.data;
};

export const getCompetitors = async () => {
  const response = await api.get('/competitors');
  return response.data;
};

// Drafts (Posts with status=DRAFT)
export const getDrafts = async () => {
  const response = await api.get('/posts'); // logic to filter on client or server? 
  // Server getPosts returns all. Let's filter here for now or update server.
  // Ideally server should support ?status=DRAFT. 
  // For now, let's just fetch all and filter client side to match "Drafts" UI requirement.
  return response.data.filter((p: any) => p.status === 'DRAFT');
};

export const createProject = async (data: any) => {
  const response = await api.post('/projects', data);
  return response.data;
};

export const reportClientError = async (errorDetails: any) => {
  // We use a clean axios call here to avoid circular dependencies or auth issues
  // Using fetch for simplicity and robustness in error scenarios
  try {
    await fetch('http://localhost:5000/api/errors/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorDetails)
    });
  } catch (e) {
    console.error("Failed to report error itself", e);
  }
};

export const updateUserProfile = async (data: any) => {
  // Mock API call for now, can be replaced with real endpoint later
  // const response = await api.put('/users/profile', data);
  // return response.data;
  return new Promise((resolve) => setTimeout(() => resolve(data), 1000));
};

export default api;
