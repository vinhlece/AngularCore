import {TabularWidget} from '../../../widgets/models';
import {WidgetData} from '../../models';
import {Collection} from '../../models/collection';
import {TabularSeriesPointsEvaluator} from '../evaluator/points';

export class TableDataBuilder {
  private _pointsEvaluator: TabularSeriesPointsEvaluator;

  constructor(widget: TabularWidget) {
    this._pointsEvaluator = new TabularSeriesPointsEvaluator(widget);
  }

  convert(collections: Collection[]): WidgetData {
    return collections.map((item: Collection) => {
      return this._pointsEvaluator.evaluate(item.records, item.path.toString());
    });
  }
}
