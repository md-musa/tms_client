/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
      },
      colors:{
        "primary":{
          500:"#00AE8E5A",
          800:"#00AE8E7A",
          900:"#00AE8E"
        },
        "secondary":{
          100:"#3585C61A",
          200:"#3585C62A",
          300:"#3585C63A",
          400:"#3585C64A",
          500:"#3585C65A",
          600:"#3585C66A",
          700:"#3585C67A",
          800:"#3585C68A",
          900:"#3585C69A"
        },
        "neutral":{
          100:"#1e1e1e1A",
          200:"#1e1e1e2A",
          300:"#1e1e1e3A",
          400:"#1e1e1e4A",
          500:"#1e1e1e5A",
          600:"#1e1e1e6A",
          700:"#1e1e1e7A",
          800:"#1e1e1e8A",
          900:"#1e1e1e9A"
        }
      }
    },
  },
  plugins: [],
}