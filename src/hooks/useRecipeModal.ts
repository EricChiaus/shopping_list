"use client";

import { useCallback, useMemo, useState } from "react";
import { Meal } from "@/types";

import {
  addMealToShoppingList,
  isMealInShoppingList,
} from "@/lib/shoppingList";
import { getIngredients } from "@/lib/helpers";

interface UseRecipeModalOptions {
  meal: Meal | null;
  onClose: () => void;
  onShoppingListChange: () => void;
}

export function useRecipeModal({
  meal,
  onShoppingListChange,
}: UseRecipeModalOptions) {
  // Tracks which meal was added in this session so the button updates without an effect
  const [addedMealId, setAddedMealId] = useState<string | null>(null);

  // True if added in this session OR already persisted in localStorage
  const added = useMemo(
    () =>
      meal != null &&
      (addedMealId === meal.idMeal || isMealInShoppingList(meal.idMeal)),
    [meal, addedMealId],
  );

  const ingredients = useMemo(() => (meal ? getIngredients(meal) : []), [meal]);

  const handleAddToShoppingList = useCallback(() => {
    if (!meal) return;
    addMealToShoppingList(meal);
    setAddedMealId(meal.idMeal);
    onShoppingListChange();
  }, [meal, onShoppingListChange]);

  return { added, ingredients, handleAddToShoppingList };
}
