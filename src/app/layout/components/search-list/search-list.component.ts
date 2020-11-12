import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {
  AbstractControl, FormArray, FormBuilder, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors,
  Validators
} from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchListComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SearchListComponent),
      multi: true
    }
  ]
})

export class SearchListComponent implements OnInit {
  private _fb: FormBuilder;

  @Input() placeHolder: string;
  @Input() required: boolean = true;

  @Output() onEnter: EventEmitter<string[]> = new EventEmitter();

  form: FormGroup;
  searchList: string[] = [];

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  ngOnInit() {
    this.createForm();
    this.form.valueChanges.subscribe((value) => {
      this._propagateChange([value.values]);
    });
  }

  writeValue(value): void {
    if (value) {
      this.form.get('values').setValue([...value], {emitEvent: false});
    }
  }

  registerOnChange(fn: any): void {
    this._propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  validate(c: AbstractControl): ValidationErrors | any {
    const err = {
      required: true
    };
    return this.form.invalid ? err : null;
  }

  handleAddSearch(event: MatChipInputEvent) {
    if (event.value) {
      const value = event.value;
      if (this.searchList.indexOf(value) >= 0) { return; }
      this.searchList.push(value);
      (this.form.get('values') as FormArray).push(this._fb.control(value));
    }
    event.input.value = '';
  }

  handleRemoveSearch(value) {
    const index = this.searchList.indexOf(value);
    if (index >= 0) {
      this.searchList.splice(index, 1);
      this._propagateChange([this.searchList]);
    }
  }

  handleRemoveAll() {
    this.searchList = [];
    this._propagateChange(null);
  }

  private _propagateChange = (_: any) => {
  };

  private createForm() {
    const validatorFns = this.required ? [Validators.required, (c) => this.validateLists(c)] : [];
    this.form = this._fb.group({
      values: this._fb.array([], validatorFns)
    });
  }

  private validateLists(c: AbstractControl) {
    return this.searchList.length === 0 ? {notExisted: true} : null;
  }
}
