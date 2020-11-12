import {DebugElement} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FlexLayoutModule} from '@angular/flex-layout';
import {AbstractControl, FormBuilder, ReactiveFormsModule} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {By} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ThresholdColorInputComponent} from './threshold-color-input.component';
import {WidgetThresholdColor} from '../../../models/enums';
import {TranslateModule} from '@ngx-translate/core';
import {ThemeModule} from '../../../../theme/theme.module';

class Page {
  greaterControl: AbstractControl;
  lesserControl: AbstractControl;

  constructor(private fixture: ComponentFixture<ThresholdColorInputComponent>) {
  }

  setControls() {
    const comp = this.fixture.componentInstance;

    this.greaterControl = comp.form.get('greater');
    this.lesserControl = comp.form.get('lesser');
  }
}

describe('ThresholdColorInputComponent', () => {
  let fixture: ComponentFixture<ThresholdColorInputComponent>;
  let comp: ThresholdColorInputComponent;
  let de: DebugElement;
  let page: Page;

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        imports: [
          ReactiveFormsModule,
          BrowserAnimationsModule,
          MatInputModule,
          FlexLayoutModule,
          MatSelectModule,
          TranslateModule.forRoot(),
          ThemeModule
        ],
        declarations: [ThresholdColorInputComponent],
        providers: [FormBuilder]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThresholdColorInputComponent);
    de = fixture.debugElement;

    comp = fixture.componentInstance;
    comp.thresholdColorConfig = {greater: WidgetThresholdColor.Green, lesser: WidgetThresholdColor.Red};

    fixture.detectChanges();

    page = new Page(fixture);
    page.setControls();
  });

  it('should only show required error when greater was not selected', () => {
    page.greaterControl.setValue(null);
    page.greaterControl.markAsTouched();

    fixture.detectChanges();

    const greater = de.query(By.css('.greater'));
    const required = greater.query(By.css('.required'));
    expect(required).not.toBeNull();
  });

  it('should hide all errors when greater is valid', () => {
    page.greaterControl.setValue(50);
    page.greaterControl.markAsTouched();

    fixture.detectChanges();

    const greater = de.query(By.css('.greater'));
    const error = greater.query(By.css('.required'));
    expect(error).toBeNull();
  });

  it('should only show required error when lesser is not provided', () => {
    page.lesserControl.setValue(null);
    page.lesserControl.markAsTouched();

    fixture.detectChanges();

    const lesser = de.query(By.css('.lesser'));
    const required = lesser.query(By.css('.required'));
    expect(required).not.toBeNull();
  });

  it('should hide all errors when lesser is valid', () => {
    page.lesserControl.setValue(50);
    page.lesserControl.markAsTouched();

    fixture.detectChanges();

    const lesser = de.query(By.css('.lesser'));
    const error = lesser.query(By.css('.required'));
    expect(error).toBeNull();
  });
});
