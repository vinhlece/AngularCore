import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FlexLayoutModule} from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import {BillboardComponent} from './billboard.component';
import {mockBillboardWidget} from '../../../common/testing/mocks/widgets';
import {By} from '@angular/platform-browser';
import {ThemeModule} from '../../../theme/theme.module';

describe('Billboard component', () => {
  let component: BillboardComponent;
  let fixture: ComponentFixture<BillboardComponent>;
  const widget = mockBillboardWidget();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FlexLayoutModule,
        MatIconModule,
        ThemeModule
      ],
      declarations: [
        BillboardComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillboardComponent);
    component = fixture.componentInstance;
    component.widget = widget;
    component.size = {width: 12, height: 12};
    component.instanceColors = [];
  });

  it('should display current data only when pass value is null', () => {
    component.data = {
      current: {timestamp: 25, value: 50},
      passed: {timestamp: null, value: null},
    };
    fixture.detectChanges();
    const currentData = fixture.debugElement.query(By.css('.latest-data'));
    const passedData = fixture.debugElement.query(By.css('.previous-data'));

    expect(currentData).toBeTruthy();
    expect(passedData).not.toBeTruthy();
  });

  it('should display current data and passed data', () => {
    component.data = {
      current: {timestamp: 25, value: 50},
      passed: {timestamp: 15, value: 60},
    };
    fixture.detectChanges();
    const currentData = fixture.debugElement.query(By.css('.latest-data'));
    const passedData = fixture.debugElement.query(By.css('.previous-data'));

    expect(currentData).toBeTruthy();
    expect(passedData).toBeTruthy();
  });

  describe('Threshold', () => {
    it('passed data should be displayed with widget.threshold.greater color when current value is less than passed value', () => {
      component.data = {
        current: {timestamp: 25, value: 50},
        passed: {timestamp: 15, value: 60},
      };
      fixture.detectChanges();
      const passedData = fixture.debugElement.query(By.css('.previous-data'));
      const style = passedData.nativeElement.style;
      expect(style['color']).toBe(component.widget.thresholdColor.greater.toLowerCase());
    });

    it('passed data should be displayed with widget.threshold.lesser color when current value is great than passed value', () => {
      component.data = {
        current: {timestamp: 25, value: 80},
        passed: {timestamp: 15, value: 60},
      };
      fixture.detectChanges();
      const passedData = fixture.debugElement.query(By.css('.previous-data'));
      const style = passedData.nativeElement.style;
      expect(style['color']).toBe(component.widget.thresholdColor.lesser.toLowerCase());
    });
  });

  describe('onMouseDown', () => {
    it('should emit mousedown event on mousedown', () => {
      component.data = {
        current: {timestamp: 25, value: 50},
        passed: {timestamp: null, value: null},
      };
      fixture.detectChanges();

      const spy = spyOn(component.onMouseDown, 'emit');
      const el = fixture.debugElement.query(By.css('.container'));
      const mouseDownEvent = new MouseEvent('mousedown');
      el.triggerEventHandler('mousedown', mouseDownEvent);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('data change', () => {
    it('should emit change event when data change', () => {
      const spy = spyOn(component.onChange, 'emit');

      component.data = {
        current: {timestamp: 25, value: 50},
        passed: {timestamp: null, value: null},
      };
      fixture.detectChanges();
      component.data = {
        current: {timestamp: 25, value: 50},
        passed: {timestamp: 25, value: 12},
      };

      expect(spy).toHaveBeenCalledTimes(2);
    });
  });
});
