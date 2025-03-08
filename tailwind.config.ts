
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
      padding: {
        DEFAULT: "0.75rem",
        sm: "1rem",
        md: "1.5rem",
        lg: "2rem",
        xl: "3rem",
        "2xl": "4rem",
      },
      screens: {
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },
    screens: {
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1400px",
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
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" }
        }
      },
      animation: {
        "rainbow": "rainbow 3s ease infinite"
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
        darkBase: "#000000", // Updated to pure black
        darkBlue: "#0A0A0A", // Slightly lighter for gradient
        darkGrey: "#0D0D0D", // Middle tone for contrast
        
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
        shadowGray: "#1A1A1A",
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
      // Ensure responsive spacing
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      // Improve responsive typography
      fontSize: {
        'xxs': ['0.65rem', { lineHeight: '1rem' }],
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
