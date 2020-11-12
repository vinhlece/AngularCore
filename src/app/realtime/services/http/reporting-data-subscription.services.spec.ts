import {HttpRequest} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {ReportingDataSubscriptionServiceImpl} from './reporting-data-subscription.services';
import {AppConfigService} from '../../../app.config.service';
import {Store} from '@ngrx/store';

describe('ReportingDataSubscriptionServiceImpl', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ReportingDataSubscriptionServiceImpl,
        AppConfigService,
        {
          provide: Store,
          useValue: jasmine.createSpyObj('store', ['dispatch', 'pipe'])
        }
      ]
    });
  });

  describe('makeSubscriptionToPackage', () => {
    let http;
    let service;
    let appConfigService;

    beforeEach(() => {
      http = TestBed.get(HttpTestingController);
      service = TestBed.get(ReportingDataSubscriptionServiceImpl);
      appConfigService = TestBed.get(AppConfigService);
      appConfigService.config = {
        apiEndPoint: '',
        kafkaEndPoint: '',
        kafkaApiKey: '',
        reportingDataGeneratorEndPoint: 'test.com/generator/',
        reportingDataSubscriptionEndPoint: 'test.com/sub/',
        webSocket: '',
        fqdn: ''
      };
    });

    it('should make request with correct arguments', () => {
      service.makeSubscriptionToPackage('sean', 'QueueStatus').subscribe();

      http.expectOne((request: HttpRequest<any>) => {
        return request.urlWithParams === `test.com/sub/makeSubscriptionToPackage/?User Name=sean&Package=QueueStatus`;
      });
    });
  });
});
