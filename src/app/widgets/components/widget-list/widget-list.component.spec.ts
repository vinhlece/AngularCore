import {CdkTableModule} from '@angular/cdk/table';
import {DebugElement} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import {By} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {WidgetListComponent} from '.';
import {ContextMenuItemDirective} from '../../../layout/components/context-menu/context-menu-item.directive';
import {ContextMenuComponent} from '../../../layout/components/context-menu/context-menu.component';
import {mockWidget} from '../../../common/testing/mocks/widgets';
import {TranslateModule} from '@ngx-translate/core';
import {ThemeModule} from '../../../theme/theme.module';

describe('WidgetListComponent', () => {
  let fixture: ComponentFixture<WidgetListComponent>;
  let comp: WidgetListComponent;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        imports: [
          BrowserAnimationsModule,
          MatTableModule,
          MatSortModule,
          MatIconModule,
          CdkTableModule,
          MatInputModule,
          TranslateModule.forRoot(),
          ThemeModule
        ],
        declarations: [
          WidgetListComponent,
          ContextMenuComponent,
          ContextMenuItemDirective
        ]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetListComponent);
    de = fixture.debugElement;
    comp = fixture.componentInstance;
  });

  describe('context menu', () => {
    afterEach(() => {
      comp.contextMenuEvent = null;
      fixture.detectChanges();
    });

    it('should emit launch event when click launch widget', () => {
      comp.widgets = [];
      fixture.detectChanges();

      const spy = spyOn(comp.onLaunch, 'emit');
      const event = new MouseEvent('contextmenu');
      const widget = {...mockWidget(), id: '1'};

      comp.handleContextMenu(event, widget);
      fixture.detectChanges();

      const contextMenu = de.query(By.directive(ContextMenuComponent));
      const launchBtn = contextMenu.queryAll(By.directive(ContextMenuItemDirective))[0];
      launchBtn.triggerEventHandler('click', {});

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('1');
    });

    it('should emit remove event when click remove widget', () => {
      comp.widgets = [];
      fixture.detectChanges();

      const spy = spyOn(comp.onEdit, 'emit');
      const event = new MouseEvent('contextmenu');
      const widget = {...mockWidget(), id: '1'};
      comp.handleContextMenu(event, widget);
      fixture.detectChanges();

      const contextMenu = de.query(By.directive(ContextMenuComponent));
      const editButton = contextMenu.queryAll(By.directive(ContextMenuItemDirective))[1];
      editButton.triggerEventHandler('click', {});

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(widget);
    });

    it('should emit remove event when click remove widget', () => {
      comp.widgets = [];
      fixture.detectChanges();

      const spy = spyOn(comp.onDelete, 'emit');
      const event = new MouseEvent('contextmenu');
      const widget = {...mockWidget(), id: '1'};
      comp.handleContextMenu(event, widget);
      fixture.detectChanges();

      const contextMenu = de.query(By.directive(ContextMenuComponent));
      const removeButton = contextMenu.queryAll(By.directive(ContextMenuItemDirective))[2];
      removeButton.triggerEventHandler('click', {});

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('1');
    });
  });
});
