import * as Color from 'color';
import {ColorPalette, InstanceColor} from '../models/index';

const pastelPalette = [
  '#8271DE',
  '#769FE8',
  '#75C5D1',
  '#76E8BA',
  '#71DE76'
];

const bluePalette = [
  '#4285F4',
  '#DB4437',
  '#F4B400',
  '#0F9D58'
];

const contrastPalette = [
  '#F25022',
  '#7FBA00',
  '#00A4EF',
  '#FFB900',
  '#737373'
];

const highchartsPalette = [
  '#4AC959',
  '#41B04E',
  '#379643',
  '#455A64'
];

const pallette5 = [
  '#3C5A99',
  '#5775B2',
  '#7893CC',
  '#9EB6E5'
];

export const getDefaultColorPalettes = (): ColorPalette[] => {
  return [
    {
      name: 'Default',
      id: 'Default 1',
      colors: pastelPalette
    },
    {
      name: 'Color palette #1',
      id: 'Default 2',
      colors: bluePalette
    },
    {
      name: 'Color palette #2',
      id: 'Default 3',
      colors: contrastPalette
    },
    {
      name: 'Color palette #3',
      id: 'Default 4',
      colors: highchartsPalette
    },
    {
      name: 'Color palette #4',
      id: 'Default 5',
      colors: pallette5
    },
  ];
};

export const getChartColors = (): string[] => {
  return [...pastelPalette, ...bluePalette, ...contrastPalette, ...highchartsPalette];
};

export const getColorScheme = (): ColorPoint[] => {
  return getChartColors().map(color => {
    return {primary: color, secondary: Color(color).lighten(0.1).hex()};
  });
};

export const createColorScheme = (palette: ColorPalette) => {
  return palette.colors.map(color => {
    return {primary: color, secondary: Color(color).lighten(0.1).hex()};
  });
};

export const createInstanceColorScheme = (instanceColors) => {
  return instanceColors.map(instance => {
    return {primary: instance.color, secondary: Color(instance.color).lighten(0.1).hex()};
  });
}

export const getTransferenceColors = (): string[] => {
  return ['#F1F2FA'];
};

export interface ColorPoint {
  primary: string;
  secondary: string;
}
