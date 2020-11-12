import {MatSelectModule} from '@angular/material';
import {sandboxOf} from 'angular-playground';
import {TimeRangeType} from '../../models/enums';
import {IntervalSelectorComponent} from './interval-selector.component';

export default sandboxOf(IntervalSelectorComponent, {
  imports: [
    MatSelectModule
  ],
})
  .add('Show a list of intervals', {
    template: `<app-interval-selector [intervals]="intervals" [value]="value"></app-interval-selector>`,
    context: {
      intervals: [
        {value: 15, type: TimeRangeType.Minute},
        {value: 30, type: TimeRangeType.Minute},
        {value: 1, type: TimeRangeType.Hour},
      ],
      value: {value: 15, type: TimeRangeType.Minute}
    }
  });
