import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {PollingConfigService} from '..';
import {pollingConfig} from '../../../config/polling.config';
import {PollingConfig} from '../../models';
import {getAvailablePredictiveRange} from '../../utils/functions';

@Injectable()
export class LocalPollingConfigService implements PollingConfigService {
  load(): Observable<PollingConfig> {
    const config: PollingConfig = {...pollingConfig};
    config.predictiveSettings.available = getAvailablePredictiveRange(config.timeRangeSettings.interval);
    return of(config);
  }
}
