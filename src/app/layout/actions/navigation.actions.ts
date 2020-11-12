import {Action} from '@ngrx/store';
import {Widget} from '../../widgets/models';
import {User} from '../../user/models/user';

export const NAVIGATE_TO = '[Navigation] Navigate To';

export const navigateToWidgetList = () => new NavigateTo('/widgets');
export const navigateToAddWidget = () => new NavigateTo('/widgets/new');
export const navigateToEditWidget = (widget: Widget) => {
  const {id, type} = widget;
  return new NavigateTo(`/widgets/${id}/edit?type=${type}`);
};
export const navigateToEditUser = (user: User) => {
  const {id} = user;
  return new NavigateTo(`/user/${id}`);
};
export const navigateToMeasures = () => new NavigateTo('/measures');

export class NavigateTo implements Action {
  type = NAVIGATE_TO;
  path: string;

  constructor(path: string) {
    this.path = path;
  }
}

export type Actions = NavigateTo;
