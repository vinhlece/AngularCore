import {async, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {UserNavigator} from '../../../layout/navigator/user.navigator';
import {APP_BOOTSTRAP} from '../tokens';
import {AuthenticatedGuardService} from './authenticated-guard.service';
import {AppConfigService} from '../../../app.config.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {RouterStateSnapshot} from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AuthenticatedGuardService', () => {
  let authGuardService: AuthenticatedGuardService;
  let http: HttpTestingController;
  let mockStore;
  let mockAppBootstrap;
  let mockNavigator;
  let appConfigService: AppConfigService;
  let state;

  beforeEach(async(() => {
    mockStore = jasmine.createSpyObj('store', ['pipe']);
    mockAppBootstrap = jasmine.createSpyObj('appBootstrap', ['bootstrap', 'cleanUp', 'checkSession', 'loginBySession']);
    mockNavigator = {
      navigateToLogin: jasmine.createSpy('navigateToLogin')
    };
    state = jasmine.createSpyObj<RouterStateSnapshot>('RouterStateSnapshot', ['toString']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthenticatedGuardService,
        {
          provide: UserNavigator,
          useValue: mockNavigator
        },
        {
          provide: Store,
          useValue: mockStore
        },
        {
          provide: APP_BOOTSTRAP,
          useValue: mockAppBootstrap
        },
        AppConfigService
      ]
    });
    http = TestBed.get(HttpTestingController);
    appConfigService = TestBed.get(AppConfigService);
    appConfigService.config = {
      apiEndPoint: '',
      kafkaEndPoint: '',
      kafkaApiKey: '',
      reportingDataGeneratorEndPoint: '',
      reportingDataSubscriptionEndPoint: '',
      webSocket: '',
      fqdn: ''
    };
  }));

  describe('#canActivate()', () => {
    it('should redirect to login page if user is not authenticated', fakeAsync(() => {
      const invalidUser = null;
      mockStore.pipe.and.returnValue(of(invalidUser));
      state.url = '/protected';
      const route = null;

      authGuardService = TestBed.get(AuthenticatedGuardService);
      const observable = authGuardService.canActivate(route, state) as Observable<boolean>;
      mockAppBootstrap.checkSession.and.returnValue(true);
      observable.subscribe(() => {
        expect(mockNavigator.navigateToLogin).toHaveBeenCalled();
      });
      tick();
    }));

    it('should bootstrap app with user when user already logged in', () => {
      const validUser = {id: 'user', displayName: 'user'};
      mockStore.pipe.and.returnValue(of(validUser));
      state = null;
      const route = null;

      authGuardService = TestBed.get(AuthenticatedGuardService);
      const observable = authGuardService.canActivate(route, state) as Observable<boolean>;
      observable.subscribe(item => {
        expect(mockAppBootstrap.bootstrap).toHaveBeenCalledWith(validUser);
      });
    });
  });
});
