import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DebugElement} from '@angular/core';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {SearchBoxComponent} from './search-box.component';

describe('Search Box',  () => {
  let fixture: ComponentFixture<SearchBoxComponent>;
  let comp: SearchBoxComponent;
  let de: DebugElement;

  beforeEach(() => {
   TestBed.configureTestingModule({
     imports: [],
     declarations: [SearchBoxComponent],
     providers: [FormBuilder],
     schemas: [NO_ERRORS_SCHEMA]
   });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBoxComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
  });
});
