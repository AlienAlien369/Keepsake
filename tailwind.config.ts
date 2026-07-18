import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#FBF6EA",
          dim: "#F2EAD9",
          line: "#E3D6BC",
        },
        ink: {
          DEFAULT: "#211C2E",
          soft: "#4A4460",
        },
        night: {
          DEFAULT: "#07060D",
          deep: "#0C0A18",
          card: "#14101F",
        },
        gold: {
          DEFAULT: "#C9A227",
          bright: "#E8C766",
          soft: "#9C8A4E",
        },
        aurora: {
          violet: "#6C5CE7",
          teal: "#2FD9C4",
          rose: "#E9668B",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        hand: ["var(--font-caveat)", "cursive"],
      },
      keyframes: {
        "aurora-move": {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(-4%, 3%, 0) scale(1.08)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "heartbeat": {
          "0%, 100%": { transform: "scale(1)" },
          "14%": { transform: "scale(1.18)" },
          "28%": { transform: "scale(1)" },
          "42%": { transform: "scale(1.12)" },
          "70%": { transform: "scale(1)" },
        },
        "twinkle": {
          "0%, 100%": { opacity: "0.15" },
          "50%": { opacity: "1" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "aurora-move": "aurora-move 18s ease-in-out infinite",
        "float-slow": "float-slow 7s ease-in-out infinite",
        "heartbeat": "heartbeat 2.2s ease-in-out infinite",
        "twinkle": "twinkle 3.2s ease-in-out infinite",
        "shimmer": "shimmer 3.5s linear infinite",
      },
      backgroundImage: {
        "grain": "url('/grain.svg')",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
