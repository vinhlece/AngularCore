import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {Dashboard, Tab} from '../../../models/index';
import {User} from '../../../../user/models/user';
import {Widget} from '../../../../widgets/models/index';
import {Theme} from '../../../../theme/model/index';
import {ThemeService} from '../../../../theme/theme.service';

@Component({
  selector: 'app-dashboard-detail',
  templateUrl: './dashboard-detail.component.html',
  styleUrls: ['./dashboard-detail.component.scss']
})
export class DashboardDetailComponent {
  @Input() dashboard: Dashboard;
  @Input() total = {};
  @Input() recent: boolean;
  @Output() deleteDashboardEventEmitter: EventEmitter<number> = new EventEmitter<number>();
  @Output() onRenameDashboard = new EventEmitter<Dashboard>();
  @Output() onCopyDashboard = new EventEmitter<Dashboard>();
  isShowMenu: boolean = false;

  constructor(private themeService: ThemeService) { }

  getNumberOfObject(id: string, property: string): number {
    if (Object.keys(this.total).length !== 0) {
      return this.total[id] && this.total[id][property] ? this.total[id][property].length : 0;
    }
    return 0;
  }

  isDarkTheme() {
    if (this.themeService.getCurrentTheme() === Theme.Dark) {
      return 'dark-theme-box';
    }
    return '';
  }

  getStyleForDynamic() {
    if (this.isShowMenu) {
      return {
        transition: '0.8s',
        right: '14px'
      };
    }
    return {
      transition: '0.8s',
      opacity: '0'
    };
  }

  getButtonStyle() {
    if (this.recent) {
      return {
        'right': '4px'
      };
    } else {
      return {
        'right': '3px'
      };
    }
  }

  getMenuStyle() {
    if (this.recent) {
      return {
        'right': '-10px'
      };
    } else {
      return {
        'right': '-8px'
      };
    }
  }

  getNumberStyle() {
    if (this.recent) {
      return {
        'top': '20%',
        'font-size': '13px'
      };
    } else {
      return {
        'top': '20%',
        'font-size': '20px',
      };
    }
  }

  getTextStyle() {
    if (this.recent) {
      return {
        'top': '25%',
        'font-size': '6px',
      };
    } else {
      return {
        'top': '15%',
        'font-size': '8px',
      };
    }
  }

  getCardStyle() {
    if (this.recent) {
      return {
        'margin-right': '10px',
        height: '120px'
      };
    } else {
      return {
        margin: '10px 10px 0 0'
      };
    }
  }

  copyDashboard(dashboard: Dashboard, event) {
    this.preventRouter(event);
    this.onCopyDashboard.emit(dashboard);
  }

  renameDashboard(dashboard: Dashboard, event) {
    this.preventRouter(event);
    this.onRenameDashboard.emit(dashboard);
  }

  handleDeleteDashboard(id, event) {
    this.preventRouter(event);
    this.deleteDashboardEventEmitter.emit(id);
  }

  showMenu(event) {
    this.preventRouter(event);
    this.isShowMenu = true;
  }

  preventRouter(event) {
    event.stopPropagation();
    return;
  }
}
