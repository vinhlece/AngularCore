import {fromJS, Map} from 'immutable';

describe('Immutable groupBy', () => {
  it('should work with grouper return a Map', () => {
    const students = [
      {name: 'Nam', age: 17, gender: 'Male'},
      {name: 'Dung', age: 18, gender: 'Male'},
      {name: 'Hoa', age: 18, gender: 'Female'},
      {name: 'Nam', age: 18, gender: 'Male'},
      {name: 'Dung', age: 17, gender: 'Female'},
      {name: 'Yen', age: 17, gender: 'Female'}
    ];
    const studentList = fromJS(students);

    let expectedMap = Map();
    const key1 = fromJS({age: 17, gender: 'Female'});
    const value1 = fromJS([
      {name: 'Dung', age: 17, gender: 'Female'},
      {name: 'Yen', age: 17, gender: 'Female'}
    ]);
    expectedMap = expectedMap.set(key1, value1);

    const key2 = fromJS({age: 17, gender: 'Male'});
    const value2 = fromJS([
      {name: 'Nam', age: 17, gender: 'Male'}
    ]);
    expectedMap = expectedMap.set(key2, value2);

    const key3 = fromJS({age: 18, gender: 'Female'});
    const value3 = fromJS([
      {name: 'Hoa', age: 18, gender: 'Female'}
    ]);
    expectedMap = expectedMap.set(key3, value3);

    const key4 = fromJS({age: 18, gender: 'Male'});
    const value4 = fromJS([
      {name: 'Dung', age: 18, gender: 'Male'},
      {name: 'Nam', age: 18, gender: 'Male'}
    ]);
    expectedMap = expectedMap.set(key4, value4);

    const group = studentList.groupBy((student) => {
      return fromJS({
        age: student.get('age'),
        gender: student.get('gender')
      });
    });

    expect(group.toJS()).toEqual(expectedMap.toJS());
  });
});
