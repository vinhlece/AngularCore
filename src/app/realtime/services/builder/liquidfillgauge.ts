import {isNullOrUndefined} from 'util';
import {DataGroup, RealtimeData, WidgetData} from '../../models';
import {ChartDataBuilder} from './index';
import {ColorPalette} from '../../../common/models/index';
import {ColorStyle} from '../../models/enum';

export class LiquidFillGaugeDataBuilder implements ChartDataBuilder {
  constructor(colorPalette: ColorPalette) {
  }
  generate(groupedData: DataGroup): WidgetData {
    const props = Object.keys(groupedData);
    const latestRecord = props.length > 0 && groupedData[props[0]][0].group !== ColorStyle.Slash ? groupedData[props[0]][0] : null;
    const previousRecord = props.length > 1 ? groupedData[props[1]][0] : null;

    return {
      current: this.convertRecord(latestRecord),
      passed: this.convertRecord(previousRecord)
    };
  }

  private convertRecord(record: RealtimeData): any {
    return isNullOrUndefined(record)
      ? {timestamp: 0, value: 0}
      : {timestamp: record.measureTimestamp, value: +record.measureValue};
  }
}
