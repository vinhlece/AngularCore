import {sandboxOf} from 'angular-playground';
import {TimeSlider} from './time-slider.component';
import {FormsModule} from '@angular/forms';
import {MatSliderModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import * as moment from 'moment';
import {TimeRangeStep} from '../../models/enums';

const current = +moment.utc();

export default sandboxOf(TimeSlider, {
  imports: [
    FormsModule,
    MatSliderModule,
    FlexLayoutModule
  ],
  declarations: [
    TimeSlider
  ]
})
  .add('Time Slider Component 1 Day', {
  template: `
    <div style="background-color: #0E254D">
      <app-time-slider [min]="min"
                                 [max]="max"
                                 [current]="current"
                                 [step]="step"
                                 (onSlide)="handleChange($event)">
      </app-time-slider>
    </div>
  `,
  context: {
    min: +moment.utc(current).startOf('day'),
    max: +moment.utc(current).endOf('day'),
    step: TimeRangeStep.FifteenMinutes,
    current: current,
    handleChange: (value) => console.log(value)
  }
})
  .add('Time Slider Component 1 month', {
  template: `
    <div style="background-color: #0E254D">
      <app-time-slider [min]="min"
                                 [max]="max"
                                 [current]="current"
                                 [step]="step"
                                 (onSlide)="handleChange($event)">
      </app-time-slider>
    </div>
  `,
  context: {
    min: +moment.utc(current).subtract(1, 'month').startOf('day'),
    max: +moment.utc(current).endOf('day'),
    step: TimeRangeStep.FifteenMinutes,
    current: current,
    handleChange: (value) => console.log(value)
  }
})
  .add('Time Slider Component 1 year', {
  template: `
    <div style="background-color: #0E254D">
      <app-time-slider [min]="min"
                                 [max]="max"
                                 [current]="current"
                                 [step]="step"
                                 (onSlide)="handleChange($event)">
      </app-time-slider>
    </div>
  `,
  context: {
    min: +moment.utc(current).subtract(1, 'year').startOf('day'),
    max: +moment.utc(current).endOf('day'),
    step: TimeRangeStep.FifteenMinutes,
    current: current,
    handleChange: (value) => console.log(value)
  }
});
