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

  // Reload items from storage each time the modal opens
  useEffect(() => {
    if (open) setItems(getMergedShoppingList());
  }, [open]);

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

  return {
    items,
    meals,
    handleClear,
    handleRemoveMeal,
  };
}
