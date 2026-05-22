"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getMergedShoppingList,
  clearShoppingList,
  removeMealFromShoppingList,
} from "@/lib/shoppingList";
import { MergedShoppingItem } from "@/types";

interface UseShoppingListModalOptions {
  open: boolean;
  onClose: () => void;
  onShoppingListChange: () => void;
}

interface UseShoppingListModalReturn {
  overlayRef: React.RefObject<HTMLDivElement | null>;
  items: MergedShoppingItem[];
  /** Unique meals (id + name) derived from the current item list */
  meals: { id: string; name: string }[];
  handleClear: () => void;
  handleRemoveMeal: (mealId: string) => void;
  handleOverlayClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export function useShoppingListModal({
  open,
  onClose,
  onShoppingListChange,
}: UseShoppingListModalOptions): UseShoppingListModalReturn {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<MergedShoppingItem[]>([]);

  // Lock body scroll while open; unlock when closed
  useEffect(() => {
    if (open) {
      setItems(getMergedShoppingList());
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

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

  // Close only when clicking the backdrop, not the modal card itself
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === overlayRef.current) onClose();
    },
    [onClose],
  );

  // Derive unique (id, name) meal pairs from merged items
  const meals = Array.from(
    new Map(
      items.flatMap((item) =>
        item.mealIds.map((id, i) => [id, { id, name: item.meals[i] }]),
      ),
    ).values(),
  );

  return {
    overlayRef,
    items,
    meals,
    handleClear,
    handleRemoveMeal,
    handleOverlayClick,
  };
}
