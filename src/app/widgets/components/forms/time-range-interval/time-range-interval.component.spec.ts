import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeRangeIntervalComponent } from './time-range-interval.component';

describe('TimeRangeIntervalComponent', () => {
  let component: TimeRangeIntervalComponent;
  let fixture: ComponentFixture<TimeRangeIntervalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeRangeIntervalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeRangeIntervalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
