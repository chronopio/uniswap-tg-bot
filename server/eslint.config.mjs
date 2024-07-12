import path from "node:path";
import { fileURLToPath } from "node:url";
import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const compat = new FlatCompat({
  baseDirectory: dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...fixupConfigRules(
    compat.extends(
      "eslint:recommended",
      "plugin:@typescript-eslint/eslint-recommended",
      "plugin:import/recommended",
      "airbnb-base",
      "airbnb-typescript/base",
      "prettier",
    ),
  ),
  {
    plugins: {
      "@typescript-eslint": fixupPluginRules(typescriptEslint),
    },

    languageOptions: {
      parser: tsParser,

      parserOptions: {
        project: "./tsconfig.build.json",
        tsconfigRootDir: dirname,
      },
    },

    settings: {
      "import/resolver": {
        node: {
          extensions: [".ts", ".js"],
        },
        typescript: {},
      },
    },

    rules: {
      "import/no-default-export": "error",
      "import/prefer-default-export": "off",
      "no-unused-vars": "warn",
      "class-methods-use-this": "off",
      "@typescript-eslint/no-use-before-define": "error",
      "@typescript-eslint/no-unused-vars": "warn",

      "import/order": [
        2,
        {
          alphabetize: {
            order: "asc",
          },

          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
        },
      ],
    },
  },
  {
    ignores: ["**/contracts/**/*"],
  },
];
