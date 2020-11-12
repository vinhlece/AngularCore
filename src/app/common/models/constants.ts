import {TimeRangeStep, TimeRangeType} from '../../dashboard/models/enums';

export const TIME_RANGE_SETTINGS = [
  {
    interval: {type: TimeRangeType.Minute, value: 2, label: 'dashboard.time_range_settings.minute'},
    step: TimeRangeStep.OneSecond,
    dataPointInterval: {
      intervals: [
        {value: 1, type: TimeRangeType.Second, label: 'dashboard.time_range_settings.second'}
      ],
      value: {value: 1, type: TimeRangeType.Second, label: 'dashboard.time_range_settings.second'}
    }
  },
  {
    interval: {type: TimeRangeType.Minute, value: 10, label: 'dashboard.time_range_settings.minute'},
    step: TimeRangeStep.OneMinute,
    dataPointInterval: {
      intervals: [
        {value: 1, type: TimeRangeType.Second, label: 'dashboard.time_range_settings.second'},
        {value: 3, type: TimeRangeType.Second, label: 'dashboard.time_range_settings.second'}
      ],
      value: {value: 1, type: TimeRangeType.Second, label: 'dashboard.time_range_settings.second'}
    }
  },
  {
    interval: {type: TimeRangeType.Minute, value: 20, label: 'dashboard.time_range_settings.minute'},
    step: TimeRangeStep.OneMinute,
    dataPointInterval: {
      intervals: [
        {value: 3, type: TimeRangeType.Second, label: 'dashboard.time_range_settings.second'},
        {value: 30, type: TimeRangeType.Second, label: 'dashboard.time_range_settings.second'},
        {value: 1, type: TimeRangeType.Minute, label: 'dashboard.time_range_settings.minute'}
      ],
      value: {value: 3, type: TimeRangeType.Second, label: 'dashboard.time_range_settings.second'}
    }
  },
  {
    interval: {type: TimeRangeType.Hour, value: 1, label: 'dashboard.time_range_settings.hour'},
    step: TimeRangeStep.FiveMinutes,
    dataPointInterval: {
      intervals: [
        {value: 1, type: TimeRangeType.Minute, label: 'dashboard.time_range_settings.minute'},
        {value: 5, type: TimeRangeType.Minute, label: 'dashboard.time_range_settings.minute'},
        {value: 10, type: TimeRangeType.Minute, label: 'dashboard.time_range_settings.minute'}
      ],
      value: {value: 1, type: TimeRangeType.Minute, label: 'dashboard.time_range_settings.minute'}
    }
  },
  {
    interval: {type: TimeRangeType.Day, value: 1, label: 'dashboard.time_range_settings.day'},
    step: TimeRangeStep.ThirtyMinutes,
    dataPointInterval: {
      intervals: [
        {value: 5, type: TimeRangeType.Minute, label: 'dashboard.time_range_settings.minute'},
        {value: 30, type: TimeRangeType.Minute, label: 'dashboard.time_range_settings.minute'},
        {value: 1, type: TimeRangeType.Hour, label: 'dashboard.time_range_settings.hour'}
      ],
      value: {value: 5, type: TimeRangeType.Minute, label: 'dashboard.time_range_settings.minute'}
    }
  },
  {
    interval: {type: TimeRangeType.Day, value: 3, label: 'dashboard.time_range_settings.day'},
    step: TimeRangeStep.ThirtyMinutes,
    dataPointInterval: {
      intervals: [
        {value: 10, type: TimeRangeType.Minute, label: 'dashboard.time_range_settings.minute'},
        {value: 30, type: TimeRangeType.Minute, label: 'dashboard.time_range_settings.minute'},
        {value: 1, type: TimeRangeType.Hour, label: 'dashboard.time_range_settings.hour'}
      ],
      value: {value: 10, type: TimeRangeType.Minute, label: 'dashboard.time_range_settings.minute'}
    }
  },
  {
    interval: {type: TimeRangeType.Week, value: 1, label: 'dashboard.time_range_settings.week'},
    step: TimeRangeStep.OneHour,
    dataPointInterval: {
      intervals: [
        {value: 15, type: TimeRangeType.Minute, label: 'dashboard.time_range_settings.minute'},
        {value: 1, type: TimeRangeType.Hour, label: 'dashboard.time_range_settings.hour'},
        {value: 6, type: TimeRangeType.Hour, label: 'dashboard.time_range_settings.hour'}
      ],
      value: {value: 15, type: TimeRangeType.Minute, label: 'dashboard.time_range_settings.minute'},
    }
  },
  {
    interval: {type: TimeRangeType.Week, value: 3, label: 'dashboard.time_range_settings.week'},
    step: TimeRangeStep.OneHour,
    dataPointInterval: {
      intervals: [
        {value: 1, type: TimeRangeType.Hour, label: 'dashboard.time_range_settings.hour'},
        {value: 6, type: TimeRangeType.Hour, label: 'dashboard.time_range_settings.hour'}
      ],
      value: {value: 1, type: TimeRangeType.Hour, label: 'dashboard.time_range_settings.hour'}
    }
  },
  {
    interval: {type: TimeRangeType.Month, value: 1, label: 'dashboard.time_range_settings.month'},
    step: TimeRangeStep.SixHours,
    dataPointInterval: {
      intervals: [
        {value: 1, type: TimeRangeType.Hour, label: 'dashboard.time_range_settings.hour'},
        {value: 6, type: TimeRangeType.Hour, label: 'dashboard.time_range_settings.hour'},
        {value: 1, type: TimeRangeType.Day, label: 'dashboard.time_range_settings.day'}
      ],
      value: {value: 1, type: TimeRangeType.Hour, label: 'dashboard.time_range_settings.hour'}
    }
  },
  {
    interval: {type: TimeRangeType.Month, value: 3, label: 'dashboard.time_range_settings.month'},
    step: TimeRangeStep.TwelveHours,
    dataPointInterval: {
      intervals: [
        {value: 6, type: TimeRangeType.Hour, label: 'dashboard.time_range_settings.hour'},
        {value: 1, type: TimeRangeType.Day, label: 'dashboard.time_range_settings.day'}
      ],
      value: {value: 6, type: TimeRangeType.Hour, label: 'dashboard.time_range_settings.hour'}
    }
  },
  {
    interval: {type: TimeRangeType.Month, value: 6, label: 'dashboard.time_range_settings.month'},
    step: TimeRangeStep.OneDay,
    dataPointInterval: {
      intervals: [
        {value: 6, type: TimeRangeType.Hour, label: 'dashboard.time_range_settings.hour'},
        {value: 12, type: TimeRangeType.Hour, label: 'dashboard.time_range_settings.hour'},
        {value: 1, type: TimeRangeType.Day, label: 'dashboard.time_range_settings.day'}
      ],
      value: {value: 12, type: TimeRangeType.Hour, label: 'dashboard.time_range_settings.hour'}
    }
  },
  {
    interval: {type: TimeRangeType.Year, value: 1, label: 'dashboard.time_range_settings.year'},
    step: TimeRangeStep.OneDay,
    dataPointInterval: {
      intervals: [
        {value: 6, type: TimeRangeType.Hour, label: 'dashboard.time_range_settings.hour'},
        {value: 1, type: TimeRangeType.Day, label: 'dashboard.time_range_settings.day'}
      ],
      value: {value: 1, type: TimeRangeType.Day, label: 'dashboard.time_range_settings.day'}
    }
  },
  {
    interval: {type: TimeRangeType.Year, value: 3, label: 'dashboard.time_range_settings.year'},
    step: TimeRangeStep.OneWeek,
    dataPointInterval: {
      intervals: [
        {value: 1, type: TimeRangeType.Day, label: 'dashboard.time_range_settings.day'}
      ],
      value: {value: 1, type: TimeRangeType.Day, label: 'dashboard.time_range_settings.day'}
    }
  },
  {
    interval: {type: TimeRangeType.Year, value: 5, label: 'dashboard.time_range_settings.year'},
    step: TimeRangeStep.OneWeek,
    dataPointInterval: {
      intervals: [
        {value: 1, type: TimeRangeType.Day, label: 'dashboard.time_range_settings.day'},
        {value: 3, type: TimeRangeType.Day, label: 'dashboard.time_range_settings.day'}
      ],
      value: {value: 3, type: TimeRangeType.Day, label: 'dashboard.time_range_settings.day'}
    }
  }
];

