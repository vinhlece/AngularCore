import {Component, DebugElement, OnInit} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BreakpointThresholdColorsComponent} from './breakpoint-threshold-colors.component';
import {ColorInputComponent} from '../color-input/color-input.component';
import {ColorPickerModule} from 'ngx-color-picker';
import {AutoInvokeUrlColorComponent} from './auto-invoke-url-color/auto-invoke-url-color.component';
import {TranslateModule} from '@ngx-translate/core';
import {ThemeModule} from '../../../../theme/theme.module';

@Component({
  selector: 'app-test-component',
  template: `
    <div [formGroup]="form">
      <app-breakpoint-threshold-colors formControlName="colors"></app-breakpoint-threshold-colors>
    </div>
  `
})
class TestComponent implements OnInit {
  form: FormGroup;

  constructor(private _fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this._fb.group({
      colors: this._fb.control([null, null, null])
    });
  }
}

describe('BreakpointThresholdColorsComponent', () => {
  let fixture: ComponentFixture<TestComponent>;
  let comp: TestComponent;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        ColorPickerModule,
        MatCheckboxModule,
        TranslateModule.forRoot(),
        ThemeModule
      ],
      declarations: [
        TestComponent,
        BreakpointThresholdColorsComponent,
        ColorInputComponent,
        AutoInvokeUrlColorComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
  }));

  it('should mark form as valid', () => {
    fixture.detectChanges();
    comp.form.get('colors').setValue([
      {value: '#333'},
      {value: '#444'},
      {value: '#555'}]);
    expect(comp.form.valid).toBeTruthy();
  });
});
