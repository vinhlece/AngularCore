import {Interceptor} from '.';
import {DataSet, RealtimeData} from '../../models';

export class CompositeInterceptor implements Interceptor {
  private _interceptors: Interceptor[] = [];

  constructor(...interceptors: Interceptor[]) {
    this._interceptors = interceptors;
  }

  intercept(data: DataSet): DataSet {
    return this._interceptors.reduce((acc: RealtimeData[], interceptor: Interceptor) => {
      return interceptor.intercept(acc);
    }, data);
  }
}
