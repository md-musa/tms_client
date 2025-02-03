/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        'sf-regular': ["SFPRODISPLAYREGULAR", "sans-serif"],
        'sf-medium': ["SFPRODISPLAYMEDIUM", "sans-serif"],
        'sf-bold': ["SFPRODISPLAYBOLD", "sans-serif"],
        'sf-black-italic': ["SFPRODISPLAYBLACKITALIC" , "sans-serif"],
        'sf-heavy-italic': ["SFPRODISPLAYHEAVYITALIC" , "sans-serif"],
        'sf-light-italic': ["SFPRODISPLAYLIGHTITALIC" , "sans-serif"],
        'sf-semi-bold-italic': ["SFPRODISPLAYSEMIBOLDITALIC" , "sans-serif"],
        'sf-thin-italic': ["SFPRODISPLAYTHINITALIC" , "sans-serif"],
        'sf-ultra-light-italic': ["SFPRODISPLAYULTRALIGHTITALIC" , "sans-serif"],
      },
      fontSize: {
        'large-title': '34px',   // Title size as bold 34px
        'title-1': '28px',   // Title size as bold 34px
        'title-2': '22px',   // Title size as bold 34px
        'title-3': '20px',   // Title size as bold 34px
        'headline': '20px', // Heading size as bold 24px
        'body': '17px', // Heading size as bold 24px
        'subhead': '15px', // Heading size as bold 24px
        'footnote': '13px', // Heading size as bold 24px
      },
      colors:{
        "primary":{
          50: "#00C89B0D", 
          100: "#00C89B1A", 
          200: "#00C89B33", 
          300: "#00C89B4D", 
          400: "#00C89B66", 
          500: "#00C89B80", 
          600: "#00C89B99", 
          700: "#00C89BB3", 
          800: "#00C89BCC", 
          900: "#00C89BE6", 
          1000: "#00C89B"
        },
        "secondary":{
          50: "#8D0FC01A", 
          100: "#8D0FC033", 
          200: "#8D0FC04D", 
          300: "#8D0FC066", 
          400: "#8D0FC080", 
          500: "#8D0FC099", 
          600: "#8D0FC0B3", 
          700: "#8D0FC0CC", 
          800: "#8D0FC0E6", 
          900: "#8D0FC0"
        },
        "tertiary":{
          50: "#24204D0D", 
          100: "#24204D1A", 
          200: "#24204D33", 
          300: "#24204D4D", 
          400: "#24204D66", 
          500: "#24204D80", 
          600: "#24204D99", 
          700: "#24204DB3", 
          800: "#24204DCC", 
          900: "#24204DE6"
        },
        "muted":{
          50: "#8282820D", 
          100: "#8282821A", 
          200: "#82828233", 
          300: "#8282824D", 
          400: "#82828266", 
          500: "#82828280", 
          600: "#82828299", 
          700: "#828282B3", 
          800: "#828282CC", 
          900: "#828282E6"
        }
      }
    },
  },
  plugins: [],
}
