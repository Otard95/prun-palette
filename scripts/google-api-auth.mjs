#!/usr/bin/env zx

import { google } from "googleapis";

(await $`cat .env`)
  .stdout
  .split('\n')
  .filter((line) => line.trim() !== '' || line.trim().startsWith('#'))
  .map((line) => line.split('='))
  .forEach(([key, value]) => {
    if (value.trim() !== '')
      $.env[key] = value
  })

const clientId = requireEnv('GOOGLE_CLIENT_ID')
const clientSecret = requireEnv('GOOGLE_CLIENT_SECRET')
const code = process.env['GOOGLE_AUTH_CODE']

async function getToken() {
  const oauth2Client = makeOAuth2Client({ clientId, clientSecret });

  if (code) await getRefreshToken(code);
  else getAuthUrl();

  async function getAuthUrl() {
    const url = oauth2Client.generateAuthUrl({
      // 'online' (default) or 'offline' (gets refresh_token)
      access_type: "offline",
      // scopes are documented here: https://developers.google.com/identity/protocols/oauth2/scopes#calendar
      scope: ['https://www.googleapis.com/auth/chromewebstore'],
    });

    console.log(`Go to this URL to acquire a refresh token:\n\n${url}\n`);
  }

  /** @param {string} code */
  async function getRefreshToken(code) {
    const token = await oauth2Client.getToken(code);
    console.log(token);
  }
}

getToken();

/**
  * @param {{ clientId: string; clientSecret: string; }} opts
  */
function makeOAuth2Client({
  clientId,
  clientSecret,
}) {
  return new google.auth.OAuth2(
    clientId,
    clientSecret,
    "http://localhost:8080"
  );
}

/**
  * @param {string} key
  * @param {string} defaultValue
  * @returns {string}
  */
function requireEnv(key, defaultValue) {
  if (key in $.env) return $.env[key]
  if (defaultValue !== undefined) return defaultValue
  throw new Error(`Missing required environment variable: ${key}`)
}
