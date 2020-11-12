import {Component, DebugElement} from '@angular/core';
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ContextMenuItemDirective} from './context-menu-item.directive';

@Component({
  selector: 'app-test-component',
  template: `
    <div appContextMenuItem></div>
  `
})
class TestComponent {
}

describe('ContextMenuItemDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let directiveEl: DebugElement;
  let directive: ContextMenuItemDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ContextMenuItemDirective,
        TestComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    directiveEl = fixture.debugElement.query(By.directive(ContextMenuItemDirective));
    directive = directiveEl.injector.get(ContextMenuItemDirective);
    fixture.detectChanges();
  });

  it('should set context-menu-item class to host element', () => {
    expect(directiveEl.nativeElement.classList).toContain('context-menu-item');
  });

  describe('onclick host element', () => {
    it('should add a ripple to host element', fakeAsync(() => {
      directiveEl.triggerEventHandler('click', {offsetX: 12, offsetY: 21});
      tick();
      fixture.detectChanges();
      const ripple = directiveEl.query(By.css('.context-menu-ripple'));
      expect(ripple).not.toBeNull();
      expect(ripple.nativeElement.style.top).toEqual('21px');
      expect(ripple.nativeElement.style.left).toEqual('12px');
    }));
  });
});
