import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar} from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { uuid } from '../../../common/utils/uuid';
import * as pollingActions from '../../../realtime/actions/rest-api/polling.actions';
import * as dashboardsActions from '../../actions/dashboards.action';
import * as replayActions from '../../actions/replay.actions';
import * as tabEditorActions from '../../actions/tab-editor.actions';
import * as tabActions from '../../actions/tabs.actions';
import * as timePreferencesActions from '../../actions/time-preferences.actions';
import { NewDialogWithTitleComponent } from '../../components/common/new-dialog-with-title.component';
import { Dashboard, Tab } from '../../models';
import * as fromDashboards from '../../reducers';
import { ReplayStatus } from '../../models/enums';
import { takeUntil } from 'rxjs/internal/operators';
import * as fromWidgets from '../../../widgets/reducers/index';
import { Widget } from '../../../widgets/models/index';
import * as editWidgetActions from '../../../widgets/actions/editing-widget.actions';
import { Default_Config, PlaceholderDefaultSize } from '../../../widgets/models/constants';
import { WidgetsFactory } from '../../../widgets/services/index';
import { WIDGETS_FACTORY } from '../../../widgets/services/tokens';
import { ColorPalette } from '../../../common/models/index';
import * as fromUser from '../../../user/reducers/index';
import { DataTypes } from '../../../measures/models/enums';
import { WidgetType } from '../../../widgets/constants/widget-types';
import {TranslateService} from '@ngx-translate/core';
import {ThemeService} from '../../../theme/theme.service';
import {Theme} from '../../../theme/model/index';
import {User} from '../../../user/models/user';

@Component({
  selector: 'app-dashboard-viewer-container',
  templateUrl: './dashboard-viewer.container.html',
  styleUrls: ['./dashboard-viewer.container.scss'],
  animations: [
    trigger('searchSlideState', [
      state('in', style({
        flexBasis: '12%',
        opacity: 1
      })),
      state('out', style({
        width: '0px',
        opacity: 0
      })),
      transition('in => out', animate('200ms ease-in')),
      transition('out => in', animate('200ms ease-out'))
    ])
  ],
})
export class DashboardViewerContainer implements OnInit, OnDestroy {
  private _store: Store<fromDashboards.State>;
  private _route: ActivatedRoute;
  private _dialogService: MatDialog;
  private _dashboardId: string;
  private _unsubscribe = new Subject<void>();
  private _widgetFactory: WidgetsFactory;
  private _colorPalette: ColorPalette;
  private  _snackBar: MatSnackBar;
  private _libraryItem = 'layout.header.library';
  private _themeService: ThemeService;
  showGlobalFilter = false;

  routerList = [
    { routerLink: '/dashboards', property: 'layout.header.dashboard_management', icon: 'dashboard', isSelected: true },
    { routerLink: '/widgets', property: 'layout.header.widget_management', icon: 'widget' },
    { routerLink: '/measures', property: 'layout.header.measure_directory', icon: 'measure' },
    {
      property: this._libraryItem, icon: 'widget',
      openChild: false,
      childs: [
        {
          property: 'layout.header.widget', label: 'layout.header.label_widget', icon: 'widget',
          action: 'handleClickSearch', params: { searchType: 'widgets' }
        },
        {
          property: 'layout.header.instance', label: 'layout.header.label_instance', icon: 'widget_library',
          action: 'handleClickSearch', params: { searchType: 'instances' }
        },
        {
          property: 'layout.header.measure', label: 'layout.header.label_measure', icon: 'measure',
          action: 'handleClickSearch', params: { searchType: 'measures' }
        },
      ]
    }
    // { routerLink: '', title: 'Help', icon: 'help' }
  ];

  dashboard$: Observable<Dashboard>;
  replayStatus$: Observable<ReplayStatus>;
  user$: Observable<User>;
  searchSlideState: 'in' | 'out' = 'out';
  searchSlideStateNew: 'in' | 'out' = 'out';
  widget$: Observable<Widget>;
  isEditingWidget: boolean = true;
  currentLibrary: any = { label: '', params: { searchType: 'all' } };
  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor(store: Store<fromDashboards.State>, route: ActivatedRoute, dialogService: MatDialog,
    @Inject(WIDGETS_FACTORY) widgetFactory: WidgetsFactory, public translate: TranslateService,
              private snackBarService: MatSnackBar, themeService: ThemeService) {
    this._store = store;
    this._route = route;
    this._dialogService = dialogService;
    this._widgetFactory = widgetFactory;
    this._snackBar = snackBarService;
    this._themeService = themeService;
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.handleClose();
  }
  @HostListener('window:beforeunload', ['$event']) beforeUnloadHander(event) {
    this.ngOnDestroy();
  }

