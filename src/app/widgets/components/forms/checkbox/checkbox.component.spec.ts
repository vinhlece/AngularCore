import {Component, DebugElement, OnInit} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CheckboxComponent} from './checkbox.component';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-test-component',
  template: `
    <div [formGroup]="form">
      <app-checkbox formControlName="isChecked"></app-checkbox>
    </div>
  `
})
class TestComponent implements OnInit {
  form: FormGroup;

  constructor(private _fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this._fb.group({
      isChecked: this._fb.control(null)
    });
  }
}

describe('CheckboxComponent', () => {
  let fixture: ComponentFixture<TestComponent>;
  let comp: TestComponent;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        TestComponent,
        CheckboxComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
  }));

  it('should always valid', () => {
    fixture.detectChanges();
    comp.form.get('isChecked').setValue('Show All');
    expect(comp.form.valid).toBeTruthy();

    comp.form.get('isChecked').setValue(null);
    expect(comp.form.valid).toBeTruthy();
  });
});
