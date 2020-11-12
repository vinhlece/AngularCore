import * as moment from 'moment';

describe('#moment', () => {
  it('#clone', () => {
    const current = moment();
    const clonedMoment = current.clone();

    expect(clonedMoment).not.toBe(current);
  });
});
