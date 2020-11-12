import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import {By} from '@angular/platform-browser';
import {PaletteFormContainerComponent} from './palette-form-container.component';
import {PaletteFormComponent} from '../../components/palette-form/palette-form.component';
import {PaletteNodeComponent} from '../../components/palette-form/palette-node/palette-node.component';
import {HeaderFontComponent} from '../../components/palette-form/header-font/header-font.component';
import {ColorPickerModule} from 'ngx-color-picker';
import {Location} from '@angular/common';
import {ColorPalette} from '../../../common/models/index';
import {AddUserPalette} from '../../actions/palette.actions';
import {ThemeModule} from '../../../theme/theme.module';

describe('PaletteFormContainerComponent', () => {
  let component: PaletteFormContainerComponent;
  let fixture: ComponentFixture<PaletteFormContainerComponent>;
  let storeSpy;

  beforeEach(async(() => {
    storeSpy = jasmine.createSpyObj('store', ['pipe', 'dispatch']);
    storeSpy.pipe.and.returnValue(of('error'));

    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        MatInputModule,
        MatIconModule,
        MatDividerModule,
        ColorPickerModule,
        MatButtonModule,
        ThemeModule
      ],
      declarations: [PaletteFormContainerComponent, PaletteFormComponent, PaletteNodeComponent, HeaderFontComponent],
      providers: [
        FormBuilder,
        {
          provide: Store, useValue: storeSpy
        },
        {provide: Location, useValue: Location}
      ]
    })
      .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PaletteFormContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  describe('constructor', () => {
    it('call store.pipe to call select with getPaletteErrorMessage selector', () => {
      expect(storeSpy.pipe).toHaveBeenCalled();
    });
  });

  describe('#configure presentational component', () => {
    let uiComponent: PaletteFormComponent;

    beforeEach(() => {
      uiComponent = fixture.debugElement.query(By.directive(PaletteFormComponent)).componentInstance;
    });

    it('Input parameters are setup correctly', () => {
      expect(uiComponent.errorMessage$).toBe(component.errorMessage$);
    });

    it('Output events are setup correctly', () => {
      const spy = spyOn(component, 'handleSavePalette');
      uiComponent.savePalette.emit({});
      expect(spy).toHaveBeenCalledWith({});
    });
  });

  describe('#handleSave', () => {
    it('should dispatch save action with correct color palette', () => {
      const credentials: ColorPalette = {name: 'palette name',
        colors: ['#000000', '#111111', '#222222', '#333333', '#444444'],
        threshold: ['#000000', '#111111', '#222222']};
      component.handleSavePalette(credentials);
      expect(storeSpy.dispatch).toHaveBeenCalledWith(new AddUserPalette(credentials));
    });
  });
});
