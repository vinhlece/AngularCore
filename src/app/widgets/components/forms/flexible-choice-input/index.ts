import {FormBuilder, FormGroup} from '@angular/forms';

export interface ChoiceMode {
  configureControl(fb: FormBuilder, required: boolean): FormGroup;

  update(selectedOptions: string[], availableOptions: string[], required: boolean);

  valueChanges(emitter);
}

export interface ChoicePackageMode {
  configureControl(fb: FormBuilder, required: boolean, options: any, showAllData?: boolean): FormGroup;

  update(selectedOptions: any, availableOptions: any, required: boolean);

  valueChanges(emitter);
}

export interface ChoiceInstanceMode extends ChoicePackageMode {
  add(selectedOptions: any, availableOptions: any, required: boolean);
}
