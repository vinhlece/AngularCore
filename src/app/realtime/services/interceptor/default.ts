import {Interceptor} from './index';
import {DataSet} from '../../models';

export class DefaultInterceptor implements Interceptor {
  intercept(data: DataSet): DataSet {
    return data;
  }
}
