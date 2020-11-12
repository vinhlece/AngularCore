import {FlexLayoutModule} from '@angular/flex-layout';
import {MatButtonModule, MatCardModule, MatIconModule, MatMenuModule, MatTooltipModule} from '@angular/material';
import {sandboxOf} from 'angular-playground';
import {CopyButtonComponent} from '../copy-button/copy-button.component';
import {PlaceholderHeaderComponent} from './placeholder-header.component';
import {PlaceholderTitleComponent} from '../placeholder-title/placeholder-title.component';
import {ReactiveFormsModule} from '@angular/forms';

export default sandboxOf(PlaceholderHeaderComponent, {
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    MatMenuModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  declarations: [
    PlaceholderHeaderComponent,
    CopyButtonComponent,
    PlaceholderTitleComponent
  ]
})
  .add('disable all elements by default', {
    template: `<app-placeholder-header title="This is a header"></app-placeholder-header>`,
  })
  .add('enable all ui elements', {
    template: `<app-placeholder-header title="This is a header" [settings]="settings"></app-placeholder-header>`,
    context: {
      settings: {
        enableDelete: true,
        enableCopy: true,
        enableMinimize: true,
        enableMaximize: true,
        enableExportMenu: true,
        enableSearch: true
      }
    }
  });

