import {cold, hot} from 'jasmine-marbles';
import {merge} from 'rxjs';

describe('rxjs', () => {
  describe('#merge', () => {
    it('should combine multiple Observables into one by merging their emissions', () => {
      const e1Marble       = '----a---^-b------c----|';
      const e2Marble       = '---d---e---------f-----|';
      const expectedMarble = '--bd---e-c-------f-----|';

      const e1 = hot(e1Marble);
      const e2 = cold(e2Marble);
      const expected = cold(expectedMarble);
      expect(merge(e1, e2)).toBeObservable(expected);
    });
  });
});
