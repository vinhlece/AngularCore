import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {distinctUntilChanged} from 'rxjs/operators';
import {isNullOrUndefined} from 'util';
import {CustomValidators} from '../../../utils/custom-validators';
import {ChoicePackageMode} from '../flexible-choice-input';
import {getSelectionName} from '../../../utils/functions';

export class SingleChoicePackageMode implements ChoicePackageMode {
  private _form: FormGroup;
  private _fb: FormBuilder;
  private _options: any[];

  configureControl(fb: FormBuilder, required: boolean, options: any[], showAllData?: boolean): FormGroup {
    this._fb = fb;

    this._form = this._fb.group({
      ...options.reduce((acc, item) => {
          acc[getSelectionName(item.packageName)] = this.createControl(null, required);
          return acc;
        }, {}),
      showAllData: this._fb.control(showAllData)
    });

    return this._form;
  }

  update(selectedOptions: any, availableOptions: any, required: boolean) {
    this._options = availableOptions;
    selectedOptions.forEach(option => {
      const packageObj = availableOptions.find(i => i.packageName === option.packageName);
      if (packageObj && option.values && option.values.length > 0) {
        const value = packageObj.values.find(v => v === option.values[0]);
        if (value) {
          this._form.get(getSelectionName(option.packageName)).patchValue(value, {emitEvent: false});
        }
      }
    });
  }

  valueChanges(emitter) {
    this._form.valueChanges
      .pipe(distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe(() => {
        const checked = this._options.reduce((acc, item) => {
          const value = this._form.get(getSelectionName(item.packageName)).value;
          if (value) {
            acc.push({packageName: item.packageName, values: [value]});
          }
          return acc;
        }, []);
        const showAllData = this._form.get('showAllData').value;
        const newData = {
          showAllData,
          checked
        };
        emitter(newData);
      });
  }

  private createControl(value: string, required: boolean): AbstractControl {
    return this._fb.control(value, required ? Validators.required : null);
  }
}

export class MultipleChoicePackageMode implements ChoicePackageMode {
  private _form: FormGroup;
  private _fb: FormBuilder;
  private _options: any[];

  configureControl(fb: FormBuilder, required: boolean, options: any[], showAllData: boolean): FormGroup {
    this._fb = fb;

    this._form = this._fb.group({
        ...options.reduce((acc, item) => {
          acc[getSelectionName(item.packageName)] = this.createControl(item.values.map(i => false), required);
          return acc;
        }, {}),
        showAllData: this._fb.control(showAllData)
      });

    return this._form;
  }

  update(selectedOptions: any[], availableOptions: any[], required: boolean) {
    this._options = availableOptions;
    selectedOptions.forEach(option => {
      const packageObj = availableOptions.find(i => i.packageName === option.packageName);
      if (packageObj && option.values) {
        const values = packageObj.values.map(obj => option.values.indexOf(obj) >= 0);
        this._form.get(getSelectionName(option.packageName)).patchValue(values, {emitEvent: false});
      }
    });
  }

  valueChanges(emitter) {
    this._form.valueChanges
      .pipe(distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe(() => {
        const checked = this._options.reduce((acc, item) => {
          const value = this._form.get(getSelectionName(item.packageName)).value;
          if (value && value.length > 0) {
            const data = item.values.filter((name: string, idx: number) => value[idx]);
            if (data.length > 0) {
              acc.push({packageName: item.packageName, values: data});
            }
          }
          return acc;
        }, []);
        const showAllData = this._form.get('showAllData').value;
        const newData = {
          showAllData,
          checked
        };
        emitter(newData);
      });
  }

  private createControl(values: boolean[], required: boolean): AbstractControl {
    return this._fb.array(values, required ? CustomValidators.requiredSelected : null);
  }
}

