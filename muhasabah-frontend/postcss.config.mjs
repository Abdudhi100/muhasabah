// postcss.config.mjs
/**
 * PostCSS configuration for Tailwind CSS and Autoprefixer.
 * Tailwind handles utility generation, and Autoprefixer ensures
 * browser compatibility for the generated CSS.
 */
const config = {
  plugins: {
    "@tailwindcss/postcss": {}, // TailwindCSS PostCSS plugin
    autoprefixer: {}, // Add vendor prefixes automatically
  },
};

export default config;
