import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    cacheComponents: true,
    partialPrefetching: true,
    turbopack: {
        rules: {
            // Only the Tailwind entry needs this loader. CSS Modules must retain
            // Next.js's native processing and generated class-name exports.
            "globals.css": {
                loaders: ["@tailwindcss/turbopack"],
                as: "*.css",
            },
        },
    },
};

export default nextConfig;
