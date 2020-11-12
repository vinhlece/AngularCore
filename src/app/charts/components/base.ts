import { ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, ViewChild } from '@angular/core';
import * as HighchartsCustomEventsFactory from 'highcharts-custom-events';
import * as HighchartsPatternFill from 'highcharts-pattern-fill';
import * as Highcharts from 'highcharts/highcharts';
import * as highchartsMore from 'highcharts/highcharts-more';
import * as exportData from 'highcharts/modules/export-data';
import * as exporting from 'highcharts/modules/exporting';
import * as mapModule from 'highcharts/modules/map';
import * as sankey from 'highcharts/modules/sankey';
import * as solidGauge from 'highcharts/modules/solid-gauge';
import * as stockModule from 'highcharts/modules/stock';
import * as sunburstModule from 'highcharts/modules/sunburst';
import * as ganttModule from 'highcharts/modules/gantt';
import { Placeholder } from '../../dashboard/models';
import { Logger } from '../../logging/services';
import { DefaultLogger } from '../../logging/services/logger';
import { ChartWidget, Widget } from '../../widgets/models';
import { Dimension, REPStyles, WidgetMouseEvent } from '../models';
import { ColorPalette, InstanceColor } from '../../common/models/index';
import * as _ from 'lodash';
import * as boostHighchart from 'highcharts/modules/boost';
import {WidgetType} from '../../widgets/constants/widget-types';
import {appConfig} from '../../config/app.config';
import {isNullOrUndefined, unionInstances} from '../../common/utils/function';
import {TranslateService} from '@ngx-translate/core';
import {MatDialog} from '@angular/material/dialog';
import {LegendDialogComponent} from './dialog/legend-dialog';
import {getIconPosition} from '../utils/functions';
import {ThemeService} from '../../theme/theme.service';
import {Theme} from '../../theme/model/index';
import {static_data} from '../../dashboard/models/constants';

boostHighchart(Highcharts);
stockModule(Highcharts);
mapModule(Highcharts);
highchartsMore(Highcharts);
solidGauge(Highcharts);
sunburstModule(Highcharts);
ganttModule(Highcharts);
sankey(Highcharts);
exporting(Highcharts);
exportData(Highcharts);
HighchartsCustomEventsFactory(Highcharts);
HighchartsPatternFill(Highcharts);

export interface BaseChartComponent {
  widget: Widget;
  data: any;
  size: Dimension;
  styles: REPStyles;
  colorPalette: ColorPalette;
}

export abstract class AbstractHighchartsComponent implements BaseChartComponent, OnChanges {
  private _type: 'chart' | 'mapChart';
  private _chart: any;
  private _data: any;
  private _styles: REPStyles = {};
  private _size: Dimension = { width: null, height: null };
  private _logger: Logger;
  private _widget: ChartWidget;
  private _isUpdateOptions: boolean = false;
  private _isUpdateWidget: boolean = false;
  private _isExport: boolean = false;
  private _placeholder: Placeholder;
  private _colorPalette: ColorPalette;
  private _instanceColors: InstanceColor[];
  private _export: boolean = false;
  private _dialogData;
  private _dialogService: MatDialog;
  protected themeService: ThemeService;
  private _activeTheme: Theme;

  @Input()
  get exportMenu() {
    return this._export;
  }

  set exportMenu(_export: boolean) {
    this._export = _export;
    this._isExport = true;
  }

  @Input()
  get placeholder(): Placeholder {
    return this._placeholder;
  }
  set placeholder(placeholder: Placeholder) {
    this._placeholder = placeholder;
    this._isUpdateOptions = true;
  }

  @Input()
  get colorPalette(): ColorPalette {
    return this._colorPalette;
  }
  set colorPalette(colorPalette: ColorPalette) {
    this._colorPalette = colorPalette;
    this._isUpdateOptions = true;
  }

  @Input()
  get instanceColors(): InstanceColor[] {
    return this._instanceColors;
  }
  set instanceColors(instanceColors: InstanceColor[]) {
    this._instanceColors = instanceColors;
    this._isUpdateOptions = true;
  }

