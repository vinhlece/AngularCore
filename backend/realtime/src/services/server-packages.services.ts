import * as http from 'http';
import {IncomingMessage} from 'http';
import {Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {isNullOrUndefined} from 'util';
import {FormulaMeasure, Measure, Package} from '../../../../src/app/measures/models';
import {PackagesService} from '../../../../src/app/measures/services';

export default class ServerPackagesServices implements PackagesService {
  private static _packageService: ServerPackagesServices;

  private _serverPath = 'http://localhost:3000/';

  static instance() {
    if (!this._packageService) {
      this._packageService = new ServerPackagesServices();
    }
    return this._packageService;
  }

  getAllPackages(): Observable<Package[]> {
    const loadAll$ = new Subject<Package[]>();
    const url = this._serverPath + 'packages';
    http.get(url, (message: IncomingMessage) => {
      let body = '';
      message.on('data', (data) => {
        if (!isNullOrUndefined(data)) {
          body += data;
        }
      });

      message.on('end', (chunk) => {
        const packages = JSON.parse(body);
        loadAll$.next(packages);
      });
    });
    return loadAll$;
  }

  getMeasuresOfPackage(packageName: string): Observable<Measure[]> {
    return this.getAllPackages().pipe(
      map((packages: any) => (
        packages
          .filter((item: any) => item.package === packageName)
          .reduce((measures: Measure[], item: any) => {
            return [...measures, ...this.getMeasuresFromPackage(item)];
          }, [])
      ))
    );
  }


  getAllFormulaMeasures(userId: string): Observable<FormulaMeasure[]> {
    throw new Error('Not implemented');
  }

  getAllMeasures(userId: string): Observable<Measure[]> {
    throw new Error('Not implemented.');
  }

  addFormulaMeasure(measure: FormulaMeasure): Observable<any> {
    throw new Error('Not implemented');
  }

  findMeasuresByName(userId: string, name: string): Observable<Measure[]> {
    throw new Error('Not implemented');
  }

  private getMeasuresFromPackage(packageItem: any) {
    return packageItem.measures.map((measure: Measure) => ({...measure, dataType: packageItem.package}));
  }
}
