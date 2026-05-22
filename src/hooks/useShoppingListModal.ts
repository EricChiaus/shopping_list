"use client";

import { useEffect, useRef, useState } from "react";
import { getMergedShoppingList, clearShoppingList } from "@/lib/shoppingList";
import { MergedShoppingItem } from "@/types";

interface UseShoppingListModalOptions {
  open: boolean;
  onClose: () => void;
}

interface UseShoppingListModalReturn {
  overlayRef: React.RefObject<HTMLDivElement | null>;
  items: MergedShoppingItem[];
  /** Unique meal names derived from the current item list */
  mealNames: string[];
  handleClear: () => void;
  handleOverlayClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export function useShoppingListModal({
  open,
  onClose,
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

  function handleClear() {
    clearShoppingList();
    setItems([]);
    // Notify the Navbar badge to update its count
    window.dispatchEvent(new Event("shopping-list-updated"));
  }

  // Close only when clicking the backdrop, not the modal card itself
  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === overlayRef.current) onClose();
  }

  const mealNames = Array.from(new Set(items.flatMap((i) => i.meals)));

  return { overlayRef, items, mealNames, handleClear, handleOverlayClick };
}
