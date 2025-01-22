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
      colors: {
        // Base colors
        darkBase: "#121212",
        darkBlue: "#1A1F2C",
        darkGrey: "#1A1A1A",
        
        // Embossed palette
        softWhite: "#F6F6F7",
        softGray: "#E5E5E5",
        mediumGray: "#8E9196",
        shadowGray: "#2A2A2A",
        highlightGray: "#FFFFFF10",
        
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
      boxShadow: {
        'embossed': 'inset -2px -2px 4px rgba(255,255,255,0.05), inset 2px 2px 4px rgba(0,0,0,0.3)',
        'embossed-hover': 'inset -1px -1px 3px rgba(255,255,255,0.1), inset 1px 1px 3px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;