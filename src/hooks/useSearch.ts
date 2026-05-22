"use client";

import { useReducer, useState, useCallback } from "react";
import { Meal } from "@/types";
import { searchMeals, getRandomMeal } from "@/lib/api";

export type AppState = "idle" | "loading" | "results" | "no-results" | "error";

type SearchState = {
  appState: AppState;
  meals: Meal[];
  lastQuery: string;
};

type SearchAction =
  | { type: "SEARCH_START"; query: string }
  | { type: "SEARCH_SUCCESS"; meals: Meal[] }
  | { type: "SEARCH_ERROR" }
  | { type: "SURPRISE_START" }
  | { type: "SURPRISE_SUCCESS" }
  | { type: "SURPRISE_ERROR" }
  | { type: "GO_HOME" };

const initialState: SearchState = {
  appState: "idle",
  meals: [],
  lastQuery: "",
};

// Use a reducer to manage the complex state transitions of the search process
function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case "SEARCH_START":
      return { ...state, appState: "loading", lastQuery: action.query };
    case "SEARCH_SUCCESS":
      return {
        ...state,
        meals: action.meals,
        appState: action.meals.length > 0 ? "results" : "no-results",
      };
    case "SEARCH_ERROR":
    case "SURPRISE_ERROR":
      return { ...state, appState: "error" };
    case "SURPRISE_START":
      return { ...state, appState: "loading" };
    case "SURPRISE_SUCCESS":
      return { ...state, appState: "idle" };
    case "GO_HOME":
      return { appState: "idle", meals: [], lastQuery: "" };
    default:
      return state;
  }
}

export function useSearch() {
  const [query, setQuery] = useState("");
  const [state, dispatch] = useReducer(searchReducer, initialState);

  const handleSearch = useCallback(
    async (e: React.SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();
      const trimmed = query.trim();
      if (!trimmed) return;
      dispatch({ type: "SEARCH_START", query: trimmed });
      try {
        const results = await searchMeals(trimmed);
        dispatch({ type: "SEARCH_SUCCESS", meals: results });
      } catch {
        dispatch({ type: "SEARCH_ERROR" });
      }
    },
    [query],
  );

  const triggerSurprise = useCallback(
    async (onMealReceived: (meal: Meal) => void) => {
      dispatch({ type: "SURPRISE_START" });
      try {
        const meal = await getRandomMeal();
        if (meal) {
          onMealReceived(meal);
          dispatch({ type: "SURPRISE_SUCCESS" });
        } else {
          dispatch({ type: "SURPRISE_ERROR" });
        }
      } catch {
        dispatch({ type: "SURPRISE_ERROR" });
      }
    },
    [],
  );

  const handleGoHome = useCallback(() => {
    dispatch({ type: "GO_HOME" });
    setQuery("");
  }, []);

  return {
    query,
    setQuery,
    meals: state.meals,
    appState: state.appState,
    lastQuery: state.lastQuery,
    handleSearch,
    triggerSurprise,
    handleGoHome,
  };
}
