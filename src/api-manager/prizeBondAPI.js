import { apiRequest } from "@lib/apiRequest";

export const prizeBondAPI = {
  addBond: (data) =>
    apiRequest({ method: 'POST', url: '/user/prize-bond', data: { prizebonds: data }, requiresAuth: true }),
    
  getUserBonds: () =>
    apiRequest({ method: 'GET', url: '/user/prize-bond', requiresAuth: true }),
    
  deleteBond: (id) =>
    apiRequest({ method: 'DELETE', url: `/user/prize-bond`, data: { id }, requiresAuth: true }),
    
  getDraws: () =>
    apiRequest({ method: 'GET', url: '/draws' }),
    
  matchResult: (drawId) =>
    apiRequest({ method: 'GET', url: `/results/match/${drawId}`, requiresAuth: true }),
};