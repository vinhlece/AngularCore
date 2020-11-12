import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DebugElement} from '@angular/core';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MeasureComponent} from './measure.component';

describe('Measure',  () => {
  let fixture: ComponentFixture<MeasureComponent>;
  let comp: MeasureComponent;
  let de: DebugElement;

  beforeEach(() => {
   TestBed.configureTestingModule({
     imports: [],
     declarations: [MeasureComponent],
     providers: [FormBuilder],
     schemas: [NO_ERRORS_SCHEMA]
   });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasureComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
  });
});
