import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import base from './base.js';

/** Shared ESLint flat config for React libraries. */
export default tseslint.config(...base, reactHooks.configs.flat.recommended, {
  languageOptions: {
    globals: { ...globals.browser },
  },
});
