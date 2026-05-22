import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RecipeFinder – Discover & Cook",
  description:
    "Search thousands of recipes, view ingredients, and build your shopping list",
  keywords: [
    "recipe search",
    "meal finder",
    "cooking recipes",
    "ingredients",
    "shopping list",
    "dinner ideas",
    "meal planner",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
