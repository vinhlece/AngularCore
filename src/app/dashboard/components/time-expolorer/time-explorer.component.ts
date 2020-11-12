import {animate, state, style, transition, trigger} from '@angular/animations';
import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {getMomentByLocaleTimestamp, getMomentByTimestamp} from '../../../common/services/timeUtils';
import {Dashboard, PredictiveSetting, TimeRangeSetting} from '../../models';
import {ReplayStatus} from '../../models/enums';
import {ColorPalette, InstanceColor} from '../../../common/models/index';
import {User} from '../../../user/models/user';
import {Subject} from 'rxjs/index';
import {Logging, LogLevel} from '../../../config/app.config';
import {TranslateService} from '@ngx-translate/core';
import {isNullOrUndefined} from '../../../common/utils/function';
import {ThemeService} from '../../../theme/theme.service';
import {Theme} from '../../../theme/model/index';

@Component({
  selector: 'app-time-explorer',
  templateUrl: './time-explorer.component.html',
  styleUrls: ['./time-explorer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('timeSliderState', [
      state('in', style({
        flexBasis: '114px',
        opacity: 1,
        display: 'block'
      })),
      state('out', style({
        height: '0px',
        opacity: 0,
        display: 'none'
      })),
      transition('in => out', animate('100ms ease-in')),
      transition('out => in', animate('100ms ease-out'))
    ])
  ],
})
export class TimeExplorer implements OnChanges {
  currentTimestampLabel: string;
  timeSliderState: 'in' | 'out' = 'out';
  stopSubject: Subject<boolean> = new Subject<boolean>();
  isNewInstanceColor: boolean = false;
  readonly LogLevel = LogLevel;

  @Input() currentSettings: TimeRangeSetting;
  @Input() availableSettings: TimeRangeSetting[];
  @Input() predictiveSettings: PredictiveSetting;
  @Input() currentTimestamp: number;
  @Input() replayStatus: ReplayStatus;
  @Input() palettes: ColorPalette[];
  @Input() user: User;
  @Input() dashboard: Dashboard;
  @Input() loggingMode: Logging;
  @Input() instanceColors: InstanceColor[];

  @Output() onChangeTimeRangeSetting: EventEmitter<TimeRangeSetting> = new EventEmitter();
  @Output() onChangeCurrentTimestamp: EventEmitter<number> = new EventEmitter();
  @Output() onChangePredictiveSetting: EventEmitter<PredictiveSetting> = new EventEmitter();
  @Output() onOpen: EventEmitter<void> = new EventEmitter<void>();
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();
  @Output() onOpened: EventEmitter<void> = new EventEmitter<void>();
  @Output() onClosed: EventEmitter<void> = new EventEmitter<void>();
  @Output() onChangeColorPalette = new EventEmitter<any>();
  @Output() onToggleGlobalFilter = new EventEmitter<void>();
  @Output() onToggleSlider = new EventEmitter<void>();
  @Output() onClickAddWidget = new EventEmitter<string>();
  @Output() onClickAddLabelWidget = new EventEmitter<string>();
  @Output() onLoggingMode = new EventEmitter<LogLevel>();
  @Output() onDropTimestamp = new EventEmitter<void>();
  @Output() onUpdateInstanceColor = new EventEmitter<InstanceColor[]>();
  @Output() onDeleteInstanceColor = new EventEmitter<string>();
  @Output() onEditInstanceColor = new EventEmitter<InstanceColor>();

  get min() {
    return this.currentSettings ? this.currentSettings.range.startTimestamp : null;
  }

  get max() {
    return this.currentSettings ? this.currentSettings.range.endTimestamp : null;
  }

  get step() {
    return this.currentSettings ? this.currentSettings.step : null;
  }

  get isReplaying(): boolean {
    return this.replayStatus === ReplayStatus.RESUME;
  }

  get isReplayPaused(): boolean {
    return this.replayStatus === ReplayStatus.PAUSE;
  }

  get isReplayStopped(): boolean {
    return this.replayStatus === ReplayStatus.STOP;
  }

  constructor(public translate: TranslateService, private themeService: ThemeService) {}

