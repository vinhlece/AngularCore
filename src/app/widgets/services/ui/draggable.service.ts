import {ComponentFactoryResolver, Injectable, ViewContainerRef} from '@angular/core';
import {Subject} from 'rxjs';
import {DraggableService, DraggableSource} from '..';
import {MouseEventUtils} from '../../../common/events/MouseEventUtils';
import {DraggableMetricsContainer} from '../../containers/draggable-metrics/draggable-metrics.container';
import {DragEvent} from '../../models';

declare let $: any;

@Injectable()
export class DraggableServiceImpl implements DraggableService {
  private _componentFactoryResolver: ComponentFactoryResolver;
  private _viewContainerRef: ViewContainerRef;
  private _$cloneElement: any;
  private _cloneElementClass = 'element-clone';
  private _payloadName = 'app-droppable-data'; // Name of the measure payload will be transferred to droppable element
  private _draggableSource: DraggableSource;

  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    this._componentFactoryResolver = componentFactoryResolver;
  }

  onDragStart = new Subject<DragEvent>();
  onDrag = new Subject<DragEvent>();
  onDragStop = new Subject<DragEvent>();

  createDraggableItem(draggableSource: DraggableSource) {
    this.createDraggableComponent(DraggableMetricsContainer, draggableSource);
  }

  createDraggableComponent(componentClass, draggableSource: DraggableSource) {
    const {viewContainerRef, htmlEvent} = draggableSource;

    if (MouseEventUtils.isLeftMouse(htmlEvent)) {
      this._draggableSource = draggableSource;
      this._viewContainerRef = viewContainerRef;

      this.removePreviousClones();
      this.appendDraggableComponentToBody(componentClass, htmlEvent.pageX, htmlEvent.pageY);
      this.triggerDraggableComponent(htmlEvent);
    }
  }

  private removePreviousClones() {
    $(`.${this._cloneElementClass}`).remove();
  }

  private appendDraggableComponentToBody(componentClass, mouseX: number, mouseY: number) {
    const component = this.insertDraggableComponent(componentClass);
    this.appendToBody(component, mouseX, mouseY);
  }

  // Move the component from the host element and append it to the body in order to set its position easier
  private appendToBody(component, mouseX: number, mouseY: number) {
    this._$cloneElement = $(component.el.nativeElement);
    this._$cloneElement.addClass(this._cloneElementClass);

    this._$cloneElement.detach();
    this._$cloneElement.appendTo('body');

    this.setStyle(mouseX, mouseY);
  }

  private triggerDraggableComponent(event: MouseEvent) {
    const payload = {
      trigger: this._draggableSource.trigger,
      widget: this._draggableSource.widget,
      draggable: this._draggableSource.draggable,
    };
    this.draggable(event, payload, 'app-draggable-component');
  }

  // Make the clone element draggable and add additional data to it
  private draggable(event: MouseEvent, payload, className: string) {
    this._$cloneElement.draggable({
      containment: 'body',
      delay: 200,
      stack: '.grid-stack',
      start: (e, ui) => {
        // Add payload data (measure) to the draggable element
        ui.helper.data(this._payloadName, payload);

        this._$cloneElement.addClass(className);
        this._$cloneElement.removeClass(this._cloneElementClass);
        this._$cloneElement.css({visibility: this._draggableSource.hideDraggable ? 'hidden' : 'visible'});

        this.onDragStart.next(this.getDragEvent(e, ui));
      },
      drag: (e, ui) => {
        this.onDrag.next(this.getDragEvent(e, ui));
      },
      stop: (e, ui) => {
        this._$cloneElement.remove();
        this.onDragStop.next(this.getDragEvent(e, ui));
      }
    });
    // Toggle drag event programmatically
    this._$cloneElement.trigger($.event.fix(event));
  }

  private insertDraggableComponent(draggableComponent) {
    const factory = this._componentFactoryResolver.resolveComponentFactory(draggableComponent);
    const component = factory.create(this._viewContainerRef.parentInjector);
    this._viewContainerRef.insert(component.hostView);
    return component.instance;
  }

  private setStyle(mouseX: number, mouseY: number) {
    // Position mouse pointer at the center of the clone element
    this._$cloneElement.css({
      zIndex: 1000,
      top: mouseY,
      left: mouseX,
      position: 'absolute',
      visibility: 'hidden'
    });
  }

  private getDragEvent(e, ui): DragEvent {
    return {originalEvent: e.originalEvent.originalEvent, position: ui.position, target: ui.helper[0], type: 'metric'};
  }
}
