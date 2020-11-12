import {Directive, OnInit, ElementRef, OnDestroy} from '@angular/core';
import { ThemeService } from './theme.service';
import {Theme, themes} from './model/index';
import {Subscription} from 'rxjs/Rx';

@Directive({
  selector: '[appTheme]'
})
export class ThemeDirective implements OnInit, OnDestroy {
  private _themeName = Theme.Light;
  private _themServiceSubscription: Subscription;
  constructor( private elementRef: ElementRef,
               private themeService: ThemeService) {}

  ngOnInit() {
    this.updateTheme(this._themeName);
    this.themeService.getActiveTheme()
      .subscribe(themeName => {
        this._themeName = themeName ;
        this.updateTheme(this._themeName);
      });
  }

  updateTheme(themeName) {
    const element = this.elementRef.nativeElement;
    const theme = themes[themeName];
    for (const key in theme) {
      element.style.setProperty(key, theme[key]);
    }
  }

  ngOnDestroy() {
    if (this._themServiceSubscription) {
      this._themServiceSubscription.unsubscribe();
    }
  }
}
