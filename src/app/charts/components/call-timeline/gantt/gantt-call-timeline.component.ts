import {Component, EventEmitter, Inject, Input, Optional, Output} from '@angular/core';
import {TIME_RANGE_SETTINGS} from '../../../../common/models/constants';
import {getChartColors} from '../../../../common/utils/color';
import {TimeRange, TimeRangeSetting} from '../../../../dashboard/models';
import {LOGGER} from '../../../../logging/services/tokens';
import {VERTICAL} from '../../../../widgets/constants/bar-chart-types';
import {CallTimeLineWidget} from '../../../../widgets/models';
import {Legend, ZoomEvent} from '../../../models';
import {HighchartsComponent} from '../../base';
import {ColorPalette} from '../../../../common/models/index';
import {TranslateService} from '@ngx-translate/core';
import {getMomentByTimestamp} from '../../../../common/services/timeUtils';
import {AppDateTimeFormat} from '../../../../common/models/enums';
import { MatDialog } from '@angular/material/dialog';
import {ThemeService} from '../../../../theme/theme.service';

@Component({
  selector: 'app-gantt-call-timeline',
  templateUrl: './gantt-call-timeline.component.html',
  styleUrls: ['./gantt-call-timeline.component.scss']
})
export class GanttCallTimelineComponent extends HighchartsComponent {
  private _zoomTimeRange: TimeRange;
  private _selectedRangeSelectorButton: number;

  legends: Legend[] = [];

  @Input()
  set zoom(value: ZoomEvent) {
    this._zoomTimeRange = value.timeRange;
    this._selectedRangeSelectorButton = value.rangeSelectorButton
      ? this.getZoomButtons().findIndex((btn) => btn.text === value.rangeSelectorButton)
      : null;
  }
  @Input() colorPalette: ColorPalette;

  @Output() onZoom = new EventEmitter<ZoomEvent>();
  @Output() onSearch = new EventEmitter<string[]>();
  @Output() onToggleLegend = new EventEmitter<Legend[]>();

  constructor(@Optional() @Inject(LOGGER) logger, public translate: TranslateService,
              dialogService: MatDialog, themeService: ThemeService) {
    super(logger, translate, dialogService, themeService);
  }

  getOptions(): any {
    const chart = this.getChartOptions();
    const xAxis = this.getXAxisOptions();
    const yAxis = this.getYAxisOptions();
    const plotOptions = this.getPlotOptions();
    const navigator = this.getNavigatorOptions();
    const rangeSelector = this.getRangeSelectorOptions();
    const legend = this.getLegendOptions;
    const tooltip = this.getTooltipOptions();
    const boost = this.getboost();

    return {
      ...this.getBaseOptions(),
      chart,
      xAxis,
      yAxis,
      plotOptions,
      navigator,
      rangeSelector,
      legend,
      tooltip,
      boost
    };
  }

  getUpdateOptions(): any {
    const chart = this.getChartOptions();
    const xAxis = this.getXAxisOptions();
    const yAxis = this.getYAxisOptions();
    const rangeSelector = this.getRangeSelectorOptions();
    const legend = this.getLegendOptions;
    const tooltip = this.getTooltipOptions();
    const navigator = this.getNavigatorOptions();
    const boost = this.getboost();

    return {
      chart,
      xAxis,
      yAxis,
      rangeSelector,
      legend,
      tooltip,
      navigator,
      boost
    };
  }

  shouldRecreateChart(): boolean {
    const renderedDataSize = this.chart.series.length;
    const currentDataSize = this.data.length;
    return renderedDataSize !== currentDataSize;
  }

  postUpdate() {
    this.updateZoom();
    this.updateLegends();
  }

  getLegendContainerStyle() {
    const fontSize = this.widget.font ? this.widget.font.fontSize + 12 : 30;
    const maxHeight = fontSize * Math.ceil(this.legends.length / 5);
    return {
      'max-height': `${maxHeight + 5}px`
    };
  }

  private updateLegends() {
    this.legends = this.getWidget().segmentTypes.map((segmentType: string, index: number) => this.getLegend(segmentType, index));
  }

  private updateZoom() {
    if (this.chart) {
      const xAxis = this.chart.xAxis[0];
      if (this._zoomTimeRange) {
        xAxis.setExtremes(this._zoomTimeRange.startTimestamp, this._zoomTimeRange.endTimestamp, false);
      } else {
        xAxis.setExtremes(null, null);
      }
      this.chart.reflow();
      this.chart.redraw();
    }
  }

  handleSearch(event: string[]) {
    this.onSearch.emit(event);
  }

