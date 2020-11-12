import { Input } from '@angular/core';
import * as _ from 'lodash';

export abstract class FlexibleChoicePackage {
  static readonly SINGLE = 'single';
  static readonly MULTIPLE = 'multiple';

  private _mode: string;
  private _options: any[];
  private _selectedOptions: any[];
  private _previousOptions: any[];

  @Input() filterPackage: string;
  /**
   * Selection mode, accept 2 options: single or multiple, each option has different display:
   * "single" mode: dropdown menu
   * "multiple" mode: a list of checkboxes
   */
  @Input()
  get mode(): string {
    return this._mode;
  }

  set mode(value: string) {
    if (!value || (!FlexibleChoicePackage.isSingleChoicePackageMode(value) && !FlexibleChoicePackage.isMultipleChoicesPackageMode(value))) {
      throw new Error('Selection mode must be provided (single or multiple)');
    }
    this._mode = value;
  }

  /** Available values which can be choosen by the user */
  @Input()
  get options(): any[] {
    return this._options;
  }

  set options(values: any[]) {
    if (!values) {
      throw new Error('Options must be provided');
    }
    this._previousOptions = this._options;
    this._options = values;
    this.originalOptions = _.cloneDeep(values);
  }

  originalOptions: any[];

  /** Selected options, which can be set from parent form group */
  get selectedOptions(): any[] {
    return this._selectedOptions;
  }

  set selectedOptions(value: any[]) {
    if (value) {
      this._selectedOptions = value;
    } else {
      this._selectedOptions = [];
    }
  }

  constructor() {
    // Prevent selected options being null or undefined
    this.selectedOptions = this.selectedOptions;
  }

  static isSingleChoicePackageMode(mode: string): boolean {
    return mode === FlexibleChoicePackage.SINGLE;
  }

  static isMultipleChoicesPackageMode(mode: string): boolean {
    return mode === FlexibleChoicePackage.MULTIPLE;
  }

  /** Check if options were changed or not by comparing current options to the previous options */
  isOptionsChanged(): boolean {
    return !_.isEqual(this._options, this._previousOptions);
  }

  updateOptions(newOptions: any[]) {
    this._options = newOptions;
  }
}