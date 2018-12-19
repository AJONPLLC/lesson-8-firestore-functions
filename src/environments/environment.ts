// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
  production: false,
  firebase : {
    apiKey: 'AIzaSyBSiANxnA7IxeXng4S2xbXc-Z20Vm9CBr8',
    authDomain: 'ajonp-hosting-lessons.firebaseapp.com',
    databaseURL: 'https://ajonp-hosting-lessons.firebaseio.com',
    projectId: 'ajonp-hosting-lessons',
    storageBucket: 'ajonp-hosting-lessons.appspot.com',
    messagingSenderId: '75201775863'
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
