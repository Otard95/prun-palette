#!/usr/bin/env zx

await $`cat .env`
  .stdout
  .split('\n')
  .filter((line) => line.trim() !== '' || line.trim().startsWith('#'))
  .map((line) => line.split('='))
  .forEach(([key, value]) => {
    $.env[key] = value
  })

const requireEnv = (key, defaultValue) => {
  if (key in $.env[key]) return $.env[key]
  if (defaultValue !== undefined) return defaultValue
  throw new Error(`Missing required environment variable: ${key}`)
}

const clientId = requireEnv('GOOGLE_CLIENT_ID')
const clientSecret = requireEnv('GOOGLE_CLIENT_SECRET')
const authCode = requireEnv('GOOGLE_AUTH_CODE')

const response = await fetch('https://accounts.google.com/o/oauth2/token', {
  method: 'POST',
  body: new URLSearchParams([
    ['client_id', decodeURIComponent(clientId.trim())],
    ['client_secret', decodeURIComponent(clientSecret.trim())],
    ['code', decodeURIComponent(authCode.trim())],
    ['grant_type', 'authorization_code'],
    ['redirect_uri', 'http://localhost:8818'],
  ]),
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})
const json = await response.json()
console.log('JSON:', json)
if (!json.error) {
  console.log('Copy your token:')
  console.log(json.refresh_token)
}
