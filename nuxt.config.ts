export default defineNuxtConfig({
  telemetry: false,
  typescript: {
    includeWorkspace: true,
  },

  vue: {
    defineModel: true,
  },
  devtools: false,
  modules: ["@vueuse/nuxt"],
});
