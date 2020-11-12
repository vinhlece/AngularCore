import {fromJS} from 'immutable';
import {FormulaMeasureInjector} from './injector';

describe('FormulaMeasureInjector', () => {
  it('should call realtimeDataProcessor.generateFormulaMeasureData', () => {
    const data = fromJS([]);
    const measures = [];
    const processor = jasmine.createSpyObj('RealtimeDataProcessor', ['generateFormulaMeasureData']);
    const service = new FormulaMeasureInjector(processor, 'Queue Performance', measures);

    service.intercept(data);

    expect(processor.generateFormulaMeasureData).toHaveBeenCalledWith(data, 'Queue Performance', measures);
  });
});
