import {ChangeDetectionStrategy, Component, forwardRef, OnInit} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR} from '@angular/forms';
import {SankeyNode} from '../../../../models';

@Component({
  selector: 'app-sankey-node',
  templateUrl: './sankey-node.component.html',
  styleUrls: ['./sankey-node.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SankeyNodeComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SankeyNodeComponent implements OnInit, ControlValueAccessor {
  private _fb: FormBuilder;

  form: FormGroup;

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  ngOnInit() {
    this.form = this._fb.group({
      id: null,
      column: null
    });
    this.form.valueChanges.subscribe((value) => {
      this._propagateChange(value);
    });
  }

  writeValue(value: SankeyNode) {
    if (value) {
      this.form.setValue(value, {emitEvent: false});
    }
  }

  registerOnChange(fn: any) {
    this._propagateChange = fn;
  }

  registerOnTouched(fn: any) {
    // no op
  }

  private _propagateChange = (_: any) => {
    // no op
  };
}
