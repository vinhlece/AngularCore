import {Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {isArray, isNullOrUndefined} from 'util';
import {TranslateService} from '@ngx-translate/core';
import {WidgetType, WidgetTypeForGroup} from '../../../../widgets/constants/widget-types';
import {BAR_CHART_TYPES} from '../../../../widgets/constants/bar-chart-types';
import {BarStyleConst, LineChartTypesConst, WidgetTypeGroupsConstant} from '../../../../widgets/models/constants';
import {ChartIcons} from '../../../../widgets/models/enums';
import {trigger, state, style, animate, transition} from '@angular/animations';
import {__await} from 'tslib';
import {getChartThumbnail} from '../../../../widgets/utils/functions';
import {ThemeService} from '../../../../theme/theme.service';
import {Theme} from '../../../../theme/model/index';

@Component({
  selector: 'app-simple-name-form',
  templateUrl: './simple-name-form.component.html',
  styleUrls: ['./simple-name-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('openClosedImages', [
      state('open', style({
        'opacity': '1', 'transform': 'none'}
        )),
      state('closed', style({
        'opacity': '0', 'transform': 'translateY(-50px)'}
        )),
      transition('open => closed', [
        animate('0.1s')
      ]),
      transition('closed => open', [
        animate('0.5s')
      ])
    ])
  ]
})
export class SimpleNameFormComponent implements OnInit {
  @Input() formTitle: string;
  @Input() inputData: any;
  @Output() saveHandler: EventEmitter<any>;
  @Output() cancelHandler: EventEmitter<any>;

  newForm: FormGroup;
  icons = Object.keys(ChartIcons).filter(item =>
    ChartIcons[item] !== ChartIcons.Label &&
    ChartIcons[item] !== ChartIcons.LiquidFillGauge &&
    ChartIcons[item] !== ChartIcons.Billboard &&
    ChartIcons[item] !== ChartIcons.LiquidFillGauge &&
    ChartIcons[item] !== ChartIcons.CallTimeLine);
  selectedItem: string;
  isHaveChartStyleOrType: boolean = false;
  chartTypeObjs: any[];
  selectedTabIndex: any;
  currentView = 'grid';

  constructor(public translate: TranslateService, private themeService: ThemeService) {
    this.saveHandler = new EventEmitter();
    this.cancelHandler = new EventEmitter();
  }

  ngOnInit() {
    const formControls = Object.keys(this.inputData).reduce((acc, item) => {
      acc[item] = new FormControl(isArray(this.inputData[item]) ? null : this.inputData[item], [Validators.required]);
      return acc;
    }, {});
    this.newForm = new FormGroup(formControls);
    this.selectAllChartType();
  }

  checkValidForm(): boolean {
    return this.newForm.get('name').valid;
  }

  isAvailableControl(controlName: string) {
    return this.inputData.hasOwnProperty(controlName);
  }

  onSave(event?) {
    if (!isNullOrUndefined(event) && this.isAvailableControl('widgetType')) {
      this.saveHandler.emit(event);
    } else if (this.isAvailableControl('name')) {
      if (this.checkValidForm()) {
        this.saveHandler.emit(this.newForm.value);
      }
    }
  }

  onCancel() {
    this.cancelHandler.emit('close');
  }

  getTextSave() {
    return this.inputData.widgetType
      ? 'dashboard.simple_name_form.next'
      : 'dashboard.simple_name_form.save';
  }

  getIcon(id) {
    return getChartThumbnail(id);
  }

  getTooltip(icon) {
    return WidgetTypeForGroup[icon];
  }

  selectChartType(widgetName) {
    this.chartTypeObjs = null;
    this.selectedItem = widgetName;
    this.isHaveChartStyleOrType = widgetName === WidgetType.Bar || widgetName === WidgetType.Line ? true : false;
    this.chartTypeObjs = [];
    if (widgetName === WidgetType.Bar) {
      this.getBarChartTypeObjs();
    } else if (widgetName === WidgetType.Line) {
      this.getLineChartTypeObjs();
    } else {
      this.getOtherChartTypeObjs(widgetName);
    }
  }

  selectAllChartType() {
    this.chartTypeObjs = [];
    this.getBarChartTypeObjs();
    this.getLineChartTypeObjs();
    this.getOtherChartTypeObjs(WidgetType.TrendDiff);
    this.getOtherChartTypeObjs(WidgetType.Tabular);
    this.getOtherChartTypeObjs(WidgetType.Sankey);
    this.getOtherChartTypeObjs(WidgetType.SolidGauge.toString().replace(' ', ''));
    this.getOtherChartTypeObjs(WidgetType.GeoMap.toString().replace(' ', ''));
    this.getOtherChartTypeObjs(WidgetType.Sunburst);
    this.getOtherChartTypeObjs(WidgetType.Bubble);
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

  onTabChange(event) {
    this.selectChartType(this.icons[this.selectedTabIndex]);
  }

  getFlexForImage(index, arr) {
    if (arr.length % 2 !== 0 && index === arr.length - 1) {
      return 100;
    }
    return 50;
  }

  getFlexForAllImages(index, arr) {
    if (arr.length % 2 !== 0 && index === arr.length - 1) {
      return 100;
    }
    return 25;
  }

  isFlex100Image(index, arr) {
    return arr.length % 2 !== 0 && index === arr.length - 1;
  }

  handleChangeWidget(typeObj) {
    if (WidgetType[typeObj.type] === WidgetType.Bar || WidgetType[typeObj.type] === WidgetType.Line) {
      this.onSave({type: WidgetType[typeObj.type], chartType: typeObj.chartType, chartStyle: typeObj.chartStyle});
    } else {
      this.onSave({type: WidgetType[typeObj.type]});
    }
  }

  changeView() {
    this.currentView = this.currentView === 'grid' ? 'tab' : 'grid';
    if (this.currentView === 'grid') {
      this.selectAllChartType();
    } else {
      this.selectChartType(this.icons[0]);
    }
  }

  isDarkTheme() {
    return this.themeService.getCurrentTheme() === Theme.Dark;
  }
}
