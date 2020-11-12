import {Inject, Injectable} from '@angular/core';
import {TimeManager} from '../../../common/services';
import {TIME_MANAGER} from '../../../common/services/tokens';
import {TimeRange} from '../../../dashboard/models';
import {ProcessStrategy} from '../../models';
import {NormalizeStrategy} from '../../models/strategy';

@Injectable()
export class PreprocessorImpl {
  private _timeManager: TimeManager;

  constructor(@Inject(TIME_MANAGER) timeManager: TimeManager) {
    this._timeManager = timeManager;
  }

  timestampNormalizeStrategy(mainTimeRange: TimeRange, zoomTimeRange: TimeRange): ProcessStrategy {
    return new NormalizeStrategy(this._timeManager, mainTimeRange, zoomTimeRange);
  }
}
