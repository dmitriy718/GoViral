import axios from 'axios';
import { auth } from './firebase';
import { toast } from 'react-hot-toast';

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/$/, '');

const api = axios.create({
  baseURL: apiBaseUrl,
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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.response?.data?.message || 'Something went wrong';
    // Don't toast for 401s as the auth context might handle it, or it might be a silent refresh
    if (error.response?.status !== 401) {
      toast.error(message);
    }
    return Promise.reject(error);
  }
);


export const generateContent = async (
  keywords: string[],
  tone: string,
  postType: string,
  platform: string = 'twitter',
  includeMedia: boolean = false,
  generationMode: 'text' | 'image' | 'mix' | 'repurpose' = 'mix',
  sourceContent?: string
) => {
  const response = await api.post('/posts/generate', { keywords, tone, postType, platform, includeMedia, generationMode, sourceContent });
  return response.data.suggestions;
};

export interface PostPayload {
  content: string;
  mediaUrl?: string;
  platform?: string;
  scheduledAt?: Date;
  autoPlugEnabled?: boolean;
  autoPlugThreshold?: number;
  autoPlugContent?: string;
  autoDmEnabled?: boolean;
  autoDmKeyword?: string;
  autoDmContent?: string;
}

export const savePost = async (data: PostPayload) => {
  const response = await api.post('/posts', data);
  return response.data;
};

// ... existing competitor methods ...

// Notion
export const connectNotion = async (databaseId: string, accessToken: string) => {
  const response = await api.post('/notion/connect', { databaseId, accessToken });
  return response.data;
};

export const syncNotion = async () => {
  const response = await api.post('/notion/sync');
  return response.data;
};

export const addCompetitor = async (handle: string) => {
  const response = await api.post('/competitors', { handle });
  return response.data;
};

export const getCompetitors = async () => {
  const response = await api.get('/competitors');
  return response.data;
};

// Drafts (Posts with status=DRAFT)
export interface Post {
  id: string;
  status: string;
  content: string;
  [key: string]: unknown;
}

export const getDrafts = async () => {
  const response = await api.get('/posts?status=DRAFT');
  return response.data;
};

export const createProject = async (data: Record<string, unknown>) => {
  const response = await api.post('/projects', data);
  return response.data;
};

interface ErrorDetails {
  message: string;
  stack?: string;
  url: string;
  timestamp: string;
}

export const reportClientError = async (errorDetails: ErrorDetails) => {
  // We use a clean axios call here to avoid circular dependencies or auth issues
  // Using fetch for simplicity and robustness in error scenarios
  try {
    await fetch(`${apiBaseUrl}/errors/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorDetails)
    });
  } catch (e) {
    console.error("Failed to report error itself", e);
  }
};

export const getUserProfile = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

export const updateUserProfile = async (data: Record<string, unknown>) => {
  const response = await api.put('/users/me', data);
  return response.data;
};


export const getDashboardStats = async () => {
  const response = await api.get('/analytics/dashboard');
  return response.data;
};

export const getTrends = async () => {
  const response = await api.get('/trends');
  return response.data;
};

export const getDetailedReport = async (range: string = '7d') => {
  const response = await api.get(`/analytics/report?range=${range}`);
  return response.data;
};

export const connectProvider = async (provider: string) => {
  const response = await api.post('/social/connect', { provider });
  return response.data;
};

export const getSocialAccounts = async () => {
  const response = await api.get('/social');
  return response.data;
};

export default api;
