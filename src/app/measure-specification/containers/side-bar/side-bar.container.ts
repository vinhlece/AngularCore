import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromEventSource from '../../reducers';
import * as eventSourceActions from '../../actions/measure-specification.actions';
import * as eventTagActions from '../../actions/event-tag.actions';
import {Observable} from 'rxjs/internal/Observable';
import * as fromMeasure from '../../../measures/reducers';

@Component({
  selector: 'app-measure-side-bar-container',
  templateUrl: './side-bar.container.html',
})
export class MeasureSideBarContainer implements OnInit {
  private _store: Store<fromEventSource.State>;

  streams$: Observable<any>;
  windows$: Observable<any>;
  packages$: Observable<any>;
  eventTags$: Observable<any>;
  customEventTags: Observable<any>;

  constructor(store: Store<fromEventSource.State>) {
    this._store = store;
  }

  ngOnInit() {
    this.streams$ = this._store.pipe(select(fromEventSource.getStream));
    this.packages$ = this._store.pipe(select(fromMeasure.getPackages));
    this.windows$ = this._store.pipe(select(fromMeasure.getWindows));
    this.eventTags$ = this._store.pipe(select(fromEventSource.getEventTags));
    this.customEventTags = this._store.pipe(select(fromEventSource.getCustomEventTags));
  }

  handleGetStream(source: string) {
    this._store.dispatch(new eventSourceActions.LoadAll(source));
  }

  handleSubmit(event: any) {
    this._store.dispatch(new eventSourceActions.Add(Object.keys(event.mapping), event.measure));
    this._store.dispatch(new eventTagActions.CreateEventMappings(event.mapping));
  }

  handleAddEventQualifier(event: any) {
    this._store.dispatch(new eventTagActions.CreateCustomEvent(event.url, event.eventQualifier, event.query));
  }

  handleUpdateEventQualifier(event: any) {
    this._store.dispatch(new eventTagActions.UpdateCustomEvent(event));
  }

  handleDeleteEventQualifier(event: any) {
    this._store.dispatch(new eventTagActions.DeleteCustomEvent(event.url, event.id, event.editingEvent));
  }

  handleUpdateStream(stream) {
    this._store.dispatch(new eventSourceActions.Update(stream));
  }

  handleEventStream(event) {
    this._store.dispatch(new eventTagActions.LoadAllEventTags(event));
  }
}

