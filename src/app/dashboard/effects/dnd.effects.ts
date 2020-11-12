import {Inject, Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {interval} from 'rxjs/internal/observable/interval';
import {flatMap, map, takeUntil, tap} from 'rxjs/operators';
import {DragEvent} from '../../widgets/models';
import {DraggableService, DraggableSource} from '../../widgets/services';
import {DRAGGABLE_SERVICE} from '../../widgets/services/tokens';
import * as dndActions from '../actions/dnd.actions';
import * as fromDashboards from '../reducers';

@Injectable()
export class DndEffects {
  private _actions$: Actions;
  private _store: Store<fromDashboards.State>;
  private _service: DraggableService;

  @Effect({dispatch: false}) dragMetric$: Observable<any>;
  @Effect({dispatch: false}) scrolling$: Observable<any>;
  @Effect() dragStart$: Observable<Action>;
  @Effect() dragStop$: Observable<Action>;
  @Effect() drag$: Observable<Action>;

  constructor(action: Actions,
              store: Store<fromDashboards.State>,
              @Inject(DRAGGABLE_SERVICE) service: DraggableService) {
    this._actions$ = action;
    this._store = store;
    this._service = service;

    this.scrollingEffect();
    this.dragMetricEffect();
    this.dragStartEffect();
    this.dragStopEffect();
    this.dragEffect();
  }

  private dragMetricEffect() {
    this.dragMetric$ = this._actions$.pipe(
      ofType(dndActions.DRAG_METRIC),
      tap((action: dndActions.DragMetric) => {
        const {parent, event, draggable, hideDraggable} = action.payload;
        const draggableSource: DraggableSource = {
          htmlEvent: event,
          viewContainerRef: parent,
          trigger: 'widget',
          widget: event.widget,
          draggable: draggable,
          hideDraggable
        };
        this._service.createDraggableItem(draggableSource);
      })
    );
  }

  private scrollingEffect() {
    this.scrolling$ = this._actions$.pipe(
      ofType(dndActions.DRAG_START),
      flatMap((action: dndActions.DragStart) => {
        return interval(20).pipe(
          takeUntil(this._actions$.pipe(ofType(dndActions.DRAG_STOP))),
          tap(() => {
            const timeExplorer = document.querySelector('app-time-explorer-container');
            const tabHeader = document.querySelector('mat-tab-header');
            const target = action.payload.target;
            const parent = target.parentElement;
            const offset = 5;
            if (parent.offsetHeight === document.body.offsetHeight) {
              if (target.offsetTop + 25 >= parent.offsetHeight - target.offsetHeight) {
                this.scroll(offset);
              } else if (target.offsetTop - 25 <= timeExplorer.clientHeight + tabHeader.clientHeight) {
                this.scroll(-offset);
              }
            }
          })
        );
      })
    );
  }

  private dragStartEffect() {
    this.dragStart$ = this._service.onDragStart.pipe(map((event: DragEvent) => new dndActions.DragStart(event)));
  }

  private dragStopEffect() {
    this.dragStop$ = this._service.onDragStop.pipe(map((event: DragEvent) => new dndActions.DragStop(event)));
  }

  private dragEffect() {
    this.drag$ = this._service.onDrag.pipe(map((event: DragEvent) => new dndActions.Drag(event)));
  }

  private scroll(offset: number) {
    const el = this.getScrollingContainer();
    el.scrollTop = el.scrollTop + offset;
  }

  private getScrollingContainer(): Element {
    const containers = document.getElementsByClassName('mat-tab-body-content');
    for (let i = 0; i < containers.length; i++) {
      const container = containers.item(i);
      if (container.getElementsByTagName('app-tab-editor').length > 0) {
        return container;
      }
    }
  }
}
