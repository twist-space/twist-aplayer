import antfu from '@antfu/eslint-config';

export default antfu({
  stylistic: {
    jsx: true,
    semi: true,
    overrides: {
      'style/jsx-self-closing-comp': ['error', {
        'component': true,
        'html': false,
      }],
    },
  },
  react: true,
  typescript: true,
  rules: {
    'no-useless-return': 'off',
    'antfu/if-newline': 'off',
    'style/quote-props': 'off',
    'react/prefer-destructuring-assignment': 'off',
    'style/brace-style': 'off',
    'react/no-unstable-context-value': 'off',
    'react/no-children-for-each': 'off',
    'regexp/no-unused-capturing-group': 'off',
  },
});
