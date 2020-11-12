import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormBuilder} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import {By} from '@angular/platform-browser';
import {EditWidgetFormComponent} from './edit-widget-form.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateModule} from '@ngx-translate/core';
import {WidgetType} from '../../../constants/widget-types';
import {ThemeModule} from '../../../../theme/theme.module';

describe('EditWidgetFormComponent', () => {
  let fixture: ComponentFixture<EditWidgetFormComponent>;
  let comp: EditWidgetFormComponent;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        imports: [
          MatButtonModule,
          BrowserAnimationsModule,
          MatDialogModule,
          TranslateModule.forRoot(),
          ThemeModule
        ],
        declarations: [
          EditWidgetFormComponent
        ],
        providers: [FormBuilder],
        schemas: [NO_ERRORS_SCHEMA]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWidgetFormComponent);
    de = fixture.debugElement;
    comp = fixture.componentInstance;
    comp.options = {
      name: {
        enabled: true,
        value: 'Demo widget'
      },
      dataType: {
        enabled: true,
        value: 'Queue Performance',
        availableValues: ['Queue Status', 'Queue Performance']
      },
      chartType: {
        enabled: true,
        value: 'Line with focus',
        availableValues: ['Line without focus', 'Line with focus']
      },
      mode: {
        enabled: true,
        value: 'Instances'
      },
      measures: {
        enabled: true,
        value: ['ContactsAnswered', 'ContactsOfferd'],
        availableValues: [{name: 'ContactsAnswered'}, {name: 'ContactsOffered'}, {name: 'ContactsAbandoned'}]
      },
      measure: {
        enabled: true,
        value: 'ContactsAnswered',
        availableValues: ['ContactsAnswered', 'ContactsOffered']
      },
      instance: {
        enabled: true,
        value: 'New Sales'
      },
      thresholdColor: {
        enabled: true,
        value: {greater: 'Green', lesser: 'Red'}
      },
      trendType: {
        enabled: true,
        value: 'Day',
        availableValues: ['Day', 'Shift']
      },
      period: {
        enabled: true,
        value: 3
      },
      defaultSize: {
        enabled: true,
        value: {rows: 3, columns: 4}
      },
      showAllData: {
        enabled: true,
        value: true
      },
      enableNavigator: {
        enabled: true,
        value: true
      },
      type: {
        enabled: true,
        value: WidgetType.Bar
      }
    };
  });

  // describe('save', () => {
  //   it('should emit event when click save', () => {
  //     fixture.detectChanges();
  //     const spy = spyOn(comp.onSubmit, 'emit');
  //     const saveBtn = de.query(By.css('.save-btn'));
  //     expect(spy).toHaveBeenCalledTimes(1);
  //   });
  // });

  describe('cancel', () => {
    it('should emit event when click cancel', () => {
      const spy = spyOn(comp.onCancel, 'emit');
      const cancelBtn = de.query(By.css('.cancel-btn'));
      if (cancelBtn) {
        cancelBtn.triggerEventHandler('click', {});
        expect(spy).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('change', () => {
    it('should emit change event form value change', () => {
      fixture.detectChanges();
      const spy = spyOn(comp.onChange, 'emit');
      comp.form.controls['name'].setValue('abc');
      expect(spy).toHaveBeenCalled();
    });
  });
});
