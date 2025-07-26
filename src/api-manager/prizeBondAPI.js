import { apiRequest } from "@lib/apiRequest";

export const prizeBondAPI = {
  addBond: (data) =>
    apiRequest({ method: 'POST', url: '/api/user/prize-bond', data: { prizebonds: data }, requiresAuth: true }),
    
  getUserBonds: () =>
    apiRequest({ method: 'GET', url: '/api/user/prize-bond', requiresAuth: true }),
    
  deleteBond: (id) =>
    apiRequest({ method: 'DELETE', url: `/api/user/prize-bond`, data: { id }, requiresAuth: true }),
    
  getDrawRange: () =>
    apiRequest({ method: 'POST', url: '/api/draw' }),
    
  matchResult: (drawId) =>
    apiRequest({ method: 'GET', url: `/api/draw?draw_id=${drawId}`, requiresAuth: true }),
};