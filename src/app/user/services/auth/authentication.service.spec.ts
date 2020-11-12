import {TestBed, fakeAsync, tick} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {AuthenticationService} from './authentication.service';
import {AppConfigService} from '../../../app.config.service';
import {Store} from '@ngrx/store';
// import { AmplifyService } from 'aws-amplify-angular';
import { signInButton } from '@aws-amplify/ui';
import { of } from 'rxjs';

describe('Authentication Service', () => {
  let service: AuthenticationService;
  let http: HttpTestingController;
  let appConfigService: AppConfigService;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [
      AuthenticationService,
      AppConfigService,
      {
        provide: Store,
        useValue: jasmine.createSpyObj('store', ['dispatch', 'pipe'])
      },
      {
        // provide: AmplifyService,
        useValue: jasmine.createSpyObj('AmplifyService', {
          'auth': {
            signIn: function(username, password) {
              return of({username, password});
            }
          }})
      }
    ]
  }));

  beforeEach(() => {
    service = TestBed.get(AuthenticationService);
    http = TestBed.get(HttpTestingController);
    appConfigService = TestBed.get(AppConfigService);
    appConfigService.config = {
      apiEndPoint: 'http://localhost:3000',
      kafkaEndPoint: '',
      kafkaApiKey: '',
      reportingDataGeneratorEndPoint: '',
      reportingDataSubscriptionEndPoint: '',
      webSocket: '',
      fqdn: ''
    };
  });

  it('#getUserInfo() should make a get http with correct parameter ', fakeAsync(() => {
    const adminUser = 'adminUser';
    const fakeResponseObject = {
      'id': 'adminUser',
      'displayname': 'Administrator',
      'password': '12345678'
    };

    let actualResponseObject;
    service.getUserInfo(adminUser).subscribe(res => actualResponseObject = res );
    const req = http.expectOne('http://localhost:3000/users/adminUser');
    req.flush(fakeResponseObject);

    tick();

    expect(req.request.method).toEqual('GET');
    expect(actualResponseObject.displayname).toEqual('Administrator');
  }));

  // TODO Tom to fix sprint 12
  xit('should emit user information when the login user is valid', fakeAsync(() => {
    const validUsername = 'User1';
    const validPassword = '123456';
    const fakeResponseObject = {
      'id': 'User1',
      'displayname': 'userName1',
      'password': '123456'
    };
    let responseUser;

    service.loginUser(validUsername, validPassword).subscribe( user => responseUser = user);
    http.expectOne('http://localhost:3000/users/User1')
      .flush(fakeResponseObject);

    tick();

    expect(responseUser).toBe(fakeResponseObject);
  }));

  // TODO Tom to fix sprint 12
  xit('should throw error when the password is not correct', fakeAsync(() => {
    const invalidUsername = 'User1';
    const invalidPassword = '12345678';
    const fakeResponseObject = {
      'id': 'User1',
      'displayname': 'userName1',
      'password': '123456'
    };
    let returnedError;
    service.loginUser(invalidUsername, invalidPassword).subscribe((user) => {},
      (error) => {
          returnedError = error;
      });

    http.expectOne('http://localhost:3000/users/User1')
      .flush(fakeResponseObject);

    tick();

    expect(returnedError).toEqual(new Error('Invalid User'));
  }));

  it('#signupUser() should make a post http with correct parameter ', fakeAsync(() => {
    const userName = 'user';
    const password = '123456';

    const fakeResponseObject = {
      'id': 'user',
      'password': '123456'
    };

    let actualResponseObject;
    service.signupUser(userName, password).subscribe(res => actualResponseObject = res );
    http.expectOne('http://localhost:3000/users/')
      .flush(fakeResponseObject);
    tick();

    expect(actualResponseObject.id).toEqual('user');
  }));
});