  ngOnChanges() {
    const currentTimestamp = this.currentTimestamp || this.getCurrentTime();
    if (!isNullOrUndefined(currentTimestamp)) {
      this.currentTimestampLabel = getMomentByLocaleTimestamp(currentTimestamp, this.translate.currentLang).format('LLLL');
    }
  }

  timeSlider() {
    return this.timeSliderState === 'in';
  }

  getColor(color, colors?: any) {
    if (colors) {
      const width = 100 / colors.length;
      return {
        margin: '10px 0',
        'background-color': color,
        width: width + '%'
      };
    } else {
      return {
        'background-color': color,
        width: '100%'
      };
    }
  }

  handleChangeTimeRangeSetting(value: TimeRangeSetting) {
    this.onChangeTimeRangeSetting.emit(value);
  }

  handleChangePredictiveSetting(value: PredictiveSetting) {
    this.onChangePredictiveSetting.emit(value);
  }

  handleChangeCurrentTimestamp(value: number) {
    this.onChangeCurrentTimestamp.emit(value);
  }

  handleClickTimeSliderLabel() {
    if (this.timeSliderState === 'in') {
      this.timeSliderState = 'out';
      this.onClose.emit();
    } else {
      this.timeSliderState = 'in';
      this.onOpen.emit();
    }
  }

  handleAnimationDone() {
    this.timeSliderState === 'in' ? this.onOpened.emit() : this.onClosed.emit();
  }

  handleChangeColorPalette(event) {
    this.onChangeColorPalette.emit(event);
  }

  handleToggleGlobalFilter(event: MouseEvent) {
    this.onToggleGlobalFilter.emit();
  }

  handleAddWidget(event) {
    this.onClickAddWidget.emit(this.user.id);
  }

  handleAddLabelWidget() {
    this.onClickAddLabelWidget.emit(this.user.id);
  }

  toggleSlider() {
    this.onToggleSlider.emit();
  }

  stopSlider() {
    this.stopSubject.next(true);
  }

  getSliderState() {
    let text;
    if (this.isReplaying) {
      text = 'dashboard.time_explorer.pause';
    } else if (this.isReplayPaused) {
      text = 'dashboard.time_explorer.resume';
    } else {
      text = 'dashboard.time_explorer.play';
    }
    return text;
  }

  handleOffLogging() {
    this.onLoggingMode.emit(null);
  }

  handleOnDebug() {
    this.onLoggingMode.emit(LogLevel.debug);
  }

  handleOnInfo() {
    this.onLoggingMode.emit(LogLevel.info);
  }

  getSelectedLogging(item: LogLevel) {
    if (this.loggingMode && this.loggingMode.log) {
      return this.loggingMode.level === item;
    }
    return isNullOrUndefined(item);
  }

  handleDrop(event) {
    this.onDropTimestamp.emit();
  }

  triggerNewInstanceColor(event) {
    this.preventMenuItem(event);
    this.isNewInstanceColor = true;
  }

  preventMenuItem(event) {
    event.stopPropagation();
  }

  addNewInstanceColor(event) {
    this.isNewInstanceColor = false;
    let data;
    console.log(event, this.instanceColors);
    if (!isNullOrUndefined(this.instanceColors) && this.instanceColors.length > 0) {
      data = [...this.instanceColors, event];
    } else {
      data = [event];
    }
    this.onUpdateInstanceColor.emit(data);
  }

  deleteInstanceColor(name: string) {
    this.onDeleteInstanceColor.emit(name);
  }

  handlePickColor(color: string, name: string) {
    const instance = {
      name,
      color
    };
    this.onEditInstanceColor.emit(instance);
  }

  isDarkTheme() {
    if (this.themeService.getCurrentTheme() === Theme.Dark) {
      return 'dark-theme-box';
    }
    return '';
  }

  private getCurrentTime() {
    if (this.max) {
      if (this.predictiveSettings && this.predictiveSettings.value.value) {
        const {value, type} = this.predictiveSettings.value;
        return +getMomentByTimestamp(this.max).subtract(value, type);
      }
      return this.max;
    }
  }
}
