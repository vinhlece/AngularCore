import {Component, DebugElement, OnInit} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DataTypeInputComponent} from './data-type-input.component';
import {TranslateModule} from '@ngx-translate/core';
import {ThemeModule} from '../../../../theme/theme.module';

@Component({
  selector: 'app-test-component',
  template: `
    <div [formGroup]="form">
      <app-data-type-input formControlName="dataType" [dataTypes]="dataTypes"></app-data-type-input>
    </div>
  `
})
class TestComponent implements OnInit {
  dataTypes = ['Queue Status', 'Queue Performance'];
  form: FormGroup;

  constructor(private _fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this._fb.group({
      dataType: null
    });
  }
}

describe('DataTypeInputComponent', () => {
  let fixture: ComponentFixture<TestComponent>;
  let comp: TestComponent;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatSelectModule,
        TranslateModule.forRoot(),
        ThemeModule
      ],
      declarations: [
        TestComponent,
        DataTypeInputComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
  });

  it('should mark form as invalid when data type is null', () => {
    fixture.detectChanges();
    comp.form.get('dataType').setValue(null);
    expect(comp.form.invalid).toBeTruthy();
  });

  it('should mark form as valid when data type is provided', () => {
    fixture.detectChanges();
    comp.form.get('dataType').setValue('Queue Status');
    expect(comp.form.valid).toBeTruthy();
  });
});
