import apiClient from './client';

/**
 * Fetch Home Dashboard data
 */
export const fetchHomeData = async () => {
  const response = await apiClient.get('/api/home');
  return response.data;
};

export default {
  fetchHomeData,
};

