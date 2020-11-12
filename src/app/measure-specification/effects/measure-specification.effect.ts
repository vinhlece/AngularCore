import {Inject, Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action, select, Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {catchError, flatMap, map, withLatestFrom} from 'rxjs/operators';
import * as eventActions from '../actions/measure-specification.actions';
import {EventSourceService} from '../services';
import {EVENT_SOURCE_SERVICE} from '../services/tokens';
import { MatDialog } from '@angular/material/dialog';
import * as fromUser from '../../user/reducers/index';
import * as fromEventSource from '../reducers/index';
import {MessageDialogFormComponent} from '../../common/components/message-dialog-form/message-dialog-form.component';
import {mergeMap} from 'rxjs/internal/operators';
import {isNullOrUndefined} from 'util';

@Injectable()
export class EventSourceEffects {
  private _actions$: Actions;
  private _eventSourceService: EventSourceService;
  private _dialogService: MatDialog;
  private _store: Store<fromEventSource.State>;
  private _dialogData;

  @Effect() loadAll$: Observable<Action>;
  @Effect() add$: Observable<Action>;
  @Effect() addMeasure$: Observable<Action>;
  @Effect() loadStreams$: Observable<Action>;

  constructor(actions$: Actions,
              store: Store<fromEventSource.State>,
              @Inject(EVENT_SOURCE_SERVICE) eventSourceService: EventSourceService,
              dialogService: MatDialog) {
    this._actions$ = actions$;
    this._store = store;
    this._eventSourceService = eventSourceService;
    this._dialogService = dialogService;

    this.loadAllEffect();
    this.addEffect();
    this.addMeasureEffect();
    this.loadStreams();
  }

  private loadAllEffect() {
    this.loadAll$ = this._actions$.pipe(
      ofType(eventActions.LOAD_ALL),
      flatMap((action) => {
        const eventSource = (action as eventActions.LoadAll).payload;
        return this._eventSourceService.getSourceByUrl(eventSource).pipe(
          map((sources) => new eventActions.LoadAllStreams(sources[0].id, eventSource)),
          catchError((error: Error) => of(new eventActions.ActionFailure(error, eventSource)))
        );
      })
    );
  }

  private addEffect() {
    this.add$ = this._actions$.pipe(
      ofType(eventActions.ADD),
      mergeMap((action: eventActions.Add) => {
        const actions = [];
        action.payload.forEach(source => {
          actions.push(new eventActions.AddMeasure(source, action.measure));
        });
        return actions;
      })
    );
  }

  private addMeasureEffect() {
    this.addMeasure$ = this._actions$.pipe(
      ofType(eventActions.ADD_MEASURE),
      withLatestFrom(this._store.pipe(select(fromUser.getAuthenticatedUser))),
      flatMap(([action, user]) => {
        const addAction = (action as eventActions.AddMeasure);
        const body = {...addAction.measure, createdBy: user.id};
        return this._eventSourceService.addMeasure(addAction.payload, body).pipe(
          map((data) => {
            if (this._dialogService.openDialogs.length === 0) {
              this._dialogData = this._dialogService.open(MessageDialogFormComponent, {
                width: '500px',
                data: `Measure '${addAction.measure.measureName}' saved successfully`
              });
            }
            return new eventActions.AddSuccess(data);
          }),
          catchError((error: Error) => of(new eventActions.FailureResponse(error)))
        );
      })
    );
  }

  private loadStreams() {
    this.loadStreams$ = this._actions$.pipe(
      ofType(eventActions.LOAD_ALL_STREAMS),
      flatMap((action: eventActions.LoadAllStreams) => {
        return this._eventSourceService.getAllStreams(action.eventSource, action.payload).pipe(
          map((data) => new eventActions.LoadAllSuccess(data, action.eventSource)),
          catchError((error: Error) => of(new eventActions.FailureResponse(error)))
        );
      })
    );
  }
}
