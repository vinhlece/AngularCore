import {cold} from 'jasmine-marbles';
import {concatMap} from 'rxjs/operators';

describe('concatMap', () => {
  it('sequentially emit items of child observables in order', () => {
    const source   = cold('-a--a--a');
    const child    = cold('-bbbbb|');
    const expected = cold('--bbbbb-bbbbb-bbbbb');
    const result = source.pipe(concatMap(() => child));
    expect(result).toBeObservable(expected);
  });
});
