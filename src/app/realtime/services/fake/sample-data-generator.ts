import * as _ from 'lodash';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {getCurrentMoment, getMomentByTimestamp} from '../../../common/services/timeUtils';
import {uuid} from '../../../common/utils/uuid';
import {Measure} from '../../../measures/models';
import {AGENT_PERFORMANCE} from '../../../measures/models/constants';
import {AgentKeys, QueueKeys} from '../../../measures/models/enums';
import {PackagesService} from '../../../measures/services';
import {RealtimeData, Segment, USState} from '../../models';
import {Calculated, Predicted, US_STATES} from '../../models/constants';
import {buildUSInstance} from '../../utils/us-instance';
import {MeasureFilter} from '../../models/web-socket/widget-container';

export class SampleDataGenerator {
  private static RANGE_MIN = 10;
  private static RANGE_MAX = 200;

  private _packagesService: PackagesService;

  private static generateNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  constructor(packagesService: PackagesService) {
    this._packagesService = packagesService;
  }

  getDataForPackage(packageName: string, segment: Segment, predictiveSegment?: Segment, measureFilters?: MeasureFilter[]): Observable<RealtimeData[]> {
    return this._packagesService.getMeasuresOfPackage(packageName).pipe(
      map((measures: Measure[]) => {
        const actualData = this.generateSegmentData(packageName, measures, segment, measureFilters);
        if (predictiveSegment) {
          return [...actualData, ...this.generateSegmentData(packageName, measures, predictiveSegment, measureFilters)];
        }
        return actualData;
      })
    );
  }

  private generateSegmentData(packageName: string, allMeasures: Measure[], segment: Segment, measureFilters?: MeasureFilter[]): RealtimeData[] {
    let measures = null;
    let dimension = null;
    if (measureFilters) {
      measures = allMeasures.filter(m => measureFilters.findIndex(i => i.measure === m.name) >= 0);
    } else {
      measures = allMeasures;
    }
    const checkInstances = (measureName: string, instance: string) => {
      const selected = measureFilters.find(m => m.measure === measureName);
      if (selected) {
        const current = selected.dimensionFilters.find(d => d.dimension === dimension);
        if (current) {
          return current.included.length > 0 ? current.included.indexOf(instance) >= 0 : true;
        }
      }
      return false;
    };
    if (measureFilters) {
      let dimensions = [];
      let windows = [];
      measureFilters.forEach(m => {
        m.dimensionFilters.forEach(d => {
          dimensions = _.union(dimensions, [d.dimension]);
        });
        m.windows.forEach(w => {
          windows = _.union(windows, [w]);
        });
      });
      const getData = () => {
        const basicData = this.getBasicData(packageName, measures, segment, checkInstances);
        const sankeyData = this.getSankeyData(measures, segment, checkInstances);
        const sunburstData = this.getSunburstData(measures, segment, checkInstances);
        const callTimeLineData = this.getCallTimeLineData(measures, segment);
        return [...basicData, ...sankeyData, ...sunburstData, ...callTimeLineData];
      };
      if (measureFilters[0].measure === 'CallTimeLine') {
        measures = allMeasures;
        return getData();
      }
      if (dimensions.length === 0) {
        dimensions.push('fake-show-all-data');
      }
      const newData = [];
      dimensions.forEach(d => {
        windows.forEach(w => {
          dimension = d;
          const data = getData();
          data.forEach(i => {
            let isExist = false;
            measureFilters.forEach(m => {
              m.dimensionFilters.forEach(df => {
                if (df.included.length === 0 || (df.included.indexOf(i.instance) >= 0 && df.dimension === d)) {
                  isExist = true;
                }
              });
            });
            if (isExist || d === 'fake-show-all-data') {
              newData.push({...i, dimension: d, window: {windowType: w, window: ''}});
            }
          });
        });
      });
      return newData;
    }
    return [];
  }

  private getBasicData(packageName: string, measures: Measure[], segment: Segment, checkInstances: any): RealtimeData[] {
    const basicMeasures = this.getBasicMeasures(measures);
    const basicInstances = this.getBasicInstances(packageName);
    return this.generateBasicData(basicInstances, basicMeasures, segment, checkInstances);
  }

