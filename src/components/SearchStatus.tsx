type AppState = "idle" | "loading" | "results" | "no-results" | "error";

interface SearchStatusProps {
  appState: AppState;
  resultCount: number;
  lastQuery: string;
}

export default function SearchStatus({
  appState,
  resultCount,
  lastQuery,
}: SearchStatusProps) {
  if (appState === "results") {
    return (
      <p className="text-gray-600 text-sm mb-5">
        <span className="font-semibold text-gray-900">{resultCount}</span>{" "}
        recipe{resultCount !== 1 ? "s" : ""} found for &ldquo;
        <span className="text-orange-600 font-medium">{lastQuery}</span>&rdquo;
      </p>
    );
  }

  if (appState === "no-results") {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          No recipes found
        </h2>
        <p className="text-gray-500">
          No results for &ldquo;{lastQuery}&rdquo;. Try a different search term.
        </p>
      </div>
    );
  }

  if (appState === "error") {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-500">
          Could not fetch recipes. Please try again.
        </p>
      </div>
    );
  }

  return null;
}
