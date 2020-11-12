import {cold, getTestScheduler} from 'jasmine-marbles';
import * as _ from 'lodash';
import {interval} from 'rxjs';

describe('rxjs', () => {
  describe('#interval', () => {
    it('should emit 15 items (from frame 0 to frame 750) when interval is 50 milliseconds', () => {
      const data = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o'];
      const marbles = ['-'];
      for (let i = 0; i < 15; i++) {
        marbles.push(_.padStart(data[i], 5, '-'));
      }
      const marble = marbles.join('');

      expect(interval(50, getTestScheduler())).toBeObservable(cold(marble,
        {a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7, i: 8, j: 9, k: 10, l: 11, m: 12, n: 13, o: 14}));
    });
  });
});


