import withMT from "@material-tailwind/react/utils/withMT"
 
export default withMT({
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
});