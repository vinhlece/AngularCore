import {sandboxOf} from 'angular-playground';
import {TimeExplorer} from './time-explorer.component';
import {TimeSlider} from '../time-slider/time-slider.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatInputModule, MatSelectModule, MatSliderModule} from '@angular/material';
import {TimeRangeSettingsComponent} from '../time-range-settings/time-range-settings.component';
import {mockTimeRangeSettingsList} from '../../../common/testing/mocks/dashboards';
import {ReplayStatus} from '../../models/enums';
import {IntervalSelectorComponent} from '../interval-selector/interval-selector.component';

const availableSettings = mockTimeRangeSettingsList();

export default sandboxOf(TimeExplorer, {
  imports: [
    ReactiveFormsModule,
    FlexLayoutModule,
    FormsModule,
    MatSliderModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule
  ],
  declarations: [
    TimeExplorer,
    TimeSlider,
    TimeRangeSettingsComponent,
    IntervalSelectorComponent
  ]
})
  .add('Default appearance', {
    template: `
    <app-time-explorer [currentSettings]="currentSettings"
                       [availableSettings]="availableSettings"
                       [currentTimestamp]="50"
    >
    </app-time-explorer>`,
    context: {
      availableSettings,
      currentSettings: availableSettings[0],
      currentTimestamp: 50
    }
  })
  .add('Is replaying', {
    template: `
    <app-time-explorer [currentSettings]="currentSettings"
                       [availableSettings]="availableSettings"
                       [currentTimestamp]="50"
                       [replayStatus]="replayStatus"
    >
    </app-time-explorer>`,
    context: {
      availableSettings,
      currentSettings: availableSettings[0],
      currentTimestamp: 50,
      replayStatus: ReplayStatus.RESUME
    }
  })
  .add('Replay paused', {
    template: `
    <app-time-explorer [currentSettings]="currentSettings"
                       [availableSettings]="availableSettings"
                       [currentTimestamp]="50"
                       [replayStatus]="replayStatus"
    >
    </app-time-explorer>`,
    context: {
      availableSettings,
      currentSettings: availableSettings[0],
      currentTimestamp: 50,
      replayStatus: ReplayStatus.PAUSE
    }
  })
  .add('Replay stopped', {
    template: `
    <app-time-explorer [currentSettings]="currentSettings"
                       [availableSettings]="availableSettings"
                       [currentTimestamp]="50"
                       [replayStatus]="replayStatus"
    >
    </app-time-explorer>`,
    context: {
      availableSettings,
      currentSettings: availableSettings[0],
      currentTimestamp: 50,
      replayStatus: ReplayStatus.STOP
    }
  });

