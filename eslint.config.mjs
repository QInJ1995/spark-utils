import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      'dist/',
      'node_modules/',
      'coverage/',
      'docs/',
      'page/',
      'test/fixtures/',
      'src/sm-vendor/',
      // 旧 xe-utils fork 的 .js 文件逐模块删除中（M3-M6），不纳入新规则检查
      'src/**/*.js',
      '**/*.d.ts',
    ],
  },
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    // 用例数据文件：回调的占位参数是对旧签名的忠实还原（位置参数），非死代码；
    // 且函数源码文本会进入快照，不得随意改名
    files: ['test/fixtures-cases/**'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
)
