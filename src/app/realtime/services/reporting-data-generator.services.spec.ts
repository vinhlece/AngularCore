import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {inject, TestBed} from '@angular/core/testing';
import {ReportingDataGeneratorServiceImpl} from './reporting-data-generator.services';
import {LOGGER} from '../../logging/services/tokens';
import {DefaultLogger} from '../../logging/services/logger';
import {AppConfigService} from '../../app.config.service';
import {Store} from '@ngrx/store';

describe('ReportingDataGeneratorServiceImpl', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ReportingDataGeneratorServiceImpl,
        AppConfigService,
        {
          provide: LOGGER, useClass: DefaultLogger
        },
        {
          provide: Store,
          useValue: jasmine.createSpyObj('store', ['dispatch', 'pipe'])
        }
      ]
    });
  });

  it('should be created', inject([ReportingDataGeneratorServiceImpl], (service: ReportingDataGeneratorServiceImpl) => {

    expect(service).toBeTruthy();
  }));
});
