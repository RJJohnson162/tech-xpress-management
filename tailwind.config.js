/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
      extend: {
          colors: {
              primary: "#042f2e",
              highlight: "#ede9fe",
              bgGray: "#ede9fe",
          },
          backgroundImage: {
              "hero-pattern": "url('./pages/index-Image.jpg')",
          },
      },
  },
  plugins: [],
};
