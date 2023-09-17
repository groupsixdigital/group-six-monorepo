// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  telemetry: false,

  typescript: {
    includeWorkspace: true
  },

  modules: ["@vueuse/nuxt", "@nuxtjs/tailwindcss"]
});
