import {Component, forwardRef, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  AbstractControl, ControlValueAccessor, FormBuilder, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR,
  Validator
} from '@angular/forms';

@Component({
  selector: 'app-select-option-dialog',
  templateUrl: './select-option-dialog.component.html',
  styleUrls: ['./select-option-dialog.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectOptionDialogComponent),
      multi: true
    }
  ]
})
export class SelectOptionDialogComponent implements ControlValueAccessor, OnInit {
  private _dialogRef: MatDialogRef<SelectOptionDialogComponent>;

  private _fb: FormBuilder;
  form: FormGroup;
  data: any;

  constructor(dialogRef: MatDialogRef<SelectOptionDialogComponent>, @Inject(MAT_DIALOG_DATA) data: any, fb: FormBuilder) {
    this._dialogRef = dialogRef;
    this.data = data;
    this._fb = fb;
  }

  ngOnInit() {
    this.form = this._fb.group({
      options: []
    });
    this.form.valueChanges.subscribe((value) => {
      this.propagateChange(value);
    });
  }

  writeValue(value) {
    if (value) {
      this.form.setValue(value, {emitEvent: false});
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
    this._dialogRef.close(this.form.getRawValue().options);
  }

  private getControl(controlName: string): AbstractControl {
    return this.form.get(controlName);
  }

  private propagateChange = (_: any) => {
  };
}
