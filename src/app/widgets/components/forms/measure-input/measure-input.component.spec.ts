import {Component, DebugElement, OnInit} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MeasureInputComponent} from './measure-input.component';

@Component({
  selector: 'app-test-component',
  template: `
    <div [formGroup]="form">
      <app-measure-input formControlName="measures"
                         [mode]="mode"
                         [options]="availableMeasures"></app-measure-input>
    </div>
  `
})
class TestComponent implements OnInit {
  form: FormGroup;
  mode: 'single' | 'multiple';
  selectedMeasures: string | string[];
  availableMeasures = ['measure 1', 'measure 2', 'measureName 3', 'measureName 4', 'measureName 5'];

  constructor(private _fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this._fb.group({
      measures: this._fb.control(this.selectedMeasures)
    });
  }
}

describe('MeasureInputComponent', () => {
  let component: MeasureInputComponent;
  let fixture: ComponentFixture<MeasureInputComponent>;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatSelectModule,
        MatCheckboxModule
      ],
      declarations: [MeasureInputComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasureInputComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
  });

  // TODO: update tests
});
