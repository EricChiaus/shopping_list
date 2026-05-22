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

export function getIngredients(
  meal: Meal,
): { ingredient: string; measure: string }[] {
  const items: { ingredient: string; measure: string }[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}` as keyof Meal] as string | null;
    const measure = meal[`strMeasure${i}` as keyof Meal] as string | null;
    if (ingredient && ingredient.trim()) {
      items.push({
        ingredient: ingredient.trim(),
        measure: (measure ?? "").trim(),
      });
    }
  }
  return items;
}
