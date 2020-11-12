import {EventEmitter} from '@angular/core';
import {BehaviorSubject, combineLatest} from 'rxjs';

describe('combineLatest', () => {
  it('of 2 observables will emit latest items whenever a observable emits', () => {
    const spy = jasmine.createSpy('subscriber');
    const source = new BehaviorSubject('a');
    const eventEmitter = new EventEmitter<number>();

    combineLatest(source, eventEmitter).subscribe(spy);

    eventEmitter.emit(1);
    expect(spy).toHaveBeenCalledWith(['a', 1]);

    source.next('b');
    expect(spy).toHaveBeenCalledWith(['b', 1]);

    eventEmitter.emit(2);
    expect(spy).toHaveBeenCalledWith(['b', 2]);
  });
});
