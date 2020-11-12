import {Component, DebugElement, OnInit} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TextInputComponent} from './text-input.component';
import {TranslateModule} from '@ngx-translate/core';
import {ThemeModule} from '../../../theme/theme.module';

@Component({
  selector: 'app-test-component',
  template: `
    <div [formGroup]="form">
      <app-text-input formControlName="value"></app-text-input>
    </div>
  `
})
class TestComponent implements OnInit {
  form: FormGroup;

  constructor(private _fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this._fb.group({
      value: null
    });
  }
}

describe('TextInputComponent', () => {
  let fixture: ComponentFixture<TestComponent>;
  let comp: TestComponent;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatInputModule,
        TranslateModule.forRoot(),
        ThemeModule
      ],
      declarations: [
        TestComponent,
        TextInputComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
  }));

  it('should mark form as invalid when value is null', () => {
    fixture.detectChanges();
    comp.form.get('value').setValue(null);
    expect(comp.form.invalid).toBeTruthy();
  });

  it('should mark form as valid when value is provided', () => {
    fixture.detectChanges();
    comp.form.get('value').setValue('hi');
    expect(comp.form.valid).toBeTruthy();
  });
});
