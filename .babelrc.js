module.exports = {
	presets: [['@babel/preset-env', { 'targets': { 'node': '8.10' } }], 'next/babel', '@zeit/next-typescript/babel'],
  plugins: ['@babel/plugin-transform-runtime']
}
