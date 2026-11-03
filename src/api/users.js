import apiClient from './client';

export const fetchUsers = async (search = '', page = 1, limit = 50) => {
  const params = { page, limit };
  if (search && search.trim()) {
    params.search = search.trim();
  }
  const response = await apiClient.get('/api/users', { params });
  return response.data;
};

export const fetchUserById = async (id) => {
  const response = await apiClient.get(`/api/users/${id}`);
  return response.data;
};

export const createUser = async (userData) => {
  const response = await apiClient.post('/api/users', userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await apiClient.put(`/api/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await apiClient.delete(`/api/users/${id}`);
  return response.data;
};

export const fetchRoles = async () => {
  const response = await apiClient.get('/api/roles');
  return response.data;
};

