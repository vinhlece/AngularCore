import {sandboxOf} from 'angular-playground';
import {MeasuresComponent} from './measures.component';
import {
  MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatRippleModule, MatSortModule,
  MatTableModule
} from '@angular/material';
import {LayoutModule} from '../../../layout/layout.module';
import {ContextMenuComponent} from "../../../layout/components/context-menu/context-menu.component";

const measures = [
  {name: 'InstantaneousContactsAnswered', format: 'number', relatedMeasures: [], dataType: 'Queue Performance'},
  {name: 'InstAttributeMatched', format: 'number', relatedMeasures: [], dataType: 'Queue Performance'},
  {name: 'ContactsOffered', format: 'number', relatedMeasures: ['ContactsAnswered', 'ContactsAbandoned'], dataType: 'Queue Performance'},
  {name: 'ContactsAnswered', format: 'number', relatedMeasures: [], dataType: 'Queue Performance'},
  {name: 'ContactsAbandoned', format: 'number', relatedMeasures: [], dataType: 'Queue Performance', disabled: true},
  {name: 'ServiceLevel', format: 'number', relatedMeasures: [], dataType: 'Queue Performance'},
  {name: 'SankeyLayer1', format: 'number', relatedMeasures: [], dataType: 'Queue Performance'},
  {name: 'SankeyLayer2', format: 'number', relatedMeasures: [], dataType: 'Queue Performance'},
  {name: 'WorkQueuing', format: 'number', relatedMeasures: [], dataType: 'Queue Performance', disabled: true},
  {name: 'WorkOffered', format: 'number', relatedMeasures: [], dataType: 'Queue Performance', disabled: true},
  {name: 'InstAttributeQueueTime', format: 'number', relatedMeasures: [], dataType: 'Queue Performance'},
  {name: 'Available', format: 'number', relatedMeasures: [], dataType: 'Queue Status'},
  {name: 'NotReady', format: 'number', relatedMeasures: [], dataType: 'Queue Status'},
  {name: 'CallsAnswered', format: 'number', relatedMeasures: [], dataType: 'Agent Performance'},
  {name: 'InstantaneousCallsAnswered', format: 'number', relatedMeasures: [], dataType: 'Agent Performance', disabled: true},
  {name: 'CallsAbandoned', format: 'number', relatedMeasures: [], dataType: 'Agent Performance'},
  {name: 'CallsQueuing', format: 'number', relatedMeasures: [], dataType: 'Agent Performance'},
  {name: 'CompletedCalls', format: 'number', relatedMeasures: [], dataType: 'Agent Performance'},
  {name: 'LoggedInTime', format: 'number', relatedMeasures: [], dataType: 'Agent Performance', disabled: true},
  {name: 'HoldTime', format: 'number', relatedMeasures: [], dataType: 'Agent Performance'},
  {name: 'NotReadyTime', format: 'number', relatedMeasures: [], dataType: 'Agent Performance'},
  {name: 'CreatedDate', format: 'number', relatedMeasures: [], dataType: 'Agent Performance'},
  {name: 'State', format: 'string', relatedMeasures: ['TimeInState', 'CallsAnswered'], dataType: 'Agent Performance'},
  {name: 'TimeInState', format: 'time', relatedMeasures: [], dataType: 'Agent Performance'},
  {name: 'SumMeasure', format: 'number', relatedMeasures: [],
    dataType: 'Queue Performance', expression: 'ContactsAnswered + ContactsAbandoned', userId: 'adminUser', disabled: true},
  {name: 'ContactAnsweredAndOffered', format: 'number', relatedMeasures: [],
    dataType: 'Queue Performance', expression: 'ContactsAnswered  + ContactsOffered', userId: 'adminUser', disabled: true}
];

export default sandboxOf(MeasuresComponent, {
  imports: [
    MatTableModule,
    MatInputModule,
    MatIconModule,
    MatSortModule,
    MatButtonModule,
    MatFormFieldModule,
  ],
  declarations: [
    MeasuresComponent,
    ContextMenuComponent
  ]
})
  .add('Meause list', {
    template: `<app-measures [measures]="measures"></app-measures>`,
    context: {
      measures: measures
    }
  });
