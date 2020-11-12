const dark_background_primary = '#1e1e2f';
const dark_background_secondary = '#27293d';
const text_primary = '#CCC';
const text_secondary = '#d7d7d7';
export const darkTheme = {
  dashboard_list_color: {
    '--header-background' : 'linear-gradient(0deg,#1e1e2f 0, #ec250d 96%,#1e1e2f 100%)',
    '--body-background': dark_background_primary,
    '--dashboard-card-background': dark_background_secondary,
    '--dashboard-card-text': '#a7a7ba',
    '--scrollbar-color': '#707070',
    '--scrollbar-bg': 'linear-gradient(0deg, #1e1e2f 18%, #27293d 48%, #1e1e2f 82%)'
  },
  dashboard_color: {
    '--tab-grid-background': 'linear-gradient(0deg, #1e1e2f 18%, #27293d 48%, #1e1e2f 82%)',
    '--placeholder-bg': dark_background_secondary,
    '--placeholder-header-bg': dark_background_secondary,
    '--placeholder-header-text': text_secondary,
    '--placeholder-menu': '#a9a9a9',
    '--time-explorer-bg': dark_background_primary,
    '--time-explorer-text': text_secondary,
    '--time-explorer-label': text_secondary,
    '--time-explorer-date': text_secondary,
    '--mat-icon': text_primary,
    '--library-bg': dark_background_primary,
    '--library-text': text_secondary,
    '--library-item-bg': dark_background_secondary,
    '--library-item-stream': text_secondary,
    '--table-row-even-bg': dark_background_secondary,
    '--table-row-odd-bg': '#444763',
    '--table-text': text_primary,
    '--table-paging-bg': dark_background_secondary,
    '--table-paging-text': text_primary,
    '--table-button-bg': text_primary,
    '--mat-expansion': dark_background_secondary,
    '--mat-card': 'linear-gradient(0deg, #1e1e2f 18%, #27293d 48%, #1e1e2f 82%)',
    '--mat-card-title': text_primary,
    '--mat-card-subtitle': text_secondary,
    '--menu-title': text_primary,
    '--overlay-bs': dark_background_secondary
  },
  edit_form: {
    '--edit-form-bg': dark_background_primary,
    '--edit-form-label': text_primary,
    '--ink-bar': text_primary,
    '--description-label': text_primary,
    '--edit-form-primary': text_primary,
    '--panel-border': text_primary,
    '--widget-item-bg': dark_background_secondary,
    '--widget-item-title': text_primary,
    '--widget-item-subtitle': text_secondary,
    '--mat-card-title': text_primary,
    '--mat-expansion-title': text_primary
  },
  widget_list: {
    '--widget-list-color': dark_background_secondary,
    '--widget-list-header': dark_background_primary,
    '--widget-list-title': text_primary,
    '--header-cell': text_secondary,
    '--widget-list-cell-bg': dark_background_primary,
    '--widget-list-cell-text': text_primary,
    '--table-bg': dark_background_secondary,
    '--table-text': text_primary,
    '--label': text_primary
  },
  measure_spicification: {
    '--opacity': '1',
    '--measure-definition-label-color': text_primary,
    '--event-view-bg': dark_background_secondary
  }
}
