
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(5px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "rainbow": {
          "0%": { backgroundPosition: "0%" },
          "100%": { backgroundPosition: "200%" }
        }
      },
      animation: {
        "rainbow": "rainbow 4s linear infinite"
      },
      colors: {
        // Color variables for rainbow button
        "--color-1": {
          DEFAULT: "344deg 85% 60%", // Pink
        },
        "--color-2": {
          DEFAULT: "237deg 85% 60%", // Blue
        },
        "--color-3": {
          DEFAULT: "178deg 85% 50%", // Cyan
        },
        "--color-4": {
          DEFAULT: "120deg 85% 40%", // Green
        },
        "--color-5": {
          DEFAULT: "45deg 93% 56%", // Yellow
        },
        // Base colors
        darkBase: "#191919", // Updated to RGB(25, 25, 25)
        darkBlue: "#1A1A1A", // Slightly lighter for gradient
        darkGrey: "#1D1D1D", // Middle tone for contrast
        
        // Metallic palette
        silver: {
          DEFAULT: "#C0C0C0",
          light: "#D8D8D8",
          dark: "#A0A0A0",
        },
        
        // Clean palette
        softWhite: "#F6F6F7",
        softGray: "#E5E5E5",
        mediumGray: "#8E9196",
        shadowGray: "#2A2A2A",
        highlightGray: "#FFFFFF10",
        
        // Accent colors
        accent: {
          blue: "#007AFF",
          red: "#FF3B30",
          green: "#34C759",
        },
        
        // UI Elements
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
