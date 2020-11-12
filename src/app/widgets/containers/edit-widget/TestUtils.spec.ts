import {Store} from '@ngrx/store';
import {SampleRealTimeDataService} from '../../../realtime/services/fake/sample-real-time-data.service';
import {DATA_CONVERTER_FACTORY} from '../../../realtime/services/tokens';
import {RealTimeDataProcessorImpl} from '../../../realtime/services/real-time-data-processor.service';
import {REAL_TIME_DATA_PROCESSOR} from '../../../realtime/services/tokens';
import {SandBoxFormulaMeasureFactory} from '../../../measures/services/formula/formula-measure.service';
import {FORMULA_MEASURE_FACTORY} from '../../../measures/services/tokens';
import {DataConfigFactory} from '../../utils/data-config-factory';
import {HighchartsDataConverterFactory} from '../../../realtime/services/converters/factory';

export class TestUtils {
  static providers() {
    return [
      {
        provide: Store,
        useValue: jasmine.createSpyObj('store', ['select', 'dispatch'])
      },
      DataConfigFactory,
      {
        provide: DATA_CONVERTER_FACTORY,
        useClass: HighchartsDataConverterFactory
      },
      {
        provide: FORMULA_MEASURE_FACTORY,
        useClass: SandBoxFormulaMeasureFactory
      },
      {
        provide: REAL_TIME_DATA_PROCESSOR,
        useClass: RealTimeDataProcessorImpl
      },
      SampleRealTimeDataService
    ];
  }
}
