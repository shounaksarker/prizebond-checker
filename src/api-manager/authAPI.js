import { apiRequest } from "@lib/apiRequest";

export const authAPI = {
  login: (data) => 
    apiRequest({ method: 'POST', url: '/auth/login', data, requiresAuth: false }),
  
  signup: (data) =>
    apiRequest({ method: 'POST', url: '/auth/signup', data, requiresAuth: false }),
    
  getProfile: () =>
    apiRequest({ method: 'GET', url: '/user', requiresAuth: true }),
  
  updateProfile: (data) =>
    apiRequest({ method: 'PUT', url: '/user', data, requiresAuth: true }),
};