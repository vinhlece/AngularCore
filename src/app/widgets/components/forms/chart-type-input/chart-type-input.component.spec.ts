import {Component, DebugElement, OnInit} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ChartTypeInputComponent} from './chart-type-input.component';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-test-component',
  template: `
    <div [formGroup]="form">
      <app-chart-type-input formControlName="chartType" [chartTypes]="chartTypes"></app-chart-type-input>
    </div>
  `
})
class TestComponent implements OnInit {
  chartTypes = ['Horizontal', 'Vertical'];
  form: FormGroup;

  constructor(private _fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this._fb.group({
      chartType: null
    });
  }
}

describe('ChartTypeInputComponent', () => {
  let fixture: ComponentFixture<TestComponent>;
  let comp: TestComponent;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatSelectModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        TestComponent,
        ChartTypeInputComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
  });

  it('should mark form as invalid when chart type is null', () => {
    fixture.detectChanges();
    comp.form.get('chartType').setValue(null);
    expect(comp.form.invalid).toBeTruthy();
  });

  it('should mark form as valid when chart type is provided', () => {
    fixture.detectChanges();
    comp.form.get('chartType').setValue('Horizontal');
    expect(comp.form.valid).toBeTruthy();
  });
});
