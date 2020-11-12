import {CommonModule, Location} from '@angular/common';
import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {By} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PaletteFormComponent} from './palette-form.component';
import {of} from 'rxjs/index';
import {PaletteNodeComponent} from './palette-node/palette-node.component';
import {ColorPickerModule} from 'ngx-color-picker';
import {HeaderFontComponent} from './header-font/header-font.component';
import {ThemeModule} from '../../../theme/theme.module';

describe('PaletteFormComponent', () => {
  let component: PaletteFormComponent;
  let fixture: ComponentFixture<PaletteFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaletteFormComponent, PaletteNodeComponent, HeaderFontComponent],
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatIconModule,
        MatDividerModule,
        ColorPickerModule,
        FlexLayoutModule,
        ThemeModule
      ],
      providers: [
        {provide: Location, useValue: Location}
      ]

    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PaletteFormComponent);
    component = fixture.componentInstance;
  }));

  describe('#validation', () => {
    it('shows error when palette name is empty', () => {
      fixture.detectChanges();
      component.form.controls['name'].setValue('');
      component.form.controls['name'].markAsTouched();
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('#paletteNameRequiredError'))).not.toBeNull();
      expect(component.form.invalid).toBeTruthy();
    });

    it('do not show errorMessage when palette name is not empty', () => {
      fixture.detectChanges();
      component.form.controls['name'].setValue('paletteName');
      component.form.controls['name'].markAsTouched();
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('#paletteNameRequiredError'))).toBeNull();
    });
  });

  describe('#errorMessage$', () => {
    it('do not show error message when it is empty', fakeAsync(() => {
      component.errorMessage$ = of('');
      tick();
      fixture.detectChanges();

      const errorElement = fixture.debugElement.query(By.css('#error'));
      expect(errorElement).toBeNull();
    }));

    it('show error message when it is not empty', fakeAsync(() => {
      component.errorMessage$ = of('Error message');
      tick();
      fixture.detectChanges();

      const errorElement = fixture.debugElement.query(By.css('#error'));
      expect(errorElement).not.toBeNull();
      expect(errorElement.nativeElement.textContent).toBe('Error message');
    }));
  });

  describe('#onSubmit, #onCancel', () => {
    it('emit event with valid palette settings', () => {
      fixture.detectChanges();
      const spyHandleSave = jasmine.createSpy('handleSavePalette');
      component.savePalette.subscribe(spyHandleSave);

      component.form.controls['name'].setValue('paletteName');
      component.form.controls['threshold'].setValue(['#000000', '#111111', '#222222']);
      component.form.controls['colors'].setValue(['#000000', '#111111', '#222222', '#333333', '#444444']);
      component.form.controls['headerFont'].setValue({
        fontSize: 25,
        fontFamily: 'oboto'
      });
      fixture.detectChanges();
      expect(component.form.valid).toBeTruthy();
      fixture.debugElement.query(By.css('.save-btn')).nativeElement.click();
      const data = {
        name: 'paletteName',
        colors: ['#000000', '#111111', '#222222', '#333333', '#444444'],
        threshold: ['#000000', '#111111', '#222222'],
        headerFont: {
          fontSize: 25,
          fontFamily: 'oboto'
        },
      };
      expect(spyHandleSave).toHaveBeenCalledWith(data);
    });

    it('call cancel event when click cancel button', () => {
      const spy = spyOn(component, 'handleCancel');
      fixture.debugElement.query(By.css('.cancel-btn')).nativeElement.click();
      expect(spy).toHaveBeenCalledWith();
    });
  });

  describe('#onAddNode', () => {
    it('call add node event when click add node button', () => {
      const spy = spyOn(component, 'handleAddNode');
      fixture.debugElement.query(By.css('.add-node-buton')).nativeElement.click();
      expect(spy).toHaveBeenCalledWith();
    });
  });
});