export const PREDICTIVE_RANGE_SETTINGS = {
  value: {value: 1, type: TimeRangeType.Hour, label: 'dashboard.time_range_settings.hour'},
  intervals: [
    {value: 0, type: null, label: null},
    {value: 1, type: TimeRangeType.Minute, label: 'dashboard.time_range_settings.minute'},
    {value: 1, type: TimeRangeType.Hour, label: 'dashboard.time_range_settings.hour'},
    {value: 8, type: TimeRangeType.Hour, label: 'dashboard.time_range_settings.hour'},
    {value: 1, type: TimeRangeType.Day, label: 'dashboard.time_range_settings.day'},
    {value: 1, type: TimeRangeType.Month, label: 'dashboard.time_range_settings.month'},
    {value: 1, type: TimeRangeType.Year, label: 'dashboard.time_range_settings.year'}
  ]
};

export const Agent = 'Agent';
export const Queue = 'Queue';
export const Region = 'Region';
export const DimensionInstances = [Agent, Queue, Region];

export const WindowNames = ['INTERVAL', 'INSTANTANEOUS', 'MOVING_WINDOW'];

export const commonRouterList = (selectedRouter: string) => [
  { routerLink: '/dashboards', property: 'layout.header.dashboard_management', icon: 'dashboard', isSelected: selectedRouter === '/dashboards'},
  { routerLink: '/widgets', property: 'layout.header.widget_management', icon: 'widget', isSelected: selectedRouter === '/widgets' },
  { routerLink: '/measures', property: 'layout.header.measure_directory', icon: 'measure', isSelected: selectedRouter === '/measures' }
];
