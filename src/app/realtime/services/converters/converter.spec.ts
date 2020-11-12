import {Converter} from './converter';

describe('Converter', () => {
  describe('#convert', () => {
    it('call correct methods', () => {
      const filteredData = [];
      const interceptor = jasmine.createSpyObj('Interceptor', ['intercept']);
      interceptor.intercept.and.returnValue(filteredData);

      const groupedData = {};
      const grouper = jasmine.createSpyObj('Grouper', ['groupData']);
      grouper.groupData.and.returnValue(groupedData);

      const builder = jasmine.createSpyObj('Builder', ['generate']);
      const converter = new Converter(interceptor, grouper, builder);

      const data = [];
      converter.convert(data);

      expect(interceptor.intercept).toHaveBeenCalledWith(data);
      expect(grouper.groupData).toHaveBeenCalledWith(filteredData);
      expect(builder.generate).toHaveBeenCalledWith(groupedData, null);
    });
  });
});
