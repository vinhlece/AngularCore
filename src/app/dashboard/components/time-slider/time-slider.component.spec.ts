import {ChangeDetectionStrategy} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import {By} from '@angular/platform-browser';
import {TimeSlider} from './time-slider.component';

describe('TimeSlider', () => {
  let component: TimeSlider;
  let fixture: ComponentFixture<TimeSlider>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatSliderModule
      ],
      declarations: [
        TimeSlider
      ]
    }).overrideComponent(TimeSlider, {
      set: {changeDetection: ChangeDetectionStrategy.Default}
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSlider);
    component = fixture.componentInstance;
    component.min = 0;
    component.max = 100;
    component.step = 5;
  });

  describe('set slider control value', () => {
    it('should set slider control value to current value if current value is provided', () => {
      component.current = 50;
      fixture.detectChanges();
      const el = fixture.debugElement.query(By.css('mat-slider'));
      expect(el.componentInstance.value).toEqual(50);
    });

    it('should set slider control value to max value if current value is not provided', () => {
      fixture.detectChanges();
      const el = fixture.debugElement.query(By.css('mat-slider'));
      expect(el.componentInstance.value).toEqual(100);
    });
  });

  describe('on slide', () => {
    it('should emit selected time if it is less than max value', () => {
      component.current = 50;
      fixture.detectChanges();
      const spy = spyOn(component.onSlide, 'emit');
      const el = fixture.debugElement.query(By.css('mat-slider'));
      el.triggerEventHandler('change', {value: 40});
      expect(spy).toHaveBeenCalledWith(40);
    });

    it('should emit null if it is equals to max value', () => {
      component.current = 50;
      fixture.detectChanges();
      const spy = spyOn(component.onSlide, 'emit');
      const el = fixture.debugElement.query(By.css('mat-slider'));
      el.triggerEventHandler('change', {value: 100});
      expect(spy).toHaveBeenCalledWith(null);
    });
  });
});
