import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PlaygroundModule} from 'angular-playground';
import {setAgGridLicense} from './app/charts/utils/license';

PlaygroundModule
  .configure({
    selector: 'app-root',
    overlay: true,
    modules: [
      BrowserModule,
      BrowserAnimationsModule,
    ]
  });

setAgGridLicense();

platformBrowserDynamic().bootstrapModule(PlaygroundModule);
