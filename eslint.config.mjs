// eslint.config.mjs
import { ESLint } from 'eslint';

const eslint = new ESLint({
  overrideConfig: {
    files: ["**/*.js", "**/*.ts", "**/*.tsx"],
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: ["next"], // Agregar el plugin de Next.js
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      "eqeqeq": "error",
    },
  },
});

export default eslint;
