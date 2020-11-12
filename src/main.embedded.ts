import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {setAgGridLicense} from './app/charts/utils/license';
import {EmbeddedAppModule} from './app/embedded-app.module';
import {environment} from './environments/environment';

if (environment.production) {
  enableProdMode();
}

setAgGridLicense();

platformBrowserDynamic().bootstrapModule(EmbeddedAppModule);
