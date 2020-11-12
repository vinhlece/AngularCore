import {TestBed, fakeAsync, tick} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {SubscriptionService} from './subscription.services';
import {AppConfigService} from '../../../app.config.service';
import {Store} from '@ngrx/store';

describe('Subscription Service', () => {
  let service: SubscriptionService;
  let http: HttpTestingController;
  let appConfigService: AppConfigService

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [
      SubscriptionService,
      AppConfigService,
      {
        provide: Store,
        useValue: jasmine.createSpyObj('store', ['dispatch', 'pipe'])
      }
    ]
  }));

  beforeEach(() => {
    service = TestBed.get(SubscriptionService);
    http = TestBed.get(HttpTestingController);
    appConfigService = TestBed.get(AppConfigService);
    appConfigService.config = {
      apiEndPoint: '',
      kafkaEndPoint: '',
      kafkaApiKey: '',
      reportingDataGeneratorEndPoint: '',
      reportingDataSubscriptionEndPoint: '',
      webSocket: 'http://localhost:3000/websocket/',
      fqdn: ''
    };
  });

  it('#add() should add new subscription with correct parameters', fakeAsync(() => {
    const subscription = {
      sessionId: 'sessionId',
      id: 'subscriptionID',
      user: 'adminUser',
      measureFilters: [],
      packageName: 'Queue Performance'
    };
    const fakeResponseObject = {
      webSocketConnection: 'joulica-reporting-sub-pub-agentperformance'
    };

    let actualResponseObject = null;
    service.add(subscription).subscribe(res => actualResponseObject = res);
    const req = http.expectOne('http://localhost:3000/websocket/subscriptionfilter/subscriptions');
    req.flush(fakeResponseObject);

    tick();
    expect(req.request.method).toEqual('POST');
    expect(actualResponseObject).toBe(fakeResponseObject);
    expect(req.request.headers.keys()).toContain('reporting_token');
    expect(req.request.headers.get('Content-Type')).toEqual('application/json');
    expect(req.request.headers.keys().length).toEqual(2);
  }));

  it('#remove() should remove existing subscription with correct parameters', fakeAsync(() => {
    const subscription = {
      sessionId: 'sessionId',
      id: 'subscriptionID',
      user: 'adminUser',
      measureFilters: [],
      packageName: 'Queue Performance'
    };
    const fakeResponseObject = subscription.id;

    let actualResponseObject = null;
    service.remove(subscription).subscribe(res => actualResponseObject = res);
    const req = http.expectOne(`http://localhost:3000/websocket/subscriptionfilter/subscriptions/${subscription.id}`);
    req.flush(fakeResponseObject);

    tick();

    expect(req.request.method).toEqual('DELETE');
    expect(actualResponseObject).toBe(fakeResponseObject);
    expect(req.request.headers.keys().length).toEqual(0);
  }));

  it('#update() should update existing subscription with correct parameters', fakeAsync(() => {
    const subscription = {
      sessionId: 'sessionId',
      id: 'subscriptionID',
      user: 'adminUser',
      measureFilters: [],
      packageName: 'Queue Performance'
    };
    const fakeResponseObject = {
      webSocketConnection: 'joulica-reporting-sub-pub-agentperformance'
    };

    let actualResponseObject = null;
    service.update(subscription).subscribe(res => actualResponseObject = res);
    const req = http.expectOne(`http://localhost:3000/websocket/subscriptionfilter/subscriptions/${subscription.id}`);
    req.flush(fakeResponseObject);

    tick();

    expect(req.request.method).toEqual('PUT');
    expect(actualResponseObject).toBe(fakeResponseObject);
    expect(req.request.headers.keys().length).toEqual(0);
  }));
});
