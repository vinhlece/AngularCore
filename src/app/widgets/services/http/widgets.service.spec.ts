import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {mockBarWidget, mockWidget, mockWidgets} from '../../../common/testing/mocks/widgets';
import {Widget} from '../../models';
import {WidgetService} from './widgets.service';
import {AppConfigService} from '../../../app.config.service';
import {getHostUrl} from '../../../common/utils/url';
import {Store} from '@ngrx/store';

describe('WidgetService', () => {
  let widgetService: WidgetService;
  let http: HttpTestingController;
  let appConfigService: AppConfigService
  let path: string;
  const userId = 'User';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        WidgetService,
        AppConfigService,
        {
          provide: Store,
          useValue: jasmine.createSpyObj('store', ['dispatch', 'pipe'])
        }
      ]
    });

    http = TestBed.get(HttpTestingController);
    widgetService = TestBed.get(WidgetService);
    appConfigService = TestBed.get(AppConfigService);
    appConfigService.config = {
      apiEndPoint: `${getHostUrl()}:3000`,
      kafkaEndPoint: '',
      kafkaApiKey: '',
      reportingDataGeneratorEndPoint: '',
      reportingDataSubscriptionEndPoint: '',
      webSocket: '',
      fqdn: ''
    }
    path = `${appConfigService.config.apiEndPoint}/widgets`;
  });

  describe('#getAll widgets', () => {
    it('should call http client #get', () => {
      const getPath = `${path}?userId=${userId}`;

      widgetService.getAll(userId).subscribe();

      http.expectOne(getPath);
    });
  });

  describe('#get widgets', () => {
    it('should call http client #get', () => {
      const getPath = `${path}/1`;

      widgetService.get('1').subscribe();

      http.expectOne(getPath);
    });
  });

  describe('#find by name', () => {
    it('should get widgets by name (case insensitive)', () => {
      const widgets = mockWidgets();
      const token = 'Joulica';
      const getPath = `${path}?userId=${userId}`;

      widgetService.findByName(userId, token).subscribe((result: Widget[]) => {
        const expected = widgets.filter((widget: Widget) => widget.name.toLowerCase().includes(token.toLowerCase()));
        expect(result).toEqual(expected);
      });
      http.expectOne(getPath).flush(widgets);
    });
  });

  describe('#add widget', () => {
    it('should call http client post', () => {
      const widget = mockWidget();

      widgetService.add(widget).subscribe();

      http.expectOne(path);
    });
  });

  describe('#remove widget', () => {
    it('should call http client #delete', () => {
      const removePath = `${path}/1`;

      widgetService.remove('1').subscribe();

      http.expectOne(removePath);
    });
  });

  describe('#update widget', () => {
    it('should call http client put', () => {
      const updatePath = `${path}/1`;
      const barWidget = mockBarWidget();
      barWidget.id = '1';

      widgetService.update(barWidget).subscribe();

      http.expectOne(updatePath);
    });
  });
});
