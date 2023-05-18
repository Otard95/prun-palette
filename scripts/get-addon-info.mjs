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

const jwt = require('jsonwebtoken')

const issuedAt = Math.floor(Date.now() / 1000);
const payload = {
  iss: requireEnv('FIREFOX_JWT_ISSUER'),
  jti: Math.random().toString(),
  iat: issuedAt,
  exp: issuedAt + 30,
};
const secret = requireEnv('FIREFOX_JWT_SECRET');
const jwtBlob = jwt.sign(payload, secret, { algorithm: 'HS256' });

const jwtHeader = `JWT ${jwtBlob}`
const extId = requireEnv('FIREFOX_EXTENSION_ID')

const url = `https://addons.mozilla.org/api/v5/addons/addon/${extId}`

const res = await fetch(url, {
  headers: {
    Authorization: jwtHeader,
  },
});

console.log('res code:', res.status)
if (res.status === 200) {
  const json = await res.json()
  console.log('JSON:', json)
}
