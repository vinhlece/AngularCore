import {DebugElement} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import {BrowserModule, By} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ExportType} from '../../models/enums';
import {CopyButtonComponent} from '../copy-button/copy-button.component';
import {PlaceholderTitleComponent} from '../placeholder-title/placeholder-title.component';
import {PlaceholderHeaderComponent} from './placeholder-header.component';
import {TranslateModule} from '@ngx-translate/core';
import {ThemeModule} from '../../../theme/theme.module';

describe('PlaceholderHeaderComponent', () => {
  let fixture: ComponentFixture<PlaceholderHeaderComponent>;
  let comp: PlaceholderHeaderComponent;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        FlexLayoutModule,
        MatTooltipModule,
        TranslateModule.forRoot(),
        ThemeModule
      ],
      declarations: [
        PlaceholderHeaderComponent,
        CopyButtonComponent,
        PlaceholderTitleComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PlaceholderHeaderComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
  }));

  it('should not show buttons by default', () => {
    fixture.detectChanges();

    const deleteBtn = de.query(By.css('.delete'));
    expect(deleteBtn).toBeNull();

    const maximizeBtn = de.query(By.css('.maximize'));
    expect(maximizeBtn).toBeNull();

    const minimizeBtn = de.query(By.css('.minimize'));
    expect(minimizeBtn).toBeNull();

    const copyBtn = de.query(By.css('.copy'));
    expect(copyBtn).toBeNull();

    const searchBtn = de.query(By.css('.search'));
    expect(searchBtn).toBeNull();

    const editBtn = de.query(By.css('.edit'));
    expect(editBtn).toBeNull();
  });

  it('should show delete button if it is enabled', () => {
    comp.settings = {delete: true};
    fixture.detectChanges();
    const triggerBtn = de.query(By.css('.more-vert-menu'));
    triggerBtn.nativeElement.click();
    const deleteBtn = de.query(By.css('.delete'));
    expect(deleteBtn).not.toBeNull();
  });

  it('should emit delete event on click delete button', () => {
    comp.settings = {delete: true};
    fixture.detectChanges();
    const spy = spyOn(comp.onDelete, 'emit');
    const triggerBtn = de.query(By.css('.more-vert-menu'));
    triggerBtn.nativeElement.click();
    const deleteBtn = de.query(By.css('.delete'));
    deleteBtn.triggerEventHandler('click', {});
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should show maximize button if it is enabled', () => {
    comp.settings = {maximize: true};
    fixture.detectChanges();
    const triggerBtn = de.query(By.css('.more-vert-menu'));
    triggerBtn.nativeElement.click();
    const maximizeBtn = de.query(By.css('.maximize'));
    expect(maximizeBtn).not.toBeNull();
  });

  it('should emit maximize event on click maximize button', () => {
    comp.settings = {maximize: true};
    fixture.detectChanges();
    const spy = spyOn(comp.onMaximize, 'emit');
    const triggerBtn = de.query(By.css('.more-vert-menu'));
    triggerBtn.nativeElement.click();
    const maximizeBtn = de.query(By.css('.maximize'));
    maximizeBtn.triggerEventHandler('click', {});
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should show minimize button if it is enabled', () => {
    comp.settings = {minimize: true};
    fixture.detectChanges();
    const triggerBtn = de.query(By.css('.more-vert-menu'));
    triggerBtn.nativeElement.click();
    const minimizeBtn = de.query(By.css('.minimize'));
    expect(minimizeBtn).not.toBeNull();
  });

  it('should emit minimize event on click minimize button', () => {
    comp.settings = {minimize: true};
    fixture.detectChanges();
    const spy = spyOn(comp.onMinimize, 'emit');
    const triggerBtn = de.query(By.css('.more-vert-menu'));
    triggerBtn.nativeElement.click();
    const minimizeBtn = de.query(By.css('.minimize'));
    minimizeBtn.triggerEventHandler('click', {});
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should show search button if it is enabled', () => {
    comp.settings = {search: true};
    fixture.detectChanges();
    const triggerBtn = de.query(By.css('.more-vert-menu'));
    triggerBtn.nativeElement.click();
    const searchBtn = de.query(By.css('.search'));
    expect(searchBtn).not.toBeNull();
  });

  it('should emit search event on click search button', () => {
    comp.settings = {search: true};
    fixture.detectChanges();
    const spy = spyOn(comp.onSearch, 'emit');
    const triggerBtn = de.query(By.css('.more-vert-menu'));
    triggerBtn.nativeElement.click();
    const searchBtn = de.query(By.css('.search'));
    searchBtn.triggerEventHandler('click', {});
    expect(spy).toHaveBeenCalled();
  });

  it('should show copy button if it is enabled', () => {
    comp.settings = {copy: true};
    fixture.detectChanges();
    const triggerBtn = de.query(By.css('.more-vert-menu'));
    triggerBtn.nativeElement.click();
    const copyBtn = de.query(By.css('.copy'));
    expect(copyBtn).not.toBeNull();
  });

  it('should emit copy event on click copy button', () => {
    comp.settings = {copy: true};
    fixture.detectChanges();
    const spy = spyOn(comp.onCopy, 'emit');
    const triggerBtn = de.query(By.css('.more-vert-menu'));
    triggerBtn.nativeElement.click();
    const copyBtn = de.query(By.css('.copy'));
    copyBtn.triggerEventHandler('onCopy', {});
    expect(spy).toHaveBeenCalled();
  });

  it('should emit event to export PDF', () => {
    comp.settings = {exportMenu: true};
    fixture.detectChanges();
    const triggerBtn = de.query(By.css('.more-vert-menu'));
    triggerBtn.nativeElement.click();
    const spy = spyOn(comp.onExport, 'emit');
    fixture.componentInstance.handleExportToPDF();
    expect(spy).toHaveBeenCalledWith(ExportType.PDF);
  });

  it('should emit event to export CSV', () => {
    comp.settings = {exportMenu: true};
    fixture.detectChanges();
    const triggerBtn = de.query(By.css('.more-vert-menu'));
    triggerBtn.nativeElement.click();
    const spy = spyOn(comp.onExport, 'emit');
    fixture.componentInstance.handleExportToCSV();
    expect(spy).toHaveBeenCalledWith(ExportType.CSV);
  });

  it('should emit event to export XLS', () => {
    comp.settings = {exportMenu: true};
    fixture.detectChanges();
    const triggerBtn = de.query(By.css('.more-vert-menu'));
    triggerBtn.nativeElement.click();
    const spy = spyOn(comp.onExport, 'emit');
    fixture.componentInstance.handleExportToXLS();
    expect(spy).toHaveBeenCalledWith(ExportType.XLS);
  });

  it('should emit event to change title', () => {
    fixture.detectChanges();
    const spy = spyOn(comp.onChangeTitle, 'emit');
    const el = de.query(By.css('app-placeholder-title'));
    el.triggerEventHandler('onSubmit', 'abc');
    expect(spy).toHaveBeenCalledWith('abc');
  });

  it('should show edit button if it is enabled', () => {
    comp.settings = {edit: true};
    fixture.detectChanges();
    const triggerBtn = de.query(By.css('.more-vert-menu'));
    triggerBtn.nativeElement.click();
    const deleteBtn = de.query(By.css('.edit'));
    expect(deleteBtn).not.toBeNull();
  });

  it('should emit edit event on click edit button', () => {
    comp.settings = {edit: true};
    fixture.detectChanges();
    const spy = spyOn(comp.onEdit, 'emit');
    const triggerBtn = de.query(By.css('.more-vert-menu'));
    triggerBtn.nativeElement.click();
    const deleteBtn = de.query(By.css('.edit'));
    deleteBtn.triggerEventHandler('click', {});
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should emit add event on click add button', () => {
    comp.settings = {add: true};
    comp.measures = [{name: 'Contact Answered'}];
    comp.currentMeasures = [];
    fixture.detectChanges();
    const spy = spyOn(comp.onAddMeasure, 'emit');
    const triggerBtn = de.query(By.css('.more-vert-menu'));
    triggerBtn.nativeElement.click();
    const addBtn = de.query(By.css('.add'));
    addBtn.nativeElement.click();
    const Btn = de.query(By.css('.measure-item'));
    fixture.detectChanges();
    Btn.triggerEventHandler('click', {});
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
