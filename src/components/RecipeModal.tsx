"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Meal } from "@/types";
import {
  addMealToShoppingList,
  isMealInShoppingList,
} from "@/lib/shoppingList";

interface RecipeModalProps {
  meal: Meal | null;
  onClose: () => void;
  onShoppingListChange: () => void;
}

function getIngredients(meal: Meal) {
  const items: { ingredient: string; measure: string }[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}` as keyof Meal] as string | null;
    const measure = meal[`strMeasure${i}` as keyof Meal] as string | null;
    if (ingredient && ingredient.trim()) {
      items.push({
        ingredient: ingredient.trim(),
        measure: (measure ?? "").trim(),
      });
    }
  }
  return items;
}

export default function RecipeModal({
  meal,
  onClose,
  onShoppingListChange,
}: RecipeModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (meal) {
      setAdded(isMealInShoppingList(meal.idMeal));
    }
  }, [meal]);

  // Close on Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!meal) return null;

  const ingredients = getIngredients(meal);

  function handleAddToShoppingList() {
    if (!meal) return;
    addMealToShoppingList(meal);
    setAdded(true);
    onShoppingListChange();
  }

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === overlayRef.current) onClose();
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
    >
      <div className="bg-white shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto overscroll-contain relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 shadow hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Hero image */}
        <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
          <Image
            src={meal.strMealThumb}
            alt={meal.strMeal}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-5 right-14">
            <h2 className="text-white text-2xl sm:text-3xl font-bold leading-tight">
              {meal.strMeal}
            </h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {meal.strCategory && (
                <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-orange-500 text-white">
                  {meal.strCategory}
                </span>
              )}
              {meal.strArea && (
                <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-blue-500 text-white">
                  {meal.strArea}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-7 space-y-6">
          {/* Add to shopping list */}
          <button
            onClick={handleAddToShoppingList}
            className={`w-full py-3 px-5 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2 ${
              added
                ? "bg-emerald-50 text-emerald-700 border-2 border-emerald-300 cursor-default"
                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg"
            }`}
            disabled={added}
          >
            {added ? (
              <span>Added to My Shopping List</span>
            ) : (
              <span>Add to My Shopping List</span>
            )}
          </button>

          {/* Ingredients */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Ingredients
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ingredients.map(({ ingredient, measure }, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-2 bg-gray-50 rounded-xl px-4 py-2.5"
                >
                  <span className="text-gray-800 font-medium text-sm">
                    {ingredient}
                  </span>
                  {measure && (
                    <span className="text-gray-500 text-sm text-right shrink-0">
                      {measure}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Instructions
            </h3>
            <div className="prose prose-sm max-w-none">
              {meal.strInstructions
                .split(/\r?\n/)
                .filter((line) => line.trim())
                .map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-gray-700 text-sm leading-relaxed mb-3"
                  >
                    {paragraph.trim()}
                  </p>
                ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100">
            {meal.strYoutube && (
              <a
                href={meal.strYoutube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Watch on YouTube (opens in new tab)"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-medium text-sm transition-colors"
              >
                <span>Watch on YouTube</span>
              </a>
            )}
            {meal.strSource && (
              <a
                href={meal.strSource}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View Source Recipe (opens in new tab)"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium text-sm transition-colors"
              >
                <span>View Source Recipe</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
