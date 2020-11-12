import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR} from '@angular/forms';
import {isNullOrUndefined} from '../../../common/utils/function';
import {WidgetMode, WidgetType} from '../../../widgets/constants/widget-types';

@Component({
  selector: 'app-legend-configuration',
  templateUrl: './legend-configuration.component.html',
  styleUrls: ['./legend-configuration.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LegendConfigurationComponent),
      multi: true
    }
  ]
})
export class LegendConfigurationComponent implements OnInit {
  private _fb: FormBuilder;
  private _config: { [key: string]: any } = {};
  newForm: FormGroup;
  @Input() formTitle;
  @Input() inputData;
  @Output() saveHandler = new EventEmitter<any>();

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  ngOnInit() {
    this.createForm();
    this.newForm.valueChanges.subscribe((value) => {
      this.propagateChange(value);
    });
  }

  private createForm() {
    Object.keys(this.inputData.params).forEach((controlName: string) => {
      this.addConfig(controlName, this.inputData.params[controlName]);
    });
    this.newForm = this._fb.group(this._config);
  }

  private addConfig(control: string, controlValue) {
    this._config[control] = this._fb.control(controlValue);
  }

  getLegendItem(legendOptions) {
    const {measureName, instance} = this.inputData.user;
    return legendOptions.find(item => item.instance === instance && item.measure === measureName);
  }
  getControlValue(ctrlName: string) {
    return this.newForm.get(ctrlName).value;
  }

  getWidgetData() {
    console.log(this.newForm.getRawValue());
    const newWidget = this.inputData.widget;
    newWidget['legendOptions'] = this.getLegendOptions();
    if (newWidget.type === WidgetType.Line) {
      newWidget['hideKPI'] = {
        lower: this.getControlValue('lower'),
        upper: this.getControlValue('upper')
      };
    }
    return newWidget;
  }


  getLegendOptions() {
    const {measureName, instance} = this.inputData.user;
    const widget = this.inputData.widget;
    let data = [];
    if (widget.legendOptions && widget.legendOptions.length > 0) {
      data = widget.legendOptions;
    }
    const existItem = this.getLegendItem(data);
    const formValues = Object.keys(this.inputData.params).reduce((acc, ctrlName) => {
      if (ctrlName !== 'lower' && ctrlName !== 'upper') {
        acc[ctrlName] = this.getControlValue(ctrlName);
      }
      if (existItem) {
        existItem[ctrlName] = acc[ctrlName];
      }
      return acc;
    }, {});
    const newItem = {
      instance,
      measure: measureName,
      ...formValues
    };
    if (existItem) {
      return data;
    } else if (data.length > 0) {
      data.push(newItem);
    } else {
      return [newItem];
    }
    return data;
  }

  isMeasureMode() {
    return this.inputData.widget.mode && this.inputData.widget.mode.value === WidgetMode.Measures;
  }

  writeValue(value) {
    if (value) {
      const data = {
        ...value,
      };
      this.newForm.setValue(data, {emitEvent: false});
    }
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) {
    // no op
  }

  onSave() {
    const newWidget = this.getWidgetData();
    this.saveHandler.emit(newWidget);
  }

  onCancel() {
    this.saveHandler.emit(null);
  }

  checkControl(control: string) {
    return !isNullOrUndefined(this.inputData.params[control]);
  }

  private propagateChange = (_: any) => {
  };
}