  private getSankeyData(measures: Measure[], segment: Segment, checkInstances: any): RealtimeData[] {
    const sankeyMeasures = this.getSankeyMeasures(measures);
    const sankeyInstances = this.getSankeyInstances();
    return this.generateBasicData(sankeyInstances, sankeyMeasures, segment, checkInstances);
  }

  private getSunburstData(measures: Measure[], segment: Segment, checkInstances: any): RealtimeData[] {
    const sunburstMeasures = this.getSunburstMeasures(measures);
    const sunburstInstances = this.getSunburstIntances();
    return this.generateBasicData(sunburstInstances, sunburstMeasures, segment, checkInstances);
  }

  private getCallTimeLineData(measures: Measure[], segment: Segment): RealtimeData[] {
    const callTimeLineMeasures = this.getCallTimeLineMeasures(measures);
    const segmentMeasures = this.getBasicMeasures(measures);
    const agents = this.getCallTimeLineAgents();
    const queues = this.getCallTimeLineQueues();
    return this.generateCallTimeLineData(callTimeLineMeasures, segmentMeasures, agents, queues, segment);
  }

  private generateBasicData(instances: string[], measures: Measure[], segment: Segment, checkInstances: any): RealtimeData[] {
    const start = getMomentByTimestamp(segment.timeRange.startTimestamp);
    const end = getMomentByTimestamp(segment.timeRange.endTimestamp);
    const currentTime = +getCurrentMoment();

    const data: RealtimeData[] = [];
    while (start.isBefore(end)) {
      instances.forEach((instance: string) => {
        measures.forEach((measure: Measure) => {
          const measureTimestamp = start.valueOf();
          const measureName = measure.name;
          if (!checkInstances(measureName, instance)) { return; }
          const measureValue = this.generateMeasureValue(measure);
          const metricCalcType = measureTimestamp > currentTime ? Predicted : Calculated;
          data.push({
            instance: instance,
            measureName,
            measureTimestamp,
            measureValue,
            dataType: measure.dataType,
            metricCalcType
          });
        });
      });

      start.add(segment.dataPointInterval.value, segment.dataPointInterval.type);
    }

    return data;
  }

  private generateCallTimeLineData(measures: Measure[],
                                   segmentMeasures: Measure[],
                                   agents: string[],
                                   queues: string[],
                                   segment: Segment): RealtimeData[] {
    const start = getMomentByTimestamp(segment.timeRange.startTimestamp);
    const end = getMomentByTimestamp(segment.timeRange.endTimestamp);

    const locations = ['US', 'UK', 'VN', 'FR', 'JP', 'KR', 'GR'];

    const data: RealtimeData[] = [];
    measures.forEach((measure: Measure) => {
      // locations.forEach((location: string) => {
        agents.forEach((agent: string) => {
          queues.forEach((queue: string) => {
            const callID = uuid().split('-')[0];
            let measureTimestamp = start.valueOf();
            segmentMeasures.forEach((segmentMeasure: Measure) => {
              const measureName = measure.name;
              const measureValue = +this.generateMeasureValue(measure) * 10000;
              data.push({
                measureName,
                measureTimestamp,
                measureValue,
                dataType: measure.dataType,
                segmentType: segmentMeasure.name,
                metricCalcType: Calculated,
                agent,
                queue,
                callID
                // location
              });
              measureTimestamp += measureValue;
            });
          });
        });
      // });
    });
    return data;
  }

  private getSankeyInstances(): string[] {
    return [
      'Ireland,Sales',
      'Ireland,Sales,iPhone',
      'Ireland,Sales,iPhone,v7',
      'Ireland,Sales,iPhone,v6',
      'Ireland,Sales,iPad',
      'Ireland,Sales,iPad,v7',
      'Ireland,Sales,iPad,v6',
      'UK,Sales',
      'UK,Sales,iPhone',
      'UK,Sales,iPhone,v7',
      'UK,Sales,iPhone,v6',
      'UK,Sales,iPad',
      'UK,Sales,iPad,v7',
      'UK,Sales,iPad,v6',
    ];
  }

