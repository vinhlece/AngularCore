import {CommonModule} from '@angular/common';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {By} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SimpleNameFormComponent} from './simple-name-form.component';
import {TranslateModule} from '@ngx-translate/core';
import {ThemeModule} from '../../../../theme/theme.module';

describe('SimpleNameFormComponent', () => {
  let component: SimpleNameFormComponent;
  let fixture: ComponentFixture<SimpleNameFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        MatInputModule,
        MatCardModule,
        TranslateModule.forRoot(),
        ThemeModule
      ],
      declarations: [SimpleNameFormComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleNameFormComponent);
    component = fixture.componentInstance;
    component.inputData = {name: null};
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct input title', () => {
    const title = 'test title';
    component.formTitle = title;
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.card-title'));
    expect(el).not.toBe(null);
  });

  it('should have cancel button', () => {
    const el = fixture.debugElement.query(By.css('#cancelButton'));
    expect(el).not.toBe(null);
    expect(el.nativeElement.textContent).toContain('dashboard.simple_name_form.cancel');
  });

  it('cancel button click handler should be called', () => {
    const el = fixture.debugElement.query(By.css('#cancelButton'));
    const spy = spyOn(component, 'onCancel');
    el.nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should have save button', () => {
    const el = fixture.debugElement.query(By.css('#saveButton'));
    expect(el).not.toBe(null);
    expect(el.nativeElement.textContent).toContain('dashboard.simple_name_form.save');
  });

  it('save button should be disabled when input element still empty', () => {
    const el = fixture.debugElement.query(By.css('#saveButton'));
    expect(el.nativeElement.disabled).toBe(true);
  });

  it('save button should be enabled if input element is not empty', () => {
    const name = component.newForm.get('name');
    name.setValue('a name');
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('#saveButton'));
    expect(el.nativeElement.disabled).toBe(false);
  });

  it('save button click handler should be called', () => {
    const name = component.newForm.get('name');
    name.setValue('a name');
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('#saveButton'));
    const spy = spyOn(component, 'onSave');
    el.nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('save button click handler should be called with correct data', () => {
    const testName = 'a name';
    const spy1 = spyOn(component.saveHandler, 'emit');
    const name = component.newForm.get('name');
    name.setValue(testName);
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('#saveButton'));
    el.nativeElement.click();
    expect(spy1).toHaveBeenCalledWith({name: testName});
  });
});
