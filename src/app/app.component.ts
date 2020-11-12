import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ThemeService} from './theme/theme.service';
import {Theme} from './theme/model/index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'app';

  signedIn: boolean;
  user: any;
  greeting: string;

  constructor(public translate: TranslateService, private themeService: ThemeService) {

    // Define languages in the application
    const languages = ['en', 'vi'];
    translate.addLangs(languages);
    translate.setDefaultLang('en');

    // Set current language by browser language or local storage
    let language = localStorage.getItem('language');
    if (!language) {
      language = this.translate.getBrowserLang();
    }
    this.translate.use(languages.indexOf(language) >= 0 ? language : 'en');
  }

  isDarkTheme() {
    return this.themeService.getCurrentTheme() === Theme.Dark;
  }

  login(){
    console.log('login')
  }

  currentUser(){
    console.log('currentUser')
  }
}
