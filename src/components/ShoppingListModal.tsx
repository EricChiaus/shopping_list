"use client";

import { useShoppingListModal } from "@/hooks/useShoppingListModal";
import Modal from "@/components/Modal";

interface ShoppingListModalProps {
  open: boolean;
  onClose: () => void;
  onShoppingListChange: () => void;
}

export default function ShoppingListModal({
  open,
  onClose,
  onShoppingListChange,
}: ShoppingListModalProps) {
  const { items, meals, handleClear, handleRemoveMeal } = useShoppingListModal({
    open,
    onShoppingListChange,
  });

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-lg">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Shopping List</h2>
          {items.length > 0 && (
            <p className="text-sm text-gray-500 mt-0.5">
              {items.length} ingredient{items.length !== 1 ? "s" : ""}
              {meals.length > 0 &&
                ` from ${meals.length} recipe${meals.length !== 1 ? "s" : ""}`}
            </p>
          )}
        </div>
      </div>

      <div className="px-6 py-5 space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 font-medium">
              Your shopping list is empty
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Open a recipe and click &ldquo;Add to My Shopping List&rdquo;
            </p>
          </div>
        ) : (
          <>
            {/* Meals included */}
            {meals.length > 0 && (
              <div className="bg-orange-50 rounded-xl px-4 py-3">
                <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide mb-1.5">
                  Recipes included
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {meals.map(({ id, name }) => (
                    <span
                      key={id}
                      className="flex items-center gap-1 pl-2.5 pr-1.5 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium"
                    >
                      {name}
                      <button
                        onClick={() => handleRemoveMeal(id)}
                        className="ml-0.5 w-4 h-4 flex items-center justify-center rounded-full hover:bg-orange-300 transition-colors"
                        aria-label={`Remove ${name} from shopping list`}
                      >
                        X
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Ingredient list */}
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.ingredient}
                  className="flex items-center justify-between gap-3 py-2.5 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-gray-900 font-medium text-sm capitalize truncate">
                      {item.ingredient}
                    </span>
                  </div>
                  {item.measure && (
                    <span className="text-gray-500 text-sm text-right shrink-0 max-w-[40%]">
                      {item.measure}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Clear button */}
            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={handleClear}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors border border-red-200"
              >
                Clear Shopping List
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
