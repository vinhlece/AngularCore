import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {UserRolesService} from './user-roles.service';
import {AppConfigService} from '../../../app.config.service';
import {Store} from '@ngrx/store';

describe('User roles Service', () => {
  let service: UserRolesService;
  let http: HttpTestingController;
  let appConfigService: AppConfigService;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [
      UserRolesService,
      AppConfigService,
      {
        provide: Store,
        useValue: jasmine.createSpyObj('store', ['dispatch', 'pipe'])
      }
    ]
  }));

  beforeEach(() => {
    service = TestBed.get(UserRolesService);
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

  xit('#getRolesForUser() should get http with correct parameter ', fakeAsync(() => {
    const adminUser = 'adminUser';
    const fakeResponseObject = {
      'id': 'adminUser',
      'roleIds': ['1', '2']
    };

    let actualResponseObject;
    service.getRolesForUser(adminUser).subscribe(res => actualResponseObject = res );
    const req = http.expectOne('http://localhost:3000/permissions/adminUser');
    req.flush(fakeResponseObject);

    tick();

    expect(req.request.method).toEqual('GET');
    expect(actualResponseObject).toEqual(['1', '2']);
  }));

  xit('#addRoleForUser() should post http with correct parameter ', fakeAsync(() => {
    const fakeResponseObject = {
      'id': 'adminUser',
      'roleIds': ['1', '2']
    };

    let actualResponseObject;
    service.addRoleForUser(fakeResponseObject.id, fakeResponseObject.roleIds)
      .subscribe(res => actualResponseObject = res );
    const req = http.expectOne('http://localhost:3000/permissions/');
    req.flush(fakeResponseObject);

    tick();

    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(fakeResponseObject);
    expect(actualResponseObject).toEqual(fakeResponseObject);
  }));

  it('#dettachRoleFromUser() should put http with correct parameter ', fakeAsync(() => {
    const fakeResponseObject = {
      'id': 'adminUser',
      'roleIds': ['1', '2']
    };

    let actualResponseObject;
    service.dettachRoleFromUser(fakeResponseObject.id, fakeResponseObject.roleIds)
      .subscribe(res => actualResponseObject = res );
    const req = http.expectOne('http://localhost:3000/permissions/adminUser');
    req.flush(fakeResponseObject);

    tick();

    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(fakeResponseObject);
    expect(actualResponseObject).toEqual(fakeResponseObject);
  }));
});
