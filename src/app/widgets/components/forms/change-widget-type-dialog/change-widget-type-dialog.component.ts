import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FormControl, FormGroup} from '@angular/forms';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'app-change-widget-type-dialog',
  templateUrl: './change-widget-type-dialog.component.html',
  styleUrls: ['./change-widget-type-dialog.component.scss']
})
export class ChangeWidgetTypeDialogComponent implements OnInit, OnChanges {
  @Input() formTitle: string;
  @Input() inputData: any;
  @Output() saveHandler: EventEmitter<object> = new EventEmitter();
  newForm: FormGroup;
  measures;
  dimensions;
  windows;

  constructor(public translate: TranslateService) {}

  ngOnInit() {
    this.newForm = new FormGroup({
        'measure': new FormControl(null),
        'dimension': new FormControl(null),
        'instance': new FormControl(null),
        'window': new FormControl(null)
      }
    );
  }

  ngOnChanges() {
    if (this.inputData) {
      this.measures = this.inputData.measures;
      this.dimensions = this.inputData.dimensions ? this.inputData.dimensions.map(item => item.dimension) : null;
      this.windows = this.inputData.windows;
    }
  }

  checkDimensionValue() {
    return this.getFormValue('dimension');
  }

  getInstances() {
    if (isNullOrUndefined(this.checkDimensionValue())) {
      return [];
    }
    const selectedDimension = this.inputData.dimensions.find(item => item.dimension === this.checkDimensionValue());
    return [...selectedDimension.systemInstances, ...selectedDimension.customInstances];
  }

  onSave() {
    this.saveHandler.emit(this.newForm.value);
  }

  onCancel() {
    this.saveHandler.emit(null);
  }

  checkFormValid() {
    return !Object.keys(this.newForm.controls).reduce((acc, controlName) => {
      if (!acc) {
        return acc;
      }
      return acc && !isNullOrUndefined(this.getFormValue(controlName));
    }, true);
  }

  getFormValue(form: string) {
    return this.newForm.get(form).value;
  }
}
