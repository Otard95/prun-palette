#!/usr/bin/env zx

$.verbose = false

const args = process.argv.slice(2)
const program = args.shift()
const isDryRun = args.includes('--dry-run')

const positionalArgs = args.filter(arg => !arg.startsWith('-'))
if (positionalArgs.length !== 1) {
  console.log(`Usage: ${program} [--dry-run] <in-directory>`)
  exit(1)
}

const directory = positionalArgs[0]

const pkg = JSON.parse((await $`cat package.json`).stdout || 'null')
const licenseTemplate = (await $`cat LICENSE_TEMPLATE`).stdout || ''

if (!pkg || !licenseTemplate) {
  console.log('Error: failed to read package.json or LICENSE_TEMPLATE')
  exit(1)
}

const license = licenseTemplate
  .replace('<%= pkg.description %>', pkg.description)
  .replace('<%= moment().format(\'YYYY\') %>', new Date().getFullYear())

const licenseLines = license.split('\n').length

const findArgs = [
  '-not',
  '-path',
  '**/node_modules/**',
  '-and',
  '(',
  '-name',
  '*.ts',
  '-or',
  '-name',
  '*.tsx',
  '-or',
  '-name',
  '*.css',
  ')',
  '-type',
  'f'
]
const files = (await $`find ${directory} ${findArgs}`).stdout
  .split('\n')
  .filter(Boolean)

for (const file of files) {
  console.log(file)

  let contents = (await $`cat ${file}`).stdout
  if (contents.startsWith('/*') && contents.includes('Copyright')) {
    contents = contents.split('\n').slice(licenseLines + 2).join('\n')
  }

  contents = [
    '/*',
    license,
    '*/',
    contents
  ].join('\n')

  if (!isDryRun)
    await $`echo -n ${contents} > ${file}`
}

console.log(files.stdout)

// $LICENSE=$(cat LICENSE)
// $LICENSE=$(echo $LICENSE | sed 's/\<\%\= pkg.description  \%\>/TMP_DESC/g' | sed "s/TMP_DESC/$DESCRIPTION/g")
//
// echo $LICENSE
// exit 0
//
// for f in $(find src -name *.ts -type f); do
//   echo $f
// done
