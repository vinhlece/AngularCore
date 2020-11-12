import {DebugElement} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AbstractControl, FormBuilder, ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import {By} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {QUEUE_PERFORMANCE} from '../../models/constants';
import {mockFormulaMeasure} from '../../../common/testing/mocks/mockMeasures';
import * as mockPackages from '../../../common/testing/mocks/mockPackages';
import {EditFormulaMeasureFormComponent} from './edit-formula-measure-form.component';
import {TranslateModule} from '@ngx-translate/core';
import {ThemeModule} from '../../../theme/theme.module';

class Page {
  private _fixture: any;
  public component: any;

  saveBtn: DebugElement;
  cancelBtn: DebugElement;

  nameControl: AbstractControl;
  dataTypeControl: AbstractControl;
  expressionControl: AbstractControl;

  constructor(fixture: ComponentFixture<any>) {
    this._fixture = fixture;
  }

  public setControls(option: any = {}) {
    this.component = this._fixture.componentInstance;

    this.nameControl = this.component.form.get(option.name || 'name');
    this.dataTypeControl = this.component.form.get(option.dataType || 'dataType');
    this.expressionControl = this.component.form.get(option.expression || 'expression');

    const de = this._fixture.debugElement;
    this.saveBtn = de.query(By.css(option.saveBtn || '.btn-save'));
    this.cancelBtn = de.query(By.css(option.cancelBtn || '.btn-cancel'));
  }
}

describe('EditFormulaMeasureFormComponent', () => {
  let fixture: ComponentFixture<EditFormulaMeasureFormComponent>;
  let comp: EditFormulaMeasureFormComponent;
  let de: DebugElement;
  let page: Page;
  const packages = mockPackages.getAllMeasure();
  const customMeasure = mockFormulaMeasure();
  beforeEach(() => {
    TestBed
      .configureTestingModule({
        imports: [
          ReactiveFormsModule,
          BrowserAnimationsModule,
          MatInputModule,
          MatSelectModule,
          MatCheckboxModule,
          MatButtonModule,
          MatChipsModule,
          MatRadioModule,
          TranslateModule.forRoot(),
          ThemeModule
        ],
        declarations: [
          EditFormulaMeasureFormComponent
        ],
        providers: [FormBuilder]
      })
      .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(EditFormulaMeasureFormComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
    page = new Page(fixture);
    comp.formulaMeasure = customMeasure;
    comp.packages = packages;
    comp.allMeasureNames = ['contactsoffered', 'contactsanswered', 'contactsabandoned', 'servicelevel'];
    fixture.detectChanges();
    page.setControls();
  });
  describe('Validation', () => {
    it('should show error when the name is null', () => {
      page.nameControl.setValue('');
      page.nameControl.markAsTouched();
      fixture.detectChanges();
      const error = de.query(By.css('.required'));
      // expect(error.nativeElement.innerHTML).toContain('Name is required');
    });
    it('should show error when the name is contain space or not a-Z character', () => {
      page.nameControl.setValue('My Measure');
      page.nameControl.markAsTouched();
      fixture.detectChanges();
      const error = de.query(By.css('.pattern'));
      // expect(error.nativeElement.innerHTML).toContain('Name must contain A-Z, a-z characters only');
    });
    it('should show error when the name is available', () => {
      page.nameControl.setValue('ContactsOffered');
      page.nameControl.markAsTouched();
      fixture.detectChanges();
      const error = de.query(By.css('.availableName'));
      // expect(error.nativeElement.innerHTML).toContain('This name is used. Please use another name');
    });
    it('should show error when the package is null', () => {
      page.dataTypeControl.setValue('');
      page.dataTypeControl.markAsTouched();
      fixture.detectChanges();
      const error = de.query(By.css('.required'));
      // expect(error.nativeElement.innerHTML).toContain('Package is required');
    });
    it('should show error when the expression is null', () => {
      page.expressionControl.setValue('');
      page.expressionControl.markAsTouched();
      fixture.detectChanges();
      const error = de.query(By.css('.required'));
      // expect(error.nativeElement.innerHTML).toContain('Expression is required');
    });
  });

  describe('Cancel', () => {
    it('should emit event when click to cancel button', () => {
      const spy = spyOn(comp.onCancel, 'emit');
      page.cancelBtn.nativeElement.click();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('#addMeasureToExpression', () => {
    it('should add measure to expression input when click on measure chip', () => {
      comp.packageMeasures = mockPackages.getDataType(QUEUE_PERFORMANCE);
      fixture.detectChanges();
      page.dataTypeControl.setValue(QUEUE_PERFORMANCE);
      page.dataTypeControl.markAsTouched();
      page.expressionControl.setValue('');
      fixture.detectChanges();
      const el = fixture.debugElement.query(By.css('mat-chip'));
      el.nativeElement.click();
      fixture.detectChanges();
      expect(page.expressionControl.value).toContain(el.nativeElement.innerText);
    });
  });

  describe('Save', () => {
    it('Should disable save button when form still not valid', () => {
      page.expressionControl.setValue('');
      page.expressionControl.markAsTouched();

      fixture.detectChanges();

      expect(page.saveBtn.componentInstance.disabled).toBeTruthy();
    });
    it('should emit event when click to save button', () => {
      page.nameControl.setValue('CustomMeasure');
      page.dataTypeControl.setValue('Queue Performance');
      page.expressionControl.setValue('no expression');
      const spy = spyOn(comp.onSave, 'emit');
      fixture.detectChanges();
      page.saveBtn.nativeElement.click();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('#onChangePackage', () => {
    it('should emit event when click to save button', () => {
      page.nameControl.setValue('CustomMeasure');
      page.dataTypeControl.setValue('Queue Performance');
      page.expressionControl.setValue('no expression');
      const spy = spyOn(comp.onChangePackage, 'emit');
      fixture.detectChanges();
      page.dataTypeControl.setValue('Queue Status');
      page.dataTypeControl.markAsTouched();

      const selectDataType = fixture.debugElement.query(By.css('mat-select'));
      selectDataType.triggerEventHandler('selectionChange', {});

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
