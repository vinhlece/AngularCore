// import {cold} from 'jasmine-marbles';
// import {mockBarWidget, mockTabularWidget, mockWidget} from '../../../shared/mocks/widgets';
// import {LaunchType, PlaceholderSize} from '../../models/enums';
// import {DefaultUIBehavior} from './ui-behaviors';
// import * as placeholdersActions from '../../actions/placeholders.actions';
//
// describe('UIBehavior', () => {
//   let store: any;
//
//   beforeEach(() => {
//     store = jasmine.createSpyObj('store', ['pipe', 'dispatch']);
//   });
//
//   describe('configure UI settings', () => {
//     it('should return empty settings if not focus', () => {
//       const placeholderSize$ = cold('-a-', {a: PlaceholderSize.MINIMUM});
//       const launchMode$      = cold('-a-', {a: LaunchType.INTEGRATED});
//       const focus$           = cold('-a-', {a: false});
//       const expected$        = cold('-a-', {a: {}});
//
//       store.pipe.and.returnValues(placeholderSize$, launchMode$, focus$);
//
//       const uiBehavior = new DefaultUIBehavior(store, mockWidget());
//       const result$ = uiBehavior.configure('abc');
//
//       expect(result$).toBeObservable(expected$);
//     });
//
//     it('integrated - not tabular - minimum size', () => {
//       const expectedSettings = {
//         enableDelete: true,
//         enableCopy: true,
//         enableMinimize: false,
//         enableMaximize: true,
//         enableExportMenu: false,
//         enableSearch: false,
//         enableContextMenu: true
//       };
//
//       const placeholderSize$ = cold('-a-', {a: PlaceholderSize.MINIMUM});
//       const launchMode$      = cold('-a-', {a: LaunchType.INTEGRATED});
//       const focus$           = cold('-a-', {a: true});
//       const expected$        = cold('-a-', {a: expectedSettings});
//
//       store.pipe.and.returnValues(placeholderSize$, launchMode$, focus$);
//
//       const uiBehavior = new DefaultUIBehavior(store, mockBarWidget());
//       const result$ = uiBehavior.configure('abc');
//
//       expect(result$).toBeObservable(expected$);
//     });
//
//     it('integrated - not tabular - maximum size', () => {
//       const expectedSettings = {
//         enableDelete: false,
//         enableCopy: true,
//         enableMinimize: true,
//         enableMaximize: false,
//         enableExportMenu: false,
//         enableSearch: false,
//         enableContextMenu: true
//       };
//
//       const placeholderSize$ = cold('-a-', {a: PlaceholderSize.MAXIMUM});
//       const launchMode$      = cold('-a-', {a: LaunchType.INTEGRATED});
//       const focus$           = cold('-a-', {a: true});
//       const expected$        = cold('-a-', {a: expectedSettings});
//
//       store.pipe.and.returnValues(placeholderSize$, launchMode$, focus$);
//
//       const uiBehavior = new DefaultUIBehavior(store, mockBarWidget());
//       const result$ = uiBehavior.configure('abc');
//
//       expect(result$).toBeObservable(expected$);
//     });
//
//     it('integrated - tabular - minimum size', () => {
//       const expectedSettings = {
//         enableDelete: true,
//         enableCopy: true,
//         enableMinimize: false,
//         enableMaximize: true,
//         enableExportMenu: true,
//         enableSearch: true,
//         enableContextMenu: true
//       };
//
//       const placeholderSize$ = cold('-a-', {a: PlaceholderSize.MINIMUM});
//       const launchMode$      = cold('-a-', {a: LaunchType.INTEGRATED});
//       const focus$           = cold('-a-', {a: true});
//       const expected$        = cold('-a-', {a: expectedSettings});
//
//       store.pipe.and.returnValues(placeholderSize$, launchMode$, focus$);
//
//       const uiBehavior = new DefaultUIBehavior(store, mockTabularWidget());
//       const result$ = uiBehavior.configure('abc');
//
//       expect(result$).toBeObservable(expected$);
//     });
//
//     it('integrated - tabular - maximum size', () => {
//       const expectedSettings = {
//         enableDelete: false,
//         enableCopy: true,
//         enableMinimize: true,
//         enableMaximize: false,
//         enableExportMenu: true,
//         enableSearch: true,
//         enableContextMenu: true
//       };
//
//       const placeholderSize$ = cold('-a-', {a: PlaceholderSize.MAXIMUM});
//       const launchMode$      = cold('-a-', {a: LaunchType.INTEGRATED});
//       const focus$           = cold('-a-', {a: true});
//       const expected$        = cold('-a-', {a: expectedSettings});
//
//       store.pipe.and.returnValues(placeholderSize$, launchMode$, focus$);
//
//       const uiBehavior = new DefaultUIBehavior(store, mockTabularWidget());
//       const result$ = uiBehavior.configure('abc');
//
//       expect(result$).toBeObservable(expected$);
//     });
//
//     it('standalone - not tabular - any size', () => {
//       const expectedSettings = {
//         enableDelete: false,
//         enableCopy: true,
//         enableMinimize: false,
//         enableMaximize: false,
//         enableExportMenu: false,
//         enableSearch: false,
//         enableContextMenu: false
//       };
//
//       const placeholderSize$ = cold('-a-', {a: PlaceholderSize.MINIMUM});
//       const launchMode$      = cold('-a-', {a: LaunchType.STANDALONE});
//       const focus$           = cold('-a-', {a: true});
//       const expected$        = cold('-a-', {a: expectedSettings});
//
//       store.pipe.and.returnValues(placeholderSize$, launchMode$, focus$);
//
//       const uiBehavior = new DefaultUIBehavior(store, mockBarWidget());
//       const result$ = uiBehavior.configure('abc');
//
//       expect(result$).toBeObservable(expected$);
//     });
//
//     it('standalone - tabular - any size', () => {
//       const expectedSettings = {
//         enableDelete: false,
//         enableCopy: true,
//         enableMinimize: false,
//         enableMaximize: false,
//         enableExportMenu: true,
//         enableSearch: true,
//         enableContextMenu: false
//       };
//
//       const placeholderSize$ = cold('-a-', {a: PlaceholderSize.MAXIMUM});
//       const launchMode$      = cold('-a-', {a: LaunchType.STANDALONE});
//       const focus$           = cold('-a-', {a: true});
//       const expected$        = cold('-a-', {a: expectedSettings});
//
//       store.pipe.and.returnValues(placeholderSize$, launchMode$, focus$);
//
//       const uiBehavior = new DefaultUIBehavior(store, mockTabularWidget());
//       const result$ = uiBehavior.configure('abc');
//
//       expect(result$).toBeObservable(expected$);
//     });
//   });
//
//   describe('focus/blur', () => {
//     it('should dispatch focus action on focus', () => {
//       const behavior = new DefaultUIBehavior(store, mockBarWidget());
//       behavior.focus('abc');
//       expect(store.dispatch).toHaveBeenCalledWith(new placeholdersActions.Focus('abc'));
//     });
//
//     it('should dispatch blur action on blur', () => {
//       const behavior = new DefaultUIBehavior(store, mockBarWidget());
//       behavior.blur('abc');
//       expect(store.dispatch).toHaveBeenCalledWith(new placeholdersActions.Blur('abc'));
//     });
//   });
// });
