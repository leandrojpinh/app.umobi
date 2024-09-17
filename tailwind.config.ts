import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      'app-background': 'linear-gradient(#252C3D, #13181F)',
      'app-linear': 'linear-gradient(#2DB4E3, #4646E9)',
      'app-primary-light': '#2DB4E3',
      'app-primary-dark': '#4646E9',
      'app-black-light': '#252C3D',
      'app-black-dark': '#13181F',
      'app-text': '#D7DFEB',
      'app-text2': '#A2AAB6',
      'app-placeholder': '#8994BD',
      'app-error': '#d32f2f',
    },
    fontFamily: {
      'app-text': ['Inter', 'Signika', 'sans-serif'],
      'app-title': ['Staatliches', 'sans-serif'],
    }
  },
  plugins: [],
};
export default config;
