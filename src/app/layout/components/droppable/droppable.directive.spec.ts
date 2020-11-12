import {Component, DebugElement} from '@angular/core';
import {DropEvent, DroppableDirective} from './droppable.directive';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

declare let $: any;

@Component({
  selector: 'app-test-component',
  template: `
    <div appDroppable (onDrop)="handleDrop($event)"></div>
  `
})
class TestComponent {
  handleDrop(event: DropEvent) {
  }
}

describe('DroppableDirective', () => {
  let comp: TestComponent;
  let directiveEl: DebugElement;
  let directive: DroppableDirective;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, DroppableDirective]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    comp = fixture.componentInstance;
    directiveEl = fixture.debugElement.query(By.directive(DroppableDirective));
    directive = directiveEl.injector.get(DroppableDirective);
  });

  describe('onInit', () => {
    it('should configure host element to be droppable', () => {
      const spy = spyOn($(directiveEl.nativeElement), 'droppable');
      fixture.detectChanges();
      expect(directiveEl.nativeElement.classList).toContain('ui-droppable');
    });
  });

  // TODO: test drop event
});
