import { Component, forwardRef, Input, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'app-stack-settings',
  styleUrls: ['./stack-settings.component.scss'],
  templateUrl: './stack-settings.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StackSettingsComponent),
      multi: true
    }
  ]
})
export class StackSettingsComponent implements OnInit, ControlValueAccessor {
  private _fb: FormBuilder;
  form: FormGroup;

  @Input() values: string[];
  @Input() stackItems: string[];

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  ngOnInit() {
    this.form = this._fb.group({
      selectedStackItems: null,
    });
    this.form.valueChanges.subscribe((value) => {
      this._propagateChange(value.selectedStackItems);
    });
  }

  writeValue(selectedStackItems) {
    if (selectedStackItems) {
      this.form.patchValue({ selectedStackItems }, { emitEvent: false });
    }
  }

  registerOnChange(fn: any) {
    this._propagateChange = fn;
  }

  registerOnTouched(fn: any) {
    // no op
  }

  private _propagateChange = (_: any) => {
  }

  isAddedItemSelected(item) {
    const isSelected = this.stackItems.find(stack => stack === item);
    return isSelected ? true : false;
  }
}
