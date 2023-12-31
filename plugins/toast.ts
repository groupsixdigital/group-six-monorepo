export default defineNuxtPlugin({
  name: "toast",

  async setup(nuxtApp) {
    const toast = useToast();
    return {
      provide: {
        toast,
      },
    };
  },
});
