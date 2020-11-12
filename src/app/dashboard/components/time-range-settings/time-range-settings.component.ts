import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {PredictiveSetting, TimeRangeInterval, TimeRangeSetting} from '../../models';
import {TranslateService} from '@ngx-translate/core';
import {ThemeService} from '../../../theme/theme.service';
import {Theme} from '../../../theme/model/index';

@Component({
  selector: 'app-time-range-settings',
  templateUrl: './time-range-settings.component.html',
  styleUrls: ['./time-range-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TimeRangeSettingsComponent {
  @Input() availableSettings: TimeRangeSetting[];
  @Input() currentSettings: TimeRangeSetting;
  @Input() predictiveSettings: PredictiveSetting;
  @Output() onChangeTimeRangeSettings: EventEmitter<TimeRangeSetting> = new EventEmitter();
  @Output() onChangePredictiveSettings: EventEmitter<PredictiveSetting> = new EventEmitter();

  constructor(public translate: TranslateService, private themeService: ThemeService) {}

  handleChangeTimeRangeSettings(event: any) {
    // log the moment user change time range
    // console.log('change time range at: ', getCurrentMoment().format(AppDateTimeFormat.dateTime))
    this.onChangeTimeRangeSettings.emit(event.value);
  }

  handleChangeDataPointInterval(interval: TimeRangeInterval) {
    const dataPointInterval = {...this.currentSettings.dataPointInterval, value: interval};
    this.onChangeTimeRangeSettings.emit({...this.currentSettings, dataPointInterval});
  }

  handleChangePredictiveRange(interval: TimeRangeInterval) {
    this.onChangePredictiveSettings.emit({...this.predictiveSettings, value: interval});
  }

  getText(settings: TimeRangeSetting) {
    return `${settings.interval.value} ${this.translate.instant(settings.interval.label)}`;
  }

  compareWith(v1: TimeRangeSetting, v2: TimeRangeSetting): boolean {
    return v1.interval.type === v2.interval.type && v1.interval.value === v2.interval.value;
  }

  isDarkTheme() {
    return this.themeService.getCurrentTheme() === Theme.Dark;
  }
}

