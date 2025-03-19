
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// Créer une instance axios avec des configurations de base
const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification aux requêtes
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Rediriger vers la page de login si le token est invalide ou expiré
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API d'authentification
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  register: (userData: any) => 
    api.post('/auth/register', userData),
  
  getCurrentUser: () => 
    api.get('/auth/me'),
    
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
};

// API des propriétés
export const propertiesAPI = {
  getAll: () => 
    api.get('/properties'),
  
  getById: (id: string) => 
    api.get(`/properties/${id}`),
  
  create: (propertyData: any) => 
    api.post('/properties', propertyData),
  
  update: (id: string, propertyData: any) => 
    api.put(`/properties/${id}`, propertyData),
  
  delete: (id: string) => 
    api.delete(`/properties/${id}`)
};

// API des contrats de location
export const leasesAPI = {
  getAll: () => 
    api.get('/leases'),
  
  getById: (id: string) => 
    api.get(`/leases/${id}`),
  
  create: (leaseData: any) => 
    api.post('/leases', leaseData),
  
  update: (id: string, leaseData: any) => 
    api.put(`/leases/${id}`, leaseData),
  
  delete: (id: string) => 
    api.delete(`/leases/${id}`)
};

// API des paiements
export const paymentsAPI = {
  getAll: () => 
    api.get('/payments'),
  
  getById: (id: string) => 
    api.get(`/payments/${id}`),
  
  create: (paymentData: any) => 
    api.post('/payments', paymentData),
  
  update: (id: string, paymentData: any) => 
    api.put(`/payments/${id}`, paymentData),
  
  delete: (id: string) => 
    api.delete(`/payments/${id}`)
};

// API de maintenance
export const maintenanceAPI = {
  getAll: (filters?: any) => {
    let url = '/maintenance';
    if (filters) {
      const params = new URLSearchParams();
      for (const key in filters) {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      }
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }
    return api.get(url);
  },
  
  getById: (id: string) => 
    api.get(`/maintenance/${id}`),
  
  create: (requestData: any) => 
    api.post('/maintenance', requestData),
  
  update: (id: string, requestData: any) => 
    api.put(`/maintenance/${id}`, requestData),
  
  delete: (id: string) => 
    api.delete(`/maintenance/${id}`)
};

// API des utilisateurs
export const usersAPI = {
  getAll: () => 
    api.get('/users'),
  
  getById: (id: string) => 
    api.get(`/users/${id}`),
  
  updateProfile: (profileData: any) => 
    api.put('/users/profile', profileData),
  
  changePassword: (passwordData: any) => 
    api.put('/users/password', passwordData),
  
  updateRole: (id: string, role: string) => 
    api.put(`/users/${id}/role`, { role }),
  
  updateStatus: (id: string, status: string) => 
    api.put(`/users/${id}/status`, { status })
};

export default api;
