"use client";

import { useState, useEffect } from "react";
import { getShoppingList } from "@/lib/shoppingList";

interface NavbarProps {
  onShowShoppingList: () => void;
  onSurpriseMe: () => void;
  onGoHome: () => void;
}

export default function Navbar({
  onShowShoppingList,
  onSurpriseMe,
  onGoHome,
}: NavbarProps) {
  const [itemCount, setItemCount] = useState(0);

  // Refresh count when localStorage changes (e.g. after adding items)
  useEffect(() => {
    function updateCount() {
      const meals = new Set(getShoppingList().map((i) => i.mealId));
      setItemCount(meals.size);
    }
    updateCount();
    window.addEventListener("storage", updateCount);
    window.addEventListener("shopping-list-updated", updateCount);
    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("shopping-list-updated", updateCount);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={onGoHome}
            className="flex items-center gap-2 font-bold text-xl text-orange-600 hover:text-orange-700 transition-colors"
          >
            <span>RecipeFinder</span>
          </button>

          {/* Nav actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onGoHome}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors text-sm"
            >
              <span>Search</span>
            </button>

            <button
              onClick={onSurpriseMe}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 font-medium transition-colors text-sm"
            >
              <span className="hidden sm:inline">Surprise Me</span>
              <span className="sm:hidden">Surprise</span>
            </button>

            <button
              onClick={onShowShoppingList}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium transition-colors text-sm relative"
            >
              <span className="hidden sm:inline">View My Shopping List</span>
              <span className="sm:hidden">List</span>
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
