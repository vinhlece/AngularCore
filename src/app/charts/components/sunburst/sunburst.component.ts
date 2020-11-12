import {Component, EventEmitter, Inject, Input, Optional, Output} from '@angular/core';
import {DisplayMode, LabelMode} from '../../../dashboard/models/enums';
import {LOGGER} from '../../../logging/services/tokens';
import {DisplayModeEvent} from '../../models';
import {HighchartsComponent} from '../base';
import {isNullOrUndefined} from 'util';
import {ThousandsSeparator} from '../../../widgets/constants/constants';
import * as _ from 'lodash';
import {TranslateService} from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import {ThemeService} from '../../../theme/theme.service';
import {chartBG, chartText} from '../../models/const';

@Component({
  selector: 'app-sunburst',
  template: `    
    <div class="chart-container" #chartContainer></div>
  `,
  styleUrls: ['./sunburst.component.scss']
})
export class SunburstComponent extends HighchartsComponent {
  private _backupData: any;

  constructor(@Optional() @Inject(LOGGER) logger, translate: TranslateService,
              dialogService: MatDialog, themeService: ThemeService) {
    super(logger, translate, dialogService, themeService);
  }

  getOptions(): any {
    const chart = this.getChartOptions();
    const plotOptions = this.getPlotOptions();
    const tooltip = this.getTooltipOptions();
    const exporting = this.getExportingOptions();

    return {
      ...this.getBaseOptions(),
      chart,
      plotOptions,
      tooltip,
      exporting
    };
  }

  getUpdateOptions(): any {
    const chart = this.getChartOptions();
    const plotOptions = this.getPlotOptions();
    const tooltip = this.getTooltipOptions();
    const exporting = this.getExportingOptions();
    return {
      chart,
      plotOptions,
      tooltip,
      exporting
    };
  }

  shouldRecreateChart(): boolean {
    return this.isDataSizeChange();
  }

  postUpdate() {
    this._backupData = [...this.data];
  }

  protected updateData() {
    if (_.isEqual(this._backupData, this.data)) {
      return;
    }
    super.updateData();
  }

  private getChartOptions() {
    return {
      type: 'sunburst',
      width: this.size.width,
      height: this.size.height,
      backgroundColor: this.isDarkTheme() ? chartBG : this.styles.backgroundColor,
      style: {
        fontFamily: this.styles.font
      }
    };
  }

  private getTooltipOptions() {
    return {
      style: this.getTooltipFontStyle()
    };
  }

  private getPlotOptions() {
    const font = this.widget.font;
    const defaultStyle = `font-family: Poppins; font-size: 15px; font-weight: normal`;
    const defaultLevel1 = `font-family: Poppins; font-size: 17px; font-weight: bold`;
    const style = font
      ? `font-family: ${font.fontFamily}; font-size: ${font.fontSize}px; font-weight: ${font.fontWeight}`
      : defaultStyle;
    const styleLevel1 = font ? style : defaultLevel1;
    const getFormat = () => {
      if (this.widget['labelMode'] === LabelMode.ShowValue) {
        return `<p style="${style}">{point.value${ThousandsSeparator}}</p>`;
      } else if (this.widget['labelMode'] === LabelMode.None) {
        return `<p></p>`;
      }
      return `<p style="${style}">{point.name}</p>`;
    };
    const getRootFormat = () => {
      if (this.widget['labelMode'] === LabelMode.None) {
        return `<p></p>`;
      }
      return `<p style="${styleLevel1}">{point.value${ThousandsSeparator}}</p>`;
    };
    return {
      sunburst: {
        allowDrillToNode: true,
        drillUpButton: {
          position: {
            x: -72,
            y: -4,
          }
        },
        cursor: 'pointer',
        dataLabels: {
          filter: {
            property: 'innerArcLength',
            operator: '>',
            value: 16
          },
          style: {
            textOutline: 0
          },
          useHTML: true
        },
        levels: [
          {
            level: 1,
            levelIsConstant: false,
            color: 'red',
            dataLabels: {
              filter: {
                property: 'outerArcLength',
                operator: '>',
                value: 64
              },
              y: 5,
              format: getRootFormat(),
            }
          },
          {
            level: 2,
            colorByPoint: true,
            dataLabels: {
              format: getFormat(),
            }
          },
          {
            level: 3,
            colorVariation: {
              key: 'brightness',
              to: -0.5
            },
            dataLabels: {
              format: getFormat(),
            }
          },
          {
            level: 4,
            colorVariation: {
              key: 'brightness',
              to: 0.5
            },
            dataLabels: {
              format: getFormat(),
            }
          },
          {
            level: 5,
            colorVariation: {
              key: 'brightness',
              to: -0.5
            },
            dataLabels: {
              format: getFormat(),
            }
          }
        ]
      },
      series: {
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
              // but when doing this, we can only zoom in/out by click the label, click on node do nothing
            }
          },
        },
        ...this.enableAnimation()
      }
    };
  }


  private isDataSizeChange(): boolean {
    const renderedDataSize = this.chart.series.length;
    const currentDataSize = this.data.length;
    return renderedDataSize !== currentDataSize;
  }

  private getOtherParams(point): object {
    const otherParams = {
      [this.widget.measures[0].toLowerCase()]: point.value
    };
    const parentNode = point.id.split(',')[0];
    if (parentNode) {
      const leafNode = this.data[0].data.filter(record => {
        return !isNullOrUndefined(record.value) && record.id.includes(`${parentNode},`);
      });
      leafNode.forEach(item => {
        otherParams[item.name.toLowerCase()] = item.value;
      });
    }
    return otherParams;
  }
}