  @Input()
  get widget(): ChartWidget {
    return this._widget;
  }

  set widget(widet: ChartWidget) {
    if (!_.isEqual(this._widget, widet)) {
      this._isUpdateWidget = true;
    }
    if (!this._widget || this._widget.hideLegend !== widet.hideLegend) {
      this.showLegend = !widet.hideLegend;
    }
    this._widget = widet;
  }
  @Input()
  get data(): any {
    return this._data;
  }

  set data(data: any) {
    this._data = this.dataSetter(data);
  }

  @Input()
  get styles(): REPStyles {
    return this._styles;
  }

  set styles(value: REPStyles) {
    this._styles = value || {};
    this._isUpdateOptions = true;
  }

  @Input()
  get size(): Dimension {
    return this._size;
  }

  set size(value: Dimension) {
    this._size = value || { width: null, height: null };
    this._isUpdateOptions = true;
  }

  @Input() isOverlayWidget: boolean;
  @Input() isEmptyData: boolean;

  @Input() showLegend: boolean;
  @Output() onContextMenu = new EventEmitter<WidgetMouseEvent>();
  @Output() onClick = new EventEmitter<WidgetMouseEvent>();
  @Output() onMouseDown = new EventEmitter<WidgetMouseEvent>();
  @Output() onDoubleClick = new EventEmitter<WidgetMouseEvent>();
  @Output() onLegendConfig = new EventEmitter<Widget>();

  @ViewChild('chartContainer') chartContainer: ElementRef;

  get getShowLegendVal(): boolean {
    return this.widget && (!this.widget.hideLegend) ? this.showLegend !== undefined ? this.showLegend : true : false;
  }

  getIconStyle(alpha: number = 0) {
    return getIconPosition(this.exportMenu, 12, alpha);
  }

  constructor(type: 'chart' | 'mapChart', logger: Logger, public translate: TranslateService,
              dialogService: MatDialog, themeService: ThemeService) {
    this._type = type;
    this._logger = logger || new DefaultLogger();
    this._dialogService = dialogService;
    this.themeService = themeService;
    this._activeTheme = themeService.getCurrentTheme();
    this.themeService.getActiveTheme().subscribe(item => {
      if (item && this._chart) {
        this._activeTheme = item;
        this.createChart();
      }
    });
    this.updateLanguage();
  }

  @HostListener('window:visibilitychange', ['$event'])
  onVisibilityChange() {
    this.updateChart();
  }

  abstract getOptions(): any;

  abstract getUpdateOptions(): any;

  abstract shouldRecreateChart(): boolean;

  get chart() {
    return this._chart;
  }

  ngOnChanges() {
    if (!this.isOverlayWidget) {
      this.updateChart();
    }
  }

  preUpdate() {
    // no op
  }

  updateLanguage() {
    // Set initialize language for highchart
    const languageObj = {
      lang: {
        thousandsSep: ',',
        ...this.translate.instant('highchart')
      }
    };
    Highcharts.setOptions(languageObj);

    // Update new language for highchart whenever changing language
    this.translate.onLangChange.subscribe((data) => {
      const langObj = {
        lang: {
          thousandsSep: ',',
          ...data.translations.highchart
        }
      };
      Highcharts.setOptions(langObj);
      this.createChart();
    });
  }

  generatePreviewData() {
    const widgetStaticData = static_data.find(data => data.type === this.widget.type);
    if (widgetStaticData && widgetStaticData['data']) {
      this._data = widgetStaticData['data'];
    }
  }

  update() {
    this._logger.startSetDataBenchmark(this.widget);
    if (this.isUpdateChart()) {
      this.updateOptions();
      this._chart.reflow();
      this.updateData();
      this._chart.redraw();
      // log the moment when chart update data and redraw
      // console.log('chart redraw at: ', getCurrentMoment().format(AppDateTimeFormat.dateTime))
      // log the data after updated
      // console.log('data being plotted: ', this._data);
    } else {
      this.createChart();
      this.generatePreviewData();
    }
    this._logger.endSetDataBenchmark(this.widget);
  }

