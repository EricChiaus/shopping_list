"use client";

import { useState, useCallback, useEffect } from "react";
import { Meal } from "@/types";
import { getShoppingList } from "@/lib/shoppingList";

function getMealCount() {
  return new Set(getShoppingList().map((i) => i.mealId)).size;
}

export function useModalState() {
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [shoppingListOpen, setShoppingListOpen] = useState(false);
  const [shoppingListCount, setShoppingListCount] = useState(0);

  // Read localStorage only on the client to avoid SSR/hydration mismatch
  useEffect(() => {
    setShoppingListCount(getMealCount());
  }, []);

  const refreshShoppingListCount = useCallback(() => {
    setShoppingListCount(getMealCount());
  }, []);

  return {
    selectedMeal,
    setSelectedMeal,
    shoppingListOpen,
    setShoppingListOpen,
    shoppingListCount,
    refreshShoppingListCount,
  };
}
