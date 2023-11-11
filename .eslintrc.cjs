module.exports = {
    env: {
      browser: true,
      es2021: true
    },
    extends: [
      "@nuxtjs/eslint-config",
      "@nuxtjs/eslint-config-typescript",
      "prettier"
    ],
    overrides: [],
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module"
    },
    rules: {}
  };
  