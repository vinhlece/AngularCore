import {CdkTableModule} from '@angular/cdk/table';
import {MatIconModule, MatInputModule, MatMenuModule, MatSortModule, MatTableModule} from '@angular/material';
import {sandboxOf} from 'angular-playground';
import {WidgetListComponent} from '.';
import {mockBarWidget, mockLineWidget, mockTabularWidget, mockTrendDiffLineWidget} from '../../../common/testing/mocks/widgets';
import {ContextMenuComponent} from '../../../layout/components/context-menu/context-menu.component';

export default sandboxOf(WidgetListComponent, {
  imports: [
    MatTableModule,
    MatSortModule,
    MatMenuModule,
    MatIconModule,
    MatInputModule,
    CdkTableModule
  ],
  declarations: [
    ContextMenuComponent,
  ]
})
  .add('widget list', {
  template: `
    <app-widget-list
      [widgets]="widgets"
    ></app-widget-list>
  `,
  context: {
    widgets: [
      mockBarWidget(),
      mockLineWidget(),
      mockTrendDiffLineWidget(),
      mockTabularWidget()
    ]
  }
});
