import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {AbstractControl, FormBuilder, FormGroup} from '@angular/forms';
import {WidgetType} from '../../../widgets/constants/widget-types';
import {InputRange, TimeInterval} from '../../../widgets/models/index';
import {isNullOrUndefined} from 'util';
import {TimeGroupBy} from '../../../widgets/models/enums';
import {validateFunc} from '../../../common/utils/function';

@Component({
  selector: 'app-time-range-dialog-container',
  templateUrl: './time-range-dialog.container.html',
  styleUrls: ['./time-range-dialog.container.scss']
})
export class TimeRangeDialogContainer implements OnInit {
  private _dialogRef: MatDialogRef<TimeRangeDialogContainer>;

  private _fb: FormBuilder;
  form: FormGroup;
  data: any;
  validateInput: Function[];

  constructor(dialogRef: MatDialogRef<TimeRangeDialogContainer>, @Inject(MAT_DIALOG_DATA) data: any, fb: FormBuilder) {
    this._dialogRef = dialogRef;
    this.data = data;
    this._fb = fb;
  }

  ngOnInit() {
    this.validateInput = this.isRequiredType() ? null : validateFunc;
    this.form = this._fb.group({
      timeGroup: [this.data.timeGroup]
    });
    this.form.valueChanges.subscribe((value) => {
      this.propagateChange(value);
      this.form.patchValue(value, {emitEvent: false});
    });
  }

  writeValue(value) {
    if (value) {
      const data = {
        ...value,
      };
      this.form.setValue(data, {emitEvent: false});
    }
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) {
    // no op
  }

  handleClose() {
    this._dialogRef.close(null);
  }

  handleSave() {
    this._dialogRef.close(this.form.getRawValue());
  }

  isRequiredInterval(): boolean {
    return this.data.type === WidgetType.Bar || this.data.type === WidgetType.Line;
  }

  isRequiredType(): boolean {
    return this.data.type === WidgetType.Bar;
  }

  private getControl(controlName: string): AbstractControl {
    return this.form.get(controlName);
  }

  private propagateChange = (_: any) => {
  };
}
