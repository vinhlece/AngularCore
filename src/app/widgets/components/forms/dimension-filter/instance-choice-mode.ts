import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {distinctUntilChanged} from 'rxjs/operators';
import {isNullOrUndefined} from 'util';
import {CustomValidators} from '../../../utils/custom-validators';
import {ChoiceInstanceMode} from '../flexible-choice-input';

export class SingleInstanceChoiceMode implements ChoiceInstanceMode {
  private _form: FormGroup;
  private _fb: FormBuilder;

  configureControl(fb: FormBuilder, required: boolean, options: any[]): FormGroup {
    this._fb = fb;
    this._form = this._fb.group({
      systemSelections: this.createControl(null, required),
      customSelections: this.createControl(null, required)
    });
    return this._form;
  }

  update(selectedOptions: any, availableOptions: any, required: boolean) {
    const {systemSelections, customSelections} = selectedOptions;
    if (systemSelections && systemSelections.length > 0) {
      this._form.get('systemSelections').patchValue(systemSelections[0], {emitEvent: false});
    }
    if (customSelections && customSelections.length > 0) {
      this._form.get('customSelections').patchValue(customSelections[0], {emitEvent: false});
    }
  }

  add(selectedOptions: any, availableOptions: any, required: boolean) {
    this._form.get('customSelections').patchValue(selectedOptions);
  }

  valueChanges(emitter) {
    this._form.valueChanges
      .pipe(distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe(() => {
        const systemValue = this._form.get('systemSelections').value;
        const customValue = this._form.get('customSelections').value;
        emitter({systemSelections: systemValue ? [systemValue] : [], customSelections: customValue ? [customValue] : []});
      });
  }

  private createControl(value: string, required: boolean): AbstractControl {
    return this._fb.control(value, required ? Validators.required : null);
  }
}

export class MultipleInstanceChoiceMode implements ChoiceInstanceMode {
  private _form: FormGroup;
  private _fb: FormBuilder;
  private _options: any;

  configureControl(fb: FormBuilder, required: boolean, options: any): FormGroup {
    this._fb = fb;

    this._form = this._fb.group({
      systemSelections: this.createControl([], required),
      customSelections: this.createControl([], required)
    });

    return this._form;
  }

  update(selectedOptions: any, availableOptions: any, required: boolean) {
    this._options = availableOptions;
    const {systemSelections, customSelections} = selectedOptions;
    const {system, custom} = availableOptions;
    const values = (options: string[], selected: string[]) => options.map((name: string) => {
      return !isNullOrUndefined(selected.find(item => item === name));
    });
    this._form.setControl('systemSelections', this.createControl(values(system, systemSelections), required));
    this._form.setControl('customSelections', this.createControl(values(custom, customSelections), required));
  }

  add(selectedOptions: any, availableOptions: any, required: boolean) {
    const values = this._form.get('customSelections').value;
    values.push(true);
    this._options.custom.push(selectedOptions);
    this._form.setControl('customSelections', this.createControl(values, required));
  }

  valueChanges(emitter) {
    this._form.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(() => {
        const systemValue = this._form.get('systemSelections').value;
        const customValue = this._form.get('customSelections').value;
        const getValue = (options, selected) => options.filter((name: string, idx: number) => idx < selected.length && selected[idx]);
        emitter({systemSelections: getValue(this._options.system, systemValue),
          customSelections: getValue(this._options.custom, customValue)});
      });
  }

  private createControl(values: boolean[], required: boolean): AbstractControl {
    return this._fb.array(values, required ? CustomValidators.requiredSelected : null);
  }
}
