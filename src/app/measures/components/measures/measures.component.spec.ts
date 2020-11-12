import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DebugElement} from '@angular/core';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {MeasuresComponent} from './measures.component';
import {mockMeasure} from '../../../common/testing/mocks/widgets';
import {ContextMenuComponent} from '../../../layout/components/context-menu/context-menu.component';
import {ContextMenuItemDirective} from '../../../layout/components/context-menu/context-menu-item.directive';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import {TranslateModule} from '@ngx-translate/core';

describe('MeasureForm',  () => {
  let fixture: ComponentFixture<MeasuresComponent>;
  let comp: MeasuresComponent;
  let de: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        MatIconModule,
        MatButtonModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        MeasuresComponent,
        ContextMenuComponent,
        ContextMenuItemDirective
      ],
      providers: [FormBuilder],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasuresComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
  });

  it('should emit edit event when click edit measure', () => {
    comp.measures = [];
    fixture.detectChanges();

    const spy = spyOn(comp.onEdit, 'emit');
    const event = new MouseEvent('contextmenu');
    const measure = {...mockMeasure(), id: '1'};
    comp.handleContextMenu(event, measure);
    fixture.detectChanges();

    const contextMenu = de.query(By.directive(ContextMenuComponent));
    const editButton = contextMenu.queryAll(By.directive(ContextMenuItemDirective))[0];
    editButton.triggerEventHandler('click', {});

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(measure);
  });

  it('should emit remove event when click remove measure', () => {
    comp.measures = [];
    fixture.detectChanges();

    const spy = spyOn(comp.onDelete, 'emit');
    const event = new MouseEvent('contextmenu');
    const measure = {...mockMeasure({name: 'ContactsAnswered'})};
    comp.handleContextMenu(event, measure);
    fixture.detectChanges();

    const contextMenu = de.query(By.directive(ContextMenuComponent));
    const removeButton = contextMenu.queryAll(By.directive(ContextMenuItemDirective))[1];
    removeButton.triggerEventHandler('click', {});

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('ContactsAnswered');
  });
});
