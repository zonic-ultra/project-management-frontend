/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "ink-black": "#0d1b2a",
        "prussian-blue": "#1b263b",
        "dusk-blue": "#415a77",
        "lavender-grey": "#778da9",
        "alabaster-grey": "#e0e1dd",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
    },
  },
  plugins: [],
};
