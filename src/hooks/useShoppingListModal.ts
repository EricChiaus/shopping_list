"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getMergedShoppingList,
  clearShoppingList,
  removeMealFromShoppingList,
} from "@/lib/shoppingList";
import { MergedShoppingItem } from "@/types";

interface UseShoppingListModalOptions {
  open: boolean;
  onShoppingListChange: () => void;
}

interface UseShoppingListModalReturn {
  items: MergedShoppingItem[];
  /** Unique meals (id + name) derived from the current item list */
  meals: { id: string; name: string }[];
  handleClear: () => void;
  handleRemoveMeal: (mealId: string) => void;
}

export function useShoppingListModal({
  open,
  onShoppingListChange,
}: UseShoppingListModalOptions): UseShoppingListModalReturn {
  const [items, setItems] = useState<MergedShoppingItem[]>([]);

  // Derive unique (id, name) meal pairs from merged items
  // Use a Map to ensure uniqueness and preserve the first name encountered for each mealId
  const meals = useMemo(
    () =>
      Array.from(
        new Map(
          items.flatMap((item) =>
            item.mealIds.map((id, i) => [id, { id, name: item.meals[i] }]),
          ),
        ).values(),
      ),
    [items],
  );

  const handleClear = useCallback(() => {
    clearShoppingList();
    setItems([]);
    onShoppingListChange();
  }, [onShoppingListChange]);

  const handleRemoveMeal = useCallback(
    (mealId: string) => {
      removeMealFromShoppingList(mealId);
      setItems(getMergedShoppingList());
      onShoppingListChange();
    },
    [onShoppingListChange],
  );

  // Reload the shopping list from localStorage each time the modal opens.
  //
  // Why useEffect + setState: items must be re-read from localStorage whenever
  // `open` transitions to true so the list reflects any additions made while
  // the modal was closed. There is no way to derive this without an effect
  // because the trigger is a prop change, not a user event we can intercept.
  //
  // The lint rule flags setState inside effects to discourage deriving state
  // from other state (which causes cascading renders). This case is different —
  // I am synchronising React state with an external system (localStorage),
  // which is exactly what useEffect is designed for.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) setItems(getMergedShoppingList());
  }, [open]);

  return {
    items,
    meals,
    handleClear,
    handleRemoveMeal,
  };
}
