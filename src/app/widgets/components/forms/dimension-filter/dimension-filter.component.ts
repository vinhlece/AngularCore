import { Component, OnInit, Input, forwardRef, ElementRef, ViewChild } from '@angular/core';
import {
  AbstractControl, FormArray, FormBuilder, FormGroup, NG_VALUE_ACCESSOR,
  ValidationErrors
} from '@angular/forms';
import {ChoiceInstanceMode} from '../flexible-choice-input/index';
import { FlexibleChoiceInput } from '../flexible-choice-input/flexible-choice-input';
import { MultipleInstanceChoiceMode, SingleInstanceChoiceMode } from './instance-choice-mode';
import * as _ from 'lodash';

@Component({
  selector: 'app-dimension-filter',
  templateUrl: './dimension-filter.component.html',
  styleUrls: ['./dimension-filter.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DimensionFilterComponent),
      multi: true
    }
  ],
})
export class DimensionFilterComponent implements OnInit {

  private _fb: FormBuilder;
  private _choiceMode: ChoiceInstanceMode;
  private _isRequired: boolean = false;
  private _searchText: string;

  @Input() instances: string[];
  @Input() customInstances: any = [];
  @Input() mode: string;
  @Input() selections: any;
  @Input() dimension: any;
  @Input() inputValidators: Function[];

  filterInstances: {[type: string]: string[]};
  displayInstances: string[];
  addInstance = false;
  form: FormGroup;
  selectedSystemOptions: any;
  showError = false;
  error = 'Please input with correct format.';

  @ViewChild('inputDimension') addInput: ElementRef;

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  ngOnInit() {
    if (this.selections) {
      const {systemSelections, customSelections} = this.selections;
      if (systemSelections && systemSelections.length > 0) {
        this.instances = _.union(this.instances, systemSelections);
      }
      if (customSelections && customSelections.length > 0) {
        this.customInstances = _.union(this.customInstances, customSelections).sort((a, b) => a.localeCompare(b));
      }
    }
    this.displayInstances = _.difference(this.instances, this.customInstances).sort((a, b) => a.localeCompare(b));
    this.backupInstances();
    if (FlexibleChoiceInput.isSingleChoiceMode(this.mode)) {
      this._choiceMode = new SingleInstanceChoiceMode();
    } else if (FlexibleChoiceInput.isMultipleChoicesMode(this.mode)) {
      this._choiceMode = new MultipleInstanceChoiceMode();
    }

    const allOptions = {system: this.displayInstances, custom: this.customInstances};
    this.form = this._choiceMode.configureControl(this._fb, this._isRequired, allOptions);
    this._choiceMode.valueChanges((value: any) => {
      this.selectedSystemOptions = value;
      this._propagateChange(this.selectedSystemOptions);
    });
  }

  writeValue(value: any) {
    this.selectedSystemOptions = value;
    const allOptions = {system: this.displayInstances, custom: this.customInstances};
    this._choiceMode.update(this.selectedSystemOptions, allOptions, this._isRequired);
  }

  registerOnChange(fn: any) {
    this._propagateChange = fn;
  }

  registerOnTouched(fn: any) {
    // no op
  }

  validate(control: AbstractControl): ValidationErrors {
    return this.form.invalid ? { hasError: true } : null;
  }

  updateRadioGroupSystem() {
    this.form.get('customSelections').reset();
  }

  updateRadioGroupCustom() {
    this.form.get('systemSelections').reset();
  }

  isSingleMode() {
    return this.mode === FlexibleChoiceInput.SINGLE;
  }

  onSearchChange(event: any) {
    this._searchText = event.target.value.trim();
    if (this._searchText) {
      const reg: RegExp = new RegExp(this._searchText, 'i');
      this.filterInstances = {
        system: this.displayInstances.filter(i => reg.test(i)),
        custom: this.customInstances.filter(i => reg.test(i))
      };
    } else {
      this.backupInstances();
    }
  }

  handleAddInstance(value) {
    if (this.validateInput(value) && this.checkExistedValue(value)) {
      this.customInstances = [...this.customInstances, value].sort((a, b) => a.localeCompare(b));
      this.filterInstances.custom = [...this.filterInstances.custom, value].sort((a, b) => a.localeCompare(b));
      this._choiceMode.add(value, null, this._isRequired);
      this.clearInput();
      if (this.isSingleMode()) {
        this.updateRadioGroupCustom();
      }
    } else {
      this.showError = true;
    }
  }

  checkExistedValue(value): boolean {
    if (this.customInstances.find(item => item === value)) {
      this.error = 'This instance already exist';
      return false;
    }
    this.error = 'Please input with correct format.';
    return true;
  }

  checkExisted(type: string, instance: string) {
    if (this._searchText) {
      const isExisted = this.filterInstances[type].length > 0 && this.filterInstances[type].indexOf(instance) >= 0;
      if (!isExisted) {
        return {display: 'none'};
      }
    }
    return {display: 'block'};
  }

  clearInput() {
    this.addInstance = false;
    this.showError = false;
    this.addInput.nativeElement.value = '';
  }

  keyEnter(event: KeyboardEvent, value) {
    event.preventDefault();
    this.handleAddInstance(value);
  }

  toggleInput() {
    this.addInstance = true;

    setTimeout(() => {
      this.addInput.nativeElement.focus();
    }, 100);
  }

  checkAll(event) {
    (this.form.get('systemSelections') as FormArray).controls.map(value => value.setValue(event.checked));
  }

  private backupInstances(): void {
    this.filterInstances = {
      system: [...this.displayInstances],
      custom: [...this.customInstances]
    };
  }

  private validateInput(value: string): boolean {
    return this.inputValidators ? this.validateWithValidators(value) : true;
  }

  private validateWithValidators(value: string): boolean {
    return this.inputValidators.reduce((isValid: boolean, validator) => {
      return isValid && validator(this.form.value, value);
    }, true);
  }

  private _propagateChange = (_: any) => {
  };
}

