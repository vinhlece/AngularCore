import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable, zip} from 'rxjs';
import {map} from 'rxjs/operators';
import {PackagesService} from '..';
import {FormulaMeasure, Measure, Package} from '../../models';
import {AppConfigService} from '../../../app.config.service';

@Injectable()
export class PackagesServiceImpl implements PackagesService {
  private _http: HttpClient;
  private _appConfigService: AppConfigService;
  private get _packagesUrl() {
    return this.getPackagesUrl();
  }
  private get _formulaMeasuresUrl() {
    return this.getFormulaMeasuresUrl();
  }

  constructor(http: HttpClient, appConfigService: AppConfigService) {
    this._http = http;
    this._appConfigService = appConfigService;
  }

  getAllPackages(): Observable<Package[]> {
    return this._http.get<Package[]>(this._packagesUrl);
  }

  getAllMeasures(userId: string): Observable<Measure[]> {
    return this.getOriginalMeasures();
  }

  getAllFormulaMeasures(userId: string): Observable<FormulaMeasure[]> {
    return this._http.get<FormulaMeasure[]>(this._formulaMeasuresUrl + '?userId=' + userId);
  }

  getMeasuresOfPackage(packageName: string): Observable<Measure[]> {
    return this.getAllPackages().pipe(
      map(packages => (
        packages
          .filter((item: any) => item['package'] === packageName)
          .reduce((measures: Measure[], item: any) => {
            return [...measures, ...this.getMeasuresFromPackage(item)];
          }, [])
      ))
    );
  }

  addFormulaMeasure(measure: FormulaMeasure): Observable<any> {
    return this._http.post(this._formulaMeasuresUrl, measure);
  }

  findMeasuresByName(userId: string, name: string): Observable<Measure[]> {
    return zip(this.findOriginalMeasuresByName(name), this.findFormulaMeasuresByName(userId, name)).pipe(
      map(([originalMeasures, formulaMeasures]) => ([...originalMeasures, ...formulaMeasures]))
    );
  }

  getPackagesUrl() {
    return `${this._appConfigService.config.apiEndPoint}/packages`;
  }

  getFormulaMeasuresUrl() {
    return `${this._appConfigService.config.apiEndPoint}/formulaMeasures`;
  }

  private findFormulaMeasuresByName(userId: string, name: string): Observable<FormulaMeasure[]> {
    return this.getAllFormulaMeasures(userId).pipe(
      map((measures: FormulaMeasure[]) => {
        const filterFn = (measure: FormulaMeasure) => measure.name.toLowerCase().includes(name.toLowerCase());
        return measures.filter(filterFn);
      })
    );
  }

  private findOriginalMeasuresByName(name: string): Observable<Measure[]> {
    return this.getOriginalMeasures().pipe(
      map((measures: Measure[]) => {
        const filterFn = (measure: Measure) => measure.name.toLowerCase().includes(name.toLowerCase());
        return measures.filter(filterFn);
      })
    );
  }

  private getOriginalMeasures(): Observable<Measure[]> {
    return this.getAllPackages().pipe(
      map((packages: any) => {
        const reducerFn = (previousMeasures: Measure[], currentPackage) => {
          const currentMeasures = currentPackage.measures.map((measure: Measure) => ({
            ...measure,
            dataType: currentPackage.package
          }));
          return [...previousMeasures, ...currentMeasures];
        };
        const initialValue = [];
        return packages.reduce(reducerFn, initialValue);
      })
    );
  }

  private getMeasuresFromPackage(packageItem) {
    return packageItem.measures.map((measure: Measure) => ({...measure, dataType: packageItem.package}));
  }
}
