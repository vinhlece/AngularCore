import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {
  AbstractControl, FormBuilder, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors
} from '@angular/forms';
import {ChoicePackageMode} from '../flexible-choice-input/index';
import {MultipleChoicePackageMode, SingleChoicePackageMode} from './choice-package-mode';
import {FlexibleChoicePackage} from '../flexible-choice-input/flexible-choice-package';
import {getSelectionName} from '../../../utils/functions';

@Component({
  selector: 'app-item-filter',
  templateUrl: './item-filter.component.html',
  styleUrls: ['./item-filter.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ItemFilterComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ItemFilterComponent),
      multi: true
    }
  ]
})
export class ItemFilterComponent extends FlexibleChoicePackage implements OnInit {

  private _fb: FormBuilder;
  private _choiceMode: ChoicePackageMode;
  private _seachText: string;

  @Input() showAllData;
  @Input() type: string;

  form: FormGroup;
  required = false;

  constructor(fb: FormBuilder) {
    super();
    this._fb = fb;
  }

  ngOnInit() {
    if (FlexibleChoicePackage.isSingleChoicePackageMode(this.mode)) {
      this._choiceMode = new SingleChoicePackageMode();
    } else if (FlexibleChoicePackage.isMultipleChoicesPackageMode(this.mode)) {
      this._choiceMode = new MultipleChoicePackageMode();
    }
    const showAllData = this.showAllData ? this.showAllData.value : null
    this.form = this._choiceMode.configureControl(this._fb, this.required, this.options, showAllData);
    this._choiceMode.valueChanges((value) => {
      this.selectedOptions = value;
      this._propagateChange(this.selectedOptions);
    });
  }

  getSelectionName(packageObj: any) {
    return getSelectionName(packageObj.packageName);
  }

  onSearchChange(event: any) {
    this._seachText = event.target.value.trim();
    let filterData = null;
    if (this._seachText) {
      const reg: RegExp = new RegExp(this._seachText, 'i');
      filterData = this.originalOptions.map(item => ({...item, values: item.values.filter(i => reg.test(i))}))
        .filter(item => item.values.length > 0);
    } else {
      filterData = this.originalOptions;
    }
    this.updateOptions(filterData);
  }

  checkExisted(instance: string) {
    if (this._seachText) {
      const isExisted = this.options.length > 0 && this.options.reduce((acc, item) => {
        return acc && item.values.indexOf(instance) >= 0;
      }, true);
      if (!isExisted) {
        return {display: 'none'};
      }
    }
    return {display: 'block'};
  }

  writeValue(value: any) {
    this.selectedOptions = value;
    this._choiceMode.update(this.selectedOptions, this.options, this.required);
  }

  registerOnChange(fn: any) {
    this._propagateChange = fn;
  }

  registerOnTouched(fn: any) {
    // no op
  }

  validate(control: AbstractControl): ValidationErrors {
    return this.form.invalid ? {hasError: true} : null;
  }

  private _propagateChange = (_) => {
  }
}
