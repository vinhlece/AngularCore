export interface Measure {
  id?: string;
  name: string;
  format?: string;
  relatedMeasures?: string[];
  dataType?: string;
  disabled?: boolean;
  dimension?: string;
  windowName?: string;
  windowType?: string;
}

export interface Package {
  name: string;
  kafkaQueue: string;
  stream?: string;
  measures: Measure[];
}

export interface FormulaMeasure extends Measure {
  expression: string;
  userId?: string;

  /**
   * Calculate the mathematics expression base on measures values
   * @throws TypeError if not a formula measure
   * @returns {number} result of the calculation
   */
  calculate?: (operands: { measureName: string, measureValue: number }[]) => number;

  /**
   * Extract measures from expression
   * @throws TypeError if not a formula measure
   * @returns {string[]} measures name list
   */
  extract?: () => string[];
}
