import {Inject, Injectable} from '@angular/core';
import {PackagesService} from '../../../measures/services';
import {PACKAGES_SERVICE} from '../../../measures/services/tokens';
import {SampleDataGenerator} from './sample-data-generator';

@Injectable()
export class SampleRealTimeDataService extends SampleDataGenerator {
  constructor(@Inject(PACKAGES_SERVICE) packagesService: PackagesService) {
    super(packagesService);
  }
}
