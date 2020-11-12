import {Component, DebugElement, OnInit} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {WidgetType} from '../../../constants/widget-types';
import {WidgetTypeInputComponent} from './widget-type-input.component';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-test-component',
  template: `
    <div [formGroup]="form">
      <app-widget-type-input formControlName="widgetType" [types]="types"></app-widget-type-input>
    </div>
  `
})
class TestComponent implements OnInit {
  form: FormGroup;
  types: WidgetType[] = [WidgetType.Line, WidgetType.Bar];

  constructor(private _fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this._fb.group({
      widgetType: null
    });
  }
}

describe('WidgetTypeInputComponent', () => {
  let fixture: ComponentFixture<TestComponent>;
  let comp: TestComponent;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatSelectModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        TestComponent,
        WidgetTypeInputComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
  }));

  it('should mark form as invalid when widget type is null', () => {
    fixture.detectChanges();
    comp.form.get('widgetType').setValue(null);
    expect(comp.form.invalid).toBeTruthy();
  });

  it('should mark form as valid when widget type is provided', () => {
    fixture.detectChanges();
    comp.form.get('widgetType').setValue(WidgetType.Bar);
    expect(comp.form.valid).toBeTruthy();
  });
});
