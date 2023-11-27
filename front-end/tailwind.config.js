/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "my-salmon": "#FFAE9D",
        "my-beige": "#FAF2EA",
        "my-light-brown": "#CCAEA4",
        "my-brown": "#B39188",
        "my-dark-brown": "#392E2C",
      },
    },
  },
}
