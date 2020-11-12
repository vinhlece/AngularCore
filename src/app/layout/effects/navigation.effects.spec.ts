import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {provideMockActions} from '@ngrx/effects/testing';
import {cold, hot} from 'jasmine-marbles';
import {Observable} from 'rxjs';
import * as navigationActions from '../actions/navigation.actions';
import {NavigationEffects} from './navigation.effects';

describe('SingleInstanceWidgetEffects', () => {
  let effect: NavigationEffects;
  let actions: Observable<any>;
  let router: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NavigationEffects,
        provideMockActions(() => actions),
        {provide: Router, useValue: jasmine.createSpyObj('router', ['navigateByUrl'])}
      ]
    }).compileComponents();
  });

  describe('navigateTo$', () => {
    it('should navigate using router', () => {
      const navigateAction = navigationActions.navigateToWidgetList();
      const success = {type: 'NAVIGATION'};

      actions        =  hot('----a', {a: navigateAction});
      const expected = cold('----e', {e: success});

      effect = TestBed.get(NavigationEffects);
      router = TestBed.get(Router);

      expect(effect.navigateTo$).toBeObservable(expected);
      expect(router.navigateByUrl).toHaveBeenCalledWith(navigateAction.path);
    });
  });
});
