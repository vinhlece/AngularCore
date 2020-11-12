import {DebugElement} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {By} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {SidebarComponent} from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatButtonModule,
        MatTooltipModule,
        MatIconModule,
      ],
      declarations: [SidebarComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
  });

  it('should emit event when click search', () => {
    const spy = spyOn(component.onClickSearch, 'emit');
    fixture.detectChanges();
    const search = de.query(By.css('.search'));
    search.triggerEventHandler('click', new MouseEvent('click'));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should emit add event when click add', () => {
    const spy = spyOn(component.onClickAdd, 'emit');
    fixture.detectChanges();
    const search = de.query(By.css('.add'));
    search.triggerEventHandler('click', new MouseEvent('click'));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should emit replay event when click replay', () => {
    const spy = spyOn(component.onClickReplay, 'emit');
    component.showReplayButton = true;
    fixture.detectChanges();
    const replay = de.query(By.css('.replay'));
    replay.triggerEventHandler('click', new MouseEvent('click'));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should emit add shift trend diff event when click add shift trend diff', () => {
    const spy = spyOn(component.onClickShiftTrendDiff, 'emit');
    fixture.detectChanges();
    const shiftTrendDiff = de.query(By.css('.shift-trend-diff'));
    shiftTrendDiff.triggerEventHandler('click', new MouseEvent('click'));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should emit add day trend diff event when click add day trend diff', () => {
    const spy = spyOn(component.onClickDayTrendDiff, 'emit');
    fixture.detectChanges();
    const dayTrendDiff = de.query(By.css('.day-trend-diff'));
    dayTrendDiff.triggerEventHandler('click', new MouseEvent('click'));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should emit add week trend diff event when click add week trend diff', () => {
    const spy = spyOn(component.onClickWeekTrendDiff, 'emit');
    fixture.detectChanges();
    const weekTrendDiff = de.query(By.css('.week-trend-diff'));
    weekTrendDiff.triggerEventHandler('click', new MouseEvent('click'));
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
