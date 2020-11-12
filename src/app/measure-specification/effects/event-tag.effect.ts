import {Inject, Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action} from '@ngrx/store';
import {Observable} from 'rxjs/index';
import {of} from 'rxjs';
import * as eventTagActions from '../actions/event-tag.actions';
import {catchError, map, mergeMap, flatMap, switchMap} from 'rxjs/internal/operators';
import {EventSourceService} from '../services/index';
import {EVENT_SOURCE_SERVICE} from '../services/tokens';

@Injectable()
export class EventTagEffect {
  private _actions$: Actions;
  private _eventSourceService: EventSourceService;
  @Effect() createEventTag$: Observable<Action>;
  @Effect() updateEventTag$: Observable<Action>;
  @Effect() deleteEventTag$: Observable<Action>;
  @Effect() createEventMappings$: Observable<Action>;
  @Effect() createEventMapping$: Observable<Action>;
  @Effect() loadAllEventTags$: Observable<Action>;

  constructor(actions$: Actions,
              @Inject(EVENT_SOURCE_SERVICE) eventSourceService: EventSourceService) {
    this._actions$ = actions$;
    this._eventSourceService = eventSourceService;
    this.createEventTag();
    this.updateEventTag();
    this.deleteEventTag();
    this.createEventMappings();
    this.createEventMapping();
    this.loadAllEventTags();
  }

  private createEventTag() {
    this.createEventTag$ = this._actions$.pipe(
      ofType(eventTagActions.CREATE_CUSTOM_EVENT),
      switchMap((action) => {
        const data = action as eventTagActions.CreateCustomEvent;
        return this._eventSourceService.createEventTag(data.payload, data.body).pipe(
          map((response: any) => new eventTagActions.CreateCustomEventSuccess({id: response.id, name: data.body.name, query: data.query})),
          catchError((error: Error) => of(new eventTagActions.ActionFailure(error))));
      })
    );
  }

  private updateEventTag() {
    this.updateEventTag$ = this._actions$.pipe(
      ofType(eventTagActions.UPDATE_CUSTOM_EVENT),
      switchMap((action) => {
        const data = (action as eventTagActions.UpdateCustomEvent).payload;
        return this._eventSourceService.deleteEventTag(data.url, data.eventQualifier.id).pipe(
          switchMap((delRes: any) => this._eventSourceService.createEventTag(data.url, data.eventQualifier).pipe(
            map((creRes: any) => {
              const newEvent = {id: creRes.id, name: data.eventQualifier.name, query: data.query};
              return new eventTagActions.UpdateCustomEventSuccess(newEvent, data.eventQualifier.id, data.editingEvent);
            }),
            catchError((error: Error) => of(new eventTagActions.ActionFailure(error)))
          )),
          catchError((error: Error) => of(new eventTagActions.ActionFailure(error))));
      })
    );
  }

  private deleteEventTag() {
    this.deleteEventTag$ = this._actions$.pipe(
      ofType(eventTagActions.DELETE_CUSTOM_EVENT),
      switchMap((action) => {
        const data = action as eventTagActions.DeleteCustomEvent;
        return this._eventSourceService.deleteEventTag(data.payload, data.id).pipe(
          map((response: any) => new eventTagActions.DeleteCustomEventSuccess(data.id, data.editingEvent)),
          catchError((error: Error) => of(new eventTagActions.ActionFailure(error))));
      })
    );
  }

  private createEventMappings() {
    this.createEventMappings$ = this._actions$.pipe(
      ofType(eventTagActions.CREATE_EVENT_MAPPINGS),
      mergeMap((action: eventTagActions.CreateEventMappings) => {
        const actions = [];
        Object.keys(action.payload).forEach(source => {
          action.payload[source].forEach(mapping => {
            actions.push(new eventTagActions.CreateEventMapping(source, mapping));
          });
        });
        return actions;
      })
    );
  }

  private createEventMapping() {
    this.createEventMapping$ = this._actions$.pipe(
      ofType(eventTagActions.CREATE_EVENT_MAPPING),
      mergeMap((action: eventTagActions.CreateEventMapping) => {
        return this._eventSourceService.createEventMapping(action.payload, action.body).pipe(
          map((response: any) => new eventTagActions.CreateEventMappingSuccess(action.body)),
          catchError((error: Error) => of(new eventTagActions.ActionFailure(error))));
      })
    );
  }

  private loadAllEventTags() {
    this.loadAllEventTags$ = this._actions$.pipe(
      ofType(eventTagActions.LOAD_ALL_EVENT_TAGS),
      flatMap((action: eventTagActions.LoadAllEventTags) => {
        return this._eventSourceService.getAllEventTags(action.payload).pipe(
          map((data) => {
            data = data.map(d => {
              return {...d, query: this.convertParametersToQuery(d.parameters)};
            });
            return new eventTagActions.LoadAllEventTagsSuccess(data);
          }),
          catchError((error: Error) => of(new eventTagActions.ActionFailure(error)))
        );
      })
    );
  }

  convertParametersToQuery(params) {
    const queries = params.reduce((query, param) => {
      const prefixKey = 'body.userdata.';
      const key = param.name.indexOf(prefixKey) !== -1 ? param.name.split(prefixKey)[1] : param.name;
      const condition = param.type === 'EQUALS' ? ' = ' : ' != ';
      query.push(`${key}${condition}"${param.value}"`);
      return query;
    }, []);
    return queries.join(' AND ');
  }
}
