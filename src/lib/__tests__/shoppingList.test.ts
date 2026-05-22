import { describe, it, expect, beforeEach } from "vitest";
import {
  extractIngredients,
  addMealToShoppingList,
  getShoppingList,
  clearShoppingList,
  removeMealFromShoppingList,
  getMergedShoppingList,
  isMealInShoppingList,
} from "../shoppingList";
import type { Meal } from "@/types";

function makeMeal(
  id: string,
  name: string,
  ingredients: [ingredient: string, measure: string][] = [],
): Meal {
  const base: Record<string, string | null> = {
    idMeal: id,
    strMeal: name,
    strCategory: "",
    strArea: "",
    strInstructions: "",
    strMealThumb: "",
    strYoutube: null,
    strSource: null,
    strTags: null,
  };
  for (let i = 1; i <= 20; i++) {
    base[`strIngredient${i}`] = ingredients[i - 1]?.[0] ?? null;
    base[`strMeasure${i}`] = ingredients[i - 1]?.[1] ?? null;
  }
  return base as unknown as Meal;
}

beforeEach(() => {
  localStorage.clear();
});

// -----------------------------------------------------------------------------
// extractIngredients
// -----------------------------------------------------------------------------
describe("extractIngredients", () => {
  it("returns trimmed items with correct mealId and mealName", () => {
    const meal = makeMeal("42", "Tacos", [["  Chicken  ", "  200g  "]]);
    const [item] = extractIngredients(meal);
    expect(item).toEqual({
      ingredient: "Chicken",
      measure: "200g",
      mealId: "42",
      mealName: "Tacos",
    });
  });

  it("skips null and whitespace-only ingredient slots", () => {
    const meal = makeMeal("1", "Pasta", [
      ["Flour", "2 cups"],
      ["  ", "1 tsp"],
    ]);
    expect(extractIngredients(meal)).toHaveLength(1);
  });

  it("defaults measure to empty string when null", () => {
    const meal = makeMeal("1", "Pasta", [["Flour", ""]]);
    expect(extractIngredients(meal)[0].measure).toBe("");
  });
});

// -----------------------------------------------------------------------------
// getShoppingList / addMealToShoppingList
// -----------------------------------------------------------------------------
describe("getShoppingList", () => {
  it("returns empty array when storage is empty or corrupt", () => {
    expect(getShoppingList()).toEqual([]);
    localStorage.setItem("recipe_shopping_list", "not-json");
    expect(getShoppingList()).toEqual([]);
  });
});

describe("addMealToShoppingList", () => {
  it("replaces previous entries for the same meal (idempotent)", () => {
    const meal = makeMeal("1", "Pasta", [["Flour", "2 cups"]]);
    addMealToShoppingList(meal);
    addMealToShoppingList(meal);
    expect(getShoppingList()).toHaveLength(1);
  });

  it("preserves items from other meals", () => {
    addMealToShoppingList(makeMeal("1", "Pasta", [["Flour", "2 cups"]]));
    addMealToShoppingList(makeMeal("2", "Cake", [["Eggs", "3"]]));
    expect(getShoppingList()).toHaveLength(2);
  });
});

// -----------------------------------------------------------------------------
// clearShoppingList / removeMealFromShoppingList
// -----------------------------------------------------------------------------
describe("clearShoppingList", () => {
  it("removes all items", () => {
    addMealToShoppingList(makeMeal("1", "Pasta", [["Flour", "2 cups"]]));
    clearShoppingList();
    expect(getShoppingList()).toEqual([]);
  });
});

describe("removeMealFromShoppingList", () => {
  it("removes only items for the given meal, leaving others intact", () => {
    addMealToShoppingList(
      makeMeal("1", "Pasta", [
        ["Flour", "2 cups"],
        ["Salt", "1 tsp"],
      ]),
    );
    addMealToShoppingList(makeMeal("2", "Cake", [["Eggs", "3"]]));
    removeMealFromShoppingList("1");
    const remaining = getShoppingList();
    expect(remaining).toHaveLength(1);
    expect(remaining[0].mealId).toBe("2");
  });
});

// -----------------------------------------------------------------------------
// getMergedShoppingList
// -----------------------------------------------------------------------------
describe("getMergedShoppingList", () => {
  it("merges the same ingredient from two meals, concatenating measures", () => {
    addMealToShoppingList(makeMeal("1", "Pasta", [["Flour", "2 cups"]]));
    addMealToShoppingList(makeMeal("2", "Cake", [["Flour", "1 cup"]]));
    const [item] = getMergedShoppingList();
    expect(item.measure).toBe("2 cups + 1 cup");
    expect(item.meals).toEqual(["Pasta", "Cake"]);
    expect(item.mealIds).toEqual(["1", "2"]);
  });

  it("does not duplicate a measure already present", () => {
    addMealToShoppingList(makeMeal("1", "Pasta", [["Flour", "2 cups"]]));
    addMealToShoppingList(makeMeal("2", "Cake", [["Flour", "2 cups"]]));
    expect(getMergedShoppingList()[0].measure).toBe("2 cups");
  });

  it("returns results sorted alphabetically by ingredient", () => {
    addMealToShoppingList(
      makeMeal("1", "Pasta", [
        ["Salt", "1 tsp"],
        ["Flour", "2 cups"],
      ]),
    );
    const result = getMergedShoppingList();
    expect(result[0].ingredient).toBe("Flour");
    expect(result[1].ingredient).toBe("Salt");
  });

  it("merges case-insensitively", () => {
    addMealToShoppingList(makeMeal("1", "A", [["flour", "2 cups"]]));
    addMealToShoppingList(makeMeal("2", "B", [["Flour", "1 cup"]]));
    expect(getMergedShoppingList()).toHaveLength(1);
  });
});

// -----------------------------------------------------------------------------
// isMealInShoppingList
// -----------------------------------------------------------------------------
describe("isMealInShoppingList", () => {
  it("returns true for a meal in the list, false otherwise", () => {
    addMealToShoppingList(makeMeal("1", "Pasta", [["Flour", "2 cups"]]));
    expect(isMealInShoppingList("1")).toBe(true);
    expect(isMealInShoppingList("999")).toBe(false);
  });
});
