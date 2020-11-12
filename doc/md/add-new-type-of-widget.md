# Following are steps to add a new widget:

## Create chart component
All charts component should implements `BaseChartComponent` class, if it is a Highcharts component, extends `AbstractHighchartsComponent` instead.

## Create converter to convert from raw data to chart data
Each converter has 3 main components:
- Interceptor: filter, sorter,...
- Grouper: groping data by some properties (instance, measure, timestamp,...)
- Builder: iterating through each group and convert raw record into chart data

## Create widget model
- New widget model should implements `Widget` interface
- Add new widget type enum

## Create widget configuration form
- Create presentation component
- Create container: should extends `AbstractEditWidgetContainer`

## Add new widget placeholder
Include new chart component in `PlaceholderComponent`'s template

## Add new widget launcher item
Create launcher item and define its behaviors
