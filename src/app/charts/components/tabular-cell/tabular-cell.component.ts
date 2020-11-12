import {Component, Input, ViewChild} from '@angular/core';
import {isNullOrUndefined} from 'util';
import {AppDateTimeFormat} from '../../../common/models/enums';
import {getMomentByTimestamp} from '../../../common/services/timeUtils';
import {TwinkleDirective} from '../../../layout/components/twinkle/twinkle.directive';
import {TabularCellValue} from '../../models';

@Component({
  selector: 'app-tabular-cell',
  templateUrl: './tabular-cell.component.html',
  styleUrls: ['./tabular-cell.component.scss']
})
export class TabularCellComponent {
  private _primary: TabularCellValue;
  private _secondary: TabularCellValue;

  @Input() twinkle: boolean;

  @Input()
  get primary(): TabularCellValue {
    return this._primary;
  }

  set primary(value: TabularCellValue) {
    if (!isNullOrUndefined(value) && !isNullOrUndefined(this._primary) && (this._primary.value !== value.value)) {
      this.triggerTwinkle();
    }
    this._primary = value;
  }

  @Input()
  get secondary(): TabularCellValue {
    return this._secondary;
  }

  set secondary(value: TabularCellValue) {
    if (!isNullOrUndefined(value) && !isNullOrUndefined(this._secondary) && (this._secondary.value !== value.value)) {
      this.triggerTwinkle();
    }
    this._secondary = value;
  }

  @ViewChild(TwinkleDirective) twinkleTrigger: TwinkleDirective;

  formatValue(cell: TabularCellValue): string {
    if (cell.format === 'datetime') {
      return getMomentByTimestamp(cell.value).format(AppDateTimeFormat.dateTime);
    } else if (cell.format === 'time') {
      return getMomentByTimestamp(+cell.value * 1000).format(AppDateTimeFormat.time);
    }
    const value = cell.value.toString();
    if (cell.format === 'number') {
        return parseFloat(value).toLocaleString('en');
    }
    return value;
  }

  hasValue(cell: TabularCellValue): boolean {
    return !isNullOrUndefined(cell) && !isNullOrUndefined(cell.value);
  }

  getArrow(primary: TabularCellValue, secondary: TabularCellValue): string {
    let result = '';
    if (!isNullOrUndefined(primary) && !isNullOrUndefined(primary.value) &&
      !isNullOrUndefined(secondary) && !isNullOrUndefined(secondary.value)) {
      if (secondary.value > primary.value) {
        result = 'down';
      } else {
        result = 'up';
      }
    }
    return result;
  }

  getStyle() {
    const backgroundColor = this.primary ? this.primary.color : null;
    return {backgroundColor};
  }

  private triggerTwinkle() {
    if (this.twinkle && this.twinkleTrigger) {
      this.twinkleTrigger.trigger('dashed');
    }
  }
}
