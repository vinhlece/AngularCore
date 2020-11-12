import {TestBed} from '@angular/core/testing';
import {Action, createFeatureSelector, Store, StoreModule} from '@ngrx/store';

describe('ngrx-store', () => {
  let reducer1;
  let reducer2;

  beforeEach(() => {
    reducer1 = jasmine.createSpy('reducer1');
    reducer2 = jasmine.createSpy('reducer2');

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          state1: reducer1,
          state2: reducer2
        }),
      ]
    });
  });

  describe('#reducer', () => {
    it('all reducers receive init Action when the store is initialized', () => {
      const initAction = {type: '@ngrx/store/init'};
      const store = TestBed.get(Store);

      expect(reducer1).toHaveBeenCalledTimes(1);
      expect(reducer1).toHaveBeenCalledWith(undefined, initAction);
      expect(reducer2).toHaveBeenCalledTimes(1);
      expect(reducer2).toHaveBeenCalledWith(undefined, initAction);
    });

    it('all reducers receive the action when an action is dispatched', () => {
      const action = new DefaultAction();
      const store = TestBed.get(Store);
      store.dispatch(action);

      expect(reducer1).toHaveBeenCalledTimes(2);
      expect(reducer1.calls.mostRecent().args).toEqual([undefined, action]);
      expect(reducer2).toHaveBeenCalledTimes(2);
      expect(reducer2.calls.mostRecent().args).toEqual([undefined, action]);
    });
  });

  describe('#selector', () => {
    let store;

    beforeEach(() => {
      // initialize store
      store = TestBed.get(Store);
    });

    it('is a BehaviourSubject so that subscriber will receive the latest state when it subscribes', () => {
      const spy = jasmine.createSpy('spy');
      const state1Selector = createFeatureSelector('state1');
      store.select(state1Selector).subscribe(spy);

      expect(spy).toHaveBeenCalledWith(undefined);
    });

    it('when state2 is changed, state1Selector is not notified', () => {
      // Arrange
      const spy = jasmine.createSpy('spy');
      reducer2.and.callFake(() => {
        return 5;
      });

      const state1Selector = createFeatureSelector('state1');
      store.select(state1Selector).subscribe(spy);

      // Act
      store.dispatch(new DefaultAction());

      // Assert
      // spy only receive the lastest state when subscribes.
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(undefined);
    });

    it('is a synchronous Observer - when an action is dispatched, ' +
      'reducer is called then selector\'subscribers then dispatch completes', () => {
      // Arrange
      const sequence = [];

      const spy = jasmine.createSpy('spy', () => {
        sequence.push('spy');
      }).and.callThrough();

      reducer1.and.callFake(() => {
        sequence.push('reducer');
        return 5;
      });

      const stateSelector = createFeatureSelector('state1');

      store.select(stateSelector).subscribe(spy);

      // Act
      store.dispatch(new DefaultAction());
      sequence.push('afterDispatch');

      // Assert
      expect(sequence).toEqual(['spy', 'reducer', 'spy', 'afterDispatch']);
    });
  });
});

class DefaultAction implements Action {
  type: string;

  constructor() {
    this.type = '';
  }
}
