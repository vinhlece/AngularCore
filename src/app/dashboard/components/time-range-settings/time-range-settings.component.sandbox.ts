import {FlexLayoutModule} from '@angular/flex-layout';
import {MatButtonModule, MatSelectModule} from '@angular/material';
import {sandboxOf} from 'angular-playground';
import {mockTimeRangeSettingsList} from '../../../common/testing/mocks/dashboards';
import {TimeRangeSettingsComponent} from './time-range-settings.component';
import {IntervalSelectorComponent} from '../interval-selector/interval-selector.component';

const availableSettings = mockTimeRangeSettingsList();

export default sandboxOf(TimeRangeSettingsComponent, {
  imports: [
    MatButtonModule,
    FlexLayoutModule,
    MatSelectModule
  ],
  declarations: [
    TimeRangeSettingsComponent,
    IntervalSelectorComponent
  ]
})
  .add('Show time control component', {
    template: `<app-time-range-settings [availableSettings]="availableSettings"></app-time-range-settings>`,
    context: {
      availableSettings
    }
  })
  .add('Highlight selected button', {
    template: `<app-time-range-settings [availableSettings]="availableSettings"
                                        [currentSettings]="currentSettings"></app-time-range-settings>`,
    context: {
      availableSettings,
      currentSettings: availableSettings[1]
    }
  });
