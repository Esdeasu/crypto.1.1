/* eslint-env node */
module.exports = {
  darkMode: "class",
  content: [
    "./public/**/*.html",
    "./src/**/*.{js,jsx,ts,tsx,vue}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms", require("flowbite/plugin"))],
};
