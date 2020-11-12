import { Injectable, Inject, EventEmitter } from '@angular/core';
import {BehaviorSubject} from 'rxjs/Rx';
import {Theme} from './model/index';


@Injectable()
export class ThemeService {
  private _currentTheme = Theme.Light;
  private _activeTheme = new BehaviorSubject(this._currentTheme);

  constructor() { }

  public getCurrentTheme() {
    return this._currentTheme;
  }

  public getActiveTheme() {
    return this._activeTheme.asObservable();
  }

  public setActiveThem(name) {
    localStorage.setItem('theme', name);
    this._currentTheme = name;
    this._activeTheme.next(name);
  }
}