  postUpdate() {
    // no op
  }

  dataSetter(value: any): any {
    if (this.isEmptyData) {
      const widgetStaticData = this.getPreviewWidget();
      if (widgetStaticData && widgetStaticData['data']) {
        return widgetStaticData['data'];
      }
    }
    return value || [];
  }

  getBaseOptions() {
    return {
      title: {
        text: null
      },
      exporting: {
        buttons: {
          contextButton: {
            menuItems: [
              'printChart',
              'separator',
              'downloadPNG',
              'downloadJPEG',
              'separator',
              'downloadCSV',
              'downloadXLS'
            ],
            theme: {
              fill: this.styles.backgroundColor,
            },
            symbolStroke: this.styles.color,
            symbolFill: this.styles.color
          }
        },
        csv: {
          dateFormat: '%Y-%m-%d'
        }
      },
      scrollbar: {
        enabled: false
      },
      credits: {
        enabled: false
      }
    };
  }

  protected getboost() {
    return {
      boost: {
        useGPUTranslations: true
      }
    };
  }

  protected getExportingOptions() {
    return {
      enabled: this.exportMenu,
      buttons: {
        contextButton: {
          symbolStroke: '#CCC'
        }
      }
    };
  }

  enableAnimation() {
    return {
      animation: {
        duration: 100
      }
    };
  }

  disableAnimation() {
    return {
      animation: false
    };
  }

  getChartFontStyle() {
    const font = this.widget.font;
    return font
    ? {
        fontFamily: `${font.fontFamily}`,
        fontSize: `${font.fontSize}px`
    }
    : {
      fontFamily: '\"Poppins\", \"Lucida Grande\", \"Lucida Sans Unicode\", Verdana, Arial, Helvetica, sans-serif',
      fontSize : '12px'
    };
  }

  getLabelFontStyle() {
    const font = this.widget.font;
    const color = this.isDarkTheme() ? '#ccc' : '#333';
    return font
      ? {
        color,
        fontFamily: font.fontFamily ? `${font.fontFamily}` : 'Poppins',
        fontSize: font.fontSize ? `${font.fontSize}px` : `16px`,
        fontWeight: font.fontWeight ? `${font.fontWeight}` : 'normal',
      }
      : {color, fontSize: '16px', fontWeight: 'normal'};
  }

  getTooltipFontStyle() {
    const font = this.widget.font;
    return font
      ? {
          color: 'contrast',
          fontFamily: font.fontFamily ? `${font.fontFamily}` : 'Poppins',
          fontSize: font.fontSize ? `${font.fontSize}px` : `11px`,
          fontWeight: font.fontWeight ? `${font.fontWeight}` : 'normal',
          pointerEvents: 'none',
          whiteSpace: 'nowrap'
      }
      : {color: 'contrast', fontSize: '12px', pointerEvents: 'none', whiteSpace: 'nowrap'};
  }

  getLegendsStyle() {
    return {
      ...this.getLabelFontStyle(),
      cursor: 'pointer',
      textOverflow: 'ellipsis'
    };
  }

  handleChangeToggleLegend() {
    this.showLegend = !this.showLegend;
    this._chart.update(this.getUpdateOptions(), true);
  }

  openDialog(option: any) {
    if (!isNullOrUndefined(this._dialogData)) {
      return;
    }

    this._dialogData = this._dialogService.open(LegendDialogComponent, {
      width: '450px',
      height: '350px',
      hasBackdrop: false,
      data: {
        title: 'widgets.edit_widget_form.legend_options',
        inputData: option
      }
    });
    this._dialogData.afterClosed().subscribe((subscribedItem) => {
      this._dialogData = null;
      if (isNullOrUndefined(subscribedItem)) {
        return false;
      }
      this.onLegendConfig.emit(subscribedItem as Widget);
      this.createChart();
    });
  }

  isDarkTheme() {
    return this._activeTheme === Theme.Dark;
  }

  protected getPreviewWidget() {
    return static_data.find(data => data.type === this.widget.type);
  }

