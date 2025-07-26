import { apiRequest } from "@lib/apiRequest";

export const authAPI = {
  login: (data) => 
    apiRequest({ method: 'POST', url: '/api/auth/login', data, requiresAuth: false }),

  logout: () =>
    apiRequest({ method: 'POST', url: '/api/auth/logout' }),
  
  signup: (data) =>
    apiRequest({ method: 'POST', url: '/api/auth/signup', data, requiresAuth: false }),
    
  getProfile: () =>
    apiRequest({ method: 'GET', url: '/api/user', requiresAuth: true }),
  
  updateProfile: (data) =>
    apiRequest({ method: 'PUT', url: '/api/user', data, requiresAuth: true }),
};