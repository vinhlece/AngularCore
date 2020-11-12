import {Component, forwardRef, Input, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs/index';
import {select, Store} from '@ngrx/store';
import * as fromEntities from '../../../reducers/index';
import {
  AbstractControl, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR,
  ValidationErrors
} from '@angular/forms';

@Component({
  selector: 'app-dimension-filter-container',
  templateUrl: './dimension-filter.container.html',
  styleUrls: ['./dimension-filter.container.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DimensionFilterContainer),
      multi: true
    }
  ],
})
export class DimensionFilterContainer implements OnInit {
  instances$: Observable<string[]>;
  private _store: Store<fromEntities.State>;
  form: FormGroup;
  @Input() customInstances: any;
  @Input() selections: any;
  @Input() dimension: any;
  @Input() mode: string;
  @Input() inputValidators: Function[];
  @ViewChild('dimensionFilter') dimensionFilter;

  constructor(store: Store<fromEntities.State>) {
    this._store = store;
  }

  ngOnInit() {
    this.form = new FormGroup({
        'values': new FormControl(this.customInstances),
      }
    );
    this.form.valueChanges.subscribe((value) => {
      this._propagateChange(value);
    });
    this.instances$ = this._store.pipe(select(fromEntities.getAllInstances));
  }

  writeValue(value): void {
    if (value) {
      const data = {
        ...value,
      };
      this.form.get('values').setValue(data, {emitEvent: false});
    }
  }

  registerOnChange(fn: any): void {
    this._propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  validate(c: AbstractControl): ValidationErrors | any {
    const err = {
      required: true
    };
    return this.form.invalid ? err : null;
  }

  private _propagateChange = (_: any) => {
  };

  triggerToggleAddInstance() {
    this.dimensionFilter.toggleInput();
  }
}
