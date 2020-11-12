import {DebugElement} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { MatSelectModule } from '@angular/material/select';
import {By} from '@angular/platform-browser';
import {TimeRangeType} from '../../models/enums';
import {IntervalSelectorComponent} from './interval-selector.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateModule} from '@ngx-translate/core';

describe('IntervalSelectorComponent', () => {
  let fixture: ComponentFixture<IntervalSelectorComponent>;
  let comp: IntervalSelectorComponent;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatSelectModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        IntervalSelectorComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IntervalSelectorComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
  }));

  it('should emit selected interval on selection change', () => {
    comp.intervals = [
      {value: 15, type: TimeRangeType.Minute, label: 'dashboard.time_range_settings.minute'},
      {value: 30, type: TimeRangeType.Minute, label: 'dashboard.time_range_settings.minute'},
      {value: 1, type: TimeRangeType.Hour, label: 'dashboard.time_range_settings.hour'},
    ];
    comp.value = {value: 15, type: TimeRangeType.Minute, label: 'dashboard.time_range_settings.minute'};
    fixture.detectChanges();
    const spy = spyOn(comp.onChange, 'emit');
    const el = de.query(By.css('#option'));
    el.triggerEventHandler('selectionChange', {value: {value: 30, type: TimeRangeType.Minute, label: 'dashboard.time_range_settings.minute'}});
    expect(spy).toHaveBeenCalledWith({value: 30, type: TimeRangeType.Minute, label: 'dashboard.time_range_settings.minute'});
  });
});
