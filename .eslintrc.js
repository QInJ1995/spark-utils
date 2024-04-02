module.exports = {
  parser: '@babel/eslint-parser',
  root: true,
  env: {
    browser: true,
    node: true,
    jasmine: true,
    jest: true,
    es6: true,
  },
  extends: [
    'plugin:vue/strongly-recommended',
    'eslint:recommended',
    'standard'
  ],
  plugins: [],
  overrides: [
    {
      files: ['*.vue'],
      parser: 'vue-eslint-parser',
      extends: [
        'plugin:vue/recommended'
      ],
      rules: {
        'vue/require-prop-types': 'off',
        'vue/require-default-prop': 'off',
        'vue/no-reserved-keys': 'off',
        'vue/prop-name-casing': 'off',
        'vue/max-attributes-per-line': [
          2,
          {
            singleline: 20,
            multiline: {
              max: 1,
              allowFirstLine: false,
            },
          }
        ],
        'vue/this-in-template': 'off',
        'vue/name-property-casing': 'off',
        'vue/no-unused-vars': 'off',
        'vue/component-definition-name-casing': 'off',
      },
    }
  ],
  rules: {
    // no 规则
    'no-debugger': 'error',
    'no-extra-boolean-cast': 'off',
    'no-var': 'error',
    'no-console': ['error', { allow: ['error', 'log', 'warn'], }],
    'no-undef': 'off',
    'no-return-assign': 'off',
    'node/no-callback-literal': 'off',

    // 格式化规则
    // 代码复杂度
    complexity: ['error', 18],
    // 格式化不加分号
    semi: ['warn', 'never'],
    // 格式化为单引号
    quotes: ['warn', 'single'],
    'comma-spacing': ['warn', { before: false, after: true, }],
    'arrow-spacing': ['error', { before: true, after: true, }],
    camelcase: 'off',
    eqeqeq: ['error', 'smart'],
    'comma-dangle': ['error', {
      arrays: 'never',
      objects: 'always',
      imports: 'always',
      exports: 'always',
      functions: 'never',
    }],

    // vue 规则
    'vue/name-property-casing': 'off',
    'vue/require-prop-types': 'off',
    'vue/require-default-prop': 'off',
    'vue/no-reserved-keys': 'off',
    'vue/prop-name-casing': 'off',
    'vue/max-attributes-per-line': [
      2,
      {
        singleline: 20,
        multiline: {
          max: 1,
          allowFirstLine: false,
        },
      }
    ],
    'vue/this-in-template': 'off',
    'vue/no-unused-vars': 'off',
    'vue/component-definition-name-casing': 'off',
  },
}
