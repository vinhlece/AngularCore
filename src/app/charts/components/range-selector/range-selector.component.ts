import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {getCurrentMoment, getMomentByDate} from '../../../common/services/timeUtils';
import {isNullOrUndefined} from 'util';
import {TimeRangeInterval} from '../../../dashboard/models/index';
import {TimeRangeType} from '../../../dashboard/models/enums';
import {AppDateTimeFormat} from '../../../common/models/enums';

@Component({
  selector: 'app-range-selector',
  templateUrl: './range-selector.component.html',
  styleUrls: ['./range-selector.component.scss']
})
export class RangeSelectorComponent implements OnInit, OnChanges {
  private _interval: TimeRangeInterval;
  form: FormGroup;
  autoCompleteOptions = [];

  @Input()
  get interval(): TimeRangeInterval {
    return this._interval;
  }

  set interval(value: TimeRangeInterval) {
    const defaultInterval = {
      type: TimeRangeType.Day,
      value: 3,
    };
    if (value) {
      this._interval = value.type === TimeRangeType.Day ? value : defaultInterval;
    }
  }

  @Output() onChangeTimeRange = new EventEmitter<{from: number, to: number}>();

  constructor(private _fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this._fb.group({
      from: null,
      to: null,
    });
    this.initAutopCompleteOptions();
    this.form.valueChanges.subscribe(value => {
      this.onChangeTimeRange.emit(this.getTimeRangeValue(value));
    });
  }

  ngOnChanges() {
    this.initAutopCompleteOptions();
  }

  private getTimeRangeValue(formValue): {from: number, to: number} {
    if (isNullOrUndefined(formValue.from) && isNullOrUndefined(formValue.to)) {
      return null;
    }
    const fromValue = getMomentByDate(formValue.from, AppDateTimeFormat.yyyyMMddDate).startOf('day');
    const toValue = getMomentByDate(formValue.to, AppDateTimeFormat.yyyyMMddDate).endOf('day');
    if (fromValue.isBefore(toValue)) {
      return{
        from: fromValue.valueOf(),
        to: toValue.valueOf()
      };
    }
  }

  private initAutopCompleteOptions() {
    if (!this.interval) {
      this.interval = {
        type: TimeRangeType.Day,
        value: 1,
      };
    }
    this.autoCompleteOptions = [];
    for (let i = 0; i < this.interval.value; i++) {
      const option = getCurrentMoment().subtract(i, this.interval.type);
      this.autoCompleteOptions.push(option.format(AppDateTimeFormat.yyyyMMddDate));
    }
  }
}
