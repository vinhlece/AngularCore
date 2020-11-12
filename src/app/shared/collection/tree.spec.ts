import {PrimitiveWrapper} from '../../realtime/models/key';
import {QueryItem} from './index';
import {Tree} from './tree';

describe('Tree', () => {
  describe('insert', () => {
    it('should insert a node with key & value - sort nodes in asc order by default', () => {
      const tree = new Tree<PrimitiveWrapper, string>();
      const key1 = new PrimitiveWrapper('key 1');
      const result1 = tree.insert(key1, 'value 1');
      expect(result1).toBeTruthy();
      expect(tree.size()).toEqual(1);
      expect(tree.get(key1)).toEqual('value 1');

      const key2 = new PrimitiveWrapper('key 2');
      const result2 = tree.insert(key2, 'value 2');
      expect(result2).toBeTruthy();
      expect(tree.size()).toEqual(2);
      expect(tree.get(key2)).toEqual('value 2');

      const expectedValues = ['value 1', 'value 2'];
      expect(tree.values).toEqual(expectedValues);
    });

    it('should insert a node with key & value - sort nodes in desc order', () => {
      const tree = new Tree<PrimitiveWrapper, string>('desc');
      const key1 = new PrimitiveWrapper('key 1');
      const result1 = tree.insert(key1, 'value 1');
      expect(result1).toBeTruthy();
      expect(tree.size()).toEqual(1);
      expect(tree.get(key1)).toEqual('value 1');

      const key2 = new PrimitiveWrapper('key 2');
      const result2 = tree.insert(key2, 'value 2');
      expect(result2).toBeTruthy();
      expect(tree.size()).toEqual(2);
      expect(tree.get(key2)).toEqual('value 2');

      const expectedValues = ['value 2', 'value 1'];
      expect(tree.values).toEqual(expectedValues);
    });

    it('should do nothing if key already exists', () => {
      const tree = new Tree<PrimitiveWrapper, string>();
      const key = new PrimitiveWrapper('key 1');
      tree.insert(key, 'value 1');
      const result = tree.insert(key, 'value 2');
      expect(result).toBeFalsy();
      expect(tree.size()).toEqual(1);
      expect(tree.get(key)).toEqual('value 1');
    });
  });

  describe('update', () => {
    it('should update a not if it exists', () => {
      const tree = new Tree<PrimitiveWrapper, string>();
      const key1 = new PrimitiveWrapper('key 1');
      tree.insert(key1, 'value 1');
      const result = tree.update(key1, 'updated value 1');
      expect(result).toBeTruthy();
      expect(tree.size()).toEqual(1);
      expect(tree.get(key1)).toEqual('updated value 1');
    });

    it('should do nothing if node does not exists', () => {
      const tree = new Tree<PrimitiveWrapper, string>();
      const key1 = new PrimitiveWrapper('key 1');
      tree.insert(key1, 'value 1');
      const result = tree.update(new PrimitiveWrapper('key 2'), 'dummy');
      expect(result).toBeFalsy();
      expect(tree.size()).toEqual(1);
      expect(tree.get(key1)).toEqual('value 1');
    });
  });

  describe('remove', () => {
    it('should remove a node if it exists', () => {
      const tree = new Tree<PrimitiveWrapper, string>();
      const key1 = new PrimitiveWrapper('key 1');
      tree.insert(key1, 'value 1');
      const result = tree.remove(key1);
      expect(result).toEqual('value 1');
      expect(tree.size()).toEqual(0);
      expect(tree.get(key1)).toBeUndefined();
    });

    it('should do nothing if node does not exists', () => {
      const tree = new Tree<PrimitiveWrapper, string>();
      const key1 = new PrimitiveWrapper('key 1');
      tree.insert(key1, 'value 1');
      const result = tree.remove(new PrimitiveWrapper('key 2'));
      expect(result).toBeUndefined();
      expect(tree.size()).toEqual(1);
      expect(tree.get(key1)).toEqual('value 1');
    });
  });

  describe('find', () => {
    it('$eq', () => {
      const tree = new Tree<PrimitiveWrapper, string>();
      tree.insert(new PrimitiveWrapper(1), 'value 1');
      tree.insert(new PrimitiveWrapper(2), 'value 2');
      tree.insert(new PrimitiveWrapper(3), 'value 3');
      tree.insert(new PrimitiveWrapper(4), 'value 4');
      expect(tree.find({$eq: new PrimitiveWrapper(1)})).toEqual(['value 1']);
      expect(tree.find({$eq: new PrimitiveWrapper(5)})).toEqual([]);
    });

    it('$gt', () => {
      const tree = new Tree<PrimitiveWrapper, string>();
      tree.insert(new PrimitiveWrapper(1), 'value 1');
      tree.insert(new PrimitiveWrapper(2), 'value 2');
      tree.insert(new PrimitiveWrapper(3), 'value 3');
      tree.insert(new PrimitiveWrapper(4), 'value 4');
      expect(tree.find({$gt: new PrimitiveWrapper(2)})).toEqual(['value 3', 'value 4']);
      expect(tree.find({$gt: new PrimitiveWrapper(4)})).toEqual([]);
    });

    it('$gte', () => {
      const tree = new Tree<PrimitiveWrapper, string>();
      tree.insert(new PrimitiveWrapper(1), 'value 1');
      tree.insert(new PrimitiveWrapper(2), 'value 2');
      tree.insert(new PrimitiveWrapper(3), 'value 3');
      tree.insert(new PrimitiveWrapper(4), 'value 4');
      expect(tree.find({$gte: new PrimitiveWrapper(2)})).toEqual(['value 2', 'value 3', 'value 4']);
      expect(tree.find({$gte: new PrimitiveWrapper(5)})).toEqual([]);
    });

    it('$lt', () => {
      const tree = new Tree<PrimitiveWrapper, string>();
      tree.insert(new PrimitiveWrapper(1), 'value 1');
      tree.insert(new PrimitiveWrapper(2), 'value 2');
      tree.insert(new PrimitiveWrapper(3), 'value 3');
      tree.insert(new PrimitiveWrapper(4), 'value 4');
      expect(tree.find({$lt: new PrimitiveWrapper(3)})).toEqual(['value 1', 'value 2']);
      expect(tree.find({$lt: new PrimitiveWrapper(1)})).toEqual([]);
    });

    it('$lte', () => {
      const tree = new Tree<PrimitiveWrapper, string>();
      tree.insert(new PrimitiveWrapper(1), 'value 1');
      tree.insert(new PrimitiveWrapper(2), 'value 2');
      tree.insert(new PrimitiveWrapper(3), 'value 3');
      tree.insert(new PrimitiveWrapper(4), 'value 4');
      expect(tree.find({$lte: new PrimitiveWrapper(3)})).toEqual(['value 1', 'value 2', 'value 3']);
      expect(tree.find({$lte: new PrimitiveWrapper(0)})).toEqual([]);
    });

    it('$in', () => {
      const tree = new Tree<PrimitiveWrapper, string>();
      tree.insert(new PrimitiveWrapper(1), 'value 1');
      tree.insert(new PrimitiveWrapper(2), 'value 2');
      tree.insert(new PrimitiveWrapper(3), 'value 3');
      tree.insert(new PrimitiveWrapper(4), 'value 4');
      expect(tree.find({$in: [new PrimitiveWrapper(1), new PrimitiveWrapper(3)]})).toEqual(['value 1', 'value 3']);
      expect(tree.find({$in: [new PrimitiveWrapper(0)]})).toEqual([]);
    });

    it('mixed', () => {
      const tree = new Tree<PrimitiveWrapper, string>();
      tree.insert(new PrimitiveWrapper(1), 'value 1');
      tree.insert(new PrimitiveWrapper(2), 'value 2');
      tree.insert(new PrimitiveWrapper(3), 'value 3');
      tree.insert(new PrimitiveWrapper(4), 'value 4');
      const query: QueryItem = {
        $gt: new PrimitiveWrapper(2),
        $in: [new PrimitiveWrapper(2), new PrimitiveWrapper(3)]
      };
      expect(tree.find(query)).toEqual(['value 3']);
    });
  });
});
