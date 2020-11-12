import {EventEmitter} from '@angular/core';
import {cold} from 'jasmine-marbles';
import {of, zip} from 'rxjs';

describe('rxjs', () => {
  describe('#zip', () => {
    it('should combine multi Observable', () => {
      const obs1Mabel = '-a|';
      const obs2Mabel = 'b-|';
      const rsMabel   = '-c|';
      const obs1 = cold(obs1Mabel, {a: 1});
      const obs2 = cold(obs2Mabel, {b: 3});
      const zipObs = zip(obs1, obs2);
      expect(zipObs).toBeObservable(cold(rsMabel, {c: [1, 3]} ));
    });

    it('should combine multi Observables and event emitter', () => {
      const emitter = new EventEmitter();
      const obs1 = of(1);
      const obs2 = of(3);

      const zipObs = zip(obs1, obs2, emitter);

      const spy = jasmine.createSpy('subscriber');
      zipObs.subscribe(spy);

      emitter.emit('aloha');

      expect(spy).toHaveBeenCalledWith([1, 3, 'aloha']);
    });
  });
});
