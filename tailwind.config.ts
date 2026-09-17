import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#050505",
        "bg-card": "#0d0d0d",
        terminal: "#00ff41",
        "terminal-dim": "#00802120",
        "terminal-mid": "#00ff4140",
        cyan: "#22d3ee",
        amber: "#f59e0b",
        "fg-primary": "#e5e5e5",
        "fg-muted": "#737373",
      },
      fontFamily: {
        mono: ["Space Mono", "monospace"],
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "dash-flow": "dash-flow 1.5s linear infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        "dash-flow": {
          "0%": { strokeDashoffset: "20" },
          "100%": { strokeDashoffset: "0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
