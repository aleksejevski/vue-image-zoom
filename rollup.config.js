import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import vue from 'rollup-plugin-vue';

export default {
	// Default entry
	entry:	'src/main.js',

	// Default Format
	format: 'cjs',

	// Default output destination
	dest: 	'dist/bundle.js',
	plugins: [
		resolve({ jsnext: true }),
		commonjs(),
		vue({
			compileTemplate: true,
			css: null,
		}),
		babel({
			exclude:	'node_modules/**',
		}),
	],
}