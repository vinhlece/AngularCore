import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import {By} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {IntervalSelectorComponent} from '../interval-selector/interval-selector.component';
import {TimeRangeSettingsComponent} from '../time-range-settings/time-range-settings.component';
import {TimeSlider} from '../time-slider/time-slider.component';
import {TimeExplorer} from './time-explorer.component';
import {RouterModule} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateModule} from '@ngx-translate/core';
import {ColorPickerModule} from 'ngx-color-picker';
import {InstanceColorComponent} from '../instance-color/instance-color.component';
import {ColorInputComponent} from '../../../widgets/components/forms/color-input/color-input.component';
import {ThemeModule} from '../../../theme/theme.module';

describe('TimeExplorer', () => {
  let component: TimeExplorer;
  let fixture: ComponentFixture<TimeExplorer>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FlexLayoutModule,
        FormsModule,
        MatSliderModule,
        MatButtonModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule,
        MatDividerModule,
        MatMenuModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        MatTooltipModule,
        ColorPickerModule,
        ThemeModule
      ],
      declarations: [
        TimeSlider,
        TimeExplorer,
        TimeRangeSettingsComponent,
        IntervalSelectorComponent,
        InstanceColorComponent,
        ColorInputComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeExplorer);
    component = fixture.componentInstance;
    component.user = {
      id: 'user id',
      displayName: 'displayName',
      password: 'password'
    };
    component.dashboard = {
      name: 'test'
    };
    fixture.detectChanges();
  });

  describe('#onChangeTimeRangeSetting', () => {
    it('should emit TimeRangeSetting when click select time setting on TimeRangeSettingsComponent component', () => {
      const spy = spyOn(component.onChangeTimeRangeSetting, 'emit');
      const timeRangeSettingComponent = fixture.debugElement.query(By.directive(TimeRangeSettingsComponent));
      timeRangeSettingComponent.triggerEventHandler('onChangeTimeRangeSettings', {type: 'day', value: 1});
      expect(spy).toHaveBeenCalledWith({type: 'day', value: 1});
    });
  });

  describe('#onChangeCurrentTimestamp', () => {
    it('should emit TimeRangeSetting when click select time setting on TimeRangeSettingsComponent component', () => {
      const spy = spyOn(component.onChangeCurrentTimestamp, 'emit');
      const timeSliderComponent = fixture.debugElement.query(By.directive(TimeSlider));
      if (timeSliderComponent) {
        timeSliderComponent.triggerEventHandler('onSlide', 40);
        expect(spy).toHaveBeenCalledWith(40);
      }
    });
  });

  describe('#onOpen', () => {
    it('should emit open event', () => {
      const spy = spyOn(component.onOpen, 'emit');
      const btn = fixture.debugElement.query(By.css('#time-explorer'));
      btn.triggerEventHandler('click', {});
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('#onClose', () => {
    it('should emit close event', () => {
      const spy = spyOn(component.onClose, 'emit');
      const btn = fixture.debugElement.query(By.css('#time-explorer'));
      btn.triggerEventHandler('click', {});
      btn.triggerEventHandler('click', {});
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('on animation done', () => {
    it('should emit opened event', () => {
      const spy = spyOn(component.onOpened, 'emit');
      component.timeSliderState = 'in';
      component.handleAnimationDone();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should emit closed event', () => {
      const spy = spyOn(component.onClosed, 'emit');
      component.timeSliderState = 'out';
      component.handleAnimationDone();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
