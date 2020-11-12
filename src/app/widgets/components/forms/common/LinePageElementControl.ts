import {AbstractControl} from '@angular/forms';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {ComponentFixture} from '@angular/core/testing';

export class LinePageElementControl {
  private _fixture: any;
  public component: any;
  nameControl: AbstractControl;
  lineChartTypeControl: AbstractControl;
  dataTypeControl: AbstractControl;
  measuresControl: AbstractControl;
  instancesControl: AbstractControl;
  xAxisLabelControl: AbstractControl;
  yAxisLabelControl: AbstractControl;
  defaultSizeControl: AbstractControl;
  saveBtn: DebugElement;
  cancelBtn: DebugElement;

  constructor(fixture: ComponentFixture<any>) {
    this._fixture = fixture;
  }

  public setControls(option: any = {}) {
    this.component = this._fixture.componentInstance;

    this.nameControl = this.component.form.get(option.name || 'name');
    this.lineChartTypeControl =  this.component.form.get(option.chartType || 'chartType');
    this.dataTypeControl = this.component.form.get(option.dataType || 'dataType');
    this.measuresControl = this.component.form.get(option.measures || 'measures');
    this.instancesControl = this.component.form.get(option.instances || 'instances');
    this.xAxisLabelControl = this.component.form.get(option.xAxisLabel || 'xAxisLabel');
    this.yAxisLabelControl = this.component.form.get(option.yAxisLabel || 'yAxisLabel');
    this.defaultSizeControl = this.component.form.get(option.defaultSize || 'defaultSize');

    const de = this._fixture.debugElement;
    this.saveBtn = de.query(By.css(option.saveBtn || '.save-btn'));
    this.cancelBtn = de.query(By.css(option.cancelBtn || '.cancel-btn'));
  }
}
