import {RealTimeDataProcessorImpl} from '../../../realtime/services/real-time-data-processor.service';
import {SandBoxFormulaMeasureFactory} from '../../../measures/services/formula/formula-measure.service';

export const getRealTimeDataProcessor = () => new RealTimeDataProcessorImpl(new SandBoxFormulaMeasureFactory());
