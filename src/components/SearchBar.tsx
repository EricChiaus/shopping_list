"use client";

interface SearchBarProps {
  query: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SearchBar({
  query,
  loading,
  onChange,
  onSubmit,
}: SearchBarProps) {
  return (
    <form onSubmit={onSubmit} className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search recipes (e.g. beef, pudding, pasta…)"
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-gray-900 placeholder-gray-400 text-base"
            autoFocus
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="shrink-0 px-6 py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 text-base"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Searching
            </span>
          ) : (
            "Search"
          )}
        </button>
      </div>
    </form>
  );
}
