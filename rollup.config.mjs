import typescript from 'rollup-plugin-typescript2'
import copy from 'rollup-plugin-copy'
import sass from 'rollup-plugin-sass'
import license from 'rollup-plugin-license'
import { uglify as uglifyPlug } from 'rollup-plugin-uglify'

const plugins = ({
  browser,
  uglify,
}) => ([
  typescript({
    tsconfigOverride: {
      compilerOptions: {
        moduleSuffixes: ['', `.${browser}`],
      }
    }
  }),
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
      { src: 'web-ext/index.js', dest: `build-${browser}`, rename: 'web-ext.js' },
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
    input: 'src/content.ts',
    output: {
      file: 'build-chrome/content.js',
      format: 'iife',
    },
    plugins: plugins({ browser: 'chrome', uglify: production }),
  },
  {
    input: 'src/content.ts',
    output: {
      file: 'build-firefox/content.js',
      format: 'iife',
    },
    plugins: plugins({ browser: 'firefox', uglify: production }),
  },
  {
    input: 'src/background.ts',
    output: {
      file: 'build-chrome/background.js',
      format: 'iife',
    },
    plugins: plugins({ browser: 'chrome', uglify: production }),
  },
  {
    input: 'src/background.ts',
    output: {
      file: 'build-firefox/background.js',
      format: 'iife',
    },
    plugins: plugins({ browser: 'firefox', uglify: production }),
  },
]
