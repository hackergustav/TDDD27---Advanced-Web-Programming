export const environment = {
  production: true,
  auth: {
    domain: 'collabify.eu.auth0.com',
    audience: 'https://driver-api',
    clientID: 'M8lY6EF0IuLq5tMvcwxzLf15CDTJ2Tgb',
    redirectUri: 'http://localhost:4200/callback',
    scope: 'openid profile manage:users email'
  }
};
