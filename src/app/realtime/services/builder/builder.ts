import { ChartDataBuilder } from '.';
import { Series } from '..';
import { DataGroup, DataSet, GroupKey, WidgetData } from '../../models';
import { ColorPalette } from '../../../common/models/index';
import { SeriesZonesTrendEvaluator } from '../evaluator/SeriesZonesTrend';

export abstract class HighchartsDataBuilder implements ChartDataBuilder {
  typeEvaluator: any;
  nameEvaluator: any;
  pointsEvaluator: any;
  colorEvaluator: any;
  timestampEvaluator: any;
  dataLabelsEvaluator: any;
  nodesEvaluator: any;
  chartStyleEvaluator: any;
  seriesZonesEvaluator: any;
  colorPalette: ColorPalette;
  stepEvaluator: any;
  linkEvaluator: any;
  identityEvaluator: any;
  itemEvaluator: any;

  generate(dataGroup: DataGroup, currentTimestamp: number = 0): WidgetData {
    return Object.keys(dataGroup).map((key: GroupKey) => {
      const data = dataGroup[key];
      const series: Series = {};
      if (this.typeEvaluator) {
        series.type = this.evaluateType(data, key);
      }
      if (this.identityEvaluator) {
        series.id = this.evaluateIdentity(data, key);
      }
      if (this.nameEvaluator) {
        series.name = this.evaluateName(data, key);
      }
      if (this.dataLabelsEvaluator) {
        series.dataLabels = this.evaluateDataLabels(data, key);
      }
      if (this.colorEvaluator) {
        series.color = this.evaluateColor(data, key, currentTimestamp);
      }
      if (this.timestampEvaluator) {
        series.timestamp = this.evaluateTimestamp(data, key);
      }
      if (this.pointsEvaluator) {
        series.data = this.evaluatePoints(data, key);
      }
      if (this.nodesEvaluator) {
        series.nodes = this.evaluateNodes(data, key);
      }
      if (this.chartStyleEvaluator) {
        series.stack = this.evaluateChartStyle(data, key);
      }
      if (this.seriesZonesEvaluator) {
        const zone = this.evaluateSeriesZones(data, key, series.data);
        if (zone) {
          series.zoneAxis = 'x';
          series.zones = zone;
        }
      }
      if (this.stepEvaluator) {
        const step = this.evaluateStep(data, key);
        if (step) {
          series.step = step;
          series.type = 'line';
          series.dashStyle = 'dot';
        }
      }
      if (this.linkEvaluator) {
        const link = this.evaluateLink(data, key);
        if (link) {
          series.linkedTo = link;
        }
      }

      if (this.itemEvaluator) {
        return { ...series, ...this.evaluateItem(data, key)};
      }
      return series;
    });
  }

  evaluateType(dataSet: DataSet, key: GroupKey): any {
    return this.typeEvaluator.evaluate(dataSet, key);
  }

  evaluateIdentity(dataSet: DataSet, key: GroupKey): any {
    return this.identityEvaluator.evaluate(dataSet, key);
  }

  evaluateName(dataSet: DataSet, key: GroupKey): any {
    return this.nameEvaluator.evaluate(dataSet, key);
  }

  evaluatePoints(dataSet: DataSet, key: GroupKey): any {
    return this.pointsEvaluator.evaluate(dataSet, key);
  }

  evaluateColor(dataSet: DataSet, key: GroupKey, currentTimestamp: number = 0): string {
    return this.colorEvaluator.evaluate(dataSet, key, currentTimestamp);
  }

  evaluateTimestamp(dataSet: DataSet, key: GroupKey): string {
    return this.timestampEvaluator.evaluate(dataSet, key);
  }

  evaluateDataLabels(dataSet: DataSet, key: GroupKey): any {
    return this.dataLabelsEvaluator.evaluate(dataSet, key);
  }

  evaluateNodes(dataSet: DataSet, key: GroupKey): any {
    return this.nodesEvaluator.evaluate(dataSet, key);
  }

  evaluateChartStyle(dataSet: DataSet, key: GroupKey): any {
    return this.chartStyleEvaluator.evaluate(dataSet, key);
  }

  evaluateSeriesZones(dataSet: DataSet, key: GroupKey, seriesData: any): any {
    if (this.seriesZonesEvaluator instanceof SeriesZonesTrendEvaluator) {
      this.seriesZonesEvaluator.seriesData = seriesData;
    }
    return this.seriesZonesEvaluator.evaluate(dataSet, key);
  }

  evaluateStep(dataSet: DataSet, key: GroupKey): string {
    return this.stepEvaluator.evaluate(dataSet, key);
  }

  evaluateLink(dataSet: DataSet, key: GroupKey): string {
    return this.linkEvaluator.evaluate(dataSet, key);
  }

  evaluateItem(dataSet: DataSet, key: GroupKey): any {
    return this.itemEvaluator.evaluate(dataSet, key);
  }
}
