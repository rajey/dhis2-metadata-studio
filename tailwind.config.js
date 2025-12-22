/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  corePlugins: {
    preflight: false, // helps avoid conflicts with @dhis2/ui styling
  },
  theme: {
    extend: {},
  },
  plugins: [],
};
