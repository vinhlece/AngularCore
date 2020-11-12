import {ChangeDetectionStrategy, Component, Inject, Optional} from '@angular/core';
import {HighchartsComponent} from '../base';
import {TranslateService} from '@ngx-translate/core';
import {LOGGER} from '../../../logging/services/tokens';
import {ThousandsSeparator} from '../../../widgets/constants/constants';
import {getDateByMoment} from '../../../common/services/timeUtils';
import {addThousandSeparator} from '../../../common/utils/function';
import {AppDateTimeFormat} from '../../../common/models/enums';
import {HIGH_CHART_SERIES_NAME_REGEX} from '../../../realtime/models/constants';
import { MatDialog } from '@angular/material/dialog';
import {ThemeService} from '../../../theme/theme.service';
import {chartBG} from '../../models/const';

@Component({
  selector: 'app-bubble-chart',
  template: `
    <div #chartContainer></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        background-color: inherit;
      }
    `
  ]
})
export class BubbleComponent extends HighchartsComponent {

  constructor(@Optional() @Inject(LOGGER) logger, translate: TranslateService,
              dialogService: MatDialog, themeService: ThemeService) {
    super(logger, translate, dialogService, themeService);
  }

  getOptions() {
    const chart = this.getChartOptions();
    const plotOptions = this.getPlotOptions();
    const xAxis = this.getXAxisOptions();
    const yAxis = this.getYAxisOptions();
    const tooltip = this.getTooltipOptions();
    const legend = this.getLegendOptions();
    const exporting = this.getExportingOptions();

    return {
      ...this.getBaseOptions(),
      chart,
      plotOptions,
      xAxis,
      yAxis,
      legend,
      tooltip,
      exporting
    };
  }

  getUpdateOptions() {
    const chart = this.getChartOptions();
    const xAxis = this.getXAxisOptions();
    const yAxis = this.getYAxisOptions();
    const legend = this.getLegendOptions();
    const tooltip = this.getTooltipOptions();
    const exporting = this.getExportingOptions();

    return {
      chart,           // Update size of the chart
      xAxis,           // Update time range (min & max) for main xAxis
      yAxis,
      legend,
      tooltip,
      exporting
    };
  }

  private getChartOptions() {
    return {
      type: 'bubble',
      width: this.size.width,
      height: this.size.height,
      backgroundColor: this.isDarkTheme() ? chartBG : this.styles.backgroundColor
    };
  }

  private getLegendOptions() {
    return {
      enabled: true,
      itemStyle: this.getLegendsStyle()
    };
  }

  private getXAxisOptions() {
    const {startTimestamp, endTimestamp} = this.getXAxisTimeRange();
    return {
      type: 'datetime',
      gridLineWidth: 1,
      min: startTimestamp,
      max: endTimestamp,
      dateTimeLabelFormats: {
        day: '%e. %b',
        millisecond: '%H:%M:%S'
      },
      labels: {
        style: this.getLabelFontStyle()
      }
    };
  }

  private getYAxisOptions() {
    return {
      labels: {
        style: this.getLabelFontStyle(),
        format: `{value${ThousandsSeparator}}`
      },
      title: null
    };
  }

  private getTooltipOptions() {
    return {
      shared: false,
      useHTML: true,
      formatter: function () {
          return `<table>
            <tr><td><strong>${getDateByMoment(this.x, AppDateTimeFormat.dateTime)}</strong></td></tr>
            <tr><td style="color: ${this.color}">${this.series.name}: </td>
            <td style="text-align: right"><b>${addThousandSeparator(this.y)}</b></td></tr>
          </table>`;
      },
      style: this.getTooltipFontStyle()
    };
  }

  private getPlotOptions() {
    return {
      series: {
        dataLabels: {
          enabled: true,
          format: '{point.name}'
        },
        point: {
          events: {
            mousedown: (e) => {
              e.widget = this.widget;
              e['otherParams'] = this.getOtherParams(e.target.point);
              this.onMouseDown.emit(e);
            },
            contextmenu: (e) => {
              e.widget = this.widget;
              e['otherParams'] = this.getOtherParams(e.target.point);
              this.onContextMenu.emit(e);
            },
            click: (e) => {
              // need to override click event to fix this error: Cannot read property 'call' of undefined
            },
            dblclick: (e) => {
              e.widget = this.widget;
              this.onDoubleClick.emit(e);
            }
          }
        }
      }
    };
  }

  shouldRecreateChart(): boolean {
    return this.isDataSizeChange();
  }

  private isDataSizeChange(): boolean {
    const renderedDataSize = this.chart.series.length;
    const currentDataSize = this.data.length;
    return renderedDataSize !== currentDataSize;
  }

  private getXAxisTimeRange() {
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
  }

  private getOtherParams(point): object {
    const otherParams = {};
    if (!point || !point.options) {
      return otherParams;
    }
    this.data.forEach(item => {
      const position = item.data.filter(pos => pos.x === point.options.x);
      if (position && position.length > 0) {
        const measure = item.name.match(HIGH_CHART_SERIES_NAME_REGEX);
        if (measure) {
          otherParams[measure[0].toLowerCase()] = position[0].y;
        }
      }
    });
    otherParams['timestamp'] = point.options.x;
    return otherParams;
  }
}
