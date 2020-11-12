import {Observable} from 'rxjs/index';
import {FormulaMeasure, Measure, Package} from '../models/index';

export interface PackagesService {
  getAllPackages(): Observable<Package[]>;

  getAllMeasures(userId: string): Observable<Measure[]>;

  getAllFormulaMeasures(userId: string): Observable<FormulaMeasure[]>;

  getMeasuresOfPackage(packageName: string): Observable<Measure[]>;

  addFormulaMeasure(measure: FormulaMeasure): Observable<any>;

  findMeasuresByName(userId: string, name: string): Observable<Measure[]>;
}

export interface FormulaMeasureFactory {
  create(measureName: string): FormulaMeasure;
}
