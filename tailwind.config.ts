import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: "#FCFBF7",
        primary: '#F7A607',
        gray: "#D9D9D9",
        secondary: "#FDC332",
      },
      fontFamily: {
        sans: ["Fredoka", "sans-serif"],
        heading: ["Roboto", "sans-serif"],
      },
      zIndex: {
        '100': '100',
      }
    },
    screens: {
      sm: { max: "700px" },
      xs: { max: "320px" },
      md: "700px",
      lg: "1024px",
      xl: "1280px",
    },

    container: {
      center: true, // Automatically centers the container
      padding: "1rem", // Adds padding to all screen sizes
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px", // Optional, for extra-large screens
      },
    },
  },
  plugins: [],
}
export default config
