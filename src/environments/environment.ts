// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
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
