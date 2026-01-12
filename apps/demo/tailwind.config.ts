import type { Config } from "tailwindcss";
import baseConfig from "@research-homepage/tailwind-config";

const config: Config = {
  ...baseConfig,
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // Monorepo package paths - more specific to avoid scanning node_modules
    "../../packages/ui/components/**/*.tsx",
    "../../packages/ui/lib/**/*.ts",
    "../../packages/components/cards/**/*.tsx",
    "../../packages/components/sections/**/*.tsx",
    "../../packages/components/navigation/**/*.tsx",
    "../../packages/components/media/**/*.tsx",
  ],
};

export default config;
