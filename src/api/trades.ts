import axios from 'axios';

const API_URL = 'http://localhost:8080/api/trades'; // Replace with your actual API URL

export const fetchTrades = async () => {
  const response = await axios.get(`${API_URL}/trades`);
  return response.data;
};

export const addTrade = async (trade: any) => {
  const response = await axios.post(`${API_URL}/trades`, trade);
  return response.data;
};

export const updateTrade = async (trade: any) => {
  const response = await axios.put(`${API_URL}/trades/${trade.id}`, trade);
  return response.data;
};

export const deleteTrade = async (id: string) => {
  await axios.delete(`${API_URL}/trades/${id}`);
};