  handleToggleLegend(legend: Legend) {
    const idx = this.legends.findIndex((item: Legend) => item.name === legend.name);
    this.legends = [...this.legends.slice(0, idx), legend, ...this.legends.slice(idx + 1)];
    this.onToggleLegend.emit(this.legends);
  }

  getChartSize() {
    if (this.size) {
      return {
        width: `${this.size.width}px`,
        height: `${this.size.height}px`,
      };
    }
    return {
      width: '100%',
      height: '100%',
    };
  }

  getChartClass() {
    // return this.data && this.data.length > 0 ? 'chart-content' : 'chart-content-without-data';
    return 'chart-content';
  }

  private getChartOptions() {
    return {
      type: 'gantt',
      inverted: this.getWidget().chartType === VERTICAL.key,
      style: this.getChartFontStyle()
    };
  }

  private getXAxisOptions() {
    return {
      type: 'datetime',
      dateTimeLabelFormats: {
        millisecond: '%H:%M:%S',
      },
      events: {
        setExtremes: (e) => {
          this.handleZoom(e);
        }
      },
      labels: {
        style: this.getLabelFontStyle()
      }
    };
  }

  private getYAxisOptions() {
    return {
      categories: this.getCategories(),
      labels: {
        style: this.getLabelFontStyle()
      }
    };
  }

  private getTooltipOptions() {
    const that = this;
    return {
      style: this.getTooltipFontStyle(),
      pointFormatter: function () {
        const startTime = getMomentByTimestamp(this.x).format(AppDateTimeFormat.time);
        const endTime = getMomentByTimestamp(this.x2).format(AppDateTimeFormat.time);
        const start = that.translate.instant('charts.time_line.start');
        const end = that.translate.instant('charts.time_line.end');
        return `<b>${this.name}</b><br/> ${start}: ${startTime}<br/> ${end}: ${endTime}`;
      }
    };
  }

  private getNavigatorOptions() {
    return {
      enabled: this.enableNavigator(),
      series: {
        data: []
      },
      xAxis: {
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
    const fontStyle = {fontFamily: 'Poppins'};
    return {
      enabled: true,
      buttons: this.getZoomButtons(),
      selected: this._selectedRangeSelectorButton,
      labelStyle: fontStyle,
      inputStyle: fontStyle,
      inputPosition: {
        align: 'right',
        x: -28,
        y: 0
      }
    };
  }

  private getLegendOptions() {
    return {
      itemStyle: this.getLegendsStyle()
    };
  }

  private getPlotOptions() {
    return {
      series: {
        turboThreshold: 200000,
        boostThreshold: 1,
        ...this.enableAnimation()
      },
      gantt: {
        point: {
          events: {
            mouseOver: function () {
              this.graphic.toFront();
            },
            mouseOut: function () {
              this.series.points.forEach((point) => {
                if (point.graphic) {
                  point.graphic.toFront();
                }
              });
            },
            mousedown: (e) => {
              e.widget = this.widget;
              this.onMouseDown.emit(e);
            },
            contextmenu: (e) => {
              e.widget = this.widget;
              this.onContextMenu.emit(e);
            },
            dblclick: (e) => {
              e.widget = this.widget;
              this.onDoubleClick.emit(e);
            },
            click: (e) => {
              // need to override click event to fix this error: Cannot read property 'call' of undefined
            }
          }
        }
      }
    };
  }

  getWidget(): CallTimeLineWidget {
    return this.widget as CallTimeLineWidget;
  }

  private handleZoom(e) {
    if (e.trigger) {
      const event: ZoomEvent = {
        trigger: e.trigger,
        timeRange: {startTimestamp: e.min ? Math.round(e.min) : null, endTimestamp: e.max ? Math.round(e.max) : null},
        rangeSelectorButton: e.rangeSelectorButton ? e.rangeSelectorButton.text : null
      };
      this.onZoom.emit(event);
    }
  }

  private getCategories(): string[] {
    return this.data.map(series => series.name);
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
      text: 'All'
    };
    return [...buttonsWithEvent, allBtn];
  }

  private getLegend(name: string, position: number): Legend {
    const legend = this.legends.find((item: Legend) => item.name === name);
    return this.createLegend(name, position, legend);
  }

  private createLegend(name: string, position: number, existLegend: Legend): Legend {
    const colors = this.colorPalette ? this.colorPalette.colors : getChartColors();
    position = position % colors.length;
    return existLegend
      ? {
        name,
        color: colors[position],
        enabled: existLegend.enabled
      }
      : {
        name,
        color: colors[position],
        enabled: true
      };
  }

  private enableNavigator(): boolean {
    return (this.widget as CallTimeLineWidget).enableNavigator;
  }
}
