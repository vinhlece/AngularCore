import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ChartIcons} from '../../../models/enums';
import {WidgetType} from '../../../constants/widget-types';
import {getChartThumbnail} from '../../../utils/functions';
import {BarStyleConst, LineChartTypesConst, WidgetTypeGroupsConstant} from '../../../models/constants';
import {BAR_CHART_TYPES} from '../../../constants/bar-chart-types';
import {BarStyleDivider} from '../../../constants/constants';

@Component({
  selector: 'app-list-chart-icon',
  templateUrl: './list-chart-icon.component.html',
  styleUrls: ['./list-chart-icon.component.scss'],
})

export class ListChartIconComponent implements OnInit {

  icons = Object.keys(ChartIcons).filter(item => ChartIcons[item] !== ChartIcons.Label);
  chartTypeObjs: any[];
  @Input() chartStyle: string;
  @Input() chartType: string;
  @Input() type: string;
  @Input() selectedItem;
  @Output() selectChartType = new EventEmitter<any>();

  ngOnInit() {
    this.selectAllChartType();
  }

  selectAllChartType() {
    this.chartTypeObjs = [];
    this.getBarChartTypeObjs();
    this.getLineChartTypeObjs();
    const otherWidgets = [
      WidgetType.TrendDiff, WidgetType.Tabular, WidgetType.Sankey,
      WidgetType.SolidGauge, WidgetType.GeoMap, WidgetType.Sunburst, WidgetType.Bubble
    ];
    otherWidgets.forEach(widget => {
      const name = widget === WidgetType.SolidGauge || widget === WidgetType.GeoMap ?
        widget.toString().replace(' ', '') : widget;
      this.getOtherChartTypeObjs(name);
    });
  }

  private getOtherChartTypeObjs(widgetName: any) {
    const group = WidgetTypeGroupsConstant.find(s => s.key === widgetName);
    group.groups.forEach(g => {
      this.chartTypeObjs.push({
        type: g,
        url: `assets\\img\\widget-type\\${widgetName}\\${g}.svg`,
        chartStyle: null,
        chartType: null,
        typeKey: WidgetType[g],
        styleKey: ''
      });
    });
  }

  private getBarChartTypeObjs() {
    const widgetName = WidgetType.Bar;
    const chartTypes = BAR_CHART_TYPES;
    const chartStyles = BarStyleConst;
    chartStyles.forEach(chartStyle => {
      chartTypes.forEach(type => {
        this.chartTypeObjs.push({
          type: widgetName,
          url: `assets\\img\\widget-type\\${widgetName}\\${chartStyle.key}-${type.key}.svg`,
          chartStyle: chartStyle.key,
          chartType: type.key,
          typeKey: type.value,
          styleKey: chartStyle.value
        });
      });
    });
  }

  private getLineChartTypeObjs() {
    const widgetName = WidgetType.Line;
    const chartTypes = LineChartTypesConst;
    chartTypes.forEach(type => {
      this.chartTypeObjs.push({
        type: widgetName,
        url: `assets\\img\\widget-type\\${widgetName}\\${type.key}.svg`,
        chartStyle: null,
        chartType: type.key,
        typeKey: type.value,
        styleKey: ''
      });
    });
  }

  getTooltip(icon) {
    return WidgetType[icon];
  }

  getIcon(id) {
    return getChartThumbnail(id);
  }

  handleSelectChartType(icon) {
    this.selectChartType.emit(icon);
  }

  isSelectedIcon(item) {
    if (this.type && this.type.replace(' ', '') === item.type) {
      if (this.chartStyle) {
        if (this.chartType) {
          return this.chartStyle === item.chartStyle && this.chartType === item.chartType;
        }
      } else if (this.chartType) {
        if (this.type  === 'Line') {

        }
        return this.chartType === item.chartType;
      }
      return true;
    } else if (this.selectedItem && this.selectedItem === item) {
      return true;
    }

    return false;
  }

  getFlexForAllImages(index, arr) {
    if (arr.length % 2 !== 0 && index === arr.length - 1) {
      return 100;
    }
    return 25;
  }
}
