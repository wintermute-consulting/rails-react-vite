import configPrettier from "eslint-config-prettier";
import pluginImport from "eslint-plugin-import";
import pluginPrettier from "eslint-plugin-prettier";
import pluginReact from "eslint-plugin-react";
import pluginUnusedImports from "eslint-plugin-unused-imports";

export default [
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: pluginReact,
      import: pluginImport,
      "unused-imports": pluginUnusedImports,
      prettier: pluginPrettier,
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      "react/jsx-no-undef": "error",
      "unused-imports/no-unused-imports": "error",
      "import/no-duplicates": "error",
      "import/no-unresolved": "error",
      "prettier/prettier": "warn",
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        alias: {
          map: [["~", "./app/frontend"]],
          extensions: [".js", ".jsx", ".json"],
        },
      },
    },
  },
  configPrettier,
];
