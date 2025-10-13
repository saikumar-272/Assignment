// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  serviceName : 'TemplateApp',
  uiServiceName : 'templateappui',
  production: false,
  statusCheckDelay: 10000,
  apiUrl: 'http://$$BACKEND_DOMAIN_PREFIX$$localhost:8085/',
  templateappServiceApiUrl: 'http://$$BACKEND_DOMAIN_PREFIX$$localhost:8085',
  tempappdummyServiceApiUrl: 'http://$$BACKEND_DOMAIN_PREFIX$$localhost:8085',
  testservice2ServiceApiUrl: 'http://$$BACKEND_DOMAIN_PREFIX$$localhost:4300',
  testschoolbeServiceApiUrl: 'http://$$BACKEND_DOMAIN_PREFIX$$localhost:4500',
  mockservice1ServiceApiUrl: 'http://$$BACKEND_DOMAIN_PREFIX$$localhost:8087',
  mockservice3ServiceApiUrl: 'http://$$BACKEND_DOMAIN_PREFIX$$localhost:8042',
  mockservice2ServiceApiUrl: 'http://$$BACKEND_DOMAIN_PREFIX$$localhost:8089',
  
  templateappUrl: '/',
  tempappdummyUrl: '/',
  testservice2Url: '/testservice2/',
  testschoolbeUrl: '/',
  mockservice1Url: '/',
  mockservice2Url: '/',
  
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
