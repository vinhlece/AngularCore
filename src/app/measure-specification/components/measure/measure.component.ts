import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {
  AbstractControl, FormBuilder, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors,
  Validators
} from '@angular/forms';
import {DurationType, MeasureMetricTypes} from '../../models/enums'
import {EventTag, MeasureEvent} from '../../models/index';
import {WidgetWindow} from '../../../widgets/models/index';

@Component({
  selector: 'app-measure',
  templateUrl: './measure.component.html',
  styleUrls: ['./measure.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MeasureComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MeasureComponent),
      multi: true
    }
  ]
})
export class MeasureComponent implements OnInit {
  private _fb: FormBuilder;
  private _windows: WidgetWindow[];

  readonly measureMetricTypes = MeasureMetricTypes;
  form: FormGroup;
  eventTags: MeasureEvent[] = [];
  selectedMetricType: MeasureMetricTypes;
  displayWindows: string[];
  @Input() allEventTags: EventTag[] = [];
  @Input() packages: any;
  @Input()
  get windows(): WidgetWindow[] {
    return this._windows;
  }
  set windows(data: WidgetWindow[]) {
    this._windows = data;
    this.displayWindows = data.map(item => [item.windowType, item.window].filter(w => w).join(' - '));
  }

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  ngOnInit() {
    this.createForm();
    this.form.valueChanges.subscribe((value) => {
      this._propagateChange(this.standardizedValue(value));
    });
  }

  writeValue(value): void {
    if (value) {
      this.form.get('events').setValue(value.events, {emitEvent: false});
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

  handleAddMetricType(type: MeasureMetricTypes) {
    this.selectedMetricType = type;
    this.form.get('processorType').setValue(type.toString());
  }

  handleDeleteEventTag(name: string) {
    this.eventTags = this.eventTags.filter(item => item.eventName !== name);
    this.form.setControl('events', this.createArrayControl());
  }

  getEventsName() {
    return this.allEventTags.map(event => event.name);
  }

  getPackagesName() {
    if (this.packages) {
      return this.packages.map(p => p.dimensions);
    }
  }

  handleAddEvent(event: string) {
    if (this.eventTags.find(tag => tag.eventName === event)) {
      return;
    }
    const action = this.selectedMetricType === MeasureMetricTypes.Duration ? DurationType.Increment : null;
    this.eventTags.push({eventName: event, action, field: null});
    this.form.setControl('events', this.createArrayControl());
  }

  private _propagateChange = (_: any) => {
  };

  private createForm() {
    this.form = this._fb.group({
      measureName: this.createControl([Validators.required]),
      processorType: this.createControl([Validators.required]),
      events: this.createArrayControl(),
      dimensions: this.createControl([Validators.required]),
      packages: this.createControl(),
      measureWindows: this.createControl(),
      correlationIdentifiers: this.createControl()
    });
  }

  private standardizedValue(value): any {
    const data = {...value};
    if (!data.measureWindows) {
      data.measureWindows = [{windowType: 'INSTANTANEOUS', window: null}];
    } else {
      const index = this.displayWindows.findIndex(item => item === data.measureWindows);
      if (index >= 0) {
        data.measureWindows = [{windowType: this.windows[index].windowType, window: this.windows[index].window}];
      }
    }
    if (data.packages) {
      data.packages = [data.packages];
    }
    return data;
  }

  private createControl(validatorFns: any = null): AbstractControl {
    return this._fb.control(null, validatorFns);
  }

  private createArrayControl(): AbstractControl {
    return this._fb.array(this.eventTags, [(c) => this.validateEvents(c)]);
  }

  private validateEvents(c: AbstractControl) {
    return this.eventTags.length === 0 ? {notExisted: true} : null;
  }
}
