// This project is a Nuxt Layer: it is not meant to be run standalone as a site.
// Consuming projects install it as a dependency and add `extends: ["nuxt-ui-kit"]`
// to their own nuxt.config.ts to inherit these components.
// The layer ships no global CSS and no design tokens: the consuming project owns its
// Tailwind entry point and its theme, which the components read through Nuxt UI's
// semantic classes and CSS variables. See https://nuxt.com/docs/getting-started/layers
export default defineNuxtConfig({
  modules: ["@nuxt/ui"],

  compatibilityDate: "2025-01-15",
});
