import {FormulaMeasureFactory} from '../../measures/services/index';
import {FormulaMeasureImpl} from '../../measures/services/formula/formula-measure.service';

export function formatMeasureValue(value: string | number, format = 'number'): any {
  return format === 'number' ? +value : value;
}

export function getFormulaMeasures(formulaMeasureFactory: FormulaMeasureFactory, measure: string) {
  const measureCalculator = formulaMeasureFactory.create(measure);
  if (measureCalculator instanceof FormulaMeasureImpl) {
    return measureCalculator.extract();
  }
  return [measure];
}
