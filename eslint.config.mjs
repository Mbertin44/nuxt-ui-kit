import { createConfigForNuxt } from "@nuxt/eslint-config/flat";

// Standalone config: the layer no longer registers the @nuxt/eslint module, so the
// Nuxt source directories (layer + playground) are declared here.
export default createConfigForNuxt({
  dirs: {
    src: ["./app", "./playground/app"],
  },
});
