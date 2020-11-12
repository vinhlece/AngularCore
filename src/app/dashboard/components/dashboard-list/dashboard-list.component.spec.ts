import {CdkTableModule} from '@angular/cdk/table';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import {By} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {ContextMenuItemDirective} from '../../../layout/components/context-menu/context-menu-item.directive';
import {ContextMenuComponent} from '../../../layout/components/context-menu/context-menu.component';
import {DashboardListComponent} from './dashboard-list.component';
import {TranslateModule} from '@ngx-translate/core';
import {ThemeModule} from '../../../theme/theme.module';

class MockMatDialog {
  open() {
    return true;
  }
}

describe('DashboardListComponent', () => {
  let component: DashboardListComponent;
  let fixture: ComponentFixture<DashboardListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        MatTabsModule,
        MatButtonModule,
        MatIconModule,
        MatGridListModule,
        MatToolbarModule,
        MatTableModule,
        MatSortModule,
        CdkTableModule,
        MatTooltipModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        MatInputModule,
        HttpClientModule,
        RouterTestingModule,
        MatMenuModule,
        MatDividerModule,
        TranslateModule.forRoot(),
        ThemeModule
      ],
      declarations: [
        DashboardListComponent,
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
    fixture = TestBed.createComponent(DashboardListComponent);
    component = fixture.componentInstance;
    component.dashboards = [];
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('#deleteDashboardEventEmitter', () => {
    it('should emit event with Dashboard object', () => {
      const dashboard = {id: '1', name: 'GHJ', tabs: ['G', 'H']};
      const spy = spyOn(component.deleteDashboardEventEmitter, 'emit');
      component.selectedRow = dashboard;
      component.handleDeleteDashboard(dashboard.id);
      expect(spy).toHaveBeenCalledWith(dashboard.id);
    });
  });
});
