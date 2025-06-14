import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

type Recipe = {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string;
};

export function useRecipe(recipeId: string) {
  return useQuery<Recipe>({
    queryKey: ['recipe', recipeId],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/recipes/${recipeId}`);
      return data;
    },
    enabled: !!recipeId, // Only run if recipeId is defined
  });
}