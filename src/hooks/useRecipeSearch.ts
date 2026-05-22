"use client";

import { useState, useCallback } from "react";
import { Meal } from "@/types";
import { searchMeals, getRandomMeal } from "@/lib/api";

export type AppState = "idle" | "loading" | "results" | "no-results" | "error";

export function useRecipeSearch() {
  const [query, setQuery] = useState("");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [appState, setAppState] = useState<AppState>("idle");
  const [lastQuery, setLastQuery] = useState("");
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [shoppingListOpen, setShoppingListOpen] = useState(false);

  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
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
    try {
      const meal = await getRandomMeal();
      if (meal) setSelectedMeal(meal);
    } catch {
      // silently fail
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
    handleSearch,
    handleSurpriseMe,
    handleGoHome,
  };
}