  protected getInstance() {
    if (this.widget.dimensions.length === 0) {
      return '';
    }
    const instances = unionInstances(this.widget.dimensions[0]);
    if (instances.length === 0) {
      return '';
    }
    return this.widget.dimensions.length > 0 ? `<span>${instances[0]}</span>` : '';
  }

  protected getMeasure() {
    return this.widget.measures.length > 0 ? this.widget.measures[0] : '';
  }

  private updateChart () {
    const t1 = appConfig.performanceLogging ? performance.now() : null;
    if (!window.document.hidden) {
      this.checkUpdateOptions();
      this.preUpdate();
      this.update();
      this.postUpdate();
      this._isUpdateOptions = false;
      this._isUpdateWidget = false;
      this._isExport = false;
    }

    if (appConfig.performanceLogging) {
      console.log(`Render time: (${this.widget.name}-${this.widget.type}): ${Math.floor(performance.now() - t1)}ms`);
    }
  }

  protected createChart() {
    // TODO chartContainer was undefined on first call.  Listen for setter or add call to AfterViewInit
    // This function have to trigger whenever have any changes from input. So, check undefined at the first time is OK.
    if (this.chartContainer) {
      this._chart = Highcharts[this._type](this.chartContainer.nativeElement, {...this.getOptions(), series: this.data});
      Highcharts.setOptions({
        lang: {
          thousandsSep: ','
        }
      });
    }
  }

  private updateOptions() {
    // redraw: false, oneToOne: false (set as default), animation: true (set as default)
    if (this._isUpdateOptions || this._isUpdateWidget || this._isExport) {
      this._chart.update(this.getUpdateOptions());
    }
  }

  protected updateData() {
    this.data.forEach((item, idx) => {
      if (this._chart.legend.allItems && this._chart.legend.allItems.length > idx) {
        this._chart.legend.allItems[idx].update({name: item.name});
      }

      // null color for geo map
      this._chart.series[idx].options.nullColor = item.nullColor;

      // state color for geo map, set color alone does not change state color
      if (!isNullOrUndefined(item.color) && this._chart.series[idx].options.color !== item.color) {
        this._chart.series[idx].update({...this._chart.series[idx].options, color: item.color});
      }

      // update zones for predictive data
      if (item.zoneAxis) {
        if (JSON.stringify(this._chart.series[idx].zones) !== JSON.stringify(item.zones)) {
          this._chart.series[idx].update({...this._chart.series[idx].options, zoneAxis: item.zoneAxis, zones: item.zones});
        }
      }

      // update nodes for sankey
      if (!isNullOrUndefined(item.nodes)) {
        this._chart.series[idx].update({...this._chart.series[idx].options, nodes: item.nodes});
      }

      this._chart.series[idx].name = item.name;

      // redraw: false, animation: true (set as default), updatePoints: true (set as default)
      this._chart.series[idx].setData(item.data, false, true, true);
    });
  }

  private hasData(): boolean {
    return this._chart.series && this._chart.series.length !== 0;
  }

  private isUpdateChart(): boolean {
    return !this._isUpdateWidget
      && this._chart
      && this.hasData()
      && !this.shouldRecreateChart();
  }

  private checkUpdateOptions() {
    // is not latest charts
    this._isUpdateOptions = this._isUpdateOptions ||
      this.widget.type === WidgetType.TrendDiff ||
      this.widget.type === WidgetType.Line ||
      this.widget.type === WidgetType.CallTimeLine ||
      this.widget.type === WidgetType.Bar ||
      this.widget.type === WidgetType.GeoMap;
  }
}

export abstract class HighchartsComponent extends AbstractHighchartsComponent {
  constructor(logger: Logger, translate: TranslateService, dialogService: MatDialog, themeService: ThemeService) {
    super('chart', logger, translate, dialogService, themeService);
  }
}

export abstract class HighmapsComponent extends AbstractHighchartsComponent {
  constructor(logger: Logger, translate: TranslateService, dialogService: MatDialog, themeService: ThemeService) {
    super('mapChart', logger, translate, dialogService, themeService);
  }
}
