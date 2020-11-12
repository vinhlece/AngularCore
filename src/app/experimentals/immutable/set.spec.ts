import {Set} from 'immutable';

describe('Set', () => {
  describe('#groupBy', () => {
    it('group records by category', () => {
      const set = Set([
        {category: 'cat', name: 'cat'},
        {category: 'cat', name: 'lion'},
        {category: 'cat', name: 'tiger'},
        {category: 'dog', name: 'Shepherd'},
        {category: 'dog', name: 'Dalmatian'},
        {category: 'dog', name: 'Wolf'},
      ]);

      const groups = set.groupBy(item => item.category);

      expect(groups.size).toEqual(2);
      expect(groups.get('cat').size).toEqual(3);
      expect(groups.get('dog').size).toEqual(3);
    });

    describe('#flatMap', () => {
      it('create a new set with records returned by the function', () => {
        const set = Set([
          {category: 'cat', name: 'cat'},
          {category: 'cat', name: 'lion'},
          {category: 'cat', name: 'tiger'},
          {category: 'dog', name: 'Shepherd'},
          {category: 'dog', name: 'Dalmatian'},
          {category: 'dog', name: 'Wolf'},
        ]);

        const result = set.flatMap(item => Set([item, {category: 'cat', name: item.name + '1'}]));

        expect(result.size).toEqual(12);
      });
    });
  });
});
