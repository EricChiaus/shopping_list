# Recipe Finder

A fullstack recipe search app built with Next.js, React, and TypeScript. Search millions of meals, view full recipe details, and build a persistent shopping list — all powered by the free [TheMealDB API](https://www.themealdb.com/).

## Features

- **Recipe search** — search by keyword and browse paginated results
- **Recipe detail modal** — ingredients, step-by-step instructions, YouTube video link, and source link
- **Shopping list** — add ingredients from multiple recipes; same-named ingredients are merged automatically and persisted in `localStorage`
- **Surprise Me** — fetches a random recipe instantly
- **Sticky navbar** — quick access to search, Surprise Me, and the shopping list from anywhere on the page

## Tech Stack

| Layer       | Choice                               |
| ----------- | ------------------------------------ |
| Framework   | Next.js 15 (App Router, Turbopack)   |
| Language    | TypeScript                           |
| UI          | React 19                             |
| Styling     | Tailwind CSS v4                      |
| Data        | TheMealDB REST API                   |
| Persistence | `localStorage` (no backend required) |

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main page (search + layout)
│   ├── layout.tsx        # Root layout & SEO metadata
│   ├── globals.css       # Global styles
│   └── icon.svg          # Favicon
├── components/
│   ├── Navbar.tsx        # Sticky nav with shopping list badge
│   ├── SearchBar.tsx     # Search input & submit button
│   ├── SearchStatus.tsx  # Result count / no-results / error states
│   ├── RecipeGrid.tsx    # Responsive recipe card grid
│   ├── RecipeCard.tsx    # Individual recipe card
│   ├── RecipeModal.tsx   # Full recipe detail modal
│   └── ShoppingListModal.tsx  # Shopping list modal
├── hooks/
│   ├── useRecipeSearch.ts      # Search state, handlers, navigation
│   └── useShoppingListModal.ts # Shopping list modal state & handlers
├── lib/
│   ├── api.ts            # TheMealDB API calls
│   └── shoppingList.ts   # localStorage CRUD & ingredient merging
└── types/
    └── index.ts          # Shared TypeScript types
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
