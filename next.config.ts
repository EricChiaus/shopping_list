import type { NextConfig } from "next";

// /shopping_list basePath is required when deployed to GitHub Pages
// Set GITHUB_PAGES=true in the Actions workflow
// local dev/build needs no basePath
const basePath = process.env.GITHUB_PAGES ? "/shopping_list" : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: {
    // Next.js image optimisation requires a server,
    // use plain <img> behaviour for static export
    unoptimized: true,
    // Allow loading images from TheMealDB
    // TheMealDB image URLs are all under https://www.themealdb.com/images/
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.themealdb.com",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
