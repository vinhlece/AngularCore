import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {fakeAsync, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {PlaceholdersService} from '..';
import {mockTabs} from '../../../common/testing/mocks/dashboards';
import {Placeholder} from '../../models';
import {PLACEHOLDERS_SERVICE} from '../tokens';
import {PlaceholdersServiceImpl} from './placeholders.service';
import {AppConfigService} from '../../../app.config.service';
import {Store} from '@ngrx/store';

describe('PlaceholdersService', () => {
  let service: PlaceholdersService;
  let appConfigService: AppConfigService
  let httpServer: HttpTestingController;
  let serverUrl: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        {provide: PLACEHOLDERS_SERVICE, useClass: PlaceholdersServiceImpl},
        AppConfigService,
        {
          provide: Store,
          useValue: jasmine.createSpyObj('store', ['dispatch', 'pipe'])
        }
      ]
    });

    service = TestBed.get(PLACEHOLDERS_SERVICE);
    httpServer = TestBed.get(HttpTestingController);
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
    serverUrl = `${appConfigService.config.apiEndPoint}/tabs`;
  });

  describe('findById', () => {
    it('should return placeholder with matched id', fakeAsync(() => {
      const tabs = mockTabs();
      const placeholder = tabs[0].placeholders[0];
      const result = service.findById(placeholder.id).subscribe((resolve: Placeholder) => {
        expect(resolve).toBe(placeholder);
      });
      httpServer.expectOne(serverUrl).flush(tabs);
    }));
  });
});
