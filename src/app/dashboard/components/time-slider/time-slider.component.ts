import {
  ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit,
  Output
} from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import {AppDateTimeFormat} from '../../../common/models/enums';
import {getMomentByTimestamp} from '../../../common/services/timeUtils';
import {TimeRangeStep} from '../../models/enums';
import {Subject, Subscription} from 'rxjs/index';

@Component({
  selector: 'app-time-slider',
  templateUrl: './time-slider.component.html',
  styleUrls: ['./time-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeSlider implements OnInit, OnChanges, OnDestroy {
  private _subscription: Subscription = null;

  @Input() min: number;
  @Input() max: number;
  @Input() step: number;
  @Input() current: number;
  @Input() stopSubject: Subject<boolean>;
  @Output() onSlide: EventEmitter<number> = new EventEmitter();

  ticks: string[] = [];

  ngOnInit() {
    if (this.stopSubject) {
      this._subscription = this.stopSubject.subscribe(isStop => {
        if (isStop) {
          this.onSlide.emit(null);
        }
      });
    }
  }

  ngOnChanges() {
    this.getTimeTickLabels();
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  handleSlide(event: MatSliderChange) {
    const value = event.value === this.max ? null : event.value;
    this.onSlide.emit(value);
  }

  getTimeTickLabels() {
    this.ticks = [];
    const labelStep = (this.max - this.min) / 12;
    let timeFormat: string = AppDateTimeFormat.date;
    if (labelStep < TimeRangeStep.OneDay) {
      timeFormat = AppDateTimeFormat.dateMonthHour;
    }
    for (let i = this.min; i < this.max; i += labelStep) {
      this.ticks.push(getMomentByTimestamp(i).format(timeFormat));
    }
    this.ticks.push(getMomentByTimestamp(this.max).format(timeFormat));
  }
}
