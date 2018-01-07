export const environment = {
  production: true,
  baseUrl: 'http://angular.at/api',
  authConfig: {
    // Url of the Identity Provider
    issuer: 'https://steyer-identity-server.azurewebsites.net/identity',
    // URL of the SPA to redirect the user to after login
    redirectUri: window.location.origin + '/index.html',
    // The SPA's id. The SPA is registerd with this id at the auth-server
    clientId: 'spa-demo',
    // set the scope for the permissions the client should request
    // The first three are defined by OIDC. The 4th is a usecase-specific one
    scope: 'openid profile email voucher',
  }
};
