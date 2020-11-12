import {FlexibleChoiceInput} from './flexible-choice-input';

class SimpleFlexibleChoiceInput extends FlexibleChoiceInput {
}

describe('FlexibleChoiceInput', () => {
  let instance: FlexibleChoiceInput;

  beforeEach(() => {
    instance = new SimpleFlexibleChoiceInput();
  });

  it('should throw error when mode is invalid', () => {
    expect(() => instance.mode = '').toThrow(new Error('Selection mode must be provided (single or multiple)'));
  });

  it('should throw error when options is invalid', () => {
    expect(() => instance.options = null).toThrow(new Error('Options must be provided'));
  });

  it('should set default selected options to empty array if a null value is passed', () => {
    instance.mode = 'multiple';
    instance.selectedOptions = null;
    expect(instance.selectedOptions).toEqual([]);
  });
});
