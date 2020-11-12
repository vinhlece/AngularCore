import {StatusMeasures} from '../../measures/models/enums';
import {
  FormulaMeasureImpl,
  NullFormulaMeasure,
  SandBoxFormulaMeasureFactory
} from '../../measures/services/formula/formula-measure.service';
import {RealtimeData} from '../models';
import {RealTimeDataProcessor} from './index';
import {RealTimeDataProcessorImpl} from './real-time-data-processor.service';
import {Calculated} from '../models/constants';

describe('real time data processor', () => {
  const item1: RealtimeData = {
    instance: 'New Sales',
    measureName: StatusMeasures.Available,
    measureValue: 3,
    measureTimestamp: 10,
    dataType: 'Queue Performance',
    metricCalcType: Calculated,
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  };
  const item2: RealtimeData = {
    instance: 'New Sales',
    measureName: StatusMeasures.NotReady,
    measureValue: 12,
    measureTimestamp: 35,
    dataType: 'Queue Performance',
    metricCalcType: Calculated,
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  };
  const item3: RealtimeData = {
    instance: 'New Sales',
    measureName: StatusMeasures.Available,
    measureValue: 5,
    measureTimestamp: 27,
    dataType: 'Queue Performance',
    metricCalcType: Calculated,
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  };
  const item4: RealtimeData = {
    instance: 'Upgrade',
    measureName: StatusMeasures.NotReady,
    measureValue: 5,
    measureTimestamp: 3,
    dataType: 'Queue Performance',
    metricCalcType: Calculated,
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  };
  const item5: RealtimeData = {
    instance: 'New Sales',
    measureName: StatusMeasures.NotReady,
    measureValue: 5,
    measureTimestamp: 11,
    dataType: 'Queue Performance',
    metricCalcType: Calculated,
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  };
  const data = [item1, item2, item3, item4, item5];
  const filteredKey = 'New Sales';
  const timestamp = 12;
  const measureFactory = new SandBoxFormulaMeasureFactory();
  const service = new RealTimeDataProcessorImpl(measureFactory);

  describe('getLatestTimestamp', () => {
    it('should return latest timestamp', () => {
      const result = service.getLatestTimestamp(data);
      const expected = 35;
      expect(result).toEqual(expected);
    });
  });

  describe('getDataInTimeRange', () => {
    it('should return data in specified time range', () => {
      const result = service.getDataInTimeRange(data, {startTimestamp: 11, endTimestamp: 30});
      const expected = [item3, item5];
      expect(result).toEqual(expected);
    });
  });

  describe('getAllLatestTimestampData', () => {
    it('should return all data that have same timestamp', () => {
      const item6: RealtimeData = {
        instance: 'New Sales',
        measureName: StatusMeasures.Available,
        measureValue: 12,
        measureTimestamp: 35,
        dataType: 'Queue Performance',
        metricCalcType: Calculated,
        dimension: 'Continent',
        window: 'INSTANTANEOUS'
      };
      const dataSpec = [item1, item2, item3, item4, item5, item6];
      const result = service.getAllLatestTimestampData(dataSpec);
      const expected = [item2, item6];
      expect(result).toEqual(expected);
    });
  });

  describe('filterDataByKeys', () => {
    it('should return data in specified keys', () => {
      const result = service.filterDataByKeys(data, ['Upgrade']);
      const expected = [item4];
      expect(result).toEqual(expected);
    });
  });

  describe('filterDataByMeasures', () => {
    it('should return data in specified measures', () => {
      const result = service.filterDataByMeasures(data, 'Queue Performance', [StatusMeasures.Available], ['INSTANTANEOUS']);
      const expected = [item1, item3];
      expect(result).toEqual(expected);
    });
  });

  describe('getLatestTimestampHavingData', () => {
    it('should return 0 if maxTimestamp is less than minTimestamp of data', () => {
      const result = service.getLatestTimestampHavingData(data, 2);

      expect(result).toEqual(0);
    });

    it('should return maxTimestamp if there is data which timestamp is same as maxTimestamp', () => {
      const result = service.getLatestTimestampHavingData(data, 11);

      expect(result).toEqual(11);
    });

    it('should return nearest Timestamp of data if there is no data at maxTimestamp', () => {
      const result = service.getLatestTimestampHavingData(data, 13);

      expect(result).toEqual(11);
    });
  });

  describe('filterDataByInstancesAndMeasures', () => {
    it('for a single instance and single measure - should return data of that instance and that measure', () => {
      const result = service.filterDataByInstancesAndMeasures(data, 'Queue Performance', {Continent: ['New Sales']}, [StatusMeasures.Available], ['INSTANTANEOUS']);
      const expected = [item1, item3];
      expect(result).toEqual(expected);
    });

    it('for a single instance and 2 measures - should return data of that instance and 2 measures', () => {
      const result = service.filterDataByInstancesAndMeasures(
        data,
        'Queue Performance',
        {Continent: ['New Sales']},
        [StatusMeasures.Available, StatusMeasures.NotReady],
        ['INSTANTANEOUS']
      );
      const expected = [item1, item2, item3, item5];
      expect(result).toEqual(expected);
    });

    it('for 2 instances and a measure - should return data of those 2 instances and that measure', () => {
      const result = service.filterDataByInstancesAndMeasures(
        data,
        'Queue Performance',
        {Continent: ['New Sales', 'Upgrade']},
        [StatusMeasures.NotReady],
        ['INSTANTANEOUS']
      );
      const expected = [item2, item4, item5];
      expect(result).toEqual(expected);
    });

    it('for 2 instances and 2 measure - should return data of those 2 instances and 2 measures', () => {
      const result = service.filterDataByInstancesAndMeasures(
        data,
        'Queue Performance',
        {Continent: ['New Sales', 'Upgrade']},
        [StatusMeasures.Available, StatusMeasures.NotReady],
        ['INSTANTANEOUS']
      );
      const expected = [item1, item2, item3, item4, item5];
      expect(result).toEqual(expected);
    });
  });

  describe('getElementMeasures', () => {
    let formulaFactory, processor: RealTimeDataProcessor;

    beforeEach(() => {
      formulaFactory = jasmine.createSpyObj('FormulaFactory', ['create']);
      processor = new RealTimeDataProcessorImpl(formulaFactory);
    });

    it('with empty measure list, return empty list', () => {
      const elementMeasures = processor.getElementMeasures([]);

      const expected = [];
      expect(elementMeasures).toEqual(expected);
    });

    it('with elemental measures only then no more measures are added', () => {
      formulaFactory.create.and.returnValue(new NullFormulaMeasure());
      const elementMeasures = processor.getElementMeasures(['elementalMeasure1', 'elementalMeasure2']);

      expect(elementMeasures).toEqual(['elementalMeasure1', 'elementalMeasure2']);
    });

    it('with formula measures only then element measures of formulas are added', () => {
      const formulaMeasure = jasmine.createSpyObj('FormulaMeasure', ['extract']);
      formulaMeasure.extract.and.returnValue(['elementMeasure']);
      const formulaMeasure1 = jasmine.createSpyObj('FormulaMeasure1', ['extract']);
      formulaMeasure1.extract.and.returnValue(['elementMeasure1']);
      formulaFactory.create.and.callFake(measure => {
        if (measure === 'formulaMeasure') {
          return formulaMeasure;
        } else {
          return formulaMeasure1;
        }
      });

      const elementMeasures = processor.getElementMeasures(['formulaMeasure', 'formulaMeasure1']);

      expect(elementMeasures).toEqual(['elementMeasure1', 'elementMeasure', 'formulaMeasure', 'formulaMeasure1']);
    });

    it('with formula measures only then element measures of formulas are added with no duplication', () => {
      const formulaMeasure = jasmine.createSpyObj('FormulaMeasure', ['extract']);
      formulaMeasure.extract.and.returnValue(['elementMeasure']);
      const formulaMeasure1 = jasmine.createSpyObj('FormulaMeasure1', ['extract']);
      formulaMeasure1.extract.and.returnValue(['elementMeasure']);
      formulaFactory.create.and.callFake(measure => {
        if (measure === 'elementMeasure') {
          return formulaMeasure;
        } else {
          return formulaMeasure1;
        }
      });

      const elementMeasures = processor.getElementMeasures(['formulaMeasure', 'formulaMeasure1']);

      expect(elementMeasures).toEqual(['elementMeasure', 'formulaMeasure', 'formulaMeasure1']);
    });
  });

  describe('generateFormulaMeasureData', () => {
    it('should generate data base on formula measure', () => {
      const item6: RealtimeData = {
        dataType: 'Queue Performance',
        instance: 'New Sales',
        measureName: StatusMeasures.Available,
        measureValue: 8,
        measureTimestamp: 11,
        metricCalcType: Calculated,
        dimension: 'Continent',
        window: 'INSTANTANEOUS'
      };
      const resultItem1: RealtimeData = {
        dataType: 'Queue Performance',
        instance: 'Upgrade',
        measureName: 'Sum Measure',
        measureValue: 5,
        measureTimestamp: 3,
        metricCalcType: Calculated
      };

      const resultItem2: RealtimeData = {
        dataType: 'Queue Performance',
        instance: 'New Sales',
        measureName: 'Sum Measure',
        measureValue: 13,
        measureTimestamp: 11,
        metricCalcType: Calculated
      };

      const records = [item4, item5, item6];
      const formulaMeasure = new FormulaMeasureImpl('Sum Measure', StatusMeasures.Available + ' + ' + StatusMeasures.NotReady);
      spyOn(measureFactory, 'create').and.returnValue(formulaMeasure);

      const result = service.generateFormulaMeasureData(records, 'Queue Performance', ['Sum Measure']);
      const expected = [item4, item5, item6, resultItem1, resultItem2];
      expect(result).toEqual(expected);
    });
  });
});

