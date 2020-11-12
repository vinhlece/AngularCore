import {createMeasureId} from '../common/schemas/utils';
import deepFreeze from '../common/testing/deepFreeze';
import {mockTab} from '../common/testing/mocks/dashboards';
import {mockFormulaMeasure} from '../common/testing/mocks/mockMeasures';
import * as dashboardsActions from '../dashboard/actions/dashboards.action';
import * as tabsActions from '../dashboard/actions/tabs.actions';
import {FormulaMeasure, Measure} from '../measures/models';
import * as formulaMeasureActions from '../measures/actions/formula-measure.actions';
import * as instancesActions from '../widgets/actions/instances.actions';
import * as measuresActions from '../measures/actions/measures.actions';
import * as widgetsActions from '../widgets/actions/widgets.actions';
import * as fromEntities from './entities.reducer';

describe('entities reducer', () => {
  it('should merge entities state if action has entity in payload', () => {
    const stateBefore: fromEntities.State = {
      widgets: {},
      dashboards: {},
      tabs: {},
      placeholders: {},
      packages: {},
      measures: {},
      instances: [],
      isBootstrapLoaded: true,
      palettes: {},
      users: {}
    };
    const stateAfter: fromEntities.State = {
      widgets: {
        1: {name: 'test widget'}
      },
      dashboards: {
        1: {name: 'test dashboard'}
      },
      tabs: {},
      placeholders: {},
      packages: {},
      measures: {},
      instances: [],
      isBootstrapLoaded: true,
      palettes: {
        1: {name: 'test palette'}
      },
      users: {}
    };
    const action = {
      type: 'TEST',
      payload: {
        entities: {
          widgets: {
            1: {name: 'test widget'}
          },
          dashboards: {
            1: {name: 'test dashboard'}
          },
          palettes: {
            1: {name: 'test palette'}
          }
        }
      }
    };
    deepFreeze(stateBefore);
    deepFreeze(action);
    expect(fromEntities.reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('should return previous state if action has no entity in payload', () => {
    const stateBefore: fromEntities.State = {
      widgets: {
        1: {name: 'test widget'}
      },
      dashboards: {
        1: {name: 'test dashboard'}
      },
      tabs: {},
      placeholders: {},
      packages: {},
      measures: {},
      instances: [],
      isBootstrapLoaded: true,
      palettes: {
        1: {name: 'test palette'}
      },
      users: {}
    };

    const stateAfter: fromEntities.State = {
      widgets: {
        1: {name: 'test widget'}
      },
      dashboards: {
        1: {name: 'test dashboard'}
      },
      tabs: {},
      placeholders: {},
      packages: {},
      measures: {},
      instances: [],
      isBootstrapLoaded: true,
      palettes: {
        1: {name: 'test palette'}
      },
      users: {}
    };
    const action = {
      type: 'TEST',
      payload: {name: 'test'}
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(fromEntities.reducer(stateBefore, action)).toEqual(stateAfter);
  });

  describe('widgets state', () => {
    it('should mark a widget as deleted with delete widget success action', () => {
      const stateBefore = {
        1: {name: 'test widget 1'},
        2: {name: 'test widget 2'}
      };

      const stateAfter = {
        1: {name: 'test widget 1'},
        2: {name: 'test widget 2', status: 'deleted'}
      };
      const action = new widgetsActions.DeleteSuccess('2');

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromEntities.widgets(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('dashboards state', () => {
    it('should mark a dashboard as deleted with delete dashboard success action', () => {
      const stateBefore = {
        1: {name: 'dashboard 1'},
        2: {name: 'dashboard 2'}
      };

      const stateAfter = {
        1: {name: 'dashboard 1', status: 'deleted'},
        2: {name: 'dashboard 2'}
      };
      const action = new dashboardsActions.DeleteSuccess('1');

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromEntities.dashboards(stateBefore, action)).toEqual(stateAfter);
    });

    it('should add a tab id to tab ids list of dashboard on add tab success action', () => {
      const tab = {...mockTab(), id: '3', dashboardId: '1', placeholders: []};
      const stateBefore = {
        1: {name: 'dashboard 1', tabs: ['1', '2']},
        2: {name: 'dashboard 2', tabs: ['4', '5']}
      };

      const stateAfter = {
        1: {name: 'dashboard 1', tabs: ['1', '2', '3']},
        2: {name: 'dashboard 2', tabs: ['4', '5']}
      };
      const action = new tabsActions.AddSuccess(tab);

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromEntities.dashboards(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('tabs state', () => {
    it('should mark a tab as deleted with delete tab success action', () => {
      const stateBefore = {
        1: {name: 'tab 1'},
        2: {name: 'tab 2'}
      };

      const stateAfter = {
        1: {name: 'tab 1'},
        2: {name: 'tab 2', status: 'deleted'}
      };
      const action = new tabsActions.DeleteSuccess('2');

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromEntities.tabs(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('packages state', () => {
    it('should add new measures name for each packages with load all formula measures success action', () => {
      const measure = mockFormulaMeasure();
      const stateBefore = {
        'package 1': {
          measures: [createMeasureId('package 1', 'measure 1'), createMeasureId('package 1', 'measure 2')]
        },
        'package 2': {
          measures: [createMeasureId('package 2', 'measure 5'), createMeasureId('package 2', 'measure 6')]
        }
      };
      const stateAfter = {
        'package 1': {
          measures: [
            createMeasureId('package 1', 'measure 1'),
            createMeasureId('package 1', 'measure 2'),
            createMeasureId('package 1', 'measure 3'),
            createMeasureId('package 1', 'measure 4')
          ]
        },
        'package 2': {
          measures: [
            createMeasureId('package 2', 'measure 5'),
            createMeasureId('package 2', 'measure 6'),
            createMeasureId('package 2', 'measure 7')
          ]
        }
      };
      const measures: FormulaMeasure[] = [
        {...measure, dataType: 'package 1', name: 'measure 3'},
        {...measure, dataType: 'package 1', name: 'measure 4'},
        {...measure, dataType: 'package 2', name: 'measure 7'}
      ];
      const action = new formulaMeasureActions.LoadAllSuccess(measures);

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromEntities.packages(stateBefore, action)).toEqual(stateAfter);
    });

    it('should not add existing measures name to a package with load all formula measures success action', () => {
      const measure = mockFormulaMeasure();
      const stateBefore = {
        'package 1': {
          measures: [createMeasureId('package 1', 'measure 1'), createMeasureId('package 1', 'measure 2')]
        },
        'package 2': {
          measures: [createMeasureId('package 2', 'measure 5'), createMeasureId('package 2', 'measure 6')]
        }
      };
      const stateAfter = {
        'package 1': {
          measures: [createMeasureId('package 1', 'measure 1'), createMeasureId('package 1', 'measure 2')]
        },
        'package 2': {
          measures: [
            createMeasureId('package 2', 'measure 5'),
            createMeasureId('package 2', 'measure 6'),
            createMeasureId('package 2', 'measure 7')
          ]
        }
      };
      const measures: FormulaMeasure[] = [
        {...measure, dataType: 'package 1', name: 'measure 1'},
        {...measure, dataType: 'package 1', name: 'measure 2'},
        {...measure, dataType: 'package 2', name: 'measure 7'}
      ];
      const action = new formulaMeasureActions.LoadAllSuccess(measures);

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromEntities.packages(stateBefore, action)).toEqual(stateAfter);
    });

    it('should return current state if measures is empty with load all formula measures success action', () => {
      const stateBefore = {
        'package 1': {
          measures: [createMeasureId('package 1', 'measure 1'), createMeasureId('package 1', 'measure 2')]
        },
        'package 2': {
          measures: [createMeasureId('package 2', 'measure 5'), createMeasureId('package 2', 'measure 6')]
        }
      };
      const stateAfter = {
        'package 1': {
          measures: [createMeasureId('package 1', 'measure 1'), createMeasureId('package 1', 'measure 2')]
        },
        'package 2': {
          measures: [createMeasureId('package 2', 'measure 5'), createMeasureId('package 2', 'measure 6')]
        }
      };
      const measures: FormulaMeasure[] = [];
      const action = new formulaMeasureActions.LoadAllSuccess(measures);

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromEntities.packages(stateBefore, action)).toEqual(stateAfter);
    });

    it('should add new measures name for each packages with find measures by name success action', () => {
      const measure = mockFormulaMeasure();
      const stateBefore = {
        'package 1': {
          measures: [createMeasureId('package 1', 'measure 1'), createMeasureId('package 1', 'measure 2')]
        },
        'package 2': {
          measures: [createMeasureId('package 2', 'measure 5'), createMeasureId('package 2', 'measure 6')]
        }
      };
      const stateAfter = {
        'package 1': {
          measures: [
            createMeasureId('package 1', 'measure 1'),
            createMeasureId('package 1', 'measure 2'),
            createMeasureId('package 1', 'measure 3'),
            createMeasureId('package 1', 'measure 4')
          ]
        },
        'package 2': {
          measures: [
            createMeasureId('package 2', 'measure 5'),
            createMeasureId('package 2', 'measure 6'),
            createMeasureId('package 2', 'measure 7')
          ]
        }
      };
      const measures: FormulaMeasure[] = [
        {...measure, dataType: 'package 1', name: 'measure 3'},
        {...measure, dataType: 'package 1', name: 'measure 4'},
        {...measure, dataType: 'package 2', name: 'measure 7'}
      ];
      const action = new measuresActions.FindByNameSuccess(measures);

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromEntities.packages(stateBefore, action)).toEqual(stateAfter);
    });

    it('should not add existing measures name to a package with find measures by name success action', () => {
      const measure = mockFormulaMeasure();
      const stateBefore = {
        'package 1': {
          measures: [createMeasureId('package 1', 'measure 1'), createMeasureId('package 1', 'measure 2')]
        },
        'package 2': {
          measures: [createMeasureId('package 2', 'measure 5'), createMeasureId('package 2', 'measure 6')]
        }
      };
      const stateAfter = {
        'package 1': {
          measures: [createMeasureId('package 1', 'measure 1'), createMeasureId('package 1', 'measure 2')]
        },
        'package 2': {
          measures: [
            createMeasureId('package 2', 'measure 5'),
            createMeasureId('package 2', 'measure 6'),
            createMeasureId('package 2', 'measure 7')
          ]
        }
      };
      const measures: FormulaMeasure[] = [
        {...measure, dataType: 'package 1', name: 'measure 1'},
        {...measure, dataType: 'package 1', name: 'measure 2'},
        {...measure, dataType: 'package 2', name: 'measure 7'}
      ];
      const action = new measuresActions.FindByNameSuccess(measures);

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromEntities.packages(stateBefore, action)).toEqual(stateAfter);
    });

    it('should return current state if measures is empty with find measures by name success action', () => {
      const stateBefore = {
        'package 1': {
          measures: [createMeasureId('package 1', 'measure 1'), createMeasureId('package 1', 'measure 2')]
        },
        'package 2': {
          measures: [createMeasureId('package 2', 'measure 5'), createMeasureId('package 2', 'measure 6')]
        }
      };
      const stateAfter = {
        'package 1': {
          measures: [createMeasureId('package 1', 'measure 1'), createMeasureId('package 1', 'measure 2')]
        },
        'package 2': {
          measures: [createMeasureId('package 2', 'measure 5'), createMeasureId('package 2', 'measure 6')]
        }
      };
      const measures: Measure[] = [];
      const action = new measuresActions.FindByNameSuccess(measures);

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromEntities.packages(stateBefore, action)).toEqual(stateAfter);
    });

    it('should add new measures name to a package with add formula measure success action', () => {
      const stateBefore = {
        'package 1': {
          measures: [createMeasureId('package 1', 'measure 1'), createMeasureId('package 1', 'measure 2')]
        },
        'package 2': {
          measures: [createMeasureId('package 2', 'measure 5'), createMeasureId('package 2', 'measure 6')]
        }
      };
      const stateAfter = {
        'package 1': {
          measures: [createMeasureId('package 1', 'measure 1'), createMeasureId('package 1', 'measure 2')]
        },
        'package 2': {
          measures: [
            createMeasureId('package 2', 'measure 5'),
            createMeasureId('package 2', 'measure 6'),
            createMeasureId('package 2', 'measure 7')
          ]
        }
      };
      const measure: FormulaMeasure = {...mockFormulaMeasure(), dataType: 'package 2', name: 'measure 7'};
      const action = new formulaMeasureActions.AddSuccess(measure);

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromEntities.packages(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('instances state', () => {
    it('should add new instances with update instance action', () => {
      const stateBefore = {
        dimension1: ['instance 1', 'instance 2']
      };
      const stateAfter = {
        dimension1: ['instance 1', 'instance 2', 'instance 3', 'instance 4']
      };
      const action = new instancesActions.Update({
        dimension1: ['instance 2', 'instance 3', 'instance 4']
      });

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromEntities.instances(stateBefore, action)).toEqual(stateAfter);
    });
  });
});
