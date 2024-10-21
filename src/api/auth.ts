import axios from 'axios';

const API_URL = 'https://api.example.com'; // Replace with your actual API URL

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  return response.data.user;
};

export const register = async (name: string, email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
  return response.data.user;
};

export const logout = async () => {
  await axios.post(`${API_URL}/auth/logout`);
};