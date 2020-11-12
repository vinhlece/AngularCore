import {Widget} from '../../../widgets/models';
import {PlotPoint} from '../../models';
import {isNullOrUndefined} from 'util';
import {WidgetType} from '../../../widgets/constants/widget-types';
import {US_STATES} from '../../../realtime/models/constants';
import {USState} from '../../../realtime/models';
import {buildUSInstance} from '../../../realtime/utils/us-instance';
import { unionDimensions } from '../../../common/utils/function';

export type UpdateMetricsValidator = (widget: Widget, point: PlotPoint) => boolean;

export class EditOnPlotValidator {
  static dropInstanceValidator(): UpdateMetricsValidator {
    return EditOnPlotValidator.compose(EditOnPlotValidator.validateNotDropIntoItself, EditOnPlotValidator.validateInstance);
  }

  static dropMeasureValidator(): UpdateMetricsValidator {
    return EditOnPlotValidator.compose(EditOnPlotValidator.validateNotDropIntoItself, EditOnPlotValidator.validateMeasure);
  }

  static compose(...validators: UpdateMetricsValidator[]): UpdateMetricsValidator {
    return (widget: Widget, point: PlotPoint) => {
      return validators.reduce((acc: boolean, validator: UpdateMetricsValidator) => {
        return acc && validator(widget, point);
      }, true);
    };
  }

  static validateNotDropIntoItself(widget: Widget, point: PlotPoint): boolean {
    return point.widgetId !== widget.id;
  }

  static validateInstanceLevel(widget: Widget, point: PlotPoint): boolean {
    var instances = unionDimensions(widget);
    if (instances.length === 0) {
      return true;
    }
    return point.instance && instances[0].split(',').length === point.instance.split(',').length;
  }

  static validateMeasure(widget: Widget, point: PlotPoint): boolean {
    const isSameDataType = point.dataType === widget.dataType;
    // const isSameFormat = measure.format === 'number' || widget.type === WidgetType.Tabular;
    return isSameDataType;
  }

  static validateInstance(widget: Widget, point: PlotPoint): boolean {
    return widget.type !== WidgetType.GeoMap || (widget.type === WidgetType.GeoMap && EditOnPlotValidator.isUSInstance(point.instance));
  }

  static isUSInstance(instance: string): boolean {
    return !isNullOrUndefined(US_STATES.find((state: USState) => buildUSInstance(state) === instance));
  }
}
