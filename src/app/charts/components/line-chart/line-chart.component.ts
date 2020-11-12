import {
  ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, OnDestroy, Optional,
  Output
} from '@angular/core';
import * as Highcharts from 'highcharts/highstock';
import * as $ from 'jquery';
import {TimeRange, TimeRangeInterval, TimeRangeSetting} from '../../../dashboard/models';
import {TIME_RANGE_SETTINGS} from '../../../common/models/constants';
import {LOGGER} from '../../../logging/services/tokens';
import {TimeUtils} from '../../../common/services';
import {TIME_UTILS} from '../../../common/services/tokens';
import {WidgetType} from '../../../widgets/constants/widget-types';
import {LegendOption, LineWidget, ThresholdLine} from '../../../widgets/models';
import {LineChartTypes} from '../../../widgets/models/enums';
import {ChangeChartTypeEvent, ZoomEvent} from '../../models';
import {HighchartsComponent} from '../base';
import {HIGH_CHART_SERIES_NAME_REGEX} from '../../../realtime/models/constants';
import {ThousandsSeparator, TimeRangeAll} from '../../../widgets/constants/constants';
import {getMomentByTimestamp} from '../../../common/services/timeUtils';
import {isNullOrUndefined, unionDimensions} from '../../../common/utils/function';
import {TranslateService} from '@ngx-translate/core';
import {Subscription, timer} from 'rxjs/index';
import {pollingConfig} from '../../../config/polling.config';
import { MatDialog } from '@angular/material/dialog';
import {ThemeService} from '../../../theme/theme.service';
import {chartBG, chartText} from '../../models/const';

const DATE_TIME_FORMAT = '%d/%m/%Y, %H:%M:%S';
const TIME_FORMAT = '%H:%M:%S';

