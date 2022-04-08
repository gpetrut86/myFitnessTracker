// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import {ConfigFirebase} from '../../config';

const configFirebase = new ConfigFirebase();

export const environment = {
  production: false,
  firebase: {
    apiKey: configFirebase.config.firebase.apiKey,
    authDomain: configFirebase.config.firebase.authDomain,
    projectId: configFirebase.config.firebase.projectId,
    storageBucket: configFirebase.config.firebase.storageBucket,
    messagingSenderId: configFirebase.config.firebase.messagingSenderId,
    appId: configFirebase.config.firebase.appId,
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
