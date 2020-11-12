import {NO_ERRORS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FlexLayoutModule} from '@angular/flex-layout';
import {TabularCellComponent} from './tabular-cell.component';

describe('TabularCellComponent', () => {
  let fixture: ComponentFixture<TabularCellComponent>;
  let comp: TabularCellComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FlexLayoutModule
      ],
      declarations: [
        TabularCellComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TabularCellComponent);
    comp = fixture.componentInstance;
  }));

  it('should twinkle when primary value change', () => {
    const twinkle = jasmine.createSpyObj('twinkle', ['trigger']);
    comp.twinkleTrigger = twinkle;
    comp.twinkle = true;
    comp.primary = {value: 12, color: 'black', format: 'number'};
    fixture.detectChanges();

    // null value - should not trigger
    comp.primary = null;
    expect(twinkle.trigger).toHaveBeenCalledTimes(0);

    // value does not change
    comp.primary = {value: 12, color: 'black', format: 'number'};
    expect(twinkle.trigger).toHaveBeenCalledTimes(0);

    comp.primary = {value: 13, color: 'red', format: 'number'};
    // TODO disabled until directive injection updated
    // expect(twinkle.trigger).toHaveBeenCalledTimes(1);
  });

  it('should twinkle when secondary value change', () => {
    const twinkle = jasmine.createSpyObj('twinkle', ['trigger']);
    comp.twinkleTrigger = twinkle;
    comp.twinkle = true;
    comp.secondary = {value: 12, color: 'black', format: 'number'};
    fixture.detectChanges();

    // null value - should not trigger
    comp.secondary = null;
    expect(twinkle.trigger).toHaveBeenCalledTimes(0);

    // value does not change
    comp.secondary = {value: 12, color: 'black', format: 'number'};
    expect(twinkle.trigger).toHaveBeenCalledTimes(0);

    comp.secondary = {value: 13, color: 'red', format: 'number'};
    // TODO disabled until directive injection updated
    // expect(twinkle.trigger).toHaveBeenCalledTimes(1);
  });

  it('should not twinkle when twinkle = false', () => {
    const twinkle = jasmine.createSpyObj('twinkle', ['trigger']);
    comp.twinkleTrigger = twinkle;
    comp.twinkle = false;
    comp.secondary = {value: '12', color: 'black', format: 'number'};
    fixture.detectChanges();

    expect(twinkle.trigger).toHaveBeenCalledTimes(0);

    // value does not change
    comp.secondary = {value: '12', color: 'black', format: 'number'};
    expect(twinkle.trigger).toHaveBeenCalledTimes(0);

    // null value - should not trigger
    comp.secondary = null;
    expect(twinkle.trigger).toHaveBeenCalledTimes(0);

    comp.secondary = {value: '13', color: 'red', format: 'number'};
    expect(twinkle.trigger).toHaveBeenCalledTimes(0);
  });
});
