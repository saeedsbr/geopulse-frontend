import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('geopulse_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('geopulse_token');
    }
    return Promise.reject(error);
  }
);

export default api;

// API functions
export const conflictApi = {
  getAll: () => api.get('/conflicts'),
  getById: (id: string) => api.get(`/conflicts/${id}`),
  getActive: () => api.get('/conflicts/active'),
  getByRegion: (region: string) => api.get(`/conflicts/region/${region}`),
  getByCountry: (countryId: string) => api.get(`/conflicts/country/${countryId}`),
  getEvents: (id: string) => api.get(`/conflicts/${id}/events`),
  getStats: (id: string) => api.get(`/conflicts/${id}/stats`),
  getRecentEvents: (hours?: number) => api.get(`/conflicts/events/recent`, { params: { hours } }),
};

export const countryApi = {
  getAll: () => api.get('/countries'),
  getById: (id: string) => api.get(`/countries/${id}`),
  getByIsoCode: (isoCode: string) => api.get(`/countries/iso/${isoCode}`),
  getDashboard: (isoCode: string) => api.get(`/countries/iso/${isoCode}/dashboard`),
};

export const newsApi = {
  getAll: (page = 0, size = 20) => api.get('/news', { params: { page, size } }),
  getById: (id: string) => api.get(`/news/${id}`),
  getByCategory: (category: string, page = 0) => api.get(`/news/category/${category}`, { params: { page } }),
  getByCountry: (countryId: string, page = 0) => api.get(`/news/country/${countryId}`, { params: { page } }),
  getBreaking: () => api.get('/news/breaking'),
};

export const warRoomApi = {
  getData: () => api.get('/warroom'),
};

export const alertApi = {
  getAll: (page = 0) => api.get('/alerts', { params: { page } }),
  getUnread: () => api.get('/alerts/unread'),
  getUnreadCount: () => api.get('/alerts/unread/count'),
  markAsRead: (id: string) => api.patch(`/alerts/${id}/read`),
  markAllAsRead: () => api.patch('/alerts/read-all'),
};

export const eventApi = {
  getAll: () => api.get('/events'),
  getById: (id: string) => api.get(`/events/${id}`),
  getByCountry: (isoCode: string) => api.get(`/events/country/${isoCode}`),
  getByConflict: (conflictId: string) => api.get(`/events/conflict/${conflictId}`),
};

export const authApi = {
  login: (data: { username: string; password: string }) => api.post('/auth/login', data),
  register: (data: { username: string; email: string; password: string }) => api.post('/auth/register', data),
};
