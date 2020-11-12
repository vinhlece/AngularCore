import {User} from '../models/user';

export interface AppBootstrap {
  bootstrap(user: User): void;
  cleanUp(): void;
  checkSession(): boolean;
  loginBySession(): void;
}

export interface Session {
  setUser(user: User);
  removeUser();
  getUser(): User;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  getItem(key: string): string;
}
