import axios from 'axios';

// 本番環境では同じドメインの /api を使用、開発環境では localhost:3001 を使用
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.MODE === 'production' ? '/api' : 'http://localhost:3001/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// お題生成API
export const topicsApi = {
  getRandom: () => api.get('/topics/random'),
  getRecommended: () => api.get('/topics/recommended'),
};

// 練習セッションAPI
export const practiceApi = {
  create: (formData: FormData) => api.post('/practice', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getAll: () => api.get('/practice'),
  getById: (id: number) => api.get(`/practice/${id}`),
  updateReflection: (id: number, data: any) => api.patch(`/practice/${id}/reflection`, data),
};

// 統計API
export const statsApi = {
  get: () => api.get('/stats'),
};

// AI分析API
export const aiApi = {
  generateReport: () => api.post('/ai/report'),
  getReport: () => api.get('/ai/report'),
};

export default api;
