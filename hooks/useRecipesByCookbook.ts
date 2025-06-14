import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

type Recipe = {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string;
  cookbookId: string;
};

export function useRecipesByCookbook(cookbookId: string) {
  return useQuery<Recipe[]>({
    queryKey: ['recipesByCookbook', cookbookId],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/recipes?cookbookId=${cookbookId}`);
      return data;
    },
    enabled: !!cookbookId, // avoid running before param is available
  });
}