  ngOnInit() {
    this.resetEditingWidget();
    this._route.params.subscribe(param => {
      this._dashboardId = param.id;
      this.dashboard$ = this._store.pipe(select(fromDashboards.getDashboardById(param.id)));
      this.replayStatus$ = this._store.pipe(select(fromDashboards.getReplayStatus));
      this.user$ = this._store.pipe(select(fromUser.getAuthenticatedUser));
      this._store.dispatch(new dashboardsActions.Load(this._dashboardId));
      this._store.dispatch(new timePreferencesActions.Load());
      this._store.dispatch(new pollingActions.Start());
    });
    this.widget$ = this._store.pipe(select(fromWidgets.getEditingWidget), takeUntil(this._unsubscribe));
    this.widget$.subscribe((item: Widget) => {
      if (item) {
        this.isEditingWidget = true;
        this.searchSlideStateNew = 'in';
      } else {
        setTimeout(() => { this.searchSlideStateNew = 'out'; }, 10);
      }
    });
    this._store.pipe(select(fromUser.getCurrentColorPalette))
      .subscribe(palette => this._colorPalette = palette);
    this._store.pipe(select(fromDashboards.getConnectionStatus), takeUntil(this._unsubscribe))
      .subscribe(status => {
        if (status) {
          this._snackBar.open(this.translate.instant('dashboard.placeholder.websocket'), this.translate.instant(status), {
            duration: 3000,
          });
        }
      });
  }

  ngOnDestroy() {
    this._store.dispatch(new tabActions.Exit());
    this._store.dispatch(new timePreferencesActions.StopUpdateInRealTime());
    this.resetEditingWidget();
    this._unsubscribe.next();
    this._unsubscribe.unsubscribe();
  }

  handleTriggerAction(event) {
    if (event.action) {
      this[event.action](event);
    }
  }

  handleClickAddTab(userId: string) {
    this.handleAddNewWidget(userId);
  }

  handleClickSearch(params) {
    this.openSearchBar();
    this.currentLibrary = params;
  }

  handleToggleReplay() {
    this._store.dispatch(new replayActions.Toggle());
  }

  toggleGlobalFilter() {
    this.showGlobalFilter = !this.showGlobalFilter;
  }

  handleAnimationDone() {
    this._store.dispatch(new tabEditorActions.AdjustSize());
  }

  handleClose() {
    this.resetEditingWidget();
    this.searchSlideStateNew = 'out';
  }

  handleSave() {
    this.handleClose();
  }

  openSearchBar() {
    this.searchSlideState = 'in';
  }

  addNewWidget(type, userId: string) {
    this._store.dispatch(new tabEditorActions.SaveEditingWidget(this.createBlankWidget(type, userId)));
    this.isEditingWidget = false;
    this.searchSlideStateNew = 'in';
  }

  private openCreateNewTabDialog() {
    const dialogRef = this._dialogService.open(NewDialogWithTitleComponent, {
      width: '600px',
      data: {
        title: 'Create new tab',
        inputData: { name: null }
      }
    });

    dialogRef.afterClosed().subscribe((tab: Tab) => {
      if (!tab) {
        return false;
      }
      tab.id = uuid();
      tab.dashboardId = this._dashboardId;
      this._store.dispatch(new tabActions.Add(tab));
    });
  }

  handleCloseSideBar() {
    this.searchSlideState = 'out';
    const library = this.routerList.find(item => item.property === this._libraryItem);
    if (library) {
      library.childs = [...library.childs.map(item => ({ ...item, isSelected: false }))];
    }
  }

  handleAddNewWidget(userId: string) {
    const panelClass = this._themeService.getCurrentTheme() === Theme.Light ? ['add-new-widget', 'mat-dialog-container-custom'] :
      ['add-new-widget', 'mat-dialog-container-custom', 'dark-theme-dialog-add-widget'];
    const dialogRef = this._dialogService.open(NewDialogWithTitleComponent, {
      width: '600px',
      panelClass,
      data: {
        title: this.translate.instant('dashboard.simple_name_form.title_create_new_widget'),
        inputData: {
          widgetType: Object.values(WidgetType).filter(item => item !== WidgetType.LabelWidget)
        }
      }
    });

    dialogRef.afterClosed().subscribe((item: any) => {
      if (item && item.type) {
        this.addNewWidget(item, userId);
      }
    });
  }

  handleAddLabelWidget(userId: string) {
    const labelWidget = {
      ...this.createDefaultWidget(userId, WidgetType.LabelWidget),
      type: WidgetType.LabelWidget
    }
    this._store.dispatch(new tabEditorActions.SaveEditingWidget(labelWidget));
  }

  handleAddEventViewerWidget(userId: string) {
    const evWidget = {
      ...this.createDefaultWidget(userId, WidgetType.EventViewer),
      type: WidgetType.EventViewer
    }
    this._store.dispatch(new tabEditorActions.SaveEditingWidget(evWidget));
  }

  private createBlankWidget(type, userId: string): Widget {
    const formatType = type.type.toString().replace(' ', '');

    return {
      ...this._widgetFactory.create(type, this._colorPalette),
      ...this.createDefaultWidget(userId, formatType)
    };
  }

  private createDefaultWidget(userId: string, formatType?: string) {
    return {
      id: uuid(),
      name: 'Untitled',
      dataType: DataTypes.QUEUE_PERFORMANCE,
      defaultSize: Default_Config[formatType] ? Default_Config[formatType].defaultSize : PlaceholderDefaultSize,
      isTemplate: false,
      userId
    };
  }

  private resetEditingWidget() {
    this._store.dispatch(new editWidgetActions.Edit(null));
  }
}
