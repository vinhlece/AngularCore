import {FlexLayoutModule} from '@angular/flex-layout';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule, MatCardModule, MatDialogModule, MatDividerModule, MatExpansionModule, MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatSelectModule, MatSliderModule, MatSortModule, MatTableModule, MatTabsModule, MatToolbarModule, MatTooltipModule
} from '@angular/material';
import {sandboxOf} from 'angular-playground';
import {Component, OnInit} from '@angular/core';
import {RoleFormComponent} from './role-form.component';
import {LayoutModule} from '../../../layout/layout.module';
import {ContextMenuComponent} from '../../../layout/components/context-menu/context-menu.component';
import {ContextMenuItemDirective} from '../../../layout/components/context-menu/context-menu-item.directive';

@Component({
  selector: 'app-role-form-sandbox',
  template: `
    <div>
      <app-role-form></app-role-form>
    </div>
  `
})
class RoleFormComponentSandbox {
  constructor(private _fb: FormBuilder) {}
}

export default sandboxOf(RoleFormComponent, {
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    FlexLayoutModule,
    MatCardModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatMenuModule,
    MatSelectModule,
    MatSliderModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule
  ],
  declarations: [
    ContextMenuComponent,
    ContextMenuItemDirective
  ]
})
  .add('display role form', {
    template: `<app-role-form [roles]=data>`,
    context: {
      data : [
        {
          'id': '2426dcf2-56ca-4b4e-a9af-f86b64f987ee',
          'name': 'dashboard'
        },
        {
          'id': '523db9f5-f20d-4acd-9a4a-11a96888eba4',
          'name': 'login'
        },
        {
          'id': '7623ec89-0ae6-4f83-9e5f-82aaad99f90a',
          'name': 'widget'
        }
      ]
    }
  });

