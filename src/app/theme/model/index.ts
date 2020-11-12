import {lightTheme} from './light-theme';
import {darkTheme} from './dark-theme';

export enum Theme {
  Light = 'light',
  Dark = 'dark'
}

export const themes = {
  light : {
    ...getColorFromTheme(lightTheme)
  },
  dark: {
    ...getColorFromTheme(darkTheme)
  }
};

function getColorFromTheme(theme) {
  return Object.keys(theme).reduce((acc, key) => {
    return {...acc, ...theme[key]};
  }, {});
}

