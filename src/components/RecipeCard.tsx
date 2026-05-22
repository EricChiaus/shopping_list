"use client";

import Image from "next/image";
import { Meal } from "@/types";

interface RecipeCardProps {
  meal: Meal;
  onClick: (meal: Meal) => void;
}

export default function RecipeCard({ meal, onClick }: RecipeCardProps) {
  return (
    <button
      onClick={() => onClick(meal)}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 hover:border-orange-200 transition-all duration-200 text-left w-full"
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
        <Image
          src={meal.strMealThumb}
          alt={meal.strMeal}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors">
          {meal.strMeal}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {meal.strCategory && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-700">
              {meal.strCategory}
            </span>
          )}
          {meal.strArea && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
              {meal.strArea}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
