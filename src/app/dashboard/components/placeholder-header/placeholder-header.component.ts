import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import {DisplayModeEvent, REPStyles} from '../../../charts/models';
import {PlaceholderUISettings} from '../../containers/tab-launcher-item/ui-behaviors';
import {DisplayMode, ExportType} from '../../models/enums';
import {Measure} from '../../../measures/models/index';
import {ThemeService} from '../../../theme/theme.service';
import {Theme} from '../../../theme/model/index';
import {LineChartTypes} from '../../../widgets/models/enums';
import {ChartWidget} from '../../../widgets/models';
import {WidgetType} from '../../../widgets/constants/widget-types';
import {animate, state, style, transition, trigger, keyframes} from '@angular/animations';

@Component({
  selector: 'app-placeholder-header',
  templateUrl: './placeholder-header.component.html',
  styleUrls: ['./placeholder-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaceholderHeaderComponent implements OnInit {
  @Input() title: string;
  @Input() subTitle: string;
  @Input() settings: PlaceholderUISettings = {};
  @Input() menuStyles: REPStyles = {};
  @Input() measures: Measure[];
  @Input() currentMeasures: string[];
  @Input() isRealTime: boolean;
  @Input() isDisableRealTime: boolean;
  @Input() titlePosition: string;
  @Input() isOverlayWidget: boolean;
  @Input() displayMode: DisplayMode;
  @Input() exportMenu: DisplayMode;
  @Output() onDelete = new EventEmitter<void>();
  @Output() onMaximize = new EventEmitter<void>();
  @Output() onMinimize = new EventEmitter<void>();
  @Output() onExport = new EventEmitter<ExportType>();
  @Output() onSearch = new EventEmitter<boolean>();
  @Output() onCopy = new EventEmitter<void>();
  @Output() onChangeTitle = new EventEmitter<string>();
  @Output() onChangeSubTitle = new EventEmitter<string>();
  @Output() onEdit = new EventEmitter<void>();
  @Output() onAddMeasure = new EventEmitter<string>();
  @Output() onSetTimeMode = new EventEmitter<void>();
  @Output() onSetRealTimeMode = new EventEmitter<void>();
  @Output() onToggleExportMenu = new EventEmitter<boolean>();
  @Output() onToggleGaugeMode = new EventEmitter<boolean>();
  @Output() onSwitchDisplayMode = new EventEmitter<DisplayModeEvent>();
  @Output() onChangeShowLegend = new EventEmitter<boolean>();
  @Output() onChangePauseLineChart = new EventEmitter<boolean>();
  @Output() onChangeChartType = new EventEmitter<{ currentChartType: string, newChartType: LineChartTypes }>();

  gaugeMode = false;
  isShowMenu = false;
  showLegend: boolean;
  pauseLineChart: boolean = false;
  chartType: string;
  customSettings = {legend: false, chartType: false, displayMode: false, movingTime: false};
  _widget: ChartWidget;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.showLegend = this.widget ? !this.widget.hideLegend : true;
    this.chartType = this.widget ? this.widget.chartType : LineChartTypes.Line;
    this.customSettings = {
      legend:  this._widget.type === WidgetType.Line || this._widget.type === WidgetType.Bar || this._widget.type === WidgetType.GeoMap,
      chartType: this._widget.type === WidgetType.Line,
      displayMode: this._widget.type === WidgetType.SolidGauge || this._widget.type === WidgetType.GeoMap || this._widget.type === WidgetType.Sunburst,
      movingTime: this._widget.type === WidgetType.Line,
    };
  }

  @Input()
  get widget(): ChartWidget {
    return this._widget;
  }

  set widget(widet: ChartWidget) {
    if (!this._widget || this._widget.hideLegend !== widet.hideLegend) {
      this.showLegend = !widet.hideLegend;
    }
    this._widget = widet;
  }

  get chartTypeIcon() {
    return this.chartType === LineChartTypes.Area ? 'show_chart' : this.chartType === LineChartTypes.Line ? 'waves' : 'panorama';
  }

  get chartTypeTooltip() {
    return this.chartType === LineChartTypes.Area ? 'charts.tooltip.line_chart' :
      this.chartType === LineChartTypes.Line ? 'charts.tooltip.spline_chart' : 'charts.tooltip.area_chart';
  }

  get startPauseIcon() {
    return this.pauseLineChart ? 'play_circle_outline' : 'pause_circle_outline';
  }

  get startPauseTooltip() {
    const key = this.pauseLineChart ? 'charts.tooltip.play_moving_timeline' : 'charts.tooltip.pause_moving_timeline';
    return key;
  }

  get showLegendTooltip() {
    const key = this.showLegend ? 'charts.tooltip.show_legend' : 'charts.tooltip.hide_legend';
    return key;
  }

  get getStyleLegendIcon() {
    return {
      opacity: this.showLegend ? 1 : 0.5
    };
  }

  handleChangeChartType() {
    const newChartType = this.chartType === LineChartTypes.Area ? LineChartTypes.Line :
      this.chartType === LineChartTypes.Line ? LineChartTypes.Spline : LineChartTypes.Area;
    this.onChangeChartType.emit({
      currentChartType: this.chartType,
      newChartType: newChartType
    });
    this.chartType = newChartType;
  }

  handleStartPauseAction() {
    this.pauseLineChart = !this.pauseLineChart;
    this.onChangePauseLineChart.emit(this.pauseLineChart);
  }

  handleChangeToggleLegend() {
    if (!this.widget.hideLegend) {
      this.showLegend = !this.showLegend;
      this.onChangeShowLegend.emit(this.showLegend);
    }
  }

  handleSwitchDisplayMode(event) {
    this.onSwitchDisplayMode.emit({
      currentMode: this.displayMode,
      newMode: event
    });
  }

  getStyleForDynamic() {
    if (this.isShowMenu) {
      return {
        transition: '0.8s',
        right: '0'
      };
    }
    return {
      opacity: '0'
    };
  }

  getStyleForStatic() {
    if (!this.isShowMenu) {
      return {
        right: '-100px'
      };
    }
    return {
      transition: '0.5s'
    };
  }

  getHeaderStyle() {
    if (!this.isOverlayWidget) {
      return {
        'background-color': 'var(--placeholder-header-bg)'
      };
    }
  }

  handleMaximize() {
    this.onMaximize.emit();
  }

  handleMinimize() {
    this.onMinimize.emit();
  }

  handleDelete() {
    this.onDelete.emit();
  }

  handleExportToPDF() {
    this.onExport.emit(ExportType.PDF);
  }

  handleExportToCSV() {
    this.onExport.emit(ExportType.CSV);
  }

  handleExportToXLS() {
    this.onExport.emit(ExportType.XLS);
  }

  handleSearch() {
    this.onSearch.emit();
  }

  handleCopy() {
    this.onCopy.emit();
  }

  handleChangeTitle(title: string) {
    this.isShowMenu = false;
    this.onChangeTitle.emit(title);
  }

  handleChangeSubTitle(subTitle: string) {
    this.isShowMenu = false;
    this.onChangeSubTitle.emit(subTitle);
  }

  handleEdit() {
    this.onEdit.emit();
  }

  handleAddMeasure(item) {
    this.onAddMeasure.emit(item);
  }

  handleSetTimeMode() {
    this.onSetTimeMode.emit();
  }

  handleSetRealTimeMode() {
    this.onSetRealTimeMode.emit();
  }

  checkCurrentMeasure(item) {
    if (this.currentMeasures) {
      return this.currentMeasures.find((measure) => measure === item.name) ? true : false;
    }
  }

  // toggleExportMenu() {
  //   this.exportMenu = !this.exportMenu;
  //   this.onToggleExportMenu.emit(this.exportMenu);
  // }

  toggleDisplayMode() {
    this.gaugeMode = !this.gaugeMode;
    this.onToggleGaugeMode.emit(this.gaugeMode);
  }

  getRealTimeMode() {
    return this.isRealTime ? 'On' : 'Off';
  }

  isDarkTheme() {
    if (this.themeService.getCurrentTheme() === Theme.Dark) {
      return 'dark-theme-box';
    }
    return '';
  }
}
