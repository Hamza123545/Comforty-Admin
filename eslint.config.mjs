import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Turn off all common rules
      'no-console': 'off',
      'no-unused-vars': 'off',
      'react/jsx-no-undef': 'off',
      'react/prop-types': 'off',
      'next/no-html-link-for-pages': 'off',
      'next/next-script-for-ga': 'off',
    },
  },
];

export default eslintConfig;
