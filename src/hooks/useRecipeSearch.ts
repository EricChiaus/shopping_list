"use client";

import { useState, useCallback, useEffect } from "react";
import { Meal } from "@/types";
import { searchMeals, getRandomMeal } from "@/lib/api";
import { getShoppingList } from "@/lib/shoppingList";

export type AppState = "idle" | "loading" | "results" | "no-results" | "error";

function getMealCount() {
  return new Set(getShoppingList().map((i) => i.mealId)).size;
}

export function useRecipeSearch() {
  const [query, setQuery] = useState("");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [appState, setAppState] = useState<AppState>("idle");
  const [lastQuery, setLastQuery] = useState("");
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

  const handleSearch = useCallback(
    async (e: React.SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();
      const trimmed = query.trim();
      if (!trimmed) return;
      setLastQuery(trimmed);
      setAppState("loading");
      try {
        const results = await searchMeals(trimmed);
        setMeals(results);
        setAppState(results.length > 0 ? "results" : "no-results");
      } catch {
        setAppState("error");
      }
    },
    [query],
  );

  const handleSurpriseMe = useCallback(async () => {
    setAppState("loading");
    try {
      const meal = await getRandomMeal();
      if (meal) {
        setSelectedMeal(meal);
        setAppState("idle");
      } else {
        setAppState("error");
      }
    } catch {
      setAppState("error");
    }
  }, []);

  const handleGoHome = useCallback(() => {
    setAppState("idle");
    setMeals([]);
    setQuery("");
  }, []);

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
