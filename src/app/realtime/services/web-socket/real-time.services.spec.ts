import {fakeAsync, TestBed} from '@angular/core/testing';
import {SocketRealTimeService} from './real-time.services';
import {DataMapperService} from '../http/data-mapper.services';
import {mockRealtimeData} from '../../../common/testing/mocks/realtime-data.mocks';
import {AppConfigService} from '../../../app.config.service';

xdescribe('SocketRealTime Service', () => {
  let service: SocketRealTimeService;
  let appConfigService: AppConfigService;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [],
    providers: [
      SocketRealTimeService,
      DataMapperService,
      AppConfigService
    ]
  }));

  beforeEach(() => {
    service = TestBed.get(SocketRealTimeService);
    appConfigService = TestBed.get(AppConfigService);
    appConfigService.config = {
      apiEndPoint: '',
      kafkaEndPoint: 'https://kafka',
      kafkaApiKey: '',
      reportingDataGeneratorEndPoint: '',
      reportingDataSubscriptionEndPoint: '',
      webSocket: 'http://localhost:3000/websocket/',
      fqdn: ''
    };
  });

  it('#getData() should call get data with any topics', fakeAsync(() => {
    // const topic = {
    //   dataType: 'queue performance',
    //   name: 'name `',
    //   isSubscribed: true,
    //   channel: 'queue performance'
    // };
    // const fakeData = [mockRealtimeData()];
    // const data = service.getData(topic);
    // data.subscribe((message) => {
    //   expect(message).toBe(fakeData);
    // });
    // data.next(fakeData);
  }));
});
