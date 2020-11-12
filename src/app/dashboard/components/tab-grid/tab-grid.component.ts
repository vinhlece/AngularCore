import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewContainerRef
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {Subject} from 'rxjs';
import {first, takeUntil} from 'rxjs/operators';
import {ErrorDialogFormComponent} from '../../../common/components/error-dialog-form/error-dialog-form.component';
import {DragEvent} from '../../../widgets/models';
import {GridMetrics, Placeholder} from '../../models';
import {GridService} from '../../services/grid/grid.service';
import {ThemeService} from '../../../theme/theme.service';

declare let $: any;

@Component({
  selector: 'app-tab-grid',
  templateUrl: './tab-grid.component.html',
  styleUrls: ['./tab-grid.component.scss']
})
export class TabGridComponent implements OnInit, AfterViewInit, OnDestroy {
  private _gridService: GridService;
  private _zone: NgZone;
  private _matDialog: MatDialog;
  private _unsubscribe = new Subject<void>();
  private _metrics: GridMetrics;

  @Input() isShowGridLines: boolean;

  @Input()
  get metrics(): GridMetrics {
    return this._metrics ? this._metrics : {};
  }

  set metrics(value: GridMetrics) {
    this._metrics = value;
  }

  @Input() placeholders: Placeholder[];
  @Input() rows: number;
  @Input() columns: number;

  @Output() onReady = new EventEmitter<void>();
  @Output() onChange = new EventEmitter<Placeholder[]>();
  @Output() onRequestMetrics = new EventEmitter<GridMetrics>();
  @Output() onDragStart = new EventEmitter<DragEvent>();
  @Output() onDrag = new EventEmitter<DragEvent>();
  @Output() onDragStop = new EventEmitter<DragEvent>();
  @Output() onResizeStart = new EventEmitter<void>();
  @Output() onResizeStop = new EventEmitter<void>();

  constructor(gridService: GridService,
              zone: NgZone,
              viewContainerRef: ViewContainerRef,
              themeService: ThemeService,
              matDialog: MatDialog) {
    this._gridService = gridService;
    this._gridService.setRootViewContainer(viewContainerRef);
    this._zone = zone;
    this._matDialog = matDialog;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this._gridService.update();
    this.onRequestMetrics.emit(this._gridService.metrics);
  }

  ngOnInit() {
    this._gridService.onChange
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((placeholders: Placeholder[]) => this.onChange.emit(placeholders));

    this._gridService.onError
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(error => {
        if (error) {
          this._matDialog.open(ErrorDialogFormComponent, {
            width: '500px',
            data: error
          });
        }
      });

    this._gridService.onDragStart.pipe(takeUntil(this._unsubscribe)).subscribe((event: DragEvent) => this.onDragStart.emit(event));
    this._gridService.onDrag.pipe(takeUntil(this._unsubscribe)).subscribe((event: DragEvent) => this.onDrag.emit(event));
    this._gridService.onDragStop.pipe(takeUntil(this._unsubscribe)).subscribe((event: DragEvent) => this.onDragStop.emit(event));
    this._gridService.onResizeStart.pipe(takeUntil(this._unsubscribe)).subscribe(() => this.onResizeStart.emit());
    this._gridService.onResizeStop.pipe(takeUntil(this._unsubscribe)).subscribe(() => this.onResizeStop.emit());
  }

  ngAfterViewInit() {
    // can use with this._zone.onStable | set timeout to push task to queue
    this._zone.onMicrotaskEmpty
      .pipe(first())
      .subscribe(() => {
        this._gridService.makeGrid(this.rows, this.columns);
        this.onRequestMetrics.emit(this._gridService.metrics);

        this.onReady.emit();
      });
  }

  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.unsubscribe();
  }
}
