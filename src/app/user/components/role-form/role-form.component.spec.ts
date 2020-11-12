import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RoleFormComponent} from './role-form.component';
import {ContextMenuComponent} from '../../../layout/components/context-menu/context-menu.component';
import {ContextMenuItemDirective} from '../../../layout/components/context-menu/context-menu-item.directive';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

describe('RoleFormComponent', () => {
  let component: RoleFormComponent;
  let fixture: ComponentFixture<RoleFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleFormComponent, ContextMenuComponent,
        ContextMenuItemDirective ],
      imports: [
        MatButtonModule,
        MatIconModule,
        MatTableModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
