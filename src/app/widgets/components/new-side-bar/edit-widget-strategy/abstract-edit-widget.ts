import {EventEmitter, Input, Output} from '@angular/core';
import {Widget} from '../../../models/index';
import {EditWidgetFormOptions} from '../../forms/edit-widget-form/edit-widget-form.component';
import {WidgetType} from '../../../constants/widget-types';
import {
  AbstractFormOptions, BarOptions, BillBoardOptions, CallTimeLineOptions, GeoMapOptions, LabelOptions, EventViewerOptions, LineOptions,
  SankeyOptions, LiquidFillGaugeOptions,
  SolidGaugeOptions, SunburstOptions, TabularOptions,
  TrendDiffOptions, BubbleOptions
} from './create-form-options';
import {Measure} from '../../../../measures/models/index';
import {EditWidgetType} from '../../../models/enums';
import {Observable} from 'rxjs';

export abstract class AbstractEditWidget {

  private abstractFormOptions: AbstractFormOptions;

  @Input() widget: Widget;
  @Input() dataTypes: string[];
  @Input() measures: Measure[];
  @Input() editType: EditWidgetType;
  @Input() packages: any;
  @Input() packageDetails: any;
  @Input() allDimensions: any;
  @Input() allInstance: any;
  @Input() isEditingNewSideBar: boolean = false;
  @Output() onChange = new EventEmitter<Widget>();
  @Output() onValidate = new EventEmitter<boolean>();
  @Output() onChangeType = new EventEmitter<Widget>();

  protected createFormOptions(options: any): EditWidgetFormOptions {
    if (!this.abstractFormOptions) {
      this.abstractFormOptions = this.initFormOptions();
    }
    return this.abstractFormOptions.create(this.widget, {...options, dataTypes: this.dataTypes, measures: this.measures});
  }

  handleValidate(event: boolean) {
    if (this.onValidate) {
      this.onValidate.emit(event);
    }
  }

  protected handleChange(input: any) {
    let newData = null;
    if (this.editType === EditWidgetType.OnAppearance) {
      newData = {...input};
    } else {
      newData = {
        ...this.widget,
        ...input
      };
    }
    this.onChange.emit(newData);
  }

  protected handleChangeType(widget: Widget) {
    this.onChangeType.emit(widget);
  }

  private initFormOptions() {
    switch (this.widget.type) {
      case WidgetType.SolidGauge:
        return new SolidGaugeOptions(this.editType);
      case WidgetType.Bar:
        return new BarOptions(this.editType);
      case WidgetType.TrendDiff:
        return new TrendDiffOptions(this.editType);
      case WidgetType.Sankey:
        return new SankeyOptions(this.editType);
      case WidgetType.Billboard:
        return new BillBoardOptions(this.editType);
      case WidgetType.CallTimeLine:
        return new CallTimeLineOptions(this.editType);
      case WidgetType.GeoMap:
        return new GeoMapOptions(this.editType);
      case WidgetType.Line:
        return new LineOptions(this.editType);
      case WidgetType.Sunburst:
        return new SunburstOptions(this.editType);
      case WidgetType.Tabular:
        return new TabularOptions(this.editType);
      case WidgetType.LabelWidget:
        return new LabelOptions(this.editType);
      case WidgetType.EventViewer:
        return new EventViewerOptions(this.editType);
      case WidgetType.LiquidFillGauge:
        return new LiquidFillGaugeOptions(this.editType);
      case WidgetType.Bubble:
        return new BubbleOptions(this.editType)
      default:
        return null;
    }
  }
}
