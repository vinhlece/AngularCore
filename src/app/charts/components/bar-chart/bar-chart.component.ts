import {ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Optional, Output} from '@angular/core';
import * as HighchartsCustomEventsFactory from 'highcharts-custom-events';
import * as HighchartsPatternFill from 'highcharts-pattern-fill';
import * as Highcharts from 'highcharts/highstock';
import { LOGGER } from '../../../logging/services/tokens';
import { PatternFillColorEvaluator } from '../../../realtime/services/evaluator/color';
import { HORIZONTAL, VERTICAL } from '../../../widgets/constants/bar-chart-types';
import { BarMode, BarWidget, LegendOption, TimeGroup } from '../../../widgets/models';
import { HighchartsComponent } from '../base';
import { WidgetMode } from '../../../widgets/constants/widget-types';
import { HIGH_CHART_SERIES_NAME_REGEX } from '../../../realtime/models/constants';
import { getMomentByDateTime } from '../../../common/services/timeUtils';
import { isNullOrUndefined } from 'util';
import { TimeRange } from '../../../dashboard/models/index';
import { TimeUtils } from '../../../common/services/index';
import { TIME_UTILS } from '../../../common/services/tokens';
import { BarWidgetStyle, TimeGroupBy } from '../../../widgets/models/enums';
import { ThousandsSeparator } from '../../../widgets/constants/constants';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import {ThemeService} from '../../../theme/theme.service';
import {Theme} from '../../../theme/model/index';
import {chartBG} from '../../models/const';

HighchartsCustomEventsFactory(Highcharts);
HighchartsPatternFill(Highcharts);
const DATE_TIME_FORMAT = '%d/%m/%Y, %H:%M:%S';

