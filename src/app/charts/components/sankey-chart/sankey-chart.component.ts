import {ChangeDetectionStrategy, Component, Inject, Optional, Output} from '@angular/core';
import {LOGGER} from '../../../logging/services/tokens';
import {HighchartsComponent} from '../base';
import {ThousandsSeparator} from '../../../widgets/constants/constants';
import {TranslateService} from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import {ThemeService} from '../../../theme/theme.service';
import {chartBG} from '../../models/const';

@Component({
  selector: 'app-sankey-chart',
  template: `
    <div #chartContainer></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SankeyChartComponent extends HighchartsComponent {
  constructor(@Optional() @Inject(LOGGER) logger, translate: TranslateService,
              dialogService: MatDialog, themeService: ThemeService) {
    super(logger, translate, dialogService, themeService);
  }

  getOptions() {
    const chart = this.getChartOptions();
    const responsive = this.getResponsiveOptions();
    const plotOptions = this.getPlotOptions();
    const tooltip = this.getTooltipOptions();
    const exporting = this.getExportingOptions();

    return {
      ...this.getBaseOptions(),
      chart,
      responsive,
      plotOptions,
      tooltip,
      exporting
    };
  }

  getUpdateOptions() {
    const chart = this.getChartOptions();
    const tooltip = this.getTooltipOptions();
    const exporting = this.getExportingOptions();
    const plotOptions = this.getPlotOptions();

    return {
      chart,
      plotOptions,
      tooltip,
      exporting
    };
  }

  shouldRecreateChart() {
    return this.isDataSizeChange();
  }

  private getChartOptions() {
    return {
      type: 'sankey',
      width: this.size.width,
      height: this.size.height,
      backgroundColor: this.isDarkTheme() ? chartBG : this.styles.backgroundColor,
      style: {
        fontFamily: this.styles.font
      }
    };
  }

  private getPlotOptions() {
    return {
      sankey: {
        dataLabels: {
          style: {
            ...this.getLabelFontStyle(),
            textOutline: 0
          },
          color: this.isDarkTheme() ? '#ccc' : '#333'
        },
        point: {
          events: {
            dblclick: (e) => {
              e.widget = this.widget;
              this.onDoubleClick.emit(e);
            },
            mousedown: (e) => {
              e.widget = this.widget;
              e.otherParams = this.getOtherParams(e.point);
              this.onMouseDown.emit(e);
            },
            contextmenu: (e) => {
              e.widget = this.widget;
              e.otherParams = this.getOtherParams(e.point);
              this.onContextMenu.emit(e);
            },
            click: (e) => {
              // need to override click event to fix this error: Cannot read property 'call' of undefined
            }
          }
        },
        ...this.enableAnimation()
      }
    };
  }

  private getTooltipOptions() {
    return {
      style: this.getTooltipFontStyle(),
      pointFormat: `
          <table>
            <tr>
              <td style="color: {series.color}">{point.fromNode.name} → {point.toNode.name}: </td>
              <td style="text-align: right"><b>{point.weight${ThousandsSeparator}}</b></td>
            </tr>
          </table>
        `,
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

  private isDataSizeChange(): boolean {
    const renderedDataSize = this.chart.series.length;
    const currentDataSize = this.data.length;
    return renderedDataSize !== currentDataSize;
  }

  private getOtherParams(point): object {
    const measure = point.series.name;
    const otherParams = {
      [measure.toLowerCase()]: point.weight || ''
    };
    const series = this.data.filter(record => record.name === measure)[0];
    if (series) {
      series.data.forEach(item => {
        const instance = `${item.from}-${item.to}`;
        otherParams[instance.toLowerCase()] = item.weight;
      });
    }
    return otherParams;
  }
}
