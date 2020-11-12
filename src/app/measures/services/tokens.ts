import {InjectionToken} from '@angular/core';
import {FormulaMeasureFactory, PackagesService} from './index';

export const PACKAGES_SERVICE = new InjectionToken<PackagesService>('PackagesServiceImpl');
export const FORMULA_MEASURE_FACTORY = new InjectionToken<FormulaMeasureFactory>('FormulaMeasureFactory');
