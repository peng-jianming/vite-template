module.exports = {
	"env": {
		"browser": true,
		"es2021": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:vue/vue3-essential",
		"plugin:@typescript-eslint/recommended",
		"prettier",
		"plugin:prettier/recommended"
	],
	"overrides": [
	],
	"parser": "vue-eslint-parser",
	"parserOptions": {
		"ecmaVersion": "latest",
		"sourceType": "module",
		"parser": "@typescript-eslint/parser",
	},
	"plugins": [
		"vue",
		"@typescript-eslint",
		"prettier"
	],
	"rules": {
		"prettier/prettier": 2,
		"vue/multi-word-component-names": 0,
		"no-explicit-any": 0
	}
};
