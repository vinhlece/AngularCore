import {FlexLayoutModule} from '@angular/flex-layout';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatCardModule, MatIconModule, MatListModule} from '@angular/material';
import {sandboxOf} from 'angular-playground';
import {SelectionPanelComponent} from './selection-panel.component';

export default sandboxOf(SelectionPanelComponent, {
  imports: [
    ReactiveFormsModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    FlexLayoutModule
  ]
})
  .add('selection panel', {
    template: `<app-selection-panel [items]="items" [addedItems]="addedItems"></app-selection-panel>`,
    context: {
      items: [
        {id: 'Key', type: 'string'},
        {id: 'Timestamp', type: 'datetime'},
        {id: 'ContactsAnswered', type: 'number'}
      ],
      addedItems:[
      ]
    }
  });
