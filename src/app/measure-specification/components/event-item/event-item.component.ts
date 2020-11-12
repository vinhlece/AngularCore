import { Component, EventEmitter, forwardRef, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, ValidationErrors, Validators } from '@angular/forms';
import { DurationType, MeasureMetricTypes } from '../../models/enums';
import { MeasureEvent } from '../../models/index';
import { DurationTypeLocale } from '../../models/constants';

@Component({
  selector: 'app-event-item',
  templateUrl: './event-item.component.html',
  styleUrls: ['./event-item.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EventItemComponent),
      multi: true
    }
  ],
})
export class EventItemComponent implements OnInit, OnChanges {
  private _fb: FormBuilder;

  readonly measureMetricTypes = MeasureMetricTypes;
  form: FormGroup;
  durationTypes = DurationTypeLocale;

  @Input() eventTag: MeasureEvent;
  @Input() selectedMetricType: MeasureMetricTypes;
  @Output() onDelete: EventEmitter<string> = new EventEmitter();

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  ngOnChanges(changes: SimpleChanges) {
    const newMetricType = changes['selectedMetricType'];
    if (newMetricType && newMetricType.currentValue !== newMetricType.previousValue && this.form) {
      this.form.get('action').setValue(this.selectedMetricType === MeasureMetricTypes.Duration ? DurationType.Increment : null);
    }
  }

  ngOnInit() {
    this.createForm();
    this.form.valueChanges.subscribe((value) => {
      this._propagateChange(value);
    });
  }

  handleDelete() {
    this.onDelete.emit(this.form.get('eventName').value);
  }

  writeValue(value): void {
    if (value) {
      this.form.get('eventName').setValue(value.eventName, { emitEvent: false });
      this.form.get('field').setValue(value.field, { emitEvent: false });
      this.form.get('action').setValue(value.action, { emitEvent: false });
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

  private createForm() {
    this.form = this._fb.group({
      eventName: this._fb.control(null, Validators.required),
      field: this._fb.control(null),
      action: this._fb.control(null, Validators.required),
    });
  }
}
