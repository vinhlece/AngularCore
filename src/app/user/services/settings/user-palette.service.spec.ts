import {TestBed, fakeAsync, tick} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {UserPaletteService} from './user-palette.service';

describe('Authentication Service', () => {
  let service: UserPaletteService;
  let http: HttpTestingController;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [
      UserPaletteService
    ]
  }));

  beforeEach(() => {
    service = TestBed.get(UserPaletteService);
    http = TestBed.get(HttpTestingController);
  });
});
