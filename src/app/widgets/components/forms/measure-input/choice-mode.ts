import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {distinctUntilChanged} from 'rxjs/operators';
import {isNullOrUndefined} from 'util';
import {CustomValidators} from '../../../utils/custom-validators';
import {ChoiceMode} from '../flexible-choice-input';

export class SingleChoiceMode implements ChoiceMode {
  private _form: FormGroup;
  private _fb: FormBuilder;

  configureControl(fb: FormBuilder, required: boolean): FormGroup {
    this._fb = fb;
    this._form = this._fb.group({
      selections: this.createControl(null, required)
    });
    return this._form;
  }

  update(selectedOptions: string[], availableOptions: string[], required: boolean) {
    if (selectedOptions.length <= 0) {
      return;
    }
    this._form.setControl('selections', this.createControl(selectedOptions[0], required));
  }

  valueChanges(emitter) {
    this._form.valueChanges
      .pipe(distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe(() => {
        const value = this._form.get('selections').value;
        emitter([value]);
      });
  }

  private createControl(value: string, required: boolean): AbstractControl {
    return this._fb.control(value, required ? Validators.required : null);
  }
}

export class MultipleChoiceMode implements ChoiceMode {
  private _form: FormGroup;
  private _fb: FormBuilder;
  private _options: string[];

  configureControl(fb: FormBuilder, required: boolean): FormGroup {
    this._fb = fb;

    this._form = this._fb.group({
      selections: this.createControl([], required)
    });

    return this._form;
  }

  update(selectedOptions: string[], availableOptions: string[], required: boolean) {
    this._options = availableOptions;

    const values = availableOptions.map((measureName: string) => {
      return !isNullOrUndefined(selectedOptions.find(item => item === measureName));
    });

    this._form.setControl('selections', this.createControl(values, required));
  }

  valueChanges(emitter) {
    this._form.valueChanges
      .pipe(distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe(() => {
        const value = this._form.get('selections').value;
        emitter(this._options.filter((name: string, idx: number) => value[idx]));
      });
  }

  private createControl(values: boolean[], required: boolean): AbstractControl {
    return this._fb.array(values, required ? CustomValidators.requiredSelected : null);
  }
}
