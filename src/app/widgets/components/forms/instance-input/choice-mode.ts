import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {distinctUntilChanged} from 'rxjs/operators';
import {CustomValidators} from '../../../utils/custom-validators';
import {ChoiceMode} from '../flexible-choice-input';

export class SingleChoiceMode implements ChoiceMode {
  private _form: FormGroup;
  private _fb: FormBuilder;

  configureControl(fb: FormBuilder, required: boolean): FormGroup {
    this._fb = fb;
    this._form = this._fb.group({
      values: this.createControl(null, required)
    });
    return this._form;
  }

  update(selectedOptions: string[], availableOptions: string[], required: boolean) {
    if (selectedOptions.length <= 0) {
      return;
    }
    this._form.setControl('values', this.createControl(selectedOptions[0], required));
  }

  valueChanges(emitter) {
    this._form.valueChanges
      .pipe(distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe((v) => {
        const value = this.getControl().value;
        emitter(value ? [value] : []);
      });
  }

  private createControl(value: string, required: boolean): AbstractControl {
    return this._fb.control(value, required ? Validators.required : null);
  }

  private getControl(): AbstractControl {
    return this._form.get('values');
  }
}

export class MultipleChoiceMode implements ChoiceMode {
  private _form: FormGroup;
  private _fb: FormBuilder;

  configureControl(fb: FormBuilder, required: boolean): FormGroup {
    this._fb = fb;
    this._form = this._fb.group({
      values: this.createControl([], required)
    });
    return this._form;
  }

  update(selectedOptions: string[], availableOptions: string[], required: boolean) {
    this._form.setControl('values', this.createControl(selectedOptions, required));
  }

  valueChanges(emitter) {
    this._form.valueChanges
      .pipe(distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe(() => {
        emitter(this.getControl().value);
      });
  }

  addValue(value: string | number) {
    // Don't add to values list if new value is all whitespace
    if (value === '') {
      return;
    }

    const valuesFormArray = this.getControl() as FormArray;

    // Check if new value already in the list or not, if not then add to values list
    const idx = valuesFormArray.value.findIndex(item => item === value);
    if (idx < 0) {
      valuesFormArray.push(this._fb.control(value));
    }
  }

  removeValue(value: any) {
    const valuesFormArray = this.getControl() as FormArray;
    const idx = valuesFormArray.value.findIndex((item: any) => item === value);
    valuesFormArray.removeAt(idx);
  }

  removeAll() {
    const valuesFormArray = this.getControl() as FormArray;
    while (valuesFormArray.length !== 0) {
      valuesFormArray.removeAt(0);
    }
  }

  private createControl(values: string[], required: boolean): AbstractControl {
    return this._fb.array(values, required ? CustomValidators.requiredNotEmpty : null);
  }

  private getControl(): AbstractControl {
    return this._form.get('values');
  }
}