  private getQueueInstances(): string[] {
    return [
      ..._.values(QueueKeys),
      // Fruits
      // 'Orange',
      // 'Apple',
      // 'Durian',
      // 'Lemon',
      // 'Mango',
      // 'Watermelon',
      // 'Avocado',
      // 'Cherry',
      // 'Fig',
      // 'Guava',
      // 'Kiwi',
      // 'Lime',
      // 'Mandarin',
      // 'Papaya',
      // 'Coconut',
      // Animals
      'Dog',
      'Cat',
      'Mouse',
      'Elephant',
      'Tiger',
      'Snake',
      'Bear',
      'Dragon',
      'Rabbit',
      'Fish',
      // Flowers
      // 'Lily',
      // 'Anemone',
      // 'Chrysanthemum',
      'Rose',
      // 'Sunflower',
      // 'Tulip',
      // 'Violet',
      // 'Waxflower',
      // 'Snapdragon',
      // 'Lavender',
      'Tom,Sales,EU-1',
      'Tom,Sales,US-1',
      'Jerry,Calls,EU-1',
      'Jerry,Calls,US-1',
      'Jerry,Calls',
      // US states,
      'Bronze,Mixed',
      'Bronze,Neutral',
      'Bronze,Positive',
      'Silver,Mixed',
      'Silver,Neutral',
      'Silver,Positive',
      'Gold,Mixed',
      'Gold,Neutral',
      'Gold,Positive',
      'Platinum,Mixed',
      'Platinum,Neutral',
      'Platinum,Positive',
      'Diamond,Mixed',
      'Diamond,Neutral',
      'Diamond,Positive',
      ...this.getUSInstances()
    ];
  }

  private getSunburstIntances(): string[] {
    return [
      'en,sipuri,Credit Card',
      'en,sipuri,Savings',
      'en,sipuri,Checking',
      'en,chat,Mortgage',
      'en,chat,Checking',
      'en,chat,Auto Loans',
      'en,chat,Savings',
      'en,email,Savings',
      'en,email,Home Equity',
      'en,email,Business Lending',
      'en,email,Credit Card',
      'en,Mobile Video,Business Banking',
      'en,Mobile Video,Business Lending',
      'en,Mobile Video,Savings',
      'en,sipuri,Credit Card,Extremely Happy',
      'en,sipuri,Credit Card,Unhappy',
      'en,sipuri,Savings,Extremely Unhappy',
      'en,sipuri,Checking,Extremely Happy',
      'en,sipuri,Checking,Happy',
      'en,sipuri,Checking,Unhappy',
      'en,chat,Mortgage,Extremely Unhappy',
      'en,chat,Mortgage,Neutral',
      'en,chat,Checking,Extremely Unhappy',
      'en,chat,Auto Loans,Neutral',
      'en,chat,Auto Loans,Happy',
      'en,chat,Savings,Unhappy',
      'en,email,Savings,Neutral',
      'en,email,Home Equity,Happy',
      'en,email,Business Lending,Happy',
      'en,email,Credit Card,Happy',
      'en,email,Credit Card,Unhappy',
      'en,Mobile Video,Business Banking,Happy',
      'en,Mobile Video,Business Lending,Neutral',
      'en,Mobile Video,Savings,Extremely Happy',
      'en,Mobile Video,Savings,Happy',
      'fr,sipuri,Credit Card',
      'fr,sipuri,Savings',
      'fr,sipuri,Checking',
      'fr,chat,Mortgage',
      'fr,chat,Checking',
      'fr,chat,Auto Loans',
      'fr,chat,Savings',
      'fr,email,Savings',
      'fr,email,Home Equity',
      'fr,email,Business Lending',
      'fr,email,Credit Card',
      'fr,Mobile Video,Business Banking',
      'fr,Mobile Video,Business Lending',
      'fr,Mobile Video,Savings',
      'fr,sipuri,Credit Card,Extremely Happy',
      'fr,sipuri,Credit Card,Unhappy',
      'fr,sipuri,Savings,Extremely Unhappy',
      'fr,sipuri,Checking,Extremely Happy',
      'fr,sipuri,Checking,Happy',
      'fr,sipuri,Checking,Unhappy',
      'fr,chat,Mortgage,Extremely Unhappy',
      'fr,chat,Mortgage,Neutral',
      'fr,chat,Checking,Extremely Unhappy',
      'fr,chat,Auto Loans,Neutral',
      'fr,chat,Auto Loans,Happy',
      'fr,chat,Savings,Unhappy',
      'fr,email,Savings,Neutral',
      'fr,email,Home Equity,Happy',
      'fr,email,Business Lending,Happy',
      'fr,email,Credit Card,Happy',
      'fr,email,Credit Card,Unhappy',
      'fr,Mobile Video,Business Banking,Happy',
      'fr,Mobile Video,Business Lending,Neutral',
      'fr,Mobile Video,Savings,Extremely Happy',
      'fr,Mobile Video,Savings,Happy',
    ];
  }

