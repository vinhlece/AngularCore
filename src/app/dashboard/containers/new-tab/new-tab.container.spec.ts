import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {By} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {of} from 'rxjs';
import {SimpleNameFormComponent} from '../../components/common/simple-name-form/simple-name-form.component';
import {TabService} from '../../services/http/tab.service';
import {NewTabContainer} from './new-tab.container';
import {TranslateModule} from '@ngx-translate/core';

describe('NewTabContainer', () => {
  let component: NewTabContainer;
  let fixture: ComponentFixture<NewTabContainer>;
  let serviceSpy;
  let dialogRefSpy;
  let dialogServiceSpy;

  beforeEach(async(() => {
    serviceSpy = jasmine.createSpyObj('TabService', ['add', 'remove']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['open', 'close', 'afterClosed']);
    dialogServiceSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogServiceSpy.open.and.returnValue(dialogRefSpy);
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule,
        MatCardModule,
        MatSelectModule,
        TranslateModule.forRoot()
      ],
      declarations: [NewTabContainer, SimpleNameFormComponent],
      providers: [
        {provide: TabService, useValue: serviceSpy},
        {provide: MatDialog, useValue: dialogServiceSpy}
      ]
    });
    TestBed.compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NewTabContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  describe('#configure presentational component', () => {
    it('should open the dialog on clicking the button', fakeAsync(() => {
      serviceSpy.add.and.returnValue(of({}));
      dialogRefSpy.afterClosed.and.returnValue(of({}));

      const newTabButton = fixture.debugElement.query(By.css('button'));
      newTabButton.triggerEventHandler('click', {});
      fixture.detectChanges();

      tick();
      expect(component.DialogService.open).toHaveBeenCalledTimes(1);
    }));
  });
});
