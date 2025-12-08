// eslint.config.cjs

const js = require('@eslint/js');
const globals = require('globals');
const reactHooks = require('eslint-plugin-react-hooks');
const reactRefresh = require('eslint-plugin-react-refresh');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
   // 🧹 Ignore build folders
   {
      ignores: ['**/dist/**', '**/build/**', '**/node_modules/**'],
   },

   // 🌍 Main config for ALL TypeScript/React/Node files
   {
      files: ['**/*.{ts,tsx,js,jsx}'],

      languageOptions: {
         parser: tsParser,
         ecmaVersion: 2020,
         sourceType: 'module',
         ecmaFeatures: { jsx: true },

         // Support BOTH browser (client) and Node (server)
         globals: {
            ...globals.browser,
            ...globals.node,
         },
      },

      plugins: {
         '@typescript-eslint': tseslint,
         react: require('eslint-plugin-react'),
         'react-hooks': reactHooks,
         'react-refresh': reactRefresh,
      },

      settings: {
         react: {
            version: 'detect',
         },
      },

      extends: [
         // JS recommended rules
         js.configs.recommended,

         // TS recommended rules
         tseslint.configs.recommended,

         // 🧠 React Hooks rules (useEffect deps, etc.)
         reactHooks.configs.recommended,

         // ⚡ Vite Hot Refresh rules (prevents mistakes that break HMR)
         reactRefresh.configs.vite,
      ],

      rules: {
         // ---------------------------------------------------------------------
         // You can add overrides here later if you want to customize behavior
         // ---------------------------------------------------------------------
         // Example relaxed rules:
         // "@typescript-eslint/no-explicit-any": "warn",
         // "react/react-in-jsx-scope": "off", // Vite doesn't require React import
         // "no-unused-vars": "off", // TS handles this instead
      },
   },
];
