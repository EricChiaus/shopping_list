"use client";

import { useState, useCallback } from "react";
import { Meal } from "@/types";
import { searchMeals, getRandomMeal } from "@/lib/api";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import SearchStatus from "@/components/SearchStatus";
import RecipeGrid from "@/components/RecipeGrid";
import RecipeModal from "@/components/RecipeModal";
import ShoppingListModal from "@/components/ShoppingListModal";

type AppState = "idle" | "loading" | "results" | "no-results" | "error";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [appState, setAppState] = useState<AppState>("idle");
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [shoppingListOpen, setShoppingListOpen] = useState(false);
  const [lastQuery, setLastQuery] = useState("");

  async function handleSearch(e: React.FormEvent) {
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
  }

  const handleSurpriseMe = useCallback(async () => {
    try {
      const meal = await getRandomMeal();
      if (meal) setSelectedMeal(meal);
    } catch {
      // silently fail
      // TODO: add error handling
    }
  }, []);

  function handleGoHome() {
    setAppState("idle");
    setMeals([]);
    setQuery("");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <Navbar
        onShowShoppingList={() => setShoppingListOpen(true)}
        onSurpriseMe={handleSurpriseMe}
        onGoHome={handleGoHome}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          className={`transition-all duration-300 ${appState === "idle" ? "pt-16 pb-12" : "pt-2 pb-8"}`}
        >
          {appState === "idle" && (
            <div className="text-center mb-8">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3">
                Find Your Next{" "}
                <span className="text-orange-500">Favourite Recipe</span>
              </h1>
              <p className="text-gray-500 text-lg">
                Search thousands of recipes from around the world
              </p>
            </div>
          )}
          <SearchBar
            query={query}
            loading={appState === "loading"}
            onChange={setQuery}
            onSubmit={handleSearch}
          />
        </div>

        <SearchStatus
          appState={appState}
          resultCount={meals.length}
          lastQuery={lastQuery}
        />
        {appState === "results" && (
          <RecipeGrid meals={meals} onSelectMeal={setSelectedMeal} />
        )}
      </main>

      <RecipeModal meal={selectedMeal} onClose={() => setSelectedMeal(null)} />
      <ShoppingListModal
        open={shoppingListOpen}
        onClose={() => setShoppingListOpen(false)}
      />
    </div>
  );
}
