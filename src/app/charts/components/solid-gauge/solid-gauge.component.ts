import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  Optional,
  Output
} from '@angular/core';
import clamp from 'lodash/clamp';
import cloneDeep from 'lodash/cloneDeep';
import {DisplayMode} from '../../../dashboard/models/enums';
import {LOGGER} from '../../../logging/services/tokens';
import {SolidGaugeWidget} from '../../../widgets/models';
import {Dimension, DisplayModeEvent} from '../../models';
import {HighchartsComponent} from '../base';
import {ThousandsSeparator} from '../../../widgets/constants/constants';
import {Measure} from '../../../measures/models/index';
import {MeasureFormat} from '../../../widgets/models/enums';
import {AppDateTimeFormat} from '../../../common/models/enums';
import {getMomentByTimestamp} from '../../../common/services/timeUtils';
import {TranslateService} from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import {ThemeService} from '../../../theme/theme.service';
import {chartBG, chartText} from '../../models/const';
import {isNullOrUndefined} from '../../../common/utils/function';
import {static_data} from '../../../dashboard/models/constants';

@Component({
  selector: 'app-solid-gauge',
  template: `
    <div [ngStyle]="getChartStyle()" class="chart-container" #chartContainer></div>
  `,
  styleUrls: ['./solid-gauge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SolidGaugeComponent extends HighchartsComponent {
  private _minSize: Dimension = {width: 250, height: 170};
  private _maxSize: Dimension = {width: 450, height: 450};
  private _format: string;

  @Input() isMaximized: boolean;
  @Input() measures: Measure[];

  marginLeft = 0;

  @HostListener('mousedown', ['$event']) handleMouseDown(event) {
    event.widget = this.widget;
    event.otherParams = this.getOtherParams();
    this.onMouseDown.emit(event);
  }

  constructor(@Optional() @Inject(LOGGER) logger, translate: TranslateService,
              dialogService: MatDialog, themeService: ThemeService) {
    super(logger, translate, dialogService, themeService);
  }

  getOptions() {
    const chart = this.getChartOptions();
    const plotOptions = this.getPlotOptions();
    const pane = this.getPaneOptions();
    const yAxis = this.getYAxisOptions();
    const tooltip = this.getTooltip();
    const boost = this.getboost();
    const exporting = this.getExportingOptions();
    const title = this.getTitleStyle();
    return {
      ...this.getBaseOptions(),
      chart,
      plotOptions,
      pane,
      yAxis,
      tooltip,
      boost,
      exporting,
      title: title.title,
      subtitle: title.subtitle
    };
  }

  getUpdateOptions() {
    const chart = this.getChartOptions();
    const yAxis = this.getYAxisOptions();
    const plotOptions = this.getPlotOptions();
    const boost = this.getboost();
    const exporting = this.getExportingOptions();
    const title = this.getTitleStyle();
    return {chart, yAxis, boost, exporting, plotOptions, title: title.title, subtitle: title.subtitle};
  }

  shouldRecreateChart(): boolean {
    return this.isDataSizeChange();
  }

  dataSetter(data: any): any {
    /* If the dashboard has more than one solid gauge for the same widget,
     * we need to deep clone data object in order to make animation work properly */

    if (this.isEmptyData) {
      const widgetStaticData = this.getPreviewWidget();
      if (widgetStaticData && widgetStaticData['data']) {
        data = widgetStaticData['data'];
      }
    }
    return data ? cloneDeep(data) : [];
  }

  getChartStyle() {
    return {
      marginLeft: `${this.marginLeft}px`
    };
  }

  protected createChart() {
    this._format = this.getMeasureFormat();
    super.createChart();
  }

  private getChartOptions() {
    const {width, height} = this.getRealDimension();
    return {
      type: 'gauge',
      width: width,
      height: height,
      backgroundColor: this.isDarkTheme() ? chartBG : this.styles.backgroundColor,
      style: this.getLabelFontStyle()
    };
  }

  private getRealDimension() {
    if (this.isMaximized) {
      return this.size;
    }
    let height = this.size.height;
    let width = this.size.width;
    if (width < this._minSize.width) {
      width = this._minSize.width;
    } else if (width > this._maxSize.width) {
      width = this._maxSize.width;
    }
    this.marginLeft = Math.round((this.size.width - width) / 2);
    if (height < this._minSize.height) {
      height = this._minSize.height;
    } else if (height > this._maxSize.height) {
      height = this._maxSize.height;
    }
    return {width, height};
  }

  private getPlotOptions() {
    const me = this;
    const series: any = {
      ...this.enableAnimation(),
      dataLabels: {
        borderWidth: 0,
        style: this.getLabelFontStyle()
      },
    };
    if (this._format) {
      series.dataLabels = {
        ...series.dataLabels,
        padding: 0,
        formatter: function () {
          return me.getMeasureValue(this.y);
        }
      };
    }
    return {
      solidgauge: {
        dataLabels: {
          borderWidth: 0,
          format: this.getDataLabelHtmlFormat(),
          align: 'center',
          verticalAlign: 'bottom',
          useHTML: true
        },
        events: {
          dblclick: (e) => {
            e.widget = this.widget;
            this.onDoubleClick.emit(e);
          },
          contextmenu: (e) => {
            e.widget = this.widget;
            e.otherParams = this.getOtherParams();
            this.onContextMenu.emit(e);
          }
        }
      },
      series,
      gauge: {
        wrap: false,
        dial: {
          backgroundColor: this.isDarkTheme() ? chartText : 'black',
          radius: '80%',
          baseWidth: 2,
          topWidth: 2,
          baseLength: '3%', // of radius
          rearLength: '0%'
        }
      }
    };
  }

  private getPaneOptions() {
    return {
      center: ['50%', `50%`],
      size: '100%',
      startAngle: -90,
      endAngle: 90,
      background: {
        innerRadius: this.getARCWidth(),
        outerRadius: '100%',
        borderColor: 'transparent',
        shape: 'arc'
      }
    };
  }

  private getYAxisOptions() {
    const gaugeThreshold = (this.widget as SolidGaugeWidget).gaugeThreshold;
    const gaugeValue = (this.widget as SolidGaugeWidget).gaugeValue;
    const min = gaugeValue && gaugeValue.min ? gaugeValue.min : 0;
    const max = gaugeValue && gaugeValue.max ? gaugeValue.max : 100;
    const plotBands = [];

    const defaultColor = gaugeValue && gaugeValue.color ? gaugeValue.color : '#8271DE';

    plotBands.push(this.getPlotBands(min, max, defaultColor));
    const defaultOption = [{
      min,
      max,
      lineWidth: 0,
      tickAmount: 1,
      minorTickInterval: null,
      tickPositions: [min],
      labels: {
        enabled: false,
        distance: 15
      },
      plotBands
    },
      this.getTickWithLabel(min),
      this.getTickWithLabel(max)
    ];

    if (!gaugeThreshold) {
      return defaultOption;
    }

    const {breakpoints, colors} = gaugeThreshold;
    if (isNullOrUndefined(breakpoints) || isNullOrUndefined(colors)) {
      return;
    }
    for (let i = 0; i < colors.length; i++) {
      const color = colors && colors[i] && colors[i].value ? colors[i].value : null;
      if (i === 0) {
        plotBands.push(this.getPlotBands(0, breakpoints[i], color));
      } else {
        plotBands.push(this.getPlotBands(breakpoints[i - 1], breakpoints[i], color));
      }
    }

    return defaultOption;
  }

  private getPlotBands(from: number, to: number, color: string) {
    return {
      color: color,
      from,
      to,
      innerRadius: this.getARCWidth(),
      outerRadius: '100%',
    };
  }

  private getTickWithLabel(tickPositions: number) {
    return this.getTick(tickPositions, {
      y: 20,
      zIndex: 0,
      style: {
        ...this.getLabelFontStyle(),
        color: this.isDarkTheme() ? chartText : this.styles.color
      },
      format: `{value${ThousandsSeparator}}`
    });
  }

  private getTick(tickPositions: number, labels: any) {
    return {
      linkedTo: 0,
      minorTickInterval: null,
      tickPositions: [tickPositions],
      tickPosition: 'outside',
      tickLength: 0,
      labels,
      tickColor: '#fff',
    };
  }

  private getTooltip() {
    return {
      enabled: false
    };
  }

  private getTitleStyle() {
    const {height} = this.getRealDimension();
    let deltaHeight = Math.round((height - this._minSize.height) / 2);
    if (deltaHeight < 0) {
      deltaHeight = 0;
    }
    const title = {
      align: 'center',
      verticalAlign: 'bottom',
      floating: true,
      style: {
       ...this.getLabelFontStyle(),
        color: this.isDarkTheme() ? chartText : '#212529',
      }
    };
    return {
      title: {
        ...title,
        text: this.getInstance(),
        useHTML: true,
        y: 5 - deltaHeight,
      },
      subtitle: {
        ...title,
        text: this.getMeasure(),
        y: 25 - deltaHeight,
      }
    };
  }

  private isDataSizeChange(): boolean {
    const renderedDataSize = this.chart.series.length;
    const currentDataSize = this.data.length;
    return renderedDataSize !== currentDataSize;
  }

  private getYAxisLabelFontSize(): number {
    const base = this.size.width <= this.size.height ? this.size.width : this.size.height;
    const maxSize = this.widget.font && this.widget.font.fontSize ? this.widget.font.fontSize : 18;
    return clamp(base * 0.05, 4, maxSize);
  }

  private getPaneSize(): number {
    return this.size.width <= this.size.height ? this.size.width - 20 : this.size.height - 20;
  }

  private getARCWidth() {
    const { arcWidth } = this.widget as (SolidGaugeWidget);
    return arcWidth ? (100 - arcWidth) + '%' : '60%';
  }

  private getDataLabelHtmlFormat(): string {
    const color = this.isDarkTheme() ? chartText : this.styles.color ? this.styles.color : 'black';
    return `<value-label value="{y}" color="${color}"></value-label>`;
  }

  private getMeasureFormat() {
    if (this.measures && this.widget.measures && this.widget.measures.length > 0) {
      const current = this.measures.find(item => item.name === this.widget.measures[0] && item.format === MeasureFormat.time);
      if (current) {
        return AppDateTimeFormat.time;
      }
    }
    return null;
  }

  private getMeasureValue(value) {
    return getMomentByTimestamp(value * 1000).format(this._format);
  }

  private getOtherParams(): object {
    // timestamp need to update converter
    if (!this.widget.measures || this.widget.measures.length === 0 || !this.data || this.data.length === 0) {
      return {};
    }
    return {
      timestamp: null,
      [this.widget.measures[0].toLowerCase()]: this.data[0].data[0]
    };
  }
}
