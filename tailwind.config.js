/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",   // app folder ke andar sab files
    "./components/**/*.{js,jsx,ts,tsx}", // components folder ke andar sab files
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}

