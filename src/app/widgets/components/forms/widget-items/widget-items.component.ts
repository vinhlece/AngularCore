import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {ThemeService} from '../../../../theme/theme.service';
import {Theme} from '../../../../theme/model/index';

@Component({
  selector: 'app-widget-items',
  templateUrl: './widget-items.component.html',
  styleUrls: ['./widget-items.component.scss']
})
export class WidgetItemsComponent {
  @Input() dimension: string;
  @Input() package: string;
  @Input() count: number = 0;
  @Input() filter: boolean = false;

  @Output() onDeleteDimension = new EventEmitter<string>();
  @Output() onInstancesFilter = new EventEmitter<void>();

  constructor(private themeService: ThemeService) {}

  isDarkTheme() {
    if (this.themeService.getCurrentTheme() === Theme.Dark) {
      return 'dark-theme-box';
    }
    return '';
  }

  handleDelete() {
    this.onDeleteDimension.emit(this.dimension);
  }

  handleFilter() {
    this.onInstancesFilter.emit();
  }
}
