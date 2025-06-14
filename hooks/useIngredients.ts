import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export function useIngredients() {
  return useQuery({
    queryKey: ['ingredients'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/ingredients`);
      return data;
    },
  });
}

export function useIngredient(id: string) {
  return useQuery({
    queryKey: ['ingredient', id],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/ingredients/${id}`);
      return data;
    },
    enabled: !!id,
  });
}