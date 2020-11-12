import * as _ from 'lodash';

describe('reduce', () => {
  it('build big object', () => {
    const data = [
      {
        key: 'instance',
        measureName: 'contactsAbandoned',
        measureValue: 20,
        measureTimestamp: 1
      },
      {
        key: 'instance',
        measureName: 'contactsAnswered',
        measureValue: 10,
        measureTimestamp: 1
      }];

    const expected = {
      key: 'instance',
      contactsAbandoned: 20,
      contactsAnswered: 10,
      measureTimestamp: 1
    };

    const result = _.reduce(data, (sum, item) => {
      sum[item.measureName] = item.measureValue;
      return sum;
    }, {key: 'instance', measureTimestamp: 1});

    expect(result).toEqual(expected);
  });

  it('merge 2 arrays with unique name', () => {
    const measure1 = [
      {
        name: 'ContactsOffered',
        relatedTo: ['ContactsAbandoned', 'ContactsAnswered']
      },
      {
        name: 'ServiceLevel',
        relatedTo: ['StaffedCount']
      }
    ];
    const measure2 = [
      {
        name: 'ContactsAnswered',
        relatedTo: []
      },
      {
        name: 'ContactsOffered',
        relatedTo: []
      }
    ];
    const expected = [
      {
        name: 'ContactsOffered',
        relatedTo: ['ContactsAbandoned', 'ContactsAnswered']
      },
      {
        name: 'ServiceLevel',
        relatedTo: ['StaffedCount']
      },
      {
        name: 'ContactsAnswered',
        relatedTo: []
      }
    ]
    const result = _.chain(measure1).concat(measure2).uniqBy('name').value();
    expect(result).toEqual(expected);
  });
});
