import {Component, forwardRef, Input, OnInit, Output} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validator
} from '@angular/forms';
import {isNullOrUndefined} from 'util';
import {Column} from '../../../models';
import {GroupOptions} from '../../../models/enums';
import {AggFunctionsConst, GroupOptionsConst} from '../../../models/constants';

@Component({
  selector: 'app-column-editor',
  templateUrl: './column-editor.component.html',
  styleUrls: ['./column-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColumnEditorComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ColumnEditorComponent),
      multi: true
    }
  ]
})
export class ColumnEditorComponent implements OnInit, ControlValueAccessor, Validator {
  private _fb: FormBuilder;
  private _isPreviousValid: any = null;
  private _displayMode: string = null;

  form: FormGroup;
  column: Column;

  availableFunctions = AggFunctionsConst;
  availableGroups = GroupOptionsConst;
  isGroupByHour = false;

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  ngOnInit() {
    this.createFormControl();
    this.updateFormControl();
    this.form.valueChanges.subscribe((value) => {
      const isGroup = value.group && value.group.enable;
      if (!isGroup) {
        value.groupBy = null;
        value.groupRange = null;
      } else if (isGroup && value.groupBy !== GroupOptions.Hour) {
        value.groupRange = null;
      }
      return this._propagateChange({...this.column, ...value});
    });
  }

  writeValue(column: Column) {
    if (column) {
      this.column = column;
      const title = this.column.title || '';
      const visibility = isNullOrUndefined(this.column.visibility) ? false : this.column.visibility;
      const group = {
        enable: isNullOrUndefined(this.column.group) ? false : this.column.group.enable,
        priority: isNullOrUndefined(this.column.group) || isNullOrUndefined(this.column.group.priority) ?
          null : this.column.group.priority
      };
      const aggFunc = isNullOrUndefined(this.column.aggFunc) ? null : this.column.aggFunc;
      const threshold = isNullOrUndefined(this.column.threshold) ? null : this.column.threshold;
      const width = isNullOrUndefined(this.column.width) ? null : this.column.width;
      const groupBy = isNullOrUndefined(this.column.groupBy) ? null : this.column.groupBy;
      const groupRange = isNullOrUndefined(this.column.groupRange) ? null : this.column.groupRange;
      this.form.setValue({title, visibility, group, aggFunc, threshold, width, groupBy, groupRange}, {emitEvent: false});
    }
    this.updateFormControl();
  }

  registerOnChange(fn: any) {
    this._propagateChange = fn;
  }

  registerOnTouched(fn: any) {
    // no op
  }

  createFormControl() {
    this.form = this._fb.group({
      title: null,
      visibility: false,
      group: this._fb.group({
        enable: false,
        priority: null
      }),
      aggFunc: null,
      threshold: null,
      width: null,
      groupBy: null,
      groupRange: null
    });
  }

  updateFormControl() {
    const group = this.form.get('group');
    const aggFunc = this.form.get('aggFunc');
    if (this.column && this.column.type === 'number') {
      aggFunc.enable({emitEvent: false});
      group.disable({emitEvent: false});
    } else if (this.column && this.column.type !== 'number') {
      aggFunc.disable({emitEvent: false});
      group.enable({emitEvent: false});
    } else {
      aggFunc.disable({emitEvent: false});
      group.disable({emitEvent: false});
    }
  }

  isGroup() {
    if (this.column && this.column.type !== 'datetime') {
      return false;
    }
    const groupCtr = this.form.get('group').get('enable').value;
    if (!groupCtr) {
      this.setDefaultValue('groupBy');
      this.setDefaultValue('groupRange');
    }
    this.isGroupByHour = groupCtr && this.form.get('groupBy').value === GroupOptions.Hour;
    if (!this.isGroupByHour) {
      this.setDefaultValue('groupRange');
    }
    return groupCtr;
  }

  validate(control: AbstractControl): { [key: string]: any } {
    const err = {
      required: true
    };

    if (this.column && this.column.type === 'datetime') {
      const isGroup = this.form.get('group').get('enable').value;
      const isGroupBy = this.form.get('groupBy').value;
      if (isGroup && isGroupBy === GroupOptions.Hour) {
        this._isPreviousValid = this.form.get('groupRange').value && this.form.valid ? null : err;
        return this._isPreviousValid;
      } else if (isGroup) {
        this._isPreviousValid = this.form.valid && isGroupBy ? null : err;
        return this._isPreviousValid;
      } else {
        this._isPreviousValid = null;
      }
    }

    return this.form.invalid || this._isPreviousValid ? err : null;
  }

  private setDefaultValue(property: string) {
    this.form.get(property).setValue(null, {emitEvent: false});
  }

  private _propagateChange = (_: any) => {
  }
}
