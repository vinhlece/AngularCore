import {Injectable} from '@angular/core';
import {getHostUrl} from '../../../common/utils/url';
import {SocketRealTimeService} from '../web-socket/real-time.services';

@Injectable()
export class FakeSocketRealTimeService extends SocketRealTimeService {
  getBaseUrl() {
    return `${getHostUrl()}:3002/`;
  }
}
