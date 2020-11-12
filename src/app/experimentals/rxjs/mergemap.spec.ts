import {cold} from 'jasmine-marbles';
import {flatMap, mergeMap} from 'rxjs/operators';

describe('rxjs', () => {
  describe('#mergehmap', () => {
    it('should emit items and transform them by a function and return the merging of those result ', () => {
      const sourceMarble    = '-a----a-------|';
      const transformMarble = 'b---b|';
      const expectedMarble  = '-b---bb---b---|';
      const source = cold(sourceMarble, {a: 1});
      const transform = cold(transformMarble, {b: 3});
      expect(source.pipe(flatMap(() => transform))).toBeObservable(cold(expectedMarble, {b: 3}));
    });

    it('should emit all items although source stream terminate before transform stream', () => {
      const sourceMarble    = '-a----a--|';
      const transformMarble = 'b---b|';
      const expectedMarble  = '-b---bb---b|';
      const source = cold(sourceMarble, {a: 1});
      const transform = cold(transformMarble, {b: 3});
      expect(source.pipe(mergeMap(() => transform))).toBeObservable(cold(expectedMarble, {b: 3}));
    });

    it('should throw error when transform stream emits error', () => {
      const sourceMarble    = '-a----a--|';
      const transformMarble = '#';
      const expectedMarble  = '-#';
      const source = cold(sourceMarble);
      const transform = cold(transformMarble);
      expect(source.pipe(mergeMap(() => transform))).toBeObservable(cold(expectedMarble));
    });

    // transform the items emitted by an Observable into Observables, then flatten the emissions from those into a single Observable
    it('chain two sources', () => {
      const one      = '-a---a--';
      const two      = '--------b-';
      // frame calculation: first item: 1 + 8 = 9, second item: 5 + 8 = 13
      const expected = '---------b---b';

      const oneObs = cold(one);
      const twoObs = cold(two);
      const expectedObs = cold(expected);

      expect(oneObs.pipe(flatMap(() => twoObs))).toBeObservable(expectedObs);
    });

    it('chain 3 sources', () => {
      const one      = '-a--a--';
      const two      = '-------b---b-----';
      const three    = '--c';
      // one + (two + three)
      const expected = '----------c--cc--c';

      const oneObs = cold(one);
      const twoObs = cold(two);
      const threeObs = cold(three);
      const expectedObs = cold(expected);

      expect(oneObs.pipe(flatMap(() => twoObs.pipe(flatMap(() => threeObs))))).toBeObservable(expectedObs);
    });
  });
});
