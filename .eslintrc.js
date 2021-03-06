module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
		es6: true
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			experimentalObjectRestSpread: true,
			jsx: true,
			warnOnUnsupportedTypeScriptVersion: false
		},
		ecmaVersion: 7,
		project: './tsconfig.json',
		sourceType: 'module'
	},
	plugins: [
		'@typescript-eslint',
		'import',
		'react',
		'react-hooks',
		'graphql',
		'prettierx'
	],
	settings: {
		prettierx: {
			usePrettierrc: true
		},
		react: {
			version: 'detect'
		}
	},
	extends: [
		'eslint:recommended',
		'plugin:you-dont-need-momentjs/recommended',
		'plugin:react/recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:prettierx/standardx',
		'plugin:prettierx/@typescript-eslint',
		'plugin:prettierx/react'
	],
	rules: {
		'prettierx/options': [
			2,
			{
				alignObjectProperties: false,
				jsxSingleQuote: false,
				semi: true,
				singleQuote: true,
				spaceBeforeFunctionParen: true,
				trailingComma: 'all',
				useTabs: true
			}
		],
		/* indent: [
			'error',
			'tab',
			{
				SwitchCase: 1,
				VariableDeclarator: 2
			}
		], */
		'linebreak-style': 'off',
		'no-console': 'off',
		'no-constant-condition': 'off',
		//'space-before-function-paren': ['error', 'always'],
		'no-unused-vars': [
			'warn',
			{
				varsIgnorePattern: 'UU',
				args: 'none'
			}
		],
		quotes: ['error', 'single'],
		semi: ['error', 'always'],
		'import/named': 2,
		//'comma-dangle': ['error', 'always-multiline'],
		'one-var': ['error', 'never'],
		'no-var': 'error',
		'padding-line-between-statements': [
			'error',
			{
				blankLine: 'always',
				prev: '*',
				next: 'return'
			},
			{
				blankLine: 'always',
				prev: ['const', 'let', 'var'],
				next: '*'
			},
			{
				blankLine: 'any',
				prev: ['const', 'let', 'var'],
				next: ['const', 'let', 'var']
			},
			{
				blankLine: 'always',
				prev: ['block', 'block-like', 'if'],
				next: '*'
			},
			{
				blankLine: 'always',
				prev: '*',
				next: ['block', 'block-like', 'if']
			},
			{
				blankLine: 'any',
				prev: 'export',
				next: '*'
			},
			{
				blankLine: 'any',
				prev: '*',
				next: 'export'
			}
		],
		'react/no-danger': 'off',
		'react/no-find-dom-node': 'off',
		'react/jsx-filename-extension': [
			1,
			{
				extensions: ['.tsx', '.jsx']
			}
		],
		'react/prop-types': [0],
		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': 'warn',
		'graphql/template-strings': [
			'error',
			{
				env: 'apollo',
				// @ts-ignore
				schemaJson: require('./schema.json')
			}
		],
		'@typescript-eslint/indent': ['error', 'tab']
	}
};
