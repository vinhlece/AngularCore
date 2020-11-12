import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {first} from 'rxjs/operators';
import {ZoomEvent} from '../../../charts/models';
import * as callTimeLineActions from '../../actions/call-time-line.actions';
import * as timePreferencesActions from '../../actions/time-preferences.actions';
import * as fromDashboards from '../../reducers';

export interface ZoomBehavior {
  zoom(event: ZoomEvent);
}

export class CanNotZoom implements ZoomBehavior {
  zoom(event: ZoomEvent) {
    // do nothing
  }
}

export abstract class CanZoom implements ZoomBehavior {
  private _store: Store<fromDashboards.State>;

  constructor(store: Store<fromDashboards.State>) {
    this._store = store;
  }

  get store(): Store<fromDashboards.State> {
    return this._store;
  }

  abstract getZoom(): Observable<ZoomEvent>;

  abstract dispatchZoom(event: ZoomEvent);

  abstract dispatchResetZoom();

  zoom(event: ZoomEvent) {
    if (this.isDragToZoom(event)) {
      this.handleDragToZoom(event);
    } else if (this.isZoomByRangeSelectorButton(event)) {
      this.handleZoomByRangeSelectorButton(event);
    }
  }

  private isDragToZoom(event: ZoomEvent): boolean {
    return event.trigger === 'zoom' || event.trigger === 'navigator';
  }

  private handleDragToZoom(event: ZoomEvent) {
    this.dispatchZoom(event);
  }

  private isZoomByRangeSelectorButton(event: ZoomEvent): boolean {
    return event.trigger === 'rangeSelectorButton';
  }

  private handleZoomByRangeSelectorButton(event: ZoomEvent) {
    this.getZoom()
      .pipe(first())
      .subscribe((zoom: ZoomEvent) => {
        // To prevent infinite loop, we will not send zoom event if zoom time range does not change
        if (zoom.rangeSelectorButton !== event.rangeSelectorButton) {
          if (event.rangeSelectorButton !== 'All') {
            this.dispatchZoom(event);
          } else {
            this.dispatchResetZoom();
          }
        }
      });
  }
}

export class ZoomOnLine extends CanZoom {
  getZoom(): Observable<ZoomEvent> {
    return this.store.pipe(select(fromDashboards.getZoom));
  }

  dispatchZoom(event: ZoomEvent) {
    this.store.dispatch(new timePreferencesActions.TriggerZoom(event));
  }

  dispatchResetZoom() {
    this.store.dispatch(new timePreferencesActions.ResetZoom());
  }
}

export class ZoomOnCallTimeLine extends CanZoom {
  getZoom(): Observable<ZoomEvent> {
    return this.store.pipe(select(fromDashboards.getCallTimeLineZoom));
  }

  dispatchZoom(event: ZoomEvent) {
    this.store.dispatch(new callTimeLineActions.Zoom(event));
  }

  dispatchResetZoom() {
    this.store.dispatch(new callTimeLineActions.ResetZoom());
  }
}
