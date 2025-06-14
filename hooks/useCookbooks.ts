import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export function useCookbooks() {
  return useQuery({
    queryKey: ['cookbooks'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/cookbooks`);
      return data;
    },
  });
}

export function useCookbook(id: string) {
  return useQuery({
    queryKey: ['cookbook', id],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/cookbooks/${id}`);
      return data;
    },
    enabled: !!id,
  });
}