  private getAgentInstances(): string[] {
    return [
      ..._.values(AgentKeys)
    ];
  }

  private getBasicInstances(packageName: string): string[] {
    if (packageName === AGENT_PERFORMANCE) {
      return this.getAgentInstances();
    }
    return this.getQueueInstances();
  }

  private getUSInstances(): string[] {
    return US_STATES.map((state: USState) => buildUSInstance(state));
  }

  private getBasicMeasures(measures: Measure[]): Measure[] {
    return measures.filter((measure: Measure) => this.isBasicMeasure(measure));
  }

  private getSankeyMeasures(measures: Measure[]): Measure[] {
    return measures.filter((measure: Measure) => this.isSankeyMeasure(measure));
  }

  private getSunburstMeasures(measures: Measure[]): Measure[] {
    return measures.filter((measure: Measure) => this.isSunburstMeasure(measure));
  }

  private getCallTimeLineMeasures(measures: Measure[]): Measure[] {
    return measures.filter((measure: Measure) => this.isCallTimelineMeasure(measure));
  }

  private getCallTimeLineAgents(): string[] {
    return this.getAgentInstances();
  }

  private getCallTimeLineQueues(): string[] {
    return this.getQueueInstances();
  }

  public generateMeasureValue(measure: Measure): number | string {
    if (measure.format === 'number') {
      return this.generateNumericMeasureValue(measure);
    } else if (measure.format === 'string') {
      return this.generateStringMeasureValue(measure);
    } else if (measure.format === 'time' || measure.format === 'datetime') {
      return this.generateTimeMeasureValue(measure);
    }
  }

  private generateNumericMeasureValue(measure: Measure): number {
    return SampleDataGenerator.generateNumber(
      SampleDataGenerator.RANGE_MIN,
      SampleDataGenerator.RANGE_MAX
    );
  }

  private generateStringMeasureValue(measure: Measure): string {
    if (measure.name === 'State') {
      const possibleValues = ['Logged In', 'Ready', 'Not Ready', 'Logged Out'];
      const idx = SampleDataGenerator.generateNumber(0, possibleValues.length - 1);
      return possibleValues[idx];
    }
    return '';
  }

  private generateTimeMeasureValue(measure: Measure): number {
    const oneHourMs = 3600 * 1000;
    const oneDayMs = 24 * oneHourMs;
    return SampleDataGenerator.generateNumber(oneHourMs, oneDayMs);
  }

  private isBasicMeasure(measure: Measure): boolean {
    return !(this.isCallTimelineMeasure(measure) || this.isSunburstMeasure(measure) || this.isSankeyMeasure(measure));
  }

  private isCallTimelineMeasure(measure: Measure): boolean {
    return measure.name === 'CallTimeLine';
  }

  private isSunburstMeasure(measure: Measure): boolean {
    return measure.name.includes('SunBurst');
  }

  private isSankeyMeasure(measure: Measure): boolean {
    return measure.name.includes('Sankey');
  }
}
