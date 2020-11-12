import {AbstractControl, ValidationErrors} from '@angular/forms';

export class CustomValidators {
  static requiredNotEmpty(control: AbstractControl): ValidationErrors | null {
    return control.value.length > 0
      ? null
      : {requiredNotEmpty: true};
  }

  static requiredSelected(control: AbstractControl): ValidationErrors | null {
    return control.value.find((selected: boolean) => selected)
      ? null
      : {requiredSelected: true};
  }
}
