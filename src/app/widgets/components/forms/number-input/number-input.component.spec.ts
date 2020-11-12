import {Component, DebugElement, OnInit} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NumberInputComponent} from './number-input.component';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-test-component',
  template: `
    <div [formGroup]="form">
      <app-number-input formControlName="number"
                        [required]="required"
                        [min]="min"
                        [max]="max"
                        [placeholder]="placeholder"
      ></app-number-input>
    </div>
  `
})
class TestComponent implements OnInit {
  form: FormGroup;
  required: boolean;
  min: number;
  max: number;
  placeholder: string;
  constructor(private _fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this._fb.group({
      number: this._fb.control(null)
    });
  }
}

describe('NumberInputComponent', () => {
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
        NumberInputComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
  }));

  it('should always valid no matter number when do not provide validation value', () => {
    fixture.detectChanges();
    comp.form.get('number').setValue('5');
    expect(comp.form.valid).toBeTruthy();

    comp.form.get('number').setValue(null);
    expect(comp.form.valid).toBeTruthy();
  });

  it('should not valid no matter number when required', () => {
    comp.required = true;
    fixture.detectChanges();
    comp.form.get('number').setValue(null);
    expect(comp.form.valid).not.toBeTruthy();
  });
});
