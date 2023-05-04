import typescript from '@rollup/plugin-typescript'
import copy from 'rollup-plugin-copy'
import sass from 'rollup-plugin-sass'
import license from 'rollup-plugin-license'

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'build-chrome/index.js',
      format: 'iife',
    },
    plugins: [
      typescript(),
      sass({
        output: 'build-chrome/index.css',
      }),
      copy({
        targets: [
          {
            src: 'manifest.chrome.json',
            dest: 'build-chrome',
            rename: 'manifest.json'
          },
          { src: 'assets/*.png', dest: 'build-chrome' },
        ],
      }),
      license({
        banner: {
          content: {
            file: 'LICENSE_TEMPLATE',
          },
        },
      }),
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'build-firefox/index.js',
      format: 'iife',
    },
    plugins: [
      typescript(),
      sass({
        output: 'build-firefox/index.css',
      }),
      copy({
        targets: [
          {
            src: 'manifest.firefox.json',
            dest: 'build-firefox',
            rename: 'manifest.json'
          },
          { src: 'assets/*.png', dest: 'build-firefox' }
        ],
      }),
      license({
        banner: {
          content: {
            file: 'LICENSE_TEMPLATE',
          },
        },
      }),
    ],
  },
]
