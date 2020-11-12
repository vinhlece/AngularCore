import {Component, DebugElement, OnInit} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {WidgetSizeInputComponent} from './widget-size-input.component';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-test-component',
  template: `
    <div [formGroup]="form">
      <app-widget-size formControlName="size" [min]="1" [max]="12"></app-widget-size>
    </div>
  `
})
class TestComponent implements OnInit {
  form: FormGroup;

  constructor(private _fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this._fb.group({
      size: {}
    });
  }
}

describe('WidgetSizeInputComponent', () => {
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
        WidgetSizeInputComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
  }));

  it('should mark form as invalid', () => {
    fixture.detectChanges();
    comp.form.get('size').setValue(null);
    expect(comp.form.invalid).toBeTruthy();

    comp.form.get('size').setValue({rows: 0, columns: 11});
    expect(comp.form.invalid).toBeTruthy();

    comp.form.get('size').setValue({rows: 1, columns: 13});
    expect(comp.form.invalid).toBeTruthy();
  });

  it('should mark form as valid', () => {
    fixture.detectChanges();

    comp.form.get('size').setValue({rows: 2, columns: 11});
    expect(comp.form.valid).toBeTruthy();

    comp.form.get('size').setValue({rows: 3, columns: 10});
    expect(comp.form.valid).toBeTruthy();
  });
});
