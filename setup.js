import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// 创建或更新 eslint.config.mjs 文件
const eslintConfig = `import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
export default [
  {languageOptions: { globals: globals.browser }},
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"],
];`;

fs.writeFileSync(path.join(process.cwd(), 'eslint.config.mjs'), eslintConfig);

// 初始化 Husky
execSync('npx husky install', { stdio: 'inherit' });

// 创建或更新 package.json 的 scripts 部分和 lint-staged 配置
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

packageJson.scripts = packageJson.scripts || {};
packageJson.scripts.prepare = 'husky install';
packageJson['lint-staged'] = packageJson['lint-staged'] || {
  '*.{js,jsx,ts,tsx,vue}': [
    'eslint --cache --fix',
    'prettier --write --list-different',
  ],
  '*.{json,md,html,css,scss,sass,less,styl}': [
    'prettier --write --list-different',
  ],
};

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

// 添加 pre-commit 钩子
execSync('npx husky add .husky/pre-commit "npx lint-staged"', {
  stdio: 'inherit',
});

console.log('ESLint and Husky configuration has been set up successfully.');
