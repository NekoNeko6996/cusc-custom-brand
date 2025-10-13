import babel from '@rollup/plugin-babel';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import url from '@rollup/plugin-url';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/index.js',
  output: [
    { file: 'dist/index.js', format: 'esm', sourcemap: true },
    { file: 'dist/index.cjs', format: 'cjs', sourcemap: true },
  ],
  external: [
    'react',
    'react-dom',
    'react-responsive',
    '@openedx/paragon',
    '@edx/frontend-platform',
    '@edx/frontend-platform/react',
  ],
  plugins: [
    nodeResolve({ extensions: ['.js', '.jsx'] }),
    commonjs(),
    url({ include: ['**/*.svg','**/*.png','**/*.ico'], limit: 0 }),
    postcss({ extract: 'scss/index.css', minimize: true }),
    babel({ babelHelpers: 'bundled', presets: ['@babel/preset-react'] }),
  ],
};
