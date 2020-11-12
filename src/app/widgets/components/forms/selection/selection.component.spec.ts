import {Component, DebugElement, OnInit} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SelectionComponent} from './selection.component';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-test-component',
  template: `
    <div [formGroup]="form">
      <mat-form-field class="form-field">
        <mat-select formControlName="selected" [placeholder]="placeholder">
          <mat-option *ngFor="let name of options" [value]="name">{{name}}</mat-option>
        </mat-select>
      </mat-form-field>
    </div>
  `
})
class TestComponent implements OnInit {
  form: FormGroup;

  constructor(private _fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this._fb.group({
      selected: this._fb.control(null)
    });
  }
}

describe('SelectionComponent', () => {
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
        SelectionComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
  }));

  it('should always valid', () => {
    fixture.detectChanges();
    comp.form.get('selected').setValue('Show All');
    expect(comp.form.valid).toBeTruthy();

    comp.form.get('selected').setValue(null);
    expect(comp.form.valid).toBeTruthy();
  });
});
