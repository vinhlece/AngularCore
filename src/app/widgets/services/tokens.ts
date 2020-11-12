import {InjectionToken} from '@angular/core';
import {DraggableService, PreviewDataGenerator, WidgetsFactory} from '.';

export const PREVIEW_DATA_GENERATOR = new InjectionToken<PreviewDataGenerator>('PreviewDataGenerator');
export const DRAGGABLE_SERVICE = new InjectionToken<DraggableService>('DraggableService');
export const SEARCH_DEBOUNCE_TIME = new InjectionToken<Number>('SearchDebounceTime');
export const WIDGETS_FACTORY = new InjectionToken<WidgetsFactory>('WidgetsFactory');
