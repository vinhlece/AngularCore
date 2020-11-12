import {cold, getTestScheduler} from 'jasmine-marbles';
import {takeUntil} from 'rxjs/operators';

describe('rxjs', () => {
  describe('#takeUntil', () => {
    it('should work', () => {
      const e1Marble       = '-a--b--c--d---|';
      const e1Sub          = '^-----!';
      const e2Marble       = '------e';
      const expectedMarble = '-a--b-|';
      const e1 = cold(e1Marble);
      const e2 = cold(e2Marble);
      const expected = cold(expectedMarble);
      expect(e1.pipe(takeUntil(e2))).toBeObservable(expected);
      getTestScheduler().expectSubscriptions(e1.getSubscriptions()).toBe(e1Sub);
    });
  });
});
