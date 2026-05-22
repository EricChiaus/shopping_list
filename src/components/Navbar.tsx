"use client";

interface NavbarProps {
  onShowShoppingList: () => void;
  onSurpriseMe: () => void;
  onGoHome: () => void;
  itemCount: number;
}

export default function Navbar({
  onShowShoppingList,
  onSurpriseMe,
  onGoHome,
  itemCount,
}: NavbarProps) {
  return (
    <nav
      aria-label="Main navigation"
      className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={onGoHome}
            className="flex font-bold text-xl text-orange-600 hover:text-orange-700 transition-colors"
          >
            <span>RecipeFinder</span>
          </button>

          {/* Nav actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onGoHome}
              className="hidden sm:flex px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors text-sm"
            >
              <span>Search</span>
            </button>

            <button
              onClick={onSurpriseMe}
              className="flex px-4 py-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 font-medium transition-colors text-sm"
            >
              <span className="hidden sm:inline">Surprise Me</span>
              <span className="sm:hidden">Surprise</span>
            </button>

            <button
              onClick={onShowShoppingList}
              aria-label={
                itemCount > 0
                  ? `View My Shopping List (${itemCount} recipe${itemCount !== 1 ? "s" : ""})`
                  : "View My Shopping List"
              }
              className="flex px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium transition-colors text-sm relative"
            >
              <span className="hidden sm:inline">View My Shopping List</span>
              <span className="sm:hidden">List</span>
              {itemCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                >
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
