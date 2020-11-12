import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DebugElement} from '@angular/core';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {EventItemComponent} from './event-item.component';

describe('Event Item',  () => {
  let fixture: ComponentFixture<EventItemComponent>;
  let comp: EventItemComponent;
  let de: DebugElement;

  beforeEach(() => {
   TestBed.configureTestingModule({
     imports: [],
     declarations: [EventItemComponent],
     providers: [FormBuilder],
     schemas: [NO_ERRORS_SCHEMA]
   });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventItemComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
  });
});
