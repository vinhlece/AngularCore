import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DebugElement} from '@angular/core';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {EventTagItemComponent} from './event-tag-item.component';

describe('Event Tag Item',  () => {
  let fixture: ComponentFixture<EventTagItemComponent>;
  let comp: EventTagItemComponent;
  let de: DebugElement;

  beforeEach(() => {
   TestBed.configureTestingModule({
     imports: [],
     declarations: [EventTagItemComponent],
     providers: [FormBuilder],
     schemas: [NO_ERRORS_SCHEMA]
   });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventTagItemComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
  });
});
