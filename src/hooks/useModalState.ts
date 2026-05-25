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

  const refreshShoppingListCount = useCallback(() => {
    setShoppingListCount(getMealCount());
  }, []);

  // Initialise the badge count from localStorage after hydration.
  //
  // Why useEffect + setState instead of a lazy useState initializer:
  // Next.js SSR runs the component on the server (where localStorage is unavailable)
  // and again on the client during hydration. A lazy initializer would return 0 on
  // the server but the real count on the client, causing a React hydration mismatch error.
  // Starting with useState(0) and updating after mount keeps both renders in sync.
  //
  // The proper React 18 solution is useSyncExternalStore, which accepts an explicit
  // serverSnapshot so React can handle the server/client difference gracefully:
  //
  //   const shoppingListCount = useSyncExternalStore(
  //     () => () => {},       // no subscription needed
  //     () => getMealCount(), // client snapshot
  //     () => 0,              // server snapshot
  //   );
  //
  // I use the simpler useEffect pattern here since the count is cosmetic (a badge)
  // and useSyncExternalStore would be overkill for this use case.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
