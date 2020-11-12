import {
  ChangeDetectionStrategy, Component, EventEmitter, Input, Output,
  ViewEncapsulation
} from '@angular/core';
import { ColorPalette } from '../../../common/models/index';
import { User } from '../../../user/models/user';
import { getDefaultColorPalettes } from '../../../common/utils/color';
import { AppConfigService } from '../../../app.config.service';
import { Router } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ThemeService} from '../../../theme/theme.service';
import {isNullOrUndefined} from '../../../common/utils/function';
import {Theme} from '../../../theme/model/index';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {
  @Input() user: User;
  @Input() currentLocation: string;
  @Input() routerList = [];
  @Input() palettes: ColorPalette[];
  @Input() selectedPalette: string = '';
  @Output() logout = new EventEmitter();
  @Output() onChangeColorPalette = new EventEmitter();
  @Output() onDeleteColorPalette = new EventEmitter();
  @Output() onTriggerAction = new EventEmitter();
  private _appConfigService;
  private _themeService: ThemeService;
  isExpanded = false;
  activeTheme;
  get isLogin() {
    return !isNullOrUndefined(this.user);
  }

  get version() {
    return this.hasVersion() ? this._appConfigService.config.version : null;
  }

  constructor(appConfigService: AppConfigService, private router: Router,
              public translate: TranslateService, themeService: ThemeService) {
    this._appConfigService = appConfigService;
    this._themeService = themeService;
    this.activeTheme = themeService.getCurrentTheme();
    const storageTheme = localStorage.getItem('theme');
    if (storageTheme) {
      setTimeout(() => {
        this._themeService.setActiveThem(storageTheme);
        this.activeTheme = themeService.getCurrentTheme();
      }, 0);
    }
  }

  hasVersion(): boolean {
    return this._appConfigService && this._appConfigService.config && this._appConfigService.config.version;
  }

  onLogout() {
    if (this.isLogin) {
      this.logout.emit();
    }
  }

  triggerAction(event, item) {
    const { icon, isSelected, ...another } = item;
    this.onTriggerAction.emit({ event: event, ...another });
  }

  triggerRouteNavigate(routeLink) {
    this.router.navigate([routeLink]);
  }

  handleSideBarClick($event, item) {
    if (item.childs) {
      if (!this.isExpanded) {
        this.isExpanded = true;
        item.openChild = true;
        return;
      }
      item.openChild = !item.openChild;
      return;
    }
    // Prevent parent click
    $event.stopPropagation();
    // Update selected position
    this.updateMenuItemSelected(item);
    if (item.action) {
      this.isExpanded = false;
      this.triggerAction($event, item);
      return;
    }
    this.triggerRouteNavigate(item.routerLink);
  }

  handleChangeColorPalette(event) {
    this.onChangeColorPalette.emit(event);
  }

  isDefaultColorPalettes(paletteId: string): boolean {
    const defaultColorPalettes = getDefaultColorPalettes();
    return defaultColorPalettes.find(item => item.id === paletteId) != null;
  }

  deleteColorPalette(paletteId: string) {
    this.onDeleteColorPalette.emit(paletteId);
  }

  updateMenuItemSelected(selectedItem) {
    this.routerList.forEach(item => {
      if (!item.childs) {
        item.isSelected = item.property === selectedItem.property;
      } else {
        item.childs.forEach(cItem => {
          cItem.isSelected = cItem.property === selectedItem.property;
        });
      }
    });
  }

  selectLanguage(language: string) {
    this.translate.use(language);
    localStorage.setItem('language', language);
  }

  toggleTheme() {
    if (this.isDefaultTheme()) {
      this._themeService.setActiveThem(Theme.Dark);
    } else {
      this._themeService.setActiveThem(Theme.Light);
    }
    this.activeTheme = this._themeService.getCurrentTheme();
  }

  isDefaultTheme() {
    return this.activeTheme === Theme.Light;
  }

  isDarkTheme() {
    if (!this.isDefaultTheme()) {
      return 'dark-theme-box';
    }
    return '';
  }
}
