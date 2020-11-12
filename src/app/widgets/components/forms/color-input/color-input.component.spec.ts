import {Component, DebugElement, OnInit} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {By} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ColorPickerModule} from 'ngx-color-picker';
import {ColorInputComponent} from './color-input.component';
import {TranslateModule} from '@ngx-translate/core';
import {ThemeModule} from '../../../../theme/theme.module';

@Component({
  selector: 'app-test-component',
  template: `
    <div [formGroup]="form">
      <app-color-input-component [label]="label"
                                 [colors]="colors"
                                 formControlName="color"
      ></app-color-input-component>
    </div>
  `
})
class TestComponent implements OnInit {
  form: FormGroup;
  label = 'Color';
  colors = null;

  constructor(private _fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this._fb.group({
      color: this._fb.control([null, null, null])
    });
  }
}

describe('ColorInputComponent', () => {
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
        TranslateModule.forRoot(),
        ThemeModule
      ],
      declarations: [
        TestComponent,
        ColorInputComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
  }));

  it('should show color selection when pass color list to component', () => {
    comp.colors = ['Red', 'Green'];
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('mat-select'));
    const unEl = fixture.debugElement.query(By.css('input'));
    expect(el).toBeTruthy();
    expect(unEl).not.toBeTruthy();
  });

  it('should show color input when not pass color list to component', () => {
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('mat-select'));
    const unEl = fixture.debugElement.query(By.css('input'));
    expect(el).not.toBeTruthy();
    expect(unEl).toBeTruthy();
  });
});
