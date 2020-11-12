import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FlexLayoutModule} from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import {By} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Store} from '@ngrx/store';
import {ReplaySubject, Subject} from 'rxjs';
import {Logout} from '../../../user/actions/user.actions';
import {HeaderComponent} from '../../components/header/header.component';
import {HeaderContainerComponent} from './header-container.component';
import {AppConfigService} from '../../../app.config.service';
import {getHostUrl} from '../../../common/utils/url';

xdescribe('HeaderContainerComponent', () => {
  let component: HeaderContainerComponent;
  let fixture: ComponentFixture<HeaderContainerComponent>;
  const mockStore = jasmine.createSpyObj('Store', ['dispatch', 'pipe']);
  let loginInformationSubject;
  let routerInformationSubject;
  let appConfigService: AppConfigService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HeaderContainerComponent,
        HeaderComponent
      ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        HttpClientModule,
        MatMenuModule,
        MatButtonModule,
        MatToolbarModule,
        MatIconModule
      ],
      providers: [
        {provide: Store, useValue: mockStore},
        AppConfigService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    loginInformationSubject = new Subject<{ id: string, displayName: string }>();
    routerInformationSubject = new ReplaySubject<{ state: { url: string } }>();
    mockStore.pipe.and.returnValues(loginInformationSubject.asObservable(), routerInformationSubject.asObservable());

    fixture = TestBed.createComponent(HeaderContainerComponent);
    component = fixture.componentInstance;
    appConfigService = TestBed.get(AppConfigService);
    appConfigService.config = {
      apiEndPoint: `${getHostUrl()}:3000`,
      kafkaEndPoint: '',
      kafkaApiKey: '',
      reportingDataGeneratorEndPoint: '',
      reportingDataSubscriptionEndPoint: '',
      webSocket: '',
      version: '1',
      fqdn: ''
    };
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('#constructor', () => {
    it('should getLoginInformation in store', () => {
      expect(mockStore.pipe).toHaveBeenCalled();
    });
  });

  describe('#logoutUser', () => {
    it('should dispatch LogoutAction', () => {
      component.logoutUser();
      expect(mockStore.dispatch).toHaveBeenCalledWith(new Logout());
    });
  });

  describe('#configure UI component', () => {
    it('#onLogout should call HeaderContainerComponent.logoutUser', () => {
      fixture.autoDetectChanges(true);
      loginInformationSubject.next({id: '10', displayName: 'Display name'});

      fixture.detectChanges();
      const fixtureHeaderComponent = fixture.debugElement.query(By.directive(HeaderComponent));
      const headerComponent = fixtureHeaderComponent.componentInstance;
      spyOn(component, 'logoutUser');

      headerComponent.onLogout();

      expect(component.logoutUser).toHaveBeenCalled();
    });

    it('#currentLocation of HeaderContainerComponent ' +
      'should be bound to #currentLocation of HeaderComponent', () => {
      fixture.detectChanges();
      const fixtureHeaderComponent = fixture.debugElement.query(By.directive(HeaderComponent));
      const headerComponent = fixtureHeaderComponent.componentInstance;
      const location = 'dashboard';

      component.currentLocation = location;
      fixture.detectChanges();

      expect(headerComponent.currentLocation).toBe(location);
    });
  });

  describe('#ngOnInit', () => {
    it('should call getLocation', () => {
      routerInformationSubject.next({state: {url: '/dashboard/1'}});
      spyOn(component, 'getLocation');
      fixture.detectChanges();
      expect(component.getLocation).toHaveBeenCalled();
    });
  });

  describe('#getLocation()', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });
    it('should return page name in url', () => {
      const location = '/dashboard';
      const pageName = 'dashboard';
      expect(component.getLocation(location)).toBe(pageName);
    });
    it('should return page name in url that has query parameter', () => {
      const location = '/dashboard?abc=10';
      const pageName = 'dashboard';
      expect(component.getLocation(location)).toBe(pageName);
    });
    it('should return page name in url that has parameters', () => {
      const location = '/dashboard/100';
      const pageName = 'dashboard';
      expect(component.getLocation(location)).toBe(pageName);
    });
  });

  describe('#loginInformation$ observable', () => {
    let headerComponent;
    beforeEach(() => {
      fixture.autoDetectChanges(true);
      component = fixture.componentInstance;

      const fixtureHeaderComponent = fixture.debugElement.query(By.directive(HeaderComponent));
      headerComponent = fixtureHeaderComponent.componentInstance;
    });

    it('should set userName of HeaderContainerComponent to empty when it has not emitted yet ', () => {
      fixture.detectChanges();

      expect(headerComponent.user).toBeNull();
    });

    it('should update userName of HeaderContainerComponent when loginInformation is changed', () => {
      loginInformationSubject.next({id: '10', displayName: 'User Info'});
      fixture.detectChanges();

      expect(headerComponent.user.displayName).toBe('User Info');
    });
  });
});
