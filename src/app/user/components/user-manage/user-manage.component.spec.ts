import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManageComponent } from './user-manage.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import {ContextMenuComponent} from '../../../layout/components/context-menu/context-menu.component';
import {ContextMenuItemDirective} from '../../../layout/components/context-menu/context-menu-item.directive';
import {By} from '@angular/platform-browser';
import {ThemeModule} from '../../../theme/theme.module';

class MockMatDialog {
  open() {
    return true;
  }
}
describe('UserManageComponent', () => {
  let component: UserManageComponent;
  let fixture: ComponentFixture<UserManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        MatIconModule,
        ThemeModule
      ],
      declarations: [
        UserManageComponent,
        ContextMenuComponent,
        ContextMenuItemDirective
      ],
      providers: [
        {
          provide: MatDialog,
          useClass: MockMatDialog
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManageComponent);
    component = fixture.componentInstance;
    component.users = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have user manage table element', () => {
    const el = fixture.debugElement.query(By.css('Mat-table'));
    expect(el).not.toBe(null);
  });

  describe('#deleteUserEventEmitter', () => {
    it('should emit event with user object', () => {
      const user = {id: 'user01', displayName: 'user 01'};
      const spy = spyOn(component.deleteUserEventEmitter, 'emit');
      component.selectedRow = user;
      component.handleDeleteUser();
      expect(spy).toHaveBeenCalledWith(user.id);
    });
  });

  describe('#Mat-table', () => {
    it('should update ui after datasource were updated.', () => {
      component.users = [
        {id: 'user01', displayName: 'user 01', password: 'user01'},
        {id: 'user02', displayName: 'user 02', password: 'user01'}
        ];
      component.ngOnChanges();
      fixture.detectChanges();
      const rows = fixture.debugElement.queryAll(By.css('Mat-row'));
      expect(rows.length).toEqual(2);
    });
  });
});
