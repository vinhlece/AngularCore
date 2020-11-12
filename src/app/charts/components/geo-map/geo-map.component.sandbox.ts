import {MatIconModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {sandboxOf} from 'angular-playground';
import * as H from 'highcharts/highmaps';
import {mockSolidGaugeWidget} from '../../../common/testing/mocks/widgets';
import {DisplayModeSwitcherComponent} from '../display-mode-switcher/display-mode-switcher.component';
import {GeoMapComponent} from './geo-map.component';
import * as map from './us-all';

export default sandboxOf(GeoMapComponent, {
  imports: [
    BrowserAnimationsModule,
    MatIconModule
  ],
  declarations: [
    DisplayModeSwitcherComponent
  ]
})
  .add('geo map', {
    template: `<app-geo-map [widget]="widget" [styles]="styles" [data]="data"></app-geo-map>`,
    context: {
      widget: mockSolidGaugeWidget(),
      styles: {backgroundColor: '#ffffff', color: '#ffffff', font: 'Comic Sans MS'},  // background color and font family
      data: [{
        name: 'Basemap',
        mapData: map,
        borderColor: '#606060',
        nullColor: 'rgba(200, 200, 200, 0.2)',  // change state color
        showInLegend: false
      }, {
        name: 'Separators',
        type: 'mapline',
        data: H.geojson(map, 'mapline'),
        color: '#101010',
        enableMouseTracking: false,
        showInLegend: false
      }, {
        type: 'mapbubble',
        dataLabels: {
          enabled: true,
          format: '{point.capital}',
          color: '#333', // change label color
        },
        name: 'Cities',
        maxSize: '12%',
        color: H.getOptions().colors[0], // change city color
        data: [
          {
            'abbrev': 'AL',
            'parentState': 'Alabama',
            'capital': 'Montgomery',
            'lat': 32.380120,
            'lon': -86.300629,
            'z': 205764
          },
          {
            'abbrev': 'AK',
            'parentState': 'Alaska',
            'capital': 'Juneau',
            'lat': 58.299740,
            'lon': -134.406794,
            'z': 31275
          },
          {
            'abbrev': 'AZ',
            'parentState': 'Arizona',
            'capital': 'Phoenix',
            'lat': 33.448260,
            'lon': -112.075774,
            'z': 1445632
          },
          {
            'abbrev': 'AR',
            'parentState': 'Arkansas',
            'capital': 'Little Rock',
            'lat': 34.748655,
            'lon': -92.274494,
            'z': 193524
          },
          {
            'abbrev': 'CA',
            'parentState': 'California',
            'capital': 'Sacramento',
            'lat': 38.579065,
            'lon': -121.491014,
            'z': 466488
          },
          {
            'abbrev': 'CO',
            'parentState': 'Colorado',
            'capital': 'Denver',
            'lat': 39.740010,
            'lon': -104.992259,
            'z': 600158
          },
          {
            'abbrev': 'CT',
            'parentState': 'Connecticut',
            'capital': 'Hartford',
            'lat': 41.763325,
            'lon': -72.674069,
            'z': 124775
          },
          {
            'abbrev': 'DE',
            'parentState': 'Delaware',
            'capital': 'Dover',
            'lat': 39.158035,
            'lon': -75.524734,
            'z': 36047
          },
          {
            'abbrev': 'FL',
            'parentState': 'Florida',
            'capital': 'Tallahassee',
            'lat': 30.439775,
            'lon': -84.280649,
            'z': 181376
          },
          {
            'abbrev': 'GA',
            'parentState': 'Georgia',
            'capital': 'Atlanta',
            'lat': 33.748315,
            'lon': -84.391109,
            'z': 420003
          },
          {
            'abbrev': 'HI',
            'parentState': 'Hawaii',
            'capital': 'Honolulu',
            'lat': 21.304770,
            'lon': -157.857614,
            'z': 337256
          },
          {
            'abbrev': 'ID',
            'parentState': 'Idaho',
            'capital': 'Boise',
            'lat': 43.606980,
            'lon': -116.193409,
            'z': 205671
          },
          {
            'abbrev': 'IL',
            'parentState': 'Illinois',
            'capital': 'Springfield',
            'lat': 39.801055,
            'lon': -89.643604,
            'z': 116250
          },
          {
            'abbrev': 'IN',
            'parentState': 'Indiana',
            'capital': 'Indianapolis',
            'lat': 39.766910,
            'lon': -86.149964,
            'z': 820445
          },
          {
            'abbrev': 'IA',
            'parentState': 'Iowa',
            'capital': 'Des Moines',
            'lat': 41.589790,
            'lon': -93.615659,
            'z': 203433
          },
          {
            'abbrev': 'KS',
            'parentState': 'Kansas',
            'capital': 'Topeka',
            'lat': 39.049285,
            'lon': -95.671184,
            'z': 127473
          },
          {
            'abbrev': 'KY',
            'parentState': 'Kentucky',
            'capital': 'Frankfort',
            'lat': 38.195070,
            'lon': -84.878694,
            'z': 25527
          },
          {
            'abbrev': 'LA',
            'parentState': 'Louisiana',
            'capital': 'Baton Rouge',
            'lat': 30.443345,
            'lon': -91.186994,
            'z': 229493
          },
          {
            'abbrev': 'ME',
            'parentState': 'Maine',
            'capital': 'Augusta',
            'lat': 44.318036,
            'lon': -69.776218,
            'z': 19136
          },
          {
            'abbrev': 'MD',
            'parentState': 'Maryland',
            'capital': 'Annapolis',
            'lat': 38.976700,
            'lon': -76.489934,
            'z': 38394
          },
          {
            'abbrev': 'MA',
            'parentState': 'Massachusetts',
            'capital': 'Boston',
            'lat': 42.358635,
            'lon': -71.056699,
            'z': 617594
          },
          {
            'abbrev': 'MI',
            'parentState': 'Michigan',
            'capital': 'Lansing',
            'lat': 42.731940,
            'lon': -84.552249,
            'z': 114297
          },
          {
            'abbrev': 'MN',
            'parentState': 'Minnesota',
            'capital': 'Saint Paul',
            'lat': 44.943829,
            'lon': -93.093326,
            'z': 285068
          },
          {
            'abbrev': 'MS',
            'parentState': 'Mississippi',
            'capital': 'Jackson',
            'lat': 32.298690,
            'lon': -90.180489,
            'z': 173514
          },
          {
            'abbrev': 'MO',
            'parentState': 'Missouri',
            'capital': 'Jefferson City',
            'lat': 38.577515,
            'lon': -92.177839,
            'z': 43079
          },
          {
            'abbrev': 'MT',
            'parentState': 'Montana',
            'capital': 'Helana',
            'lat': 46.589760,
            'lon': -112.021202,
            'z': 28190
          },
          {
            'abbrev': 'NE',
            'parentState': 'Nebraska',
            'capital': 'Lincoln',
            'lat': 40.813620,
            'lon': -96.707739,
            'z': 258379
          },
          {
            'abbrev': 'NV',
            'parentState': 'Nevada',
            'capital': 'Carson City',
            'lat': 39.164885,
            'lon': -119.766999,
            'z': 55274
          },
          {
            'abbrev': 'NH',
            'parentState': 'New Hampshire',
            'capital': 'Concord',
            'lat': 43.207250,
            'lon': -71.536604,
            'z': 42695
          },
          {
            'abbrev': 'NJ',
            'parentState': 'New Jersey',
            'capital': 'Trenton',
            'lat': 40.217875,
            'lon': -74.759404,
            'z': 84913
          },
          {
            'abbrev': 'NM',
            'parentState': 'New Mexico',
            'capital': 'Santa Fe',
            'lat': 35.691543,
            'lon': -105.937406,
            'z': 67947
          },
          {
            'abbrev': 'NY',
            'parentState': 'New York',
            'capital': 'Albany',
            'lat': 42.651445,
            'lon': -73.755254,
            'z': 97856
          },
          {
            'abbrev': 'NC',
            'parentState': 'North Carolina',
            'capital': 'Raleigh',
            'lat': 35.785510,
            'lon': -78.642669,
            'z': 403892
          },
          {
            'abbrev': 'ND',
            'parentState': 'North Dakota',
            'capital': 'Bismarck',
            'lat': 46.805372,
            'lon': -100.779334,
            'z': 61272
          },
          {
            'abbrev': 'OH',
            'parentState': 'Ohio',
            'capital': 'Columbus',
            'lat': 39.961960,
            'lon': -83.002984,
            'z': 787033
          },
          {
            'abbrev': 'OK',
            'parentState': 'Oklahoma',
            'capital': 'Oklahoma City',
            'lat': 35.472015,
            'lon': -97.520354,
            'z': 579999
          },
          {
            'abbrev': 'OR',
            'parentState': 'Oregon',
            'capital': 'Salem',
            'lat': 44.933260,
            'lon': -123.043814,
            'z': 154637
          },
          {
            'abbrev': 'PA',
            'parentState': 'Pennsylvania',
            'capital': 'Harrisburg',
            'lat': 40.259865,
            'lon': -76.882230,
            'z': 49528
          },
          {
            'abbrev': 'RI',
            'parentState': 'Rhode Island',
            'capital': 'Providence',
            'lat': 41.823875,
            'lon': -71.411994,
            'z': 178042
          },
          {
            'abbrev': 'SC',
            'parentState': 'South Carolina',
            'capital': 'Columbia',
            'lat': 33.998550,
            'lon': -81.045249,
            'z': 129272
          },
          {
            'abbrev': 'SD',
            'parentState': 'South Dakota',
            'capital': 'Pierre',
            'lat': 44.368924,
            'lon': -100.350158,
            'z': 13646
          },
          {
            'abbrev': 'TN',
            'parentState': 'Tennessee',
            'capital': 'Nashville',
            'lat': 36.167783,
            'lon': -86.778365,
            'z': 601222
          },
          {
            'abbrev': 'TX',
            'parentState': 'Texas',
            'capital': 'Austin',
            'lat': 30.267605,
            'lon': -97.742984,
            'z': 790390
          },
          {
            'abbrev': 'UT',
            'parentState': 'Utah',
            'capital': 'Salt Lake City',
            'lat': 40.759505,
            'lon': -111.888229,
            'z': 186440
          },
          {
            'abbrev': 'VT',
            'parentState': 'Vermont',
            'capital': 'Montpelier',
            'lat': 44.260299,
            'lon': -72.576264,
            'z': 7855
          },
          {
            'abbrev': 'VA',
            'parentState': 'Virginia',
            'capital': 'Richmond',
            'lat': 37.540700,
            'lon': -77.433654,
            'z': 204214
          },
          {
            'abbrev': 'WA',
            'parentState': 'Washington',
            'capital': 'Olympia',
            'lat': 47.039231,
            'lon': -122.891366,
            'z': 46478
          },
          {
            'abbrev': 'WV',
            'parentState': 'West Virginia',
            'capital': 'Charleston',
            'lat': 38.350195,
            'lon': -81.638989,
            'z': 51400
          },
          {
            'abbrev': 'WI',
            'parentState': 'Wisconsin',
            'capital': 'Madison',
            'lat': 43.072950,
            'lon': -89.386694,
            'z': 233209
          },
          {
            'abbrev': 'WY',
            'parentState': 'Wyoming',
            'capital': 'Cheyenne',
            'lat': 41.134815,
            'lon': -104.821544,
            'z': 59466
          }
        ]
      }]
    }
  });
