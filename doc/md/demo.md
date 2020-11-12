# Demo features:

## Create widget, dashboard:
#### Create a widget:
- Go to Widget management, click add widget button to go to add widget page. Enter widget information:

    - Name of widget: `Demo Bar Widget`
    - Select widget type: `Bar`
    - Select data stream: `Queue`
    - Enter widget size: `6 rows x 6 columns`

- Click Next to go to edit widget page:

    - Select data type: `Queue Performance`
    - Select chart type: `Vertical`
    - Select display mode: `Instances`
    - Select measures: `ContactsAnswered, ContactsAbandoned, ContactsOffered`
    - Enter instances name: `Dog, Fish, Cat, Bear, Dragon, Elephant`
    - Optional: If no instance is entered, you can check `Show all data` to show data for all instances

- Click Save to save the widget

#### Create a template:
- Go to Widget management, click add widget button to go to add widget page:

    - Name of widget: `Demo Tabular Template`
    - Select widget type: `New Tabular`
    - Select data stream: `Queue`
    - Enter widget size: `6 rows x 6 columns`
    - Check `Set as template`

- Click Next to go to edit widget page:

    - Select data type: `Queue Performance`
    - Select columns: `MeasureTimestamp, ContactsOffered, ContactsAnswered, ContactsAbandoned`
    - Edit `Key` column:
    
        - Click `Key` column
        - Check `Group`
        - You can set a column as group if it has `string` or `datetime` data type
    - Edit `ContactsOffered` column:
    
        - Click `ContactsOffered` column
        - Set `Aggregation`: `sum`
        - You can set `Aggregation` on a column if it has `number` data type

    - Leave the `Enter instance name` field empty
    - Check `Show all data`
    - Select display data type: `Show Interval`
    - Select greater color: `Green`, lesser color: `Red`

- Click Save to save the template

#### Create a dashboard:
- Go to Dashboard management, click add dashboard button
- On the add dashboard dialog, enter dashboard name: `Demo Dashboard`
- Click Save, we will be navigated to the newly created `Demo Dashboard`

## Dashboard features:

#### Add widget:
Open sidebar, there are 2 ways to add a widget:
- Drag `Demo Bar, US Bar, New Latest Table, Contacts Answered` widget from sidebar into dashboard
- Double click `Queue Sunburst` widget from sidebar
- Create a tabular widget from `Demo Tabular Template` drag and drop it into dashboard

#### Delete widget:
Delete `Demo Bar` widget by clicking delete button on the header

#### Resize widget:
Resize `Demo Tabular Template` widget to full screen width

#### Drag widget:
Drag and drop `Queue Sunburst` widget

#### Minimize/Maximize widget
Minimize/maximize `US Bar` widget

#### Rename widget
Double click header of `Demo Tabular Template` widget, rename it to `Demo US Tabular`

#### Replay real time data
- Open time explorer, select time in the past and start/stop replaying.
- Notice the changes in bar, latest table and billboard widget. Latest table and billboard widget will update it's value color base on threshold value
- Close time explorer when replaying done

#### Show time line widget
Right click on `Arizona-Phoenix` bar of `US Bar` widget, select `Show Timeline` to create `Arizona-Phoenix and ContactsAbandoned` widget

#### Add instance, measure:
- Add `Alabama-Montgomery` instance to `Demo US Tabular` widget by dragging it from sidebar
- Add `Hawaii-Honolulu, Illinois-Springfield, Kansas-Topeka, Ohio-Columbus` instances to `Demo US Tabular` widget by dragging it from `US Bar` widget
- Add `ServiceLevel` measure to `Demo US Tabular` widget by dragging it from sidebar
- Add `ContactsOffered` measure to `US Bar` widge by dragging it from sidebar

#### Replace instance, measure:
- Add solid gauge widget `Queue Solid Gauge` to dashboard
- Replace measure of `Queue Solid Gauge` by drag/drop `ContactsOffered` measure from sidebar
- Replace instance of `Queue Solid Gauge` by drag/drop `Ohio-Columbus` instance from `Demo US Tabular` widget

#### Delete instance, measure:
- Delete `ServiceLevel` measure from `Demo US Tabular` widget
- Delete `Kansas-Topeka` instance from `Demo US Tabular` widget

#### Update a blank widget:
- Add `Blank Queue Line` to dashboard
    - Drag/drop `Arizona-Phoenix` instance and `ContactsAbandoned` measure from `US Bar`
    - Drag/drop `Hawaii-Honolulu` instance and `ContactsAnswered` measure from `Demo US Tabular`

- Add `Blank Queue Geo Map` to dashboard
    - Add `ContactsAnswered` measure from sidebar to `Blank Queue Geo Map` widget
    - Add `Ohio-Columbus, Hawaii-Honolulu, Alabama-Montgomery` instances from `Demo US Tabular` to `Blank Queue Geo Map` widget

#### Replay real time data with line widget
- Open time explorer, select time in the past
- Wait 30 seconds
- Start/stop replaying. After that, close time explorer

#### Show latest, past data on geo map, solid gauge:
- Open time explorer and start replaying
- On `Queue Solid Gauge - Measure ContactsOffered - Instance Ohio-Columbus` widget, click `Show time explorer value` button several times to toggle show past value on/off

#### Zooming on line widget
Zoom on `Blank Queue Line` widget and notice data density change base on zoom time range

#### Switch time range
Open time explorer and select another time range

#### Change data point interval
For each time range, try to change data point interval, view the changes in `Demo US Tabular` widget

#### Exporting
Export data from `US Bar` widget
