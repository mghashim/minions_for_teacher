import js from "@eslint/js";
import eslintConfigNext from "eslint-config-next";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

const prettierCompatibility = {
  rules: {
    "arrow-body-style": "off",
    "prefer-arrow-callback": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-confusing-void-expression": "off",
    "@typescript-eslint/no-unnecessary-boolean-literal-compare": "off",
  },
};

export default defineConfig([
  {
    ignores: ["node_modules", ".next", "out", "build", ".tests-out", "next-env.d.ts"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintConfigNext,
  prettierCompatibility,
  {
    files: ["**/*.cjs"],
    languageOptions: {
      globals: {
        module: "readonly",
        require: "readonly",
        __dirname: "readonly",
        exports: "readonly",
      },
    },
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ],
      "react/jsx-props-no-spreading": "off"
    }
  }
]);
