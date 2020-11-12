import {DataSet} from '../../models';

export interface Interceptor {
  intercept(data: DataSet): DataSet;
}