@Component({
  selector: 'app-line-chart',
  template: `
    <div #chartContainer></div>
  `,
  styleUrls: ['./line-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineChartComponent extends HighchartsComponent implements OnDestroy {
  private _timeUtils: TimeUtils;
  private _selectedRangeSelectorButton: number;
  private _zoomTimeRange: TimeRange;
  private _interval: TimeRangeInterval;
  private _chartType: string;
  private _timerSubscription: Subscription;
  private _inUpdate: boolean = true;

  @Input() maxTimestamp: number;
  @Input() currentTimestamp: number;
  @Input() predictiveSetting: TimeRangeInterval;

  @Input()
  set zoom(value: ZoomEvent) {
    this._zoomTimeRange = value.timeRange;
    this._selectedRangeSelectorButton = value.rangeSelectorButton
      ? this.getZoomButtons().findIndex((btn) => btn.text === value.rangeSelectorButton)
      : null;
  }

  @Input()
  get interval(): TimeRangeInterval {
    return this._interval;
  }

  set interval(value: TimeRangeInterval) {
    this._interval = value;
  }

  @Input()
  get chartType(): string {
    return this._chartType || this.widget.chartType;
  }

  set chartType(value: string) {
    this._chartType = value;
  }

  @Input() pauseLineChart: boolean = false;

  @Output() onZoom = new EventEmitter<ZoomEvent>();
  @Output() onChangeChartType = new EventEmitter<ChangeChartTypeEvent>();

  constructor(@Inject(TIME_UTILS) timeUtils, @Optional() @Inject(LOGGER) logger, translate: TranslateService,
              dialogService: MatDialog, themeService: ThemeService) {
    super(logger, translate, dialogService, themeService);
    this._timeUtils = timeUtils;
    this._timerSubscription = timer(pollingConfig.realTimeInterval, pollingConfig.realTimeInterval)
      .subscribe((result) => {
        if (this.chart && !this.enableZoom && !this._inUpdate && !this.pauseLineChart) {
          const {startTimestamp, endTimestamp} = this.getXAxisTimeRange();
          this.chart.xAxis[0].setExtremes(startTimestamp, endTimestamp);
        }
      });
  }

  get enableZoom(): boolean {
    if (this._zoomTimeRange && this._zoomTimeRange.startTimestamp && this._zoomTimeRange.endTimestamp) {
      return true;
    }
    return false;
  }

  ngOnDestroy() {
    this._timerSubscription.unsubscribe();
  }

  getOptions() {
    const chart = this.getChartOptions();
    const xAxis = this.getXAxisOptions();
    const yAxis = this.getYAxisOptions();
    const plotOptions = this.getPlotOptions();
    const navigator = this.getNavigatorOptions();
    const rangeSelector = this.getRangeSelectorOptions();
    const responsive = this.getResponsiveOptions();
    const legend = this.getLegendOptions();
    const time = this.getTimeOptions();
    const tooltip = this.getTooltipOptions();
    const exporting = this.getExportingOptions();

    const options = {
      ...this.getBaseOptions(),
      chart,
      xAxis,
      yAxis,
      plotOptions,
      navigator,
      rangeSelector,
      responsive,
      legend,
      time,
      tooltip,
      exporting
    };
    if (this.widget.type === WidgetType.TrendDiff) {
      const label = this.getLabelStyle();
      return {
        ...options,
        title: label.title,
        subtitle: label.subtitle
      };
    }
    return options;
  }

  getUpdateOptions() {
    const chart = this.getChartOptions();
    const xAxis = this.getXAxisOptions();
    const rangeSelector = this.getRangeSelectorOptions();
    const legend = this.getLegendOptions();
    const navigator = this.getNavigatorOptions();
    const tooltip = this.getTooltipOptions();
    const exporting = this.getExportingOptions();
    const options = {
      chart,           // Update size of the chart
      xAxis,           // Update time range (min & max) for main xAxis
      rangeSelector,   // Update selected range button
      navigator,        // Update xAxis time range (min & max) of navigator
      legend,
      tooltip,
      exporting
    };
    if (this.widget.type === WidgetType.TrendDiff) {
      const label = this.getLabelStyle();
      return {
        ...options,
        title: label.title,
        subtitle: label.subtitle
      };
    }
    return options;
  }

  shouldRecreateChart(): boolean {
    return this.isDataSizeChange();
  }

  preUpdate() {
    this._inUpdate = true;
  }

  postUpdate() {
    this.updateZoom();
    this._inUpdate = false;
  }

  private getLabelStyle() {
    const title = {
      style: {
        color: this.isDarkTheme() ? chartText : '#000',
        fontSize: '16px',
      }
    };
    return {
      title: {
        ...title,
        text: this.getInstance(),
        useHTML: true
      },
      subtitle: {
        ...title,
        y: 35,
        text: this.getMeasure()
      }
    };
  }

  private updateZoom() {
    if (this.chart) {
      const xAxis = this.chart.xAxis[0];
      if (this.enableZoom) {
        xAxis.setExtremes(this._zoomTimeRange.startTimestamp, this._zoomTimeRange.endTimestamp, false);
        this.chart.showResetZoom();
      } else {
        xAxis.setExtremes(null, null);
      }
      this.chart.reflow();
      this.chart.redraw();
    }
  }

  private getChartOptions() {
    return {
      type: this.chartType ? this.chartType.toLowerCase() : null,
      width: this.size.width,
      height: this.size.height,
      zoomType: 'x',
      backgroundColor: this.isDarkTheme() ? chartBG : this.styles.backgroundColor,
      style: this.getChartFontStyle(),
      resetZoomButton: {
        position: {
          // align: 'right', // by default
          // verticalAlign: 'top', // by default
          x: this.isLineWidget() ? -30 : 0,
          y: -5
        }
      }
    };
  }

  private getXAxisOptions() {
    const dateTimeLabelFormats = this.widget.type === WidgetType.TrendDiff
      ? {day: '%H:%M'}
      : {day: '%e. %b'};
    dateTimeLabelFormats['millisecond'] = '%H:%M:%S';
    const {startTimestamp, endTimestamp} = this.getXAxisTimeRange();
    return {
      type: 'datetime',
      min: startTimestamp,
      max: endTimestamp,
      events: {
        setExtremes: (e) => {
          this.handleZoom(e);
        }
      },
      labels: {
        style: this.getLabelFontStyle()
      },
      plotLines: this.getXAxisPlotLines(),
      dateTimeLabelFormats
    };
  }

  private getYAxisOptions() {
    return {
      title: null,
      labels: {
        style: this.getLabelFontStyle(),
        format: `{value${ThousandsSeparator}}`
      },
      maxPadding: this.enableNavigator() ? 0 : 0.02,
      tickPixelInterval: 62,
      plotLines: this.getYAxisPlotLines(),
    };
  }

  private getPlotOptions() {
    return {
      series: {
        marker: {
          enabled: false
        },
        events: {
          dblclick: (e) => {
            const params = this.getLegendParams(e.point.series.userOptions);
            const data = {
              user: e.point.series.userOptions,
              widget: this.widget,
              params
            };
            this.openDialog(data);
          }
        },
        point: {
          events: {
            mousedown: (e) => {
              e.widget = this.widget;
              const { measureName } = e.point.series.userOptions;
              e['otherParams'] = this.getOtherParams({ ...e.target.point, measureName });
              this.onMouseDown.emit(e);
            },
            contextmenu: (e) => {
              e.widget = this.widget;
              const { measureName } = e.point.series.userOptions;
              e['otherParams'] = this.getOtherParams({ ...e.target.point, measureName });
              this.onContextMenu.emit(e);
            },
            click: (e) => {
              // need to override click event to fix this error: Cannot read property 'call' of undefined
            },
            dblclick: (e) => {
              e.widget = this.widget;
              this.onDoubleClick.emit(e);
            },
            mouseOver: function () {
              // in case hover realtime data
              this.series.linkedSeries.forEach(function(elem) {
                elem.setState('hover');
              });
              // in case hover kpi data
              if (this.series.linkedParent) {
                const parentElem = this.series.linkedParent;
                parentElem.setState('hover');
                parentElem.linkedSeries.forEach(function(elem) {
                  elem.setState('hover');
                });
              }
            },
            mouseOut: function () {
              this.series.chart.series.forEach(function(elem) {
                elem.setState();
              });
            }
          }
        },
        turboThreshold: 200000,
        ...this.enableAnimation()
      },
      line: {
        dataLabels: {
          enabled: false,
          formatter: function () {
            return Highcharts.dateFormat('%b %e %Y', this.x);
          }
        }
      },
      area: {
        fillOpacity: 0.5
      }
    };
  }

  private getTooltipOptions() {
    return {
      shared: false,
      useHTML: true,
      headerFormat: '<strong>{point.key}</strong>',
      pointFormat: `
        <table>
          <tr><td style="color: {series.color}">{series.name}: </td>
          <td style="text-align: right"><b>{point.y${ThousandsSeparator}}</b></td></tr>
        </table>
      `,
      xDateFormat: this.widget.type === WidgetType.Line ? DATE_TIME_FORMAT : TIME_FORMAT,
      style: this.getTooltipFontStyle()
    };
  }

  private getNavigatorOptions() {
    const {startTimestamp, endTimestamp} = this.getXAxisTimeRange();
    return {
      enabled: this.enableNavigator(),
      adaptToUpdatedData: false,
      xAxis: {
        type: 'datetime',
        min: startTimestamp,
        max: endTimestamp,
        labels: {
          style: this.getLabelFontStyle()
        }
      },
      yAxis: {
        labels: {
          style: this.getLabelFontStyle()
        }
      }
    };
  }

  private getRangeSelectorOptions() {
    const fontStyle = {fontFamily: 'Poppins', color: this.isDarkTheme() ? chartText : '#000'};
    const config: any = {
      enabled: this.enableNavigator(),
      buttons: this.getZoomButtons(),
      selected: this._selectedRangeSelectorButton,
      labelStyle: fontStyle,
      inputStyle: fontStyle,
      inputPosition: {
        align: 'right',
        x: -80,
        y: 0
      }
    };

    if (this.isDarkTheme()) {
      config['buttonTheme'] = {
        fill: chartBG,
        style: {
          color: chartText
        },
        states: {
          select: {
            fill: chartText,
            style: {
              color: chartBG
            }
          }
        }
      };
    } else {
      config['buttonTheme'] = {
        fill: '#f7f7f7',
        style: {
          color: '#333'
        },
        states: {
          select: {
            fill: '#e6ebf5',
            style: {
              color: '#333'
            }
          }
        }
      };
    }
    return config;
  }

  private getResponsiveOptions() {
    return {
      rules: [{
        condition: {
          maxHeight: this.enableNavigator() ? 200 : 100
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

  private getLegendOptions() {
    return {
      enabled: this.getShowLegendVal,
      itemStyle: this.getLegendsStyle()
    };
  }

  private getTimeOptions() {
    return {
      useUTC: true
    };
  }

  private getZoomButtons() {
    const buttonsWithEvent = TIME_RANGE_SETTINGS.map((settings: TimeRangeSetting, idx: number) => {
      const {type, value} = settings.interval;
      return {
        type,
        count: value,
        text: `${value}${type.charAt(0)}`
      };
    });
    const allBtn = {
      type: 'all',
      text: this.translate.instant('highchart.rangeSelectorAll')
    };
    return [...buttonsWithEvent, allBtn];
  }

  private getXAxisTimeRange(): TimeRange {
    if (this.isEmptyData && this.data && this.data.length > 0) {
      const data = this.data[0].data;
      const max = data.reduce((acc, item) => {
        return item.x > acc ? item.x : acc;
      }, data[0].x);
      const min = this.data[0].data.reduce((acc, item) => {
        return item.x < acc ? item.x : acc;
      }, data[0].x);
      return {startTimestamp: min, endTimestamp: max};
    }

    const customTimeRange = (this.widget as LineWidget).customTimeRange;
    if (customTimeRange && !isNullOrUndefined(customTimeRange.type) && customTimeRange.type !== TimeRangeAll.key) {
      const range = {
        startTimeRange: customTimeRange.range ? customTimeRange.range.startDay : null,
        endTimeRange: customTimeRange.range ? customTimeRange.range.endDay : this._timeUtils.getCurrentTimestamp()
      };
      const timeRange = this._timeUtils.getTimeRange(customTimeRange.type, range) as TimeRange;
      return {startTimestamp: timeRange.startTimestamp, endTimestamp: this.getPredictiveTimestamp(timeRange.endTimestamp)};
    }

    if (!this.interval) {
      return {startTimestamp: null, endTimestamp: null};
    }
    const maxTimestamp = isNullOrUndefined(this.maxTimestamp) ? this._timeUtils.getCurrentTimestamp() : this.maxTimestamp;
    const currentTimestamp = this.currentTimestamp ? this.currentTimestamp : maxTimestamp;
    const {value, type} = this.interval;
    const startTimestamp = this._timeUtils.subtract(currentTimestamp, value, type);
    return {startTimestamp, endTimestamp: this.getPredictiveTimestamp(maxTimestamp)};
  }

  private isDataSizeChange(): boolean {
    const renderedDataSize = this.chart.series.length;
    let currentDataSize = this.data.length;
    if (this.enableNavigator()) {
      currentDataSize++;
    }
    return renderedDataSize !== currentDataSize;
  }

  private getPredictiveTimestamp(timestamp: number): number {
    if (!this.predictiveSetting || !this.predictiveSetting.value) {
      return timestamp;
    }
    return +getMomentByTimestamp(timestamp).add(this.predictiveSetting.value, this.predictiveSetting.type);
  }

  private handleZoom(e) {
    if (e.trigger) {
      const event: ZoomEvent = {
        trigger: e.trigger,
        timeRange: {startTimestamp: e.min ? Math.round(e.min) : null, endTimestamp: e.max ? Math.round(e.max) : null},
        rangeSelectorButton: e.rangeSelectorButton ? e.rangeSelectorButton.text : null,
        otherParams: {dataType: this.widget.dataType, instances: unionDimensions(this.widget)}
      };
      this.onZoom.emit(event);
    }
  }

  private enableNavigator(): boolean {
    return (this.widget as LineWidget).enableNavigator;
  }

  private isLineWidget(): boolean {
    return (this.widget as LineWidget).type === WidgetType.Line;
  }

  private getThresholdLine(): ThresholdLine {
    return (this.widget as LineWidget).thresholdLine;
  }

  private getXAxisPlotLines() {
    if (!this.isLineWidget() || isNullOrUndefined(this.currentTimestamp)) {
      return null;
    }

    const xAxisTimeRange = this.getXAxisTimeRange();
    const xAxisElapsed = xAxisTimeRange.endTimestamp - xAxisTimeRange.startTimestamp;
    const p = Math.floor(((xAxisTimeRange.endTimestamp - this.currentTimestamp) * this.size.width) / xAxisElapsed);
    const align = p >= 270 ? 'left' : 'right';

    return [{
      color: 'red',
      width: 2,
      value: this.currentTimestamp,
      zIndex: 999,
      label: {
        rotation: 0,
        useHTML: true,
        align,
        x: align === 'left' ? 8 : -8,
        text: `<plot-line-label-container placeholder-id=${this.placeholder.id}></plot-line-label-container>`
      }
    }];
  }

  private getYAxisPlotLines() {
    const that = this;

    if (this.isLineWidget() && this.getThresholdLine() && this.getThresholdLine().enable) {
      return [{
        color: '#FF0000',
        width: 2,
        value: this.getThresholdLine().value || 0,
        zIndex: 999,
        events: {
          mousedown: function (e) {
            that.handleYPlotLineMouseDown(this, e);
          },
          mouseover: function () {
            this.svgElem.element.style.cursor = 'row-resize';
          },
        }
      }];
    } else {
      return [];
    }
  }

  private handleYPlotLineMouseDown(line, event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    if (isNullOrUndefined(line.svgElem.translateY)) {
      line.svgElem.translate(0, 0);
    }
    const clickY = event.pageY - line.svgElem.translateY;

    $(document).bind({
      'mousemove.line': function (e) {
        line.svgElem.translate(null, e.pageY - clickY);
      },
      'mouseup.line': function () {
        $(document).unbind('.line');
      },
    });
  }

  private getOtherParams(point: any): object {
    const otherParams = {};
    if (!point || !point.options) {
      return otherParams;
    }
    this.data.forEach(item => {
      const position = item.data.filter(pos => pos.x === point.options.x);
      if (position && position.length > 0) {
        otherParams[point.measureName.toLowerCase()] = position[0].y;
      }
    });
    otherParams['timestamp'] = point.options.x;
    return otherParams;
  }

  private getLegendParams(userOptions) {
    const {hideKPI, legendOptions} = this.widget as LineWidget;
    const {measureName, instance} = userOptions;
    const legendItem: LegendOption = legendOptions && legendOptions.length > 0 ?
      legendOptions.find(item => item.instance === instance && item.measure === measureName) : null;
    return  {
      lower: hideKPI && hideKPI.lower ? hideKPI.lower : false,
      upper: hideKPI && hideKPI.upper ? hideKPI.upper : false,
      hideMeasure: legendItem && legendItem.hideMeasure ? legendItem.hideMeasure : false,
      hideInstance: legendItem && legendItem.hideInstance ? legendItem.hideInstance : false,
      alias: legendItem && legendItem.alias ? legendItem.alias : null
    };
  }
}
