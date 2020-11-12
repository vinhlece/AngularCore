import {DataGroup, WidgetData} from '../../models';

export interface ChartDataBuilder {
  generate(groupedData: DataGroup, currentTimestamp: number): WidgetData;
}
