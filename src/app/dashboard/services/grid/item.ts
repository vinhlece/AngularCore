export class GridItem {
  private _el: any;

  constructor(el: any) {
    this._el = el;
  }

  setWidgetId(id: string) {
    this._el.attr('data-widget-id', id);
  }

  setWidgetPlaceholderId(widgetId: string, placeholderId: string) {
    this._el.attr('data-widget-id', widgetId);
    this._el.attr('data-id', placeholderId);
  }
}
