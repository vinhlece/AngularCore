import {fakeAsync, tick} from '@angular/core/testing';
import {cold, getTestScheduler} from 'jasmine-marbles';
import {ReplaySubject} from 'rxjs';

xdescribe('ReplaySubject', () => {
  it('can use toBeObservable method for checking when setting TestScheduler in constructor', () => {
    const subject = new ReplaySubject(0, 0, getTestScheduler());
    subject.next('a');
    expect(subject).toBeObservable(cold('a'));
  });

  it('emit only the last emitted items when buffer is 0', fakeAsync(() => {
    const subject = new ReplaySubject(0, 0);
    subject.next('a');
    subject.next('a');
    subject.next('a');
    subject.subscribe();
    const spy = jasmine.createSpy('observer');
    subject.subscribe(spy);
    subject.next('b');

    tick();
    expect(spy).toHaveBeenCalledTimes(2);
  }));
});
