import {sandboxOf} from 'angular-playground';
import {GanttCallTimelineComponent} from './gantt-call-timeline.component';
import {mockCallTimeLineWidget} from '../../../../common/testing/mocks/widgets';
import {HORIZONTAL, VERTICAL} from '../../../../widgets/constants/bar-chart-types';
import {
  MatAutocompleteModule, MatChipsModule, MatFormFieldModule, MatIconModule, MatInputModule,
  MatTooltipModule
} from '@angular/material';
import {LegendComponent} from '../../legend/legend.component';
import {CallTimelineFiterBarComponent} from '../call-timeline-fiter-bar/call-timeline-fiter-bar.component';

const widget = {
  ...mockCallTimeLineWidget(),
  agents: ['Sean', 'Tom', 'Antonio']
};

const date = new Date();
const unit = 1000 * 60;

// Set to 00:00:00:000 today
date.setUTCHours(0);
date.setUTCMinutes(0);
date.setUTCSeconds(0);
date.setUTCMilliseconds(0);
const today = date.getTime();

const series = [
  {
    name: 'Sean',
    data: [
      {
        name: 'CallA - TalkTime',
        y: 0,
        start: today - 2 * unit,
        end: today + 6 * unit,
      },
      {
        name: 'CallB - QueueTime',
        y: 0,
        start: today + 2 * unit,
        end: today + 9 * unit
      },
      {
        name: 'CallB - TalkTime',
        y: 0,
        start: today + 13 * unit,
        end: today + 17 * unit
      }
    ]
  },
  {
    name: 'Tom',
    data: [
      {
        name: 'CallC - TalkTime',
        y: 1,
        start: today + 2 * unit,
        end: today + 5 * unit
      },
      {
        name: 'CallC - QueueTime',
        y: 1,
        start: today - 1 * unit,
        end: today + 6 * unit
      },
      {
        name: 'CallD - QueueTime',
        y: 1,
        start: today + 11 * unit,
        end: today + 12 * unit
      },
      {
        name: 'CallD - TalkTime',
        y: 1,
        start: today + 14 * unit,
        end: today + 16 * unit
      }
    ]
  },
  {
    name: 'Antonio',
    data: [
      {
        name: 'CallE - QueueTime',
        y: 2,
        start: today - 1.5 * unit,
        end: today + 4 * unit
      },
      {
        name: 'CallE - TalkTime',
        y: 2,
        start: today + 6 * unit,
        end: today + 9 * unit
      },
      {
        name: 'CallF - QueueTime',
        y: 2,
        start: today + 10 * unit,
        end: today + 14 * unit
      },
      {
        name: 'CallF - QueueTime',
        y: 2,
        start: today + 15 * unit,
        end: today + 17 * unit
      }
    ]
  }
];

export default sandboxOf(GanttCallTimelineComponent, {
  imports: [
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatChipsModule
  ],
  declarations: [
    LegendComponent,
    CallTimelineFiterBarComponent
  ]
})
  .add('Horizontal GanttCallTimelineComponent', {
    template: `
        <app-gantt-call-timeline [data]="data" [widget]="widget"></app-gantt-call-timeline>
      `,
    context: {
      data: series,
      widget: {
        ...widget,
        chartType: HORIZONTAL,
      }
    }
  })
  .add('Vertical GanttCallTimelineComponent', {
    template: `
        <app-gantt-call-timeline [data]="data" [widget]="widget"></app-gantt-call-timeline>
      `,
    context: {
      data: series,
      widget: {
        ...widget,
        chartType: VERTICAL
      }
    }
  });
