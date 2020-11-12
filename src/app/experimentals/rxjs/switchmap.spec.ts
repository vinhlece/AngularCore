import {cold} from 'jasmine-marbles';
import {switchMap} from 'rxjs/operators';

describe('rxjs', () => {
  describe('#switchmap', () => {
    it('should emit items of all children when children emits faster than source ', () => {
      const requestSourceMarble = '-a-----a|';
      const requestHandlerMarble = '--a|';
      const expectedMarble = '---a-----a|';
      const requestSource = cold(requestSourceMarble, {a: 1});
      const requestHandler = cold(requestHandlerMarble, {a: 1});
      expect(requestSource.pipe(switchMap(() => requestHandler))).toBeObservable(cold(expectedMarble, {a: 1}));
    });

    it('should emit items of second child even if the first child still emits items', () => {
      const requestSourceMarble = '-a-----b|';
      const requestHandlerMarble1 = '--a--a--a--a--a|';
      const requestHandlerMarble2 = '--a--a|';
      const expectedMarble = '---a--a--b--b|';
      const requestSource = cold(requestSourceMarble, {a: 1, b: 2});
      const child1 = cold(requestHandlerMarble1, {a: 1});
      const child2 = cold(requestHandlerMarble2, {a: 2});
      expect(requestSource.pipe(switchMap((item) => {
        if (item === 1) {
          return child1;
        } else {
          return child2;
        }
      }))).toBeObservable(cold(expectedMarble, {a: 1, b: 2}));
    });
  });
});
