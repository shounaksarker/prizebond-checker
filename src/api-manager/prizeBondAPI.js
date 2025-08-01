import { apiRequest } from "@lib/apiRequest";

export const prizeBondAPI = {
  addBond: (data) =>
    apiRequest({ method: 'POST', url: '/user/prize-bond', data: { prizebonds: data }, requiresAuth: true }),
    
  getUserBonds: (params = {}) => {
    // Build query string from params
    const query = Object.entries(params)
      .filter(([_, v]) => v !== undefined && v !== null)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');
    const url = query ? `/user/prize-bond?${query}` : '/user/prize-bond';
    return apiRequest({ method: 'GET', url, requiresAuth: true });
  },
    
  deleteBond: (id) =>
    apiRequest({ method: 'DELETE', url: `/user/prize-bond`, data: { id }, requiresAuth: true }),
    
  getDrawRange: () =>
    apiRequest({ method: 'POST', url: '/draw' }),
    
  matchResult: (drawId) =>
    apiRequest({ method: 'GET', url: `/draw?draw_id=${drawId}`, requiresAuth: true }),
};