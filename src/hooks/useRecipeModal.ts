"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  onClose,
  onShoppingListChange,
}: UseRecipeModalOptions) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (meal) {
      setAdded(isMealInShoppingList(meal.idMeal));
    }
  }, [meal]);

  useEffect(() => {
    // Close on Escape key
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const ingredients = useMemo(() => (meal ? getIngredients(meal) : []), [meal]);

  const handleAddToShoppingList = useCallback(() => {
    if (!meal) return;
    addMealToShoppingList(meal);
    setAdded(true);
    onShoppingListChange();
  }, [meal, onShoppingListChange]);

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === overlayRef.current) onClose();
  }

  return {
    overlayRef,
    added,
    ingredients,
    handleAddToShoppingList,
    handleOverlayClick,
  };
}
