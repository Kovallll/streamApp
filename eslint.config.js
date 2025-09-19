import importResolver from 'eslint-plugin-import'
import prettier from 'eslint-plugin-prettier'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import tseslint from 'typescript-eslint'

import { fixupPluginRules } from '@eslint/compat'

export default [
    ...tseslint.configs.recommended,
    { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
    { languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
    { languageOptions: { globals: globals.browser } },
    {
        plugins: {
            'react-hooks': fixupPluginRules(reactHooks),
            'simple-import-sort': simpleImportSort,
            react: fixupPluginRules(react),
            import: fixupPluginRules(importResolver),
            prettier: prettier,
        },
        settings: {
            next: {
                version: 'detect',
            },
        },
        rules: {
            'simple-import-sort/imports': [
                'error',
                {
                    groups: [
                        ['^react', '^\\w'],
                        ['^src(/.*|$)', '^\\.'],
                        ['^[^.]'],
                    ],
                },
            ],
            '@typescript-eslint/no-explicit-any': 'warn',
            'react/react-in-jsx-scope': 'off',
            'react-hooks/rules-of-hooks': 'error',
            'import/first': 'error',
            '@typescript-eslint/no-unsafe-function-type': 'off',
            '@typescript-eslint/no-this-alias': 'off',
            'import/newline-after-import': 'error',
            'import/no-duplicates': 'error',
            'prefer-const': 'warn',
            'react-hooks/exhaustive-deps': 'warn',
            '@typescript-eslint/no-namespace': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                },
            ],
            'sort-imports': [
                'error',
                {
                    ignoreCase: true,
                    ignoreDeclarationSort: true,
                    ignoreMemberSort: false,
                    memberSyntaxSortOrder: [
                        'none',
                        'all',
                        'multiple',
                        'single',
                    ],
                    allowSeparatedGroups: true,
                },
            ],
            'react/self-closing-comp': [
                'error',
                {
                    component: true,
                    html: false,
                },
            ],
        },
    },
    {
        ignores: ['.next/*', '.yarn', '.pnp.cjs', 'storybook-static/*'],
    },
]
