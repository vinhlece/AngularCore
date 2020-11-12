import {FormulaMeasureImpl} from './formula-measure.service';

describe('formula measure', () => {
  it('should return correct result', () => {
    const operands = [
      {measureName: 'bob', measureValue: 6},
      {measureName: 'teddy', measureValue: -12},
      {measureName: 'jerry', measureValue: 2}
    ];
    const expression = '(bob + 10) * teddy - 2 / jerry\n';
    const service = new FormulaMeasureImpl('measure a', expression);
    const result = service.calculate(operands);
    expect(result).toEqual(-193);
  });

  it('should extract measures from expression', () => {
    const expression = '(bob + 10) * teddy - 2 / jerry - jerry';
    const service = new FormulaMeasureImpl('measure b', expression);
    const result = service.extract();
    expect(result).toEqual(['bob', 'teddy', 'jerry']);
  });
});
