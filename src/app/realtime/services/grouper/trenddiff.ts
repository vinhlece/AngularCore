import {isNullOrUndefined} from 'util';
import {getCurrentMoment, getMomentByTimestamp} from '../../../common/services/timeUtils';
import {DataGroup, DataSet} from '../../models';
import {RealTimeDataProcessor} from '../index';
import {Grouper} from './grouper';
import {AppDateTimeFormat} from '../../../common/models/enums';

export abstract class TrenddiffGrouper extends Grouper {
  private _startTimestamp: number;
  private _endTimestamp: number;
  private _start: any;
  private _end: any;
  private _period: number;
  private _numberOfLines: number;
  private _timestamps: number[];

  get start(): any {
    return this._start;
  }

  get end(): any {
    return this._end;
  }

  get period(): number {
    return this._period;
  }

  get numberOfLines(): number {
    return this._numberOfLines;
  }

  get timestamps(): number[] {
    return this._timestamps;
  }

  constructor(processor: RealTimeDataProcessor, startTimestamp: number, endTimestamp: number, period: number, numberOfLines?: number, timestamps?: number[]) {
    super(processor);
    this._startTimestamp = startTimestamp;
    this._endTimestamp = endTimestamp;
    this._period = period;
    this._numberOfLines = numberOfLines;
    this._timestamps = timestamps;
  }

  abstract getUnit(): any;

  abstract getEndOfLine(startOfLine: any): any;

  abstract getStartOfLatestLine(): any;

  groupData(data: DataSet): DataGroup {
    this._start = this.createStart();
    this._end = this.createEnd();
    this.reduceTime();
    this.reduceLines();
    return this.group(data);
  }

  getSpan(): number {
    return this.end.diff(this.start, this.getUnit());
  }

  getInRangeData(data: DataSet, startTimestamp: number, endTimestamp: number) {
    return this.processor.getDataInTimeRange(data, {startTimestamp, endTimestamp});
  }

  group(data: DataSet): DataGroup {
    if (this.timestamps && this.timestamps.length > 0) {
      return this.getTimeStampGroup(data);
    } else {
      const mainGroup = this.createMainGroup(data);
      const latestGroup = this.createLatestGroup(data);
      return this.ensureNumberOfLines({...mainGroup, ...latestGroup});
    }
  }

  reduceTime(): void {
    // no op
  }

  reduceLines(): void {
    const maxLines = Math.ceil(this.getSpan() / this.period);
    if (!isNullOrUndefined(this.numberOfLines) && this.numberOfLines < maxLines) {
      const redundantLines = maxLines - this.numberOfLines;
      this.start.add(redundantLines * this.period, this.getUnit());
    }
  }

  private createStart(timestamp?: number) {
    const startTimeStamp = timestamp ? timestamp : this._startTimestamp;
    return getMomentByTimestamp(startTimeStamp).startOf('day');
  }

  private createEnd(timestamp?: number) {
    const endTimeStamp = timestamp ? timestamp : this._endTimestamp;
    return getMomentByTimestamp(endTimeStamp).add(1, this.getUnit()).startOf(this.getUnit());
  }

  private createMainGroup(data: DataSet): DataGroup {
    const group: DataGroup = {};
    while (this.start.isBefore(this.end)) {
      const endOfLine = this.getEndOfLine(this.start);
      const inRangeData = this.getInRangeData(data, this.start.valueOf(), endOfLine.valueOf());
      if (inRangeData.length > 0) {
        group[this.start.valueOf()] = inRangeData;
      }
      this.start.add(this.period, this.getUnit());
    }
    return group;
  }

  private createLatestGroup(data: DataSet): DataGroup {
    const start = this.getStartOfLatestLine();
    const end = this.getEndOfLine(start);
    const inRangeData = this.getInRangeData(data, start.valueOf(), end.valueOf());
    return inRangeData.length > 0 ? {[start.valueOf()]: inRangeData} : {};
  }

  private getTimeStampGroup(data: DataSet): DataGroup {
    const group: DataGroup = {};
    this.timestamps.forEach(timestamp => {
      const start = this.createStart(timestamp);
      const end = this.getEndOfLine(start);
      const inRangeData = this.getInRangeData(data, +start, +end);
      if (inRangeData.length > 0) {
        group[+start] = inRangeData;
      }
    });
    return group;
  }

  private ensureNumberOfLines(group: DataGroup): DataGroup {
    if (!isNullOrUndefined(this.numberOfLines) && Object.keys(group).length > this.numberOfLines) {
      const firstGroupKey = Object.keys(group)[0];
      delete group[firstGroupKey];
    }
    return group;
  }
}

/*
 * Diagram:
 *       |-------period = 2------|
 * |--a--|-----d-----|-----d-----|-----d-----|-----d-----|-----d-----|
 *
 * - a: Only take records in full day for each line (00:00:00 -> 23:59:59), so this part will be removed
 * - d: Each group contains data for one day (d)
 */
export class DateGrouper extends TrenddiffGrouper {
  getEndOfLine(startOfLine: any): any {
    return startOfLine.clone().endOf(this.getUnit());
  }

  getStartOfLatestLine(): any {
    const now = getCurrentMoment();
    return now.clone().startOf(this.getUnit());
  }

  getUnit(): any {
    return 'days';
  }

  reduceTime() {
    const daysSpan = this.getSpan();
    if (this.period > 1) {
      const r = daysSpan % this.period;
      if (r > 0) {
        this.start.add(r - 1, this.getUnit());
      } else {
        this.start.add(this.period - 1, this.getUnit());
      }
    }
  }
}

export class ShiftGrouper extends TrenddiffGrouper {
  getEndOfLine(startOfLine): any {
    return startOfLine.clone().add(this.period - 1, this.getUnit()).endOf(this.getUnit());
  }

  getStartOfLatestLine(): any {
    const now = getCurrentMoment();
    const nowInHours = now.clone().hour();
    const position = Math.floor(nowInHours / this.period);
    return now.startOf('days').add(position * this.period, this.getUnit());
  }

  getUnit(): any {
    return 'hours';
  }
}
