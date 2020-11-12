import {Session} from './index';
import {Injectable} from '@angular/core';
import {User} from '../models/user';

@Injectable()
export class SessionImpl implements Session {
  readonly USER_NAME_KEY = 'userName';
  readonly USER_DISPLAY_NAME_KEY = 'userDisplayName';
  readonly SELECTED_PALETTE = 'selectedPalette';
  readonly TOKEN = 'token';
  readonly PASSWORD = 'password';

  setUser(user: User) {
    this.setItem(this.USER_NAME_KEY, user.id);
    this.setItem(this.USER_DISPLAY_NAME_KEY, user.displayName);
    this.setItem(this.SELECTED_PALETTE, user.selectedPalette);
    this.setItem(this.TOKEN, user.token);
    this.setItem(this.PASSWORD, user.password);
  }

  removeUser() {
    this.removeItem(this.USER_NAME_KEY);
    this.removeItem(this.USER_DISPLAY_NAME_KEY);
    this.removeItem(this.SELECTED_PALETTE);
    this.removeItem(this.TOKEN);
    this.removeItem(this.PASSWORD);
  }

  getUser(): User {
    const id = this.getItem(this.USER_NAME_KEY);
    const displayName = this.getItem(this.USER_DISPLAY_NAME_KEY);
    const selectedPalette = this.getItem(this.SELECTED_PALETTE);
    const token = this.getItem(this.TOKEN);
    const password = this.getItem(this.PASSWORD);
    if (!id) {
      return null;
    }
    return {id, displayName, selectedPalette, token, password};
  }

  setItem(key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  getItem(key: string): string {
    return sessionStorage.getItem(key);
  }
}
