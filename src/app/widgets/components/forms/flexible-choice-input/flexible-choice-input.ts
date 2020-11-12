import {Input} from '@angular/core';
import * as _ from 'lodash';

export abstract class FlexibleChoiceInput {
  static readonly SINGLE = 'single';
  static readonly MULTIPLE = 'multiple';

  private _mode: string;
  private _options: string[];
  private _selectedOptions: string[];
  private _previousOptions: string[];


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
    if (!value || (!FlexibleChoiceInput.isSingleChoiceMode(value) && !FlexibleChoiceInput.isMultipleChoicesMode(value))) {
      throw new Error('Selection mode must be provided (single or multiple)');
    }
    this._mode = value;
  }

  /** Available values which can be choosen by the user */
  @Input()
  get options(): string[] {
    return this._options;
  }

  set options(values: string[]) {
    if (!values) {
      throw new Error('Options must be provided');
    }
    this._previousOptions = this._options;
    this._options = values;
  }

  /** Selected options, which can be set from parent form group */
  get selectedOptions(): string[] {
    return this._selectedOptions;
  }

  set selectedOptions(value: string[]) {
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

  static isSingleChoiceMode(mode: string): boolean {
    return mode === FlexibleChoiceInput.SINGLE;
  }

  static isMultipleChoicesMode(mode: string): boolean {
    return mode === FlexibleChoiceInput.MULTIPLE;
  }

  /** Check if options were changed or not by comparing current options to the previous options */
  isOptionsChanged(): boolean {
    return !_.isEqual(this._options, this._previousOptions);
  }
}
