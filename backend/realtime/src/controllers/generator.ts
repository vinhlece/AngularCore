import {Request, Response} from 'express';
import {StartOptions} from '../../../../src/app/realtime/models';
import {DataCache, PolicyGroupCache} from '../models/global';
import {SampleDataGenerator} from '../../../../src/app/realtime/services/fake/sample-data-generator';
import {uuid} from '../../../../src/app/common/utils/uuid';

export class GeneratorController {
  private _context: DataCache;
  private _policyGroup: PolicyGroupCache;

  constructor(sampleRealTimeDataService: SampleDataGenerator) {
    this._context = DataCache.getInstance(sampleRealTimeDataService);
    this._policyGroup = PolicyGroupCache.getPolicyInstance(sampleRealTimeDataService);
  }

  generate(req: Request, res: Response) {
    const options: StartOptions = req.body;
    this._context.addOptions(options);
    res.json({message: 'generated'});
  }

  subscription(req: Request, res: Response) {
    const options: StartOptions = req.body;
    this._context.addSubscriptions(options);
    res.json({message: 'subscription'});
  }

  getEventSource(req: Request, res: Response) {
    if (!req.query.source || !req.query.source.startsWith('http')) {
      res.status(404).jsonp('not found');
      return;
    }
    const eventSources = [
      {
        'id': uuid(),
        'url': `kafka-cp-kafka.default.svc.cluster.local:${this.generateNumber(9000, 9999)}`,
        'description': `Kubernetes Kafka Broker ${this.generateNumber(9000, 9999)}`,
        'properties': null
      }
    ];
    res.json(eventSources);
  }

  getEventStreams(req: Request, res: Response) {
    const stream = {
      'format': 'JSON',
      'properties': null
    };
    const generateItem = () => {
      return {...stream, id: uuid(), eventSourceId: uuid(), name: `receiverIn-${this.generateNumber(999, 99999)}`};
    };
    res.json(this.generateData(generateItem));
  }

  getEventQualifiers(req: Request, res: Response) {
    const event = {
      'group': null,
      'streamId': null,
      'operator': 'ALL',
      'qualifierNames': [],
      'parameters': [
        {
          'type': 'EQUALS',
          'name': 'body.userdata.eventType',
          'value': 'AGENT'
        },
        {
          'type': 'EQUALS',
          'name': 'body.userdata.currentContactState',
          'value': 'LOGIN'
        }
      ]
    };
    const generateItem = () => {
      return {id: uuid(), name: `AgentLoginEvent-${this.generateNumber(999, 99999)}`, ...event};
    };
    res.json(this.generateData(generateItem));
  }

  postEventQualifiers(req: Request, res: Response) {
    res.json({id: uuid()});
  }

  postEventMapping(req: Request, res: Response) {
    res.json(req.params);
  }

  postMeasureSpecification(req: Request, res: Response) {
    res.json(req.body);
  }

  getMeasureSpecification(req: Request, res: Response) {
    const event = {
      'processorType': 'COUNTER',
      'events': [
        {
          'eventName': 'AgentLoginEvent',
          'field': null,
          'action': 'INC'
        },
        {
          'eventName': 'AgentLogoutEvent',
          'field': null,
          'action': 'DEC'
        }
      ],
      'dimensions': [
        [
          'region'
        ]
      ],
      'measureWindows': [
        {
          'windowType': 'INTERVAL',
          'window': 'LAST_30_MINUTES_HOUR_RETENTION'
        }
      ],
      'packages': [
        'Agent Performance'
      ],
      'correlationIdentifiers': null
    };
    const generateItem = () => {
      return {...event, id: uuid(), measureName: `TotalAgentLoginsByRegion-${this.generateNumber(999, 99999)}`};
    };
    res.json(this.generateData(generateItem));
  }

  deleteEventQualifiers(req: Request, res: Response) {
    res.json({
      id: req.params.id,
      name: null,
      group: null,
      streamId: null,
      operator: 'ALL',
      qualifierNames: [],
      parameters: []
    });
  }

  postPolicyGroup(req: Request, res: Response) {
    const id = req.params.policyGroupId;
    this._policyGroup.addUpdate(id, req.body);
    res.json(this._policyGroup.get(id));
  }

  getPolicyGroup(req: Request, res: Response) {
    const id = req.params.policyGroupId;
    res.json(this._policyGroup.generateData(id));
  }

  private generateData(funcGenerateItem: any) {
    const data = [];
    const max = this.generateNumber(2, 4);
    for (let i = 0; i < max; i++) {
      data.push(funcGenerateItem());
    }
    return data;
  }

  private generateNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
