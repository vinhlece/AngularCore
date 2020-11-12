import { Pipe, PipeTransform } from '@angular/core';
import {DurationType} from '../models/enums';

@Pipe({ name: 'metricType' })
export class MetricTypePipe implements PipeTransform {
  transform(value: string): string {
    return value === DurationType.Increment ? 'Increment' : value === DurationType.Decrement ? 'Decrement' : value;
  }
}
