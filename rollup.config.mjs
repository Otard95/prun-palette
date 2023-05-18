import typescript from 'rollup-plugin-typescript2'
import copy from 'rollup-plugin-copy'
import sass from 'rollup-plugin-sass'
import license from 'rollup-plugin-license'
import { uglify as uglifyPlug } from 'rollup-plugin-uglify'

const plugins = ({
  browser,
  uglify,
}) => ([
  typescript(),
  sass({
    output: `build-${browser}/index.css`,
  }),
  ...(uglify ? [uglifyPlug()] : []),
  copy({
    targets: [
      {
        src: `manifest.${browser}.json`,
        dest: `build-${browser}`,
        rename: 'manifest.json'
      },
      { src: 'assets/*.png', dest: `build-${browser}` },
    ],
  }),
  license({
    banner: {
      content: {
        file: 'LICENSE_TEMPLATE',
      },
    },
  }),
])

const production = process.env.ENV === 'production'

if (production) {
  console.log('Building for production')
} else {
  console.log('Building for development')
}

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'build-chrome/index.js',
      format: 'iife',
    },
    plugins: plugins({ browser: 'chrome', uglify: production }),
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'build-firefox/index.js',
      format: 'iife',
    },
    plugins: plugins({ browser: 'firefox', uglify: production }),
  },
]
