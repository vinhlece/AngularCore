import {DebugElement} from '@angular/core';
import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ContextMenuComponent} from './context-menu.component';

describe('ContextMenuComponent', () => {
  let fixture: ComponentFixture<ContextMenuComponent>;
  let comp: ContextMenuComponent;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule],
      declarations: [ContextMenuComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
  });

  describe('set event', () => {
    it('should not show context menu if event is not exists', () => {
      comp.event = null;
      fixture.detectChanges();
      const el = de.query(By.css('.context-menu'));
      expect(comp.visible).toEqual(false);
      expect(el).toBeNull();
    });

    it('should throw error if event is not contextmenu event', () => {
      expect(() => comp.event = {type: 'click'}).toThrowError();
    });

    it('should show context menu at specified position if event is valid', fakeAsync(() => {
      comp.event = {type: 'contextmenu', clientX: 12, clientY: 13};
      tick();
      fixture.detectChanges();
      const el = de.query(By.css('.context-menu'));
      expect(comp.visible).toEqual(true);
      expect(comp.top).toEqual(13);
      expect(comp.left).toEqual(12);
      expect(el).not.toBeNull();
    }));
  });

  describe('target element as close trigger', () => {
    let targetEl: HTMLElement;

    beforeEach(() => {
      targetEl = document.createElement('div');
      comp.event = {
        type: 'contextmenu',
        target: targetEl,
        clientX: 12,
        clientY: 12
      };
      fixture.detectChanges();
    });

    it('should hide context menu when click target element', fakeAsync(() => {
      targetEl.dispatchEvent(new MouseEvent('click'));
      tick();
      expect(comp.visible).toEqual(false);
    }));

    it('should remove click event from target element when component is destroyed', () => {
      const spy = spyOn(targetEl, 'removeEventListener');
      comp.ngOnDestroy();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('click', jasmine.any(Function), false);
    });
  });

  describe('document as default close trigger', () => {
    it('should hide context menu when click default close trigger', fakeAsync(() => {
      comp.event = {type: 'contextmenu', clientX: 12, clientY: 13};
      fixture.detectChanges();
      document.dispatchEvent(new MouseEvent('click'));
      tick();
      expect(comp.visible).toEqual(false);
    }));

    it('should remove click event for default close trigger when component is destroyed', () => {
      fixture.detectChanges();
      const spy = spyOn(document, 'removeEventListener');
      comp.ngOnDestroy();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('click', jasmine.any(Function), false);
    });
  });
});
