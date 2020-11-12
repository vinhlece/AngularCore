import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import {mockFormulaMeasure} from '../../../common/testing/mocks/mockMeasures';
import * as mockPackages from '../../../common/testing/mocks/mockPackages';
import {AddFormulaMeasureContainer} from './add-formula-measure.container';

describe('AddFormulaMeasureContainer', () => {
  let fixture: ComponentFixture<AddFormulaMeasureContainer>;
  let component: AddFormulaMeasureContainer;
  let de;
  let store;
  const packages = mockPackages.getAll();
  const measures = mockPackages.getAllMeasure();

  beforeEach(() => {
    const storeSpy = jasmine.createSpyObj('store', ['pipe', 'dispatch']);
    TestBed.configureTestingModule({
      declarations: [
        AddFormulaMeasureContainer
      ],
      providers: [
        {provide: Store, useValue: storeSpy},
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AddFormulaMeasureContainer);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    store = TestBed.get(Store);
  });

  describe('init', () => {
    it('should render edit formula measure form component', () => {
      store.pipe.and.returnValues(of(measures), of(packages), of(mockPackages.getAllMeasureByDataType('Queue Status')));
      fixture.detectChanges();
      const el = de.query(By.css('app-edit-formula-measure-form'));
      expect(el).toBeTruthy();
    });
  });

  describe('save', () => {
    it('should dispatch add custom measure action', () => {
      store.pipe.and.returnValues(of(measures), of(packages), of(mockPackages.getAllMeasureByDataType('Queue Status')));
      const measure = mockFormulaMeasure({id: 'my measure', name: 'my measure'});
      fixture.detectChanges();
      const form = de.query(By.css('app-edit-formula-measure-form'));
      form.triggerEventHandler('onSave', measure);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
    });
  });

  describe('onChangePackage', () => {
    it('should get new measures from store', () => {
      const expectValue = of(mockPackages.getAllMeasureByDataType('Queue Status'));
      store.pipe.and.returnValues(of(measures), of(packages), expectValue);
      fixture.detectChanges();
      const form = de.query(By.css('app-edit-formula-measure-form'));
      form.triggerEventHandler('onChangePackage', 'Queue Status');
      fixture.detectChanges();
      expect(store.pipe).toHaveBeenCalledTimes(3);
      expect(component.packageMeasure$).toEqual(expectValue);
    });
  });
});
