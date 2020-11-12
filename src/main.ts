import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app/app.module';
import {setAgGridLicense} from './app/charts/utils/license';
import {environment} from './environments/environment';

/** Need to get aws config file */
// import awsconfig from './aws-exports';
// import * as AmplifyAuth from '@aws-amplify/auth';
// import * as AmplifyCore from '@aws-amplify/core';

// set below to 'DEBUG' from Amplify logs
// AmplifyCore.Logger.LOG_LEVEL = 'DEBUG';
// AmplifyAuth.default.configure(awsconfig);

if (environment.production) {
  enableProdMode();
}

setAgGridLicense();

platformBrowserDynamic().bootstrapModule(AppModule);
