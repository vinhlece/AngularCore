import {Component, Input, OnInit, ViewContainerRef} from '@angular/core';
import {SideBarItem} from '../../models';
import {AbstractSideBarItemBehaviors} from './behaviors';
import {SideBarItemBehaviorsFactory} from './factory';

@Component({
  selector: 'app-side-bar-item-container',
  templateUrl: './side-bar-item.container.html',
  styleUrls: ['./side-bar-item.container.scss'],
  providers: [SideBarItemBehaviorsFactory]
})
export class SideBarItemContainer implements OnInit {
  private _factory: SideBarItemBehaviorsFactory;
  private _behaviors: AbstractSideBarItemBehaviors;
  private _viewContainerRef: ViewContainerRef;

  @Input() item: SideBarItem;

  constructor(factory: SideBarItemBehaviorsFactory, viewContainerRef: ViewContainerRef) {
    this._factory = factory;
    this._viewContainerRef = viewContainerRef;
  }

  ngOnInit() {
    this._behaviors = this._factory.create(this.item);
  }

  handleMouseDown(event: MouseEvent) {
    this._behaviors.handleMouseDown(this.item, event, this._viewContainerRef);
  }

  handleDoubleClick(event: MouseEvent) {
    this._behaviors.handleDoubleClick(this.item, event, this._viewContainerRef);
  }
}
