import {TabService} from './tab.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {AppConfigService} from '../../../app.config.service';
import {Store} from '@ngrx/store';

describe('Tab Service tests', () => {
  let service: TabService;
  let appConfigService: AppConfigService
  let http: HttpTestingController;
  const fakeTab: any = {
    name: 'A fake tab',
    dashboardId: 1
  };

  /**
   * Configure testing module
   */
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [
      TabService,
      AppConfigService,
      {
        provide: Store,
        useValue: jasmine.createSpyObj('store', ['dispatch', 'pipe'])
      }
    ]
  }));

  beforeEach(() => {
    service = TestBed.get(TabService);
    appConfigService = TestBed.get(AppConfigService);
    appConfigService.config = {
      apiEndPoint: '',
      kafkaEndPoint: '',
      kafkaApiKey: '',
      reportingDataGeneratorEndPoint: '',
      reportingDataSubscriptionEndPoint: '',
      webSocket: '',
      fqdn: ''
    }
    http = TestBed.get(HttpTestingController);
  });

  describe('#add()', () => {
    it('should call request http post with correct parameter', fakeAsync(() => {
      service.add(fakeTab).subscribe();
      tick();
      const req = http.expectOne(service.ConnectionString).request;
      expect(req.method).toBe('POST');
      expect(req.body).toBe(fakeTab);
    }));

    it('should return an added tab with generated id', fakeAsync(() => {
      let actualResponseObject;
      service.add(fakeTab).subscribe((res) => {
        actualResponseObject = res;
      });
      tick();
      // flush fake object if request post http://localhost:3000/tabs/ was called
      http.expectOne(service.ConnectionString).flush(fakeTab);
      expect(actualResponseObject.id).not.toBeNull();
      expect(actualResponseObject.name).toBe(fakeTab.name);
    }));
  });

  describe('#remove()', () => {
    it('should call request http delete with correct url', fakeAsync(() => {
      const tabId = '1';
      service.remove(tabId).subscribe();
      const req = http.expectOne(service.ConnectionString + '/' + tabId).request;
      tick();
      expect(req.method).toBe('DELETE');
    }));
  });
});

