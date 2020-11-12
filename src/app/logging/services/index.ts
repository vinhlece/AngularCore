import {DataSet} from '../../realtime/models';
import {Widget} from '../../widgets/models';

export interface Logger {
  info(message: string);

  startFilterBenchmark();
  endFilterBenchmark(storageType: string, receivedData: DataSet, newData: DataSet);
  endFilterStorageBenchmark(storageType: string, receivedData: DataSet, newData: any);

  startConvertBenchmark(widget: Widget);
  endConvertBenchmark(widget: Widget);

  startSetDataBenchmark(widget: Widget);
  endSetDataBenchmark(widget: Widget);
}
