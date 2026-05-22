import { Meal, ShoppingListItem, MergedShoppingItem } from "@/types";

// localStorage key used to persist the shopping list across page reloads
const STORAGE_KEY = "recipe_shopping_list";

/**
 * Extracts non-empty ingredient/measure pairs from a MealDB meal object.
 * MealDB stores up to 20 ingredients as strIngredient1…strIngredient20
 * and their corresponding measures as strMeasure1…strMeasure20.
 */
export function extractIngredients(meal: Meal): ShoppingListItem[] {
  const items: ShoppingListItem[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}` as keyof Meal] as string | null;
    const measure = meal[`strMeasure${i}` as keyof Meal] as string | null;
    // Skip slots that MealDB left empty or null
    if (ingredient && ingredient.trim()) {
      items.push({
        ingredient: ingredient.trim(),
        measure: (measure ?? "").trim(),
        mealId: meal.idMeal,
        mealName: meal.strMeal,
      });
    }
  }
  return items;
}

/**
 * Adds all ingredients from a meal to the shopping list.
 * If the meal was already added, its previous entries are replaced
 * so there are no duplicates if the user clicks "Add" more than once.
 */
export function addMealToShoppingList(meal: Meal): void {
  const existing = getShoppingList();
  const filtered = existing.filter((item) => item.mealId !== meal.idMeal);
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([...filtered, ...extractIngredients(meal)]),
  );
}

/**
 * Reads the shopping list from localStorage.
 * Returns an empty array if nothing is stored or if the stored JSON is corrupt.
 */
export function getShoppingList(): ShoppingListItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ShoppingListItem[]) : [];
  } catch {
    return [];
  }
}

/** Removes all items from the shopping list. */
export function clearShoppingList(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/** Removes all ingredients belonging to a specific meal from the shopping list. */
export function removeMealFromShoppingList(mealId: string): void {
  const filtered = getShoppingList().filter((item) => item.mealId !== mealId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

/**
 * Returns the shopping list with same-named ingredients merged together.
 * When the same ingredient appears in multiple meals:
 *  - Measures are concatenated with " + " (e.g. "2 cups + 1 cup") unless the
 *    new measure is already represented in the existing string.
 *  - The source meal names are collected into an array so the UI can show
 *    which recipes need each ingredient.
 * Results are sorted alphabetically by ingredient name.
 */
export function getMergedShoppingList(): MergedShoppingItem[] {
  const map = new Map<string, MergedShoppingItem>();

  for (const item of getShoppingList()) {
    const key = item.ingredient.toLowerCase();
    if (map.has(key)) {
      const existing = map.get(key)!;
      // Append the new measure only if it isn't already in the combined string
      if (
        item.measure &&
        !existing.measure.toLowerCase().includes(item.measure.toLowerCase())
      ) {
        existing.measure = existing.measure
          ? `${existing.measure} + ${item.measure}`
          : item.measure;
      }
      // Track every meal that uses this ingredient
      if (!existing.meals.includes(item.mealName)) {
        existing.meals.push(item.mealName);
        existing.mealIds.push(item.mealId);
      }
    } else {
      map.set(key, {
        ingredient: item.ingredient,
        measure: item.measure,
        meals: [item.mealName],
        mealIds: [item.mealId],
      });
    }
  }

  return Array.from(map.values()).sort((a, b) =>
    a.ingredient.localeCompare(b.ingredient),
  );
}

/** Returns true if any item in the shopping list belongs to the given meal. */
export function isMealInShoppingList(mealId: string): boolean {
  return getShoppingList().some((item) => item.mealId === mealId);
}
