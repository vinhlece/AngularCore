import {ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Optional, Output} from '@angular/core';
import {DisplayMode} from '../../../dashboard/models/enums';
import {LOGGER} from '../../../logging/services/tokens';
import {DisplayModeEvent} from '../../models';
import {HighmapsComponent} from '../base';
import {TranslateService} from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import {ThemeService} from '../../../theme/theme.service';
import {chartBG} from '../../models/const';

@Component({
  selector: 'app-geo-map',
  template: `
    <div #chartContainer></div>
  `,
  styleUrls: ['geo-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeoMapComponent extends HighmapsComponent {

  constructor(@Optional() @Inject(LOGGER) logger, translate: TranslateService,
              dialogService: MatDialog, themeService: ThemeService) {
    super(logger, translate, dialogService, themeService);
  }

  getOptions() {
    const chart = this.getChartOptions();
    const plotOptions = this.getPlotOptions();
    const legend = this.getLegendOptions();
    const tooltip = this.getTooltipOptions();
    const exporting = this.getExportingOptions();
    return {
      ...this.getBaseOptions(),
      chart,
      plotOptions,
      legend,
      tooltip,
      exporting
    };
  }

  getUpdateOptions() {
    const chart = this.getChartOptions();
    const legend = this.getLegendOptions();
    const plotOptions = this.getPlotOptions();
    const tooltip = this.getTooltipOptions();
    const exporting = this.getExportingOptions();

    return {
      chart,
      plotOptions,
      legend,
      tooltip,
      exporting
    };
  }

  shouldRecreateChart(): boolean {
    return this.isDataSizeChange();
  }

  private getChartOptions() {
    return {
      width: null,
      height: this.size.height,
      backgroundColor: this.isDarkTheme() ? chartBG : this.styles.backgroundColor,
      style: this.getChartFontStyle()
    };
  }

  private getPlotOptions() {
    return {
      series: {
        dataLabels: {
          color: this.isDarkTheme() ? '#ccc' : '#333',
          style: {
            ...this.getLabelFontStyle(),
            textOutline: this.isDarkTheme() ? '1px contrast' : 0
          }
        },
        point: {
          events: {
            dblclick: (e) => {
              e.widget = this.widget;
              this.onDoubleClick.emit(e);
            },
            mousedown: (e) => {
              e.widget = this.widget;
              if (e.point.capital && e.point.parentState) {
                e.otherParams = this.getOtherParams(e.point);
                this.onMouseDown.emit(e);
              }
            },
            contextmenu: (e) => {
              e.widget = this.widget;
              if (e.point.capital && e.point.parentState) {
                e.otherParams = this.getOtherParams(e.point);
                this.onContextMenu.emit(e);
              }
            }
          },
        },
        ...this.enableAnimation()
      }
    };
  }

  private getLegendOptions() {
    return {
      enabled: this.getShowLegendVal,
      itemStyle: this.getLegendsStyle()
    };
  }

  private getTooltipOptions() {
    return {
      style: this.getTooltipFontStyle()
    };
  }

  private isDataSizeChange(): boolean {
    const renderedDataSize = this.chart.series.length;
    const currentDataSize = this.data.length;
    return renderedDataSize !== currentDataSize;
  }

  private getOtherParams(point: any): object {
    const otherParams = {
      [this.widget.measures[0].toLowerCase()]: point.z
    };
    if (this.data[1]) {
      this.data[1].data.forEach(record => {
        const instance = `${record.parentState}-${record.capital}`;
        otherParams[instance.toLowerCase()] = record.z;
      });
    }
    return otherParams;
  }
}
