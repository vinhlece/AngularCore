import {Component, DebugElement, OnInit} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BreakpointThresholdValuesComponent} from './breakpoint-threshold-values.component';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-test-component',
  template: `
    <div [formGroup]="form">
      <app-breakpoint-threshold-values formControlName="breakpoints"></app-breakpoint-threshold-values>
    </div>
  `
})
class TestComponent implements OnInit {
  form: FormGroup;

  constructor(private _fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this._fb.group({
      breakpoints: this._fb.control([null, null, null])
    });
  }
}

describe('BreakpointThresholdValuesComponent', () => {
  let fixture: ComponentFixture<TestComponent>;
  let comp: TestComponent;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatInputModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        TestComponent,
        BreakpointThresholdValuesComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
  }));

  it('should mark form as valid', () => {
    fixture.detectChanges();
    comp.form.get('breakpoints').setValue([1, 22, 100, 22]);
    expect(comp.form.valid).toBeTruthy();
  });
});
