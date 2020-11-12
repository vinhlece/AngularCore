import {TestBed, fakeAsync} from '@angular/core/testing';
import { DashboardService } from './dashboard.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AppConfigService} from '../../../app.config.service';
import {AppConfig} from '../../../config/app.config';
import {APP_INITIALIZER} from '@angular/core';
import {Store} from '@ngrx/store';

describe('DashboardService', () => {
  let dashboardService: DashboardService;
  let httpServer: HttpTestingController;
  let serverUrl: string;
  let appConfigService: AppConfigService

  const fakeDashboards = [
    {id: '1', userId: 'user', name: 'ABX', tabs: []},
    {id: '2', userId: 'admin', name: 'CDE', tabs: []},
  ];
  const addingDashboard = {id: '3', userId: 'admin', name: 'GHJ', tabs: []};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        DashboardService,
        AppConfigService,
        {
          provide: Store,
          useValue: jasmine.createSpyObj('store', ['dispatch', 'pipe'])
        }
      ]
    });
  });

  beforeEach(() => {
    dashboardService = TestBed.get(DashboardService);
    appConfigService = TestBed.get(AppConfigService);
    httpServer = TestBed.get(HttpTestingController);
    appConfigService.config = {
      apiEndPoint: '',
      kafkaEndPoint: '',
      kafkaApiKey: '',
      reportingDataGeneratorEndPoint: '',
      reportingDataSubscriptionEndPoint: '',
      webSocket: '',
      fqdn: ''
    };
    serverUrl = `${appConfigService.config.apiEndPoint}/dashboards`;
  });

  describe('getDashboards', () => {
    it('should return a list of dashboard that have 2 items', fakeAsync(() => {
      const result = dashboardService.getDashboards().subscribe(resolve => {
        expect(resolve.length).toBe(2);
      });
      httpServer.expectOne(serverUrl).flush(fakeDashboards);
    }));

    it('should return an empty list', fakeAsync(() => {
      const data = [];
      const result = dashboardService.getDashboards().subscribe(resolve => {
        expect(resolve.length).toBe(0);
      });
      httpServer.expectOne(serverUrl).flush(data);
    }));
  });

  describe('getDashboardByUser', () => {
    it('should return a list of dashboard that have userId id admin', fakeAsync( () => {
      const url = serverUrl + '?userId=admin';
      const result = dashboardService.getDashboardsByUser('admin').subscribe(resolve => {
        expect(resolve).toBe(fakeDashboards);
      });
      httpServer.expectOne(url).flush(fakeDashboards);
    }));
  });

  describe('getDashboardById', () => {
    it('should return a dashboard object that has id 1', fakeAsync( () => {
      const url = serverUrl + '/1';
      const result = dashboardService.getDashboard('1').subscribe(resolve => {
        expect(resolve).toBe(fakeDashboards[0]);
      });
      httpServer.expectOne(url).flush(fakeDashboards[0]);
    }));

    it('server has no item', fakeAsync( () => {
      const hardcodeData = [];
      const url = serverUrl + '/1';
      const result = dashboardService.getDashboard('1').subscribe(resolve => {
        expect(resolve).toBeNull();
      });
      httpServer.expectOne(url);
    }));

    it('item not existed', fakeAsync( () => {
      const url = serverUrl + '/4';
      const result = dashboardService.getDashboard('4').subscribe(resolve => {
        expect(resolve).toBeUndefined();
      });
      httpServer.expectOne(url);
    }));
  });

  describe('addDashboard', () => {
    it('add an dashboard with id = "3"', fakeAsync( () => {
      const result = dashboardService.addDashboard(addingDashboard).subscribe(resolve => {
        expect(resolve).toBe(addingDashboard);
      });
      httpServer.expectOne(serverUrl).flush(addingDashboard);
    }));

    it('add an dashboard without id', fakeAsync( () => {
      const result = dashboardService.addDashboard(addingDashboard).subscribe(resolve => {
        expect(resolve).toBe(addingDashboard);
      });
      httpServer.expectOne(serverUrl).flush(addingDashboard);
    }));
  });
  describe('addDashboard', () => {
    it('add an dashboard with userId admin', fakeAsync( () => {
      const result = dashboardService.addDashboard(addingDashboard).subscribe(resolve => {
        expect(resolve).toBe(addingDashboard);
      });
      httpServer.expectOne(serverUrl).flush(addingDashboard);
    }));
  });

  describe('deleteDashboard function', () => {
    it('should delete an dashboard', () => {
      const db = {id: '1', name: 'GHJ', tabs: ['G', 'H']};
      const result = dashboardService.deleteDashboard(db.id).subscribe(resolve => {
        expect(resolve).toEqual('1');
      });
      serverUrl = serverUrl + '/' + db.id;
      httpServer.expectOne(serverUrl).flush('1');
    });
  });

  describe('updateDashboard', () => {
    it('update an dashboard with id = "2"', fakeAsync( () => {
      const db = {id: '2', userId: 'admin', name: 'CDEupdate', tabs: []};
      const result = dashboardService.updateDashboard(db).subscribe(resolve => {
        expect(resolve).toBe(db);
      });
      serverUrl = serverUrl + '/' + db.id;
      httpServer.expectOne(serverUrl).flush(db);
    }));
  });
});
