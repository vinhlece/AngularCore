import {ViewContainerRef} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Draggable} from '../../dashboard/models/enums';
import {WidgetData} from '../../realtime/models';
import {DragEvent, Widget} from '../models';
import {ColorPalette} from '../../common/models/index';

export interface PreviewDataGenerator {
  generate(widget: Widget): Observable<WidgetData>;
}

export interface DraggableService {
  onDragStart: Subject<DragEvent>;

  onDrag: Subject<DragEvent>;

  onDragStop: Subject<DragEvent>;

  createDraggableItem(draggableSource: DraggableSource);
}

export interface DraggableSource {
  htmlEvent: MouseEvent;
  viewContainerRef: ViewContainerRef;
  trigger: string;
  widget?: Widget;
  draggable?: Draggable;
  hideDraggable?: boolean;
}

export interface WidgetsFactory {
  create(options: any, colorPalette: ColorPalette): any;

  createFromTemplate(template: Widget, widgets: Widget[]): Widget;
}
