// This project is a Nuxt Layer: it is not meant to be run standalone as a site.
// Consuming projects add `extends: ['github:<you>/nuxt-ui-kit']` to their own
// nuxt.config.ts to inherit these components, composables and base styles.
// See https://nuxt.com/docs/getting-started/layers
import { createResolver } from "@nuxt/kit";

const { resolve } = createResolver(import.meta.url);

export default defineNuxtConfig({
  modules: ["@nuxt/eslint", "@nuxt/ui", "@nuxt/image"],

  // Resolved via createResolver, not the `~/` alias: in a layer, `~/` resolves
  // against the *consuming* project's srcDir, not this layer's own srcDir.
  css: [resolve("./app/assets/css/main.css")],

  compatibilityDate: "2025-01-15",
});
