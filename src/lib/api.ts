import { Meal, MealSearchResponse } from "@/types";

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

export async function searchMeals(query: string): Promise<Meal[]> {
  const res = await fetch(
    `${BASE_URL}/search.php?s=${encodeURIComponent(query)}`,
  );
  if (!res.ok) throw new Error("Failed to fetch meals");
  const data: MealSearchResponse = await res.json();
  return data.meals ?? [];
}

export async function getRandomMeal(): Promise<Meal | null> {
  const res = await fetch(`${BASE_URL}/random.php`);
  if (!res.ok) throw new Error("Failed to fetch random meal");
  const data: MealSearchResponse = await res.json();
  return data.meals?.[0] ?? null;
}

export async function getMealById(id: string): Promise<Meal | null> {
  const res = await fetch(`${BASE_URL}/lookup.php?i=${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error("Failed to fetch meal");
  const data: MealSearchResponse = await res.json();
  return data.meals?.[0] ?? null;
}
