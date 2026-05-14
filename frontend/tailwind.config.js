/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      borderColor: {
        border: "oklch(1 0 0 / 10%)",
      },
      outlineColor: {
        ring: "oklch(0.556 0 0)",
      },
      colors: {
        background: "oklch(0.145 0 0)",
        foreground: "oklch(0.985 0 0)",
        primary: {
          DEFAULT: "#6366f1",
          foreground: "#ffffff",
        },
        border: "oklch(1 0 0 / 10%)",
        ring: "oklch(0.556 0 0)",
        input: "oklch(1 0 0 / 15%)",
        card: {
          DEFAULT: "oklch(0.205 0 0)",
          foreground: "oklch(0.985 0 0)",
        },
        muted: {
          DEFAULT: "oklch(0.269 0 0)",
          foreground: "oklch(0.708 0 0)",
        },
        accent: {
          DEFAULT: "oklch(0.269 0 0)",
          foreground: "oklch(0.985 0 0)",
        },
        destructive: {
          DEFAULT: "oklch(0.704 0.191 22.216)",
        },
      },
    },
  },
  plugins: [],
}