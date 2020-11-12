import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {mockFormulaMeasure, mockFormulaMeasures} from '../../../common/testing/mocks/mockMeasures';
import {mockPackages} from '../../../common/testing/mocks/widgets';
import {FormulaMeasure, Measure, Package} from '../../models';
import {PackagesServiceImpl} from './packages.service';
import {AppConfigService} from '../../../app.config.service';
import {Store} from '@ngrx/store';

describe('PackagesServiceImpl', () => {
  let service: PackagesServiceImpl;
  let http: HttpTestingController;
  let appConfigService: AppConfigService;
  let packagesUrl: string;
  let formulaMeasuresUrl: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PackagesServiceImpl,
        AppConfigService,
        {
          provide: Store,
          useValue: jasmine.createSpyObj('store', ['dispatch', 'pipe'])
        }
      ]
    });

    http = TestBed.get(HttpTestingController);
    service = TestBed.get(PackagesServiceImpl);
    appConfigService = TestBed.get(AppConfigService);
    appConfigService.config = {
      apiEndPoint: '',
      kafkaEndPoint: '',
      kafkaApiKey: '',
      reportingDataGeneratorEndPoint: '',
      reportingDataSubscriptionEndPoint: '',
      webSocket: '',
      fqdn: ''
    };
    packagesUrl = `${appConfigService.config.apiEndPoint}/packages`;
    formulaMeasuresUrl = `${appConfigService.config.apiEndPoint}/formulaMeasures`;
  });

  describe('getAllPackages', () => {
    it('should return all packages', () => {
      const packages = mockPackages();
      service.getAllPackages().subscribe((result: Package[]) => {
        const expected = mockPackages();
        expect(result).toEqual(expected);
      });
      http.expectOne(packagesUrl).flush(packages);
    });
  });

  describe('getAllFormulaMeasures', () => {
    it('should return all formula measures', () => {
      const measures = mockFormulaMeasures();
      service.getAllFormulaMeasures('user').subscribe((result: FormulaMeasure[]) => {
        const expected = mockFormulaMeasures();
        expect(result).toEqual(expected);
      });
      http.expectOne(formulaMeasuresUrl + '?userId=user').flush(measures);
    });
  });

  describe('getAllFormulaMeasures', () => {
    it('should return added formula measures', () => {
      const measure = mockFormulaMeasure();
      service.addFormulaMeasure(measure).subscribe((result: FormulaMeasure) => {
        const expected = mockFormulaMeasure();
        expect(result).toEqual(expected);
      });
      http.expectOne(formulaMeasuresUrl).flush(measure);
    });
  });

  describe('findMeasuresByName', () => {
    it('should find original measures & formula measures by name', () => {
      const packages = mockPackages();
      const formulaMeasures = mockFormulaMeasures();
      service.findMeasuresByName('user', 'bar').subscribe((result: Measure[]) => {
        const reducerFn = (previousMeasures: Measure[], currentPackage: Package) => {
          const currentMeasures = currentPackage.measures.map((measure: Measure) => ({
            ...measure,
            dataType: currentPackage.name
          }));
          return [...previousMeasures, ...currentMeasures];
        };
        const matchedMeasures = packages.reduce(reducerFn, []).filter((measure: Measure) => measure.name.toLowerCase().includes('bar'));
        const matchedFormulaMeasures = formulaMeasures.filter((measure: FormulaMeasure) => measure.name.toLowerCase().includes('bar'));
        const expected = [...matchedMeasures, ...matchedFormulaMeasures];
        expect(result).toEqual(expected);
      });
      http.expectOne(packagesUrl).flush(packages);
      http.expectOne(formulaMeasuresUrl + '?userId=user').flush(formulaMeasures);
    });
  });
});