@Component({
  selector: 'app-bar-chart',
  template: `
    <div #chartContainer></div>
  `,
  styleUrls: ['./bar-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BarChartComponent extends HighchartsComponent {
  private static readonly MULTI_BAR_CHART = 'column';
  private static readonly MULTI_BAR_HORIZONTAL_CHART = 'bar';
  private _chartType;
  private _timeUtils: TimeUtils;

  @Input() currentTimestamp: number;

  constructor(@Inject(TIME_UTILS) timeUtils, @Optional() @Inject(LOGGER) logger, translate: TranslateService,
              dialogService: MatDialog, themeService: ThemeService) {
    super(logger, translate, dialogService, themeService);
    this._timeUtils = timeUtils;
  }

  getOptions() {
    this._chartType = this.determineModelType();
    const defs = this.getDefsOptions();
    const chart = this.getChartOptions();
    const legend = this.getLegendOptions();
    const plotOptions = this.getPlotOptions();
    const xAxis = this.getXAxisOptions();
    const yAxis = this.getYAxisOptions();
    const responsive = this.getResponsiveOptions();
    const tooltip = this.getTooltipOptions();
    const boost = this.getboost();
    const exporting = this.getExportingOptions();

    return {
      ...this.getBaseOptions(),
      chart,
      defs,
      legend,
      plotOptions,
      xAxis,
      yAxis,
      responsive,
      tooltip,
      boost,
      exporting
    };
  }

  getUpdateOptions() {
    const chart = this.getChartOptions();
    const legend = this.getLegendOptions();
    const xAxis = this.getXAxisOptions();
    const yAxis = this.getYAxisOptions();
    const tooltip = this.getTooltipOptions();
    const boost = this.getboost();
    const exporting = this.getExportingOptions();
    return {
      chart,
      legend,
      xAxis,
      yAxis,
      tooltip,
      boost,
      exporting
    };
  }

  shouldRecreateChart(): boolean {
    return this.isChartTypeChange() || this.isDataSizeChange();
  }

  private getDefsOptions() {
    return {
      patterns: PatternFillColorEvaluator.getPatterns(this.colorPalette, this.instanceColors)
    };
  }

  private getChartOptions() {
    return {
      type: this._chartType,
      width: this.size.width,
      height: this.size.height,
      backgroundColor: this.isDarkTheme() ? chartBG : this.styles.backgroundColor,
      style: this.getChartFontStyle()
    };
  }

  private isTimeRangeMode(): boolean {
    return (this.widget as BarWidget).mode.value === WidgetMode.TimeRange;
  }

  private getLegendOptions() {
    const self = this;
    return {
      enabled: this.getShowLegendVal,
      labelFormatter: function () {
        if (self.isTimeRangeMode()) {
          return this.name;
        }
        if (!this.name) {
          return '';
        }
        const openParenthesesPos = this.name.indexOf('(');
        return this.name.slice(0, openParenthesesPos);
      },
      itemStyle: this.getLegendsStyle(),
      itemHiddenStyle: {
        textOutline: 'none'
      }
    };
  }

  private getPlotOptions() {
    const eventsOption = {
      events: {
        dblclick: (e) => {
          e.widget = this.widget;
          // this.onDoubleClick.emit(e);

          const params = this.getLegendParams(e.point.userOptions);
          const userOptions = e.widget.mode.value === WidgetMode.Measures
            ? { ...e.point.userOptions, measureName: e.target.point.name }
            : e.point.userOptions;
          const data = {
            user: userOptions,
            widget: this.widget,
            params
          };
          this.openDialog(data);
        },
        click: (e) => {
          e.widget = this.widget;
          const { measureName, instance } = e.target.point.series.userOptions;
          e['otherParams'] = this.getOtherParams({ ...e.target.point, measureName, instance });
          this.onClick.emit(e);
        },
        contextmenu: (e) => {
          e.widget = this.widget;
          const { measureName, instance } = e.target.point.series.userOptions;
          e['otherParams'] = this.getOtherParams({ ...e.target.point, measureName, instance });
          this.onContextMenu.emit(e);
        },
        mousedown: (e) => {
          e.widget = this.widget;
          const { measureName, instance } = e.target.point.series.userOptions;
          e['otherParams'] = this.getOtherParams({ ...e.target.point, measureName, instance });
          this.onMouseDown.emit(e);
        },
      },
    };

    const options = {
      series: {
        ...this.enableAnimation(),
        point: {
          events: {
            click: (e) => {
              // need to override click event to fix this error: Cannot read property 'call' of undefined
            },
          }
        },
        groupPadding: 0,
        pointPadding: 0.1
      },
    };
    if ((this.widget as BarWidget).chartStyle === BarWidgetStyle.Stacked) {
      if (this.widget.chartType === VERTICAL.key) {
        return {
          ...options,
          series: { ...options.series, ...eventsOption },
          ...this.getChartStyleOption()
        };
      } else if (this.widget.chartType === HORIZONTAL.key) {
        return {
          ...options,
          series: { ...options.series, ...this.getChartStyleOption().column, ...eventsOption }
        };
      }
    } else {
      return {
        ...options,
        [this._chartType]: { ...eventsOption }
      };
    }
    return options;
  }

  private getXAxisOptions() {
    const fontStyle = this.getLabelFontStyle();
    if (!this.widget.font || !this.widget.font.fontSize) {
      fontStyle.fontSize = '12px';
    }
    if (this.isTimeRangeMode()) {
      const timeGroup = (this.widget as BarWidget).mode.timeGroup as TimeGroup;
      const { startTimestamp, endTimestamp } = this.getXAxisTimeRange(timeGroup);
      const dateTimeLabelFormats = { day: '%e. %b' };
      dateTimeLabelFormats['millisecond'] = '%H:%M:%S';
      return {
        type: 'datetime',
        min: startTimestamp,
        max: endTimestamp,
        labels: {
          style: fontStyle,
        },
        dateTimeLabelFormats
      };
    }
    return {
      type: 'category',
      labels: {
        style: fontStyle
      }
    };
  }

  private getXAxisTimeRange(timeGroup: TimeGroup): TimeRange {
    if (!timeGroup) {
      return { startTimestamp: null, endTimestamp: null };
    }
    const { type, interval, range } = timeGroup;
    if (!interval || !interval.value || !interval.unit) {
      return { startTimestamp: null, endTimestamp: null };
    }
    const customRange = timeGroup.type === TimeGroupBy.CustomRange && range;
    const currentTimestamp = isNullOrUndefined(this.currentTimestamp) ? this._timeUtils.getCurrentTimestamp() : this.currentTimestamp;
    const endTimeRange = customRange && range.endDay ? range.endDay : currentTimestamp;
    const startTimeRange = customRange && range.startDay ? range.startDay : currentTimestamp;
    const { startTimestamp, endTimestamp } = this._timeUtils.getTimeRange(type, { startTimeRange, endTimeRange });
    return { startTimestamp, endTimestamp };
  }

  private getYAxisOptions() {
    return {
      title: null,
      maxPadding: 0,
      startOnTick: true,
      min: !isNullOrUndefined(this.widget.yAxisMin) ? this.widget.yAxisMin : 70,
      max: !isNullOrUndefined(this.widget.yAxisMax) ? this.widget.yAxisMax : null,
      labels: {
        style: this.getLabelFontStyle(),
        format: `{value${ThousandsSeparator}}`
      }
    };
  }
  private getResponsiveOptions() {
    return {
      rules: [{
        condition: {
          maxHeight: 200
        },
        chartOptions: {
          legend: {
            align: 'right',
            verticalAlign: 'middle',
            layout: 'vertical'
          }
        }
      }]
    };
  }
  private getTooltipOptions() {
    const tooltip = {
      shared: false,
      useHTML: true,
      headerFormat: '<strong>{point.key}</strong>',
      pointFormat: `
          <table>
            <tr><td style="color: {series.color}">{point.tooltip}: </td>
            <td style="text-align: right"><b>{point.y${ThousandsSeparator}}</b></td></tr>
          </table>
        `,
      style: this.getTooltipFontStyle()
    };
    if (this.isTimeRangeMode()) {
      tooltip['xDateFormat'] = DATE_TIME_FORMAT;
    }
    return tooltip;
  }

  private getChartStyleOption() {
    return {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: false,
          textOutline: '0',
          style: {
            fontSize: '18px'
          }
        }
      }
    };
  }

  private isChartTypeChange(): boolean {
    const currentType = this.chart.options.chart.type;
    const optionType = this.getOptions().chart.type;
    return currentType !== optionType;
  }

  private isDataSizeChange(): boolean {
    const renderedDataSize = this.chart.series.length;
    const currentDataSize = this.data.length;
    return renderedDataSize !== currentDataSize;
  }

  private determineModelType(): string {
    let chartType;
    switch ((this.widget as BarWidget).chartType) {
      case VERTICAL.key:
        chartType = BarChartComponent.MULTI_BAR_CHART;
        break;
      case HORIZONTAL.key:
        chartType = BarChartComponent.MULTI_BAR_HORIZONTAL_CHART;
        break;
      default:
        chartType = BarChartComponent.MULTI_BAR_CHART;
    }
    return chartType;
  }

  private getOtherParams(point): object {
    const otherParams = {};
    const mode = (this.widget as BarWidget).mode.value;
    if (mode === WidgetMode.Measures) {
      const row = this.data.filter(item => item.instance === point.instance);
      row[0].data.forEach(item => {
        otherParams[item.name.toLowerCase()] = item.y;
      });
    } else if (mode === WidgetMode.Instances) {
      this.data.forEach(record => {
        const measure = record.name.split(' ')[0].toLowerCase();
        const value = record.data.filter(item => item.name === point.name);
        otherParams[measure] = value.length > 0 ? value[0].y : null;
      });
    }
    otherParams['timestamp'] = +getMomentByDateTime(point.tooltip.match(HIGH_CHART_SERIES_NAME_REGEX)[1]);
    return otherParams;
  }

  getLegendParams(userOptions) {
    const legendOptions = this.widget.legendOptions;
    const { measureName, instance } = userOptions;
    const legendItem: LegendOption = legendOptions && legendOptions.length > 0 ?
      legendOptions.find(item => item.instance === instance && item.measure === measureName) : null;
    const params = {
      alias: legendItem && legendItem.alias ? legendItem.alias : null,
      hideWindow: legendItem && legendItem.hideWindow ? legendItem.hideWindow : false,
      hideMeasure: legendItem && legendItem.hideMeasure ? legendItem.hideMeasure : false,
      hideInstance: legendItem && legendItem.hideInstance ? legendItem.hideInstance : false,
    };
    if ((this.widget as BarWidget).mode.value === WidgetMode.Measures) {
      delete params['hideMeasure'];
    } else if ((this.widget as BarWidget).mode.value === (WidgetMode.Instances)) {
      delete params['hideInstance'];
    } else {
      delete params['hideWindow'];
    }
    return params;
  }
}
