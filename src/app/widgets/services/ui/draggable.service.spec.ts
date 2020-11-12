import {Component, Inject, NO_ERRORS_SCHEMA, ViewContainerRef} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {Store} from '@ngrx/store';
import {DraggableMetricsContainer} from '../../containers/draggable-metrics/draggable-metrics.container';
import {DraggableService, DraggableSource} from '../index';
import {DRAGGABLE_SERVICE} from '../tokens';
import {DraggableServiceImpl} from './draggable.service';

declare let $: any;

@Component({
  selector: 'app-test-component',
  template: `
    <div class="trigger" (mousedown)="handleMouseDown($event)"></div>
  `
})
class TestComponent {
  private _viewContainerRef: ViewContainerRef;
  private _draggableService: DraggableService;

  constructor(viewContainerRef: ViewContainerRef, @Inject(DRAGGABLE_SERVICE) draggableService: DraggableService) {
    this._viewContainerRef = viewContainerRef;
    this._draggableService = draggableService;
  }

  handleMouseDown(event: MouseEvent) {
    const draggableSource: DraggableSource = {
      htmlEvent: event,
      viewContainerRef: this._viewContainerRef,
      trigger: 'test'
    };
    this._draggableService.createDraggableItem(draggableSource);
  }
}

describe('DraggableService', () => {
  let fixture: ComponentFixture<TestComponent>;
  let viewContainerRef: ViewContainerRef;
  let component: TestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        DraggableMetricsContainer,
      ],
      providers: [
        {provide: DRAGGABLE_SERVICE, useClass: DraggableServiceImpl},
        {provide: Store, useValue: jasmine.createSpyObj('store', ['pipe', 'dispatch'])}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [DraggableMetricsContainer]
      }
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    viewContainerRef = fixture.debugElement.injector.get(ViewContainerRef);
  });

  describe('#mousedown', () => {
    it('should do nothing if it is right mouse', () => {
      fixture.detectChanges();
      $(fixture.nativeElement).append($('<div/>', {'class': 'element-clone'}));
      $(fixture.nativeElement).append($('<div/>', {'class': 'element-clone'}));
      const triggerEl = fixture.debugElement.query(By.css('.trigger'));
      triggerEl.triggerEventHandler('mousedown', new MouseEvent('mousedown', {button: 1}));
      expect($('.element-clone').length).toEqual(2);
    });

    it('should remove previous instance clone but keep the current', () => {
      fixture.detectChanges();
      $(fixture.nativeElement).append($('<div/>', {'class': 'element-clone'}));
      $(fixture.nativeElement).append($('<div/>', {'class': 'element-clone'}));
      const triggerEl = fixture.debugElement.query(By.css('.trigger'));
      triggerEl.triggerEventHandler('mousedown', new MouseEvent('mousedown', {button: 0}));
      expect($('.element-clone').length).toEqual(1);
    });

    // TODO Disabled test as causes issues due undefined 'pipe' on spy object
    xit('should insert draggable instance component into host element', () => {
      const viewContainerRefSpy = spyOn(viewContainerRef, 'insert');
      fixture.detectChanges();
      const triggerEl = fixture.debugElement.query(By.css('.trigger'));
      triggerEl.triggerEventHandler('mousedown', new MouseEvent('mousedown', {button: 0}));
      expect(viewContainerRefSpy).toHaveBeenCalledTimes(1);
    });

    it('should remove instance clone element from the host element', () => {
      fixture.detectChanges();
      const triggerEl = fixture.debugElement.query(By.css('.trigger'));
      triggerEl.triggerEventHandler('mousedown', new MouseEvent('mousedown', {button: 0}));
      expect($(fixture.nativeElement).children('.element-clone').length).toEqual(0);
    });

    it('should insert a instance clone element into body', () => {
      fixture.detectChanges();
      const triggerEl = fixture.debugElement.query(By.css('.trigger'));
      triggerEl.triggerEventHandler('mousedown', new MouseEvent('mousedown', {button: 0}));
      expect($(document.body).find('.element-clone').length).toEqual(1);
    });
  });
});
