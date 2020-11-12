import * as formulaMeasuresActions from '../../measures/actions/formula-measure.actions';
import * as packagesActions from '../../measures/actions/packages.actions';
import * as colorPalleteActions from '../actions/palette.actions';
import {AppBootstrapImpl} from './app-bootstrap.service';

describe('AppBootstrap', () => {
  let store;
  let session;
  let service;

  beforeEach(() => {
    store = jasmine.createSpyObj('store', ['select', 'dispatch']);
    session = jasmine.createSpyObj('session', ['setUser', 'removeUser']);
    service = new AppBootstrapImpl(store, session);
  });

  describe('bootstrap', () => {
    it('should set session user', () => {
      const user = {id: 'abc', displayName: 'abc'};
      service.bootstrap(user);
      expect(session.setUser).toHaveBeenCalledWith(user);
    });

    it('should dispatch required actions', () => {
      const user = {id: 'abc', displayName: 'abc'};
      service.bootstrap(user);
      expect(store.dispatch).toHaveBeenCalledWith(new packagesActions.LoadAll());
      expect(store.dispatch).toHaveBeenCalledWith(new formulaMeasuresActions.LoadAll());
      expect(store.dispatch).toHaveBeenCalledWith(new colorPalleteActions.LoadAllPalettes());
    });

    it('should dispatch load all formula measures action', () => {
      const user = {id: 'abc', displayName: 'abc'};
      service.bootstrap(user);
    });
  });

  describe('cleanUp', () => {
    it('should remove session user', () => {
      service.cleanUp();
      expect(session.removeUser).toHaveBeenCalledTimes(1);
    });
  });
});
