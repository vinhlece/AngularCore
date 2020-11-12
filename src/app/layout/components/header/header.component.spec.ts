import {CommonModule} from '@angular/common';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import {By} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {AuthenticationService} from '../../../user/services/auth/authentication.service';
import {HeaderComponent} from './header.component';
import {User} from '../../../user/models/user';
import {getDefaultColorPalettes} from '../../../common/utils/color';
import {AppConfigService} from '../../../app.config.service';
import {getHostUrl} from '../../../common/utils/url';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {Router} from '@angular/router';

xdescribe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let appConfigService: AppConfigService;
  let http: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        MatMenuModule,
        MatButtonModule,
        MatToolbarModule,
        MatIconModule,
        MatDividerModule,
        MatSidenavModule,
        RouterTestingModule,
        HttpClientTestingModule,
        Router
      ],
      providers: [
        AuthenticationService,
        AppConfigService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    component.palettes = getDefaultColorPalettes();
    http = TestBed.get(HttpTestingController);
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

  it('shows login and signup button when user has not logged in', () => {
    setUserName('');
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('#btnLogin'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('#btnSignup'))).not.toBeNull();
  });

  it('shows the button contains userName when user logged in', () => {
    const userName = 'KaKa';
    setUserName(userName);
    fixture.detectChanges();

    const btnUserName = fixture.debugElement.query(By.css('#btnUserName'));

    expect(btnUserName).not.toBeNull();
    expect(btnUserName.nativeElement.textContent).toContain(userName);
  });

  it('shows the logout button in menu when clicking on the userName button', () => {
    const userName = 'KaKa';
    setUserName(userName);
    fixture.detectChanges();

    const btnUserName = fixture.debugElement.query(By.css('#btnUserName'));
    btnUserName.nativeElement.click();

    expect(fixture.debugElement.query(By.css('#btnLogout'))).not.toBeNull();
  });

  it('should emit event when calling #onLogout() in case of logged in', () => {
    const userName = 'KaKa';
    setUserName(userName);
    spyOn(component.logout, 'emit');

    component.onLogout();
    fixture.detectChanges();

    expect(component.logout.emit).toHaveBeenCalled();
  });

  it('should not emit event when calling #onLogout() in case of not logged in', () => {
    setUserName('');
    spyOn(component.logout, 'emit');

    component.onLogout();
    fixture.detectChanges();

    expect(component.logout.emit).not.toHaveBeenCalled();
  });

  it('should not show menu icon when user has not logged in', () => {
    const userName = '';
    setUserName(userName);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('#btnMenu'))).toBeNull();
  });

  it('show only dashboard item in menu when location is at widget', () => {
    const routerList = [
      {routerLink: 'dashboard', title: 'Manage Dashboards'},
      {routerLink: 'widget', title: 'Manage Widgets'}
    ];
    const userName = 'KaKa';
    setUserName(userName);
    component.currentLocation = 'widget';
    component.routerList = routerList;
    fixture.detectChanges();

    const btnMenu = fixture.debugElement.query(By.css('#btnMenu'));
    btnMenu.nativeElement.click();

    expect(fixture.debugElement.query(By.css('#dashboard'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('#widget'))).toBeNull();
  });

  it('show only widget item in menu when location is at dashboard', () => {
    const routerList = [
      {routerLink: 'dashboard', title: 'Manage Dashboards'},
      {routerLink: 'widget', title: 'Manage Widgets'}
    ];
    const userName = 'KaKa';
    setUserName(userName);
    component.currentLocation = 'dashboard';
    component.routerList = routerList;
    fixture.detectChanges();

    const btnMenu = fixture.debugElement.query(By.css('#btnMenu'));
    btnMenu.nativeElement.click();

    expect(fixture.debugElement.query(By.css('#dashboard'))).toBeNull();
    expect(fixture.debugElement.query(By.css('#widget'))).not.toBeNull();
  });

  it('show show version', () => {
    const userName = 'KaKa';
    setUserName(userName);
    fixture.detectChanges();

    const btnUserName = fixture.debugElement.query(By.css('#btnUserName'));
    btnUserName.nativeElement.click();

    expect(fixture.debugElement.query(By.css('#version'))).not.toBeNull();
  });

  /**
   * Set userName to component and call ngOnChange
   * @param userName
   */
  function setUserName(userName) {
    if (userName) {
      component.user = {id: 'id01', displayName: userName, selectedPalette: 'palette01'} as User;
    } else {
      component.user = null;
    }
  }
});
