"use client";

import { useCallback } from "react";
import { useSearch } from "./useSearch";
import { useModalState } from "./useModalState";

export type { AppState } from "./useSearch";

export function useRecipeSearch() {
  const {
    query,
    setQuery,
    meals,
    appState,
    lastQuery,
    handleSearch,
    triggerSurprise,
    handleGoHome,
  } = useSearch();

  const {
    selectedMeal,
    setSelectedMeal,
    shoppingListOpen,
    setShoppingListOpen,
    shoppingListCount,
    refreshShoppingListCount,
  } = useModalState();

  const handleSurpriseMe = useCallback(() => {
    triggerSurprise(setSelectedMeal);
  }, [triggerSurprise, setSelectedMeal]);

  return {
    query,
    setQuery,
    meals,
    appState,
    lastQuery,
    selectedMeal,
    setSelectedMeal,
    shoppingListOpen,
    setShoppingListOpen,
    shoppingListCount,
    refreshShoppingListCount,
    handleSearch,
    handleSurpriseMe,
    handleGoHome,
  };
}
