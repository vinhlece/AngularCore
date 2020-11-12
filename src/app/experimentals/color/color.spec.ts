import * as Color from 'color';

describe('Color', () => {
  it('lighten', () => {
    const CHART_BLUE = '#90CAF9';
    const LIGHT_BLUE = '#DBEEFD';
    const CHART_YELLOW = '#ffd400';
    const LIGHT_YELLOW = '#FFDD33';
    const CHART_ORANGE = '#ff9a0a';
    const LIGHT_ORANGE = '#FFB03F';
    const CHART_CYAN = '#3de2da';
    const LIGHT_CYAN = '#6FE9E4';

    expect(Color(CHART_BLUE).lighten(0.2).hex()).toEqual(LIGHT_BLUE);
    expect(Color(CHART_YELLOW).lighten(0.2).hex()).toEqual(LIGHT_YELLOW);
    expect(Color(CHART_ORANGE).lighten(0.2).hex()).toEqual(LIGHT_ORANGE);
    expect(Color(CHART_CYAN).lighten(0.2).hex()).toEqual(LIGHT_CYAN);
  });
});
