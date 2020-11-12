import {Request, Response} from 'express';
import {RealtimeData} from '../../../../src/app/realtime/models';
import {SampleDataGenerator} from '../../../../src/app/realtime/services/fake/sample-data-generator';
import {DataCache} from '../models/global';

export class TopicController {
  private _context: DataCache;

  constructor(sampleRealTimeDataService: SampleDataGenerator) {
    this._context = DataCache.getInstance(sampleRealTimeDataService);
  }

  getDataOfTopic(req: Request, res: Response) {
    const topic = req.params.topic;
    this._context.getDataOfTopic(topic).subscribe((records: RealtimeData[]) => res.json(records));
  }

  deleteCacheData(req: Request, res: Response) {
    this._context.deleteCacheData();
    res.json({});
  }
}
