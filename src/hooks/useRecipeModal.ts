"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  const [added, setAdded] = useState(false);

  const ingredients = useMemo(() => (meal ? getIngredients(meal) : []), [meal]);

  const handleAddToShoppingList = useCallback(() => {
    if (!meal) return;
    addMealToShoppingList(meal);
    setAdded(true);
    onShoppingListChange();
  }, [meal, onShoppingListChange]);

  useEffect(() => {
    if (meal) {
      setAdded(isMealInShoppingList(meal.idMeal));
    }
  }, [meal]);

  return { added, ingredients, handleAddToShoppingList };
}
