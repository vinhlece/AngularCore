import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as cors from 'cors';
import {GeneratorController} from './controllers/generator';
import {TopicController} from './controllers/topic';

export class Application {
  private _app: express.Application;
  private _generatorController: GeneratorController;
  private _topicController: TopicController;

  constructor(generatorController: GeneratorController, topicController: TopicController) {
    this._generatorController = generatorController;
    this._topicController = topicController;
    this._app = express();
    this.applyMiddleware();
    this.routes();
  }

  applyMiddleware() {
    this._app.use(cors());
    this._app.use(bodyParser.json());
    this._app.use(bodyParser.urlencoded({
      extended: true
    }));
  }

  routes() {
    this._app.post('/generate', (req, res) => this._generatorController.generate(req, res));
    this._app.post('/subscription', (req, res) => this._generatorController.subscription(req, res));
    this._app.get('/eventcollector/eventsources', (req, res) => this._generatorController.getEventSource(req, res));
    this._app.get('/eventhub/discoverEventStreams', (req, res) => this._generatorController.getEventStreams(req, res));
    this._app.get('/measurebuilder/eventqualifiers', (req, res) => this._generatorController.getEventQualifiers(req, res));
    this._app.post('/measurebuilder/eventqualifiers', (req, res) => this._generatorController.postEventQualifiers(req, res));
    this._app.post('/eventtranslator/measurespecification', (req, res) => this._generatorController.postMeasureSpecification(req, res));
    this._app.get('/eventtranslator/measurespecification', (req, res) => this._generatorController.getMeasureSpecification(req, res));
    this._app.delete('/measurebuilder/eventqualifiers/:id', (req, res) => this._generatorController.deleteEventQualifiers(req, res));
    this._app.post('/measurebuilder/eventmapping', (req, res) => this._generatorController.postEventMapping(req, res));
    this._app.post('/jane-action-policy-admin/policies/:policyGroupId', (req, res) => this._generatorController.postPolicyGroup(req, res));
    this._app.get('/jane-action-policy-admin/policies/:policyGroupId', (req, res) => this._generatorController.getPolicyGroup(req, res));
  }

  listen(port: number = 3001) {
    return this._app.listen(port);
  }
}
