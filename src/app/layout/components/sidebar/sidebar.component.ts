import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  showSearch: boolean;

  @Input() showReplayButton: boolean = false;
  @Input() showPauseAndResumeButton: boolean = false;
  @Input() replayStatus: string = 'Stop';

  @Output() onClickSearch = new EventEmitter<MouseEvent>();
  @Output() onClickAdd = new EventEmitter<MouseEvent>();
  @Output() onClickReplay = new EventEmitter<MouseEvent>();
  @Output() onClickShiftTrendDiff = new EventEmitter<MouseEvent>();
  @Output() onClickDayTrendDiff = new EventEmitter<MouseEvent>();
  @Output() onClickWeekTrendDiff = new EventEmitter<MouseEvent>();
  @Output() onToggleGlobalFilter = new EventEmitter<void>();

  handleClickSearch(event: MouseEvent) {
    event.preventDefault();
    this.showSearch = !this.showSearch;
    this.onClickSearch.emit(event);
  }

  handleClickAdd(event: MouseEvent) {
    event.preventDefault();
    this.onClickAdd.emit(event);
  }

  handleToggleGlobalFilter(event: MouseEvent) {
    event.preventDefault();
    this.onToggleGlobalFilter.emit();
  }

  handleClickReplay(event: MouseEvent) {
    event.preventDefault();
    this.onClickReplay.emit(event);
  }

  handleClickShiftTrendDiff(event: MouseEvent) {
    event.preventDefault();
    this.onClickShiftTrendDiff.emit(event);
  }

  handleClickDayTrendDiff(event: MouseEvent) {
    event.preventDefault();
    this.onClickDayTrendDiff.emit(event);
  }

  handleClickWeekTrendDiff(event: MouseEvent) {
    event.preventDefault();
    this.onClickWeekTrendDiff.emit(event);
  }
}
