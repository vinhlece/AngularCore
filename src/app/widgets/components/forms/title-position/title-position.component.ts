import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';
import {TextAlignmentConst} from '../../../../dashboard/models/constants';

@Component({
  selector: 'app-title-position',
  templateUrl: './title-position.component.html',
  styleUrls: ['./title-position.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TitlePositionComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TitlePositionComponent),
      multi: true
    }
  ],
})
export class TitlePositionComponent implements ControlValueAccessor, OnInit, Validator {
  private _fb: FormBuilder;

  positionOption = TextAlignmentConst;
  form: FormGroup;

  @Input() required: boolean = false;

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  ngOnInit() {
    this.createForm();
    this.form.valueChanges.subscribe((value) => {
      this.propagateChange(value.type);
    });
  }

  writeValue(value): void {
    if (value) {
      this.form.setValue({type: value}, {emitEvent: false});
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  validate(c: AbstractControl): ValidationErrors | any {
    const err = {
      required: true
    };
    return this.form.invalid ? err : null;
  }

  private propagateChange = (_: any) => {
  };

  private createForm() {
    this.form = this._fb.group({
      type: [null]
    });
  }
}
