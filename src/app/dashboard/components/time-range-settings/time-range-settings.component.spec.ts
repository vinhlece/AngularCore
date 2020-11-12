import {DebugElement} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FlexLayoutModule} from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import {By} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {mockTimeRangeSettingsList} from '../../../common/testing/mocks/dashboards';
import {TimeRangeSetting} from '../../models';
import {TimeRangeType} from '../../models/enums';
import {IntervalSelectorComponent} from '../interval-selector/interval-selector.component';
import {TimeRangeSettingsComponent} from './time-range-settings.component';
import {TranslateModule} from '@ngx-translate/core';
import {ThemeModule} from '../../../theme/theme.module';

describe('TimeRangeSettingsComponent', () => {
  let fixture: ComponentFixture<TimeRangeSettingsComponent>;
  let comp: TimeRangeSettingsComponent;
  let de: DebugElement;
  const availableSettings = mockTimeRangeSettingsList();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatButtonModule,
        MatSelectModule,
        FlexLayoutModule,
        TranslateModule.forRoot(),
        ThemeModule
      ],
      declarations: [
        TimeRangeSettingsComponent,
        IntervalSelectorComponent,
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeRangeSettingsComponent);
    comp = fixture.componentInstance;
    comp.availableSettings = availableSettings;
    de = fixture.debugElement;
  });

  it('should emit event with correct settings when click set time range settings button', () => {
    const spy = spyOn(comp.onChangeTimeRangeSettings, 'emit');
    fixture.detectChanges();
    availableSettings.forEach((settings: TimeRangeSetting) => {
      const btn = de.query(By.css('#select'));
      btn.triggerEventHandler('selectionChange', {value: settings});
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(settings);
      spy.calls.reset();
    });
  });

  it('should emit updated settings on change data point interval', () => {
    const spy = spyOn(comp.onChangeTimeRangeSettings, 'emit');
    comp.currentSettings = availableSettings[0];
    fixture.detectChanges();
    const el = de.query(By.css('.data-point-interval-selector'));
    el.triggerEventHandler('onChange', {value: 22, type: TimeRangeType.Day});
    const dataPointInterval = {...comp.currentSettings.dataPointInterval, value: {value: 22, type: TimeRangeType.Day}};
    const expected = {...comp.currentSettings, dataPointInterval};
    expect(spy).toHaveBeenCalledWith(expected);
  });
});
