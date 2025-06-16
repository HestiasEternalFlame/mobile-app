import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;


type IngredientEntry = {
  quantity: string | null;
  unit: string | null;
  preparation: string | null;
  ingredients_master: {
    name: string;
    category: string | null;
  };
};

type Recipe = {
  id: string;
  title: string;
  recipe_ingredients: IngredientEntry[];
  instructions: string;
};


export function useRecipe(recipeId?: string) {
  return useQuery<Recipe>({
    queryKey: ['recipe', recipeId],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/recipes/${recipeId}`);
      return data;
    },
    enabled: !!recipeId, // Only run if recipeId is defined
  });
}