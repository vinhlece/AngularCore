import {Component, EventEmitter, Input, Output} from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import {TimeRangeInterval} from '../../models';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-interval-selector',
  templateUrl: './interval-selector.component.html',
  styleUrls: ['./interval-selector.component.scss']
})
export class IntervalSelectorComponent {
  @Input() intervals: TimeRangeInterval[];
  @Input() value: TimeRangeInterval;
  @Input() label: string = 'dashboard.time_explorer.interval_value';
  @Input() darkTheme: boolean;

  @Output() onChange = new EventEmitter<TimeRangeInterval>();

  constructor(public translate: TranslateService) {}

  handleSelectionChange(event: MatSelectChange) {
    this.onChange.emit(event.value);
  }

  compareWith(v1: TimeRangeInterval, v2: TimeRangeInterval): boolean {
    return v1.value === v2.value && v1.type === v2.type;
  }

  getText(interval: any) {
    if (interval.label) {
      return `${interval.value} ${this.translate.instant(interval.label)}`;
    }
    return this.translate.instant(`dashboard.time_explorer.off`);
  }
}
