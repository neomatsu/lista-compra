import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontSize: {
        base: ["18px", "1.5rem"]
      }
    }
  },
  plugins: []
} satisfies Config;
