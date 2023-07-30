const withMT = require("@material-tailwind/react/utils/withMT");
 
module.exports = withMT({
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Poppins", "sans-serif"],
    },
    container: {
      center: true,
      screens: {
        desktop: "1000px"
      }
    },
    extend: {
      colors: {
        "50" : "#152028",
        "100" : "#121A21",
      }
    },
  },
  plugins: [],
})