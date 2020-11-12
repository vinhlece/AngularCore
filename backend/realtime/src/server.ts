import {SampleDataGenerator} from '../../../src/app/realtime/services/fake/sample-data-generator';
import {Application} from './app';
import {GeneratorController} from './controllers/generator';
import {TopicController} from './controllers/topic';
import ServerPackagesServices from './services/server-packages.services';
import {Socket} from './socket/socket';
import {pollingConfig} from '../../../src/app/config/polling.config';

const packageService = new ServerPackagesServices();
const sampleRealTimeDataService = new SampleDataGenerator(packageService);
const generatorController = new GeneratorController(sampleRealTimeDataService);
const topicController = new TopicController(sampleRealTimeDataService);

const app = new Application(generatorController, topicController);
app.listen();
const sock = new Socket(sampleRealTimeDataService, pollingConfig.pollingInterval);
sock.start();
