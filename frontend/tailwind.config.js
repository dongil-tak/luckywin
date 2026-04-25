/** @type {import('tailwindcss').Config} */
import formsPlugin from '@tailwindcss/forms';
import containerQueriesPlugin from '@tailwindcss/container-queries';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface-container-high": "#eae8e3",
        "on-primary-fixed": "#241a00",
        "surface-bright": "#fbf9f4",
        "on-tertiary-fixed-variant": "#584400",
        "inverse-surface": "#30312e",
        "error": "#ba1a1a",
        "on-error-container": "#93000a",
        "secondary-container": "#e4e2e1",
        "on-surface-variant": "#4d4635",
        "surface-dim": "#dbdad5",
        "on-background": "#1b1c19",
        "primary-container": "#d4af37",
        "on-secondary-container": "#656464",
        "surface-container-highest": "#e4e2dd",
        "on-primary": "#ffffff",
        "secondary-fixed": "#e4e2e1",
        "on-tertiary-fixed": "#241a00",
        "error-container": "#ffdad6",
        "on-primary-container": "#554300",
        "on-primary-fixed-variant": "#574500",
        "tertiary-fixed": "#ffe08b",
        "tertiary": "#725c14",
        "primary-fixed": "#ffe088",
        "tertiary-container": "#cdb061",
        "inverse-primary": "#e9c349",
        "on-tertiary-container": "#554300",
        "on-secondary-fixed-variant": "#474747",
        "surface-container-low": "#f5f3ee",
        "on-secondary-fixed": "#1b1c1c",
        "background": "#fbf9f4",
        "surface": "#fbf9f4",
        "secondary": "#5f5e5e",
        "secondary-fixed-dim": "#c8c6c5",
        "surface-variant": "#e4e2dd",
        "surface-tint": "#735c00",
        "on-error": "#ffffff",
        "outline": "#7f7663",
        "surface-container-lowest": "#ffffff",
        "outline-variant": "#d0c5af",
        "tertiary-fixed-dim": "#e1c472",
        "primary": "#735c00",
        "surface-container": "#f0eee9",
        "on-secondary": "#ffffff",
        "inverse-on-surface": "#f2f1ec",
        "on-surface": "#1b1c19",
        "on-tertiary": "#ffffff",
        "primary-fixed-dim": "#e9c349"
      },
      fontFamily: {
        "headline": ["Manrope", "sans-serif"],
        "body": ["Noto Sans KR", "Work Sans", "sans-serif"],
        "label": ["Work Sans", "sans-serif"]
      },
      borderRadius: {"DEFAULT": "1rem", "lg": "2rem", "xl": "3rem", "full": "9999px"},
    },
  },
  plugins: [
    formsPlugin,
    containerQueriesPlugin,
  ],
}
