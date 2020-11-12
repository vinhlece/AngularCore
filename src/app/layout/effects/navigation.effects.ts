import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action} from '@ngrx/store';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import * as navigationActions from '../actions/navigation.actions';

@Injectable()
export class NavigationEffects {
  private _actions: Actions;
  private _router: Router;

  @Effect() navigateTo$: Observable<Action>;

  constructor(actions: Actions, router: Router) {
    this._actions = actions;
    this._router = router;

    this.configureNavigateToEffect();
  }

  private configureNavigateToEffect() {
    this.navigateTo$ = this._actions.pipe(
      ofType(navigationActions.NAVIGATE_TO),
      map((action: navigationActions.Actions) => {
        this._router.navigateByUrl(action.path);
        return {type: 'NAVIGATION'};
      })
    );
  }
}
