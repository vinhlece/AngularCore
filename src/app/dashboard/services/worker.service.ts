import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {WorkerService} from '.';
import {environment} from '../../../environments/environment';
import {ActionWithPayload} from '../../common/actions';
import {AppConfigService} from '../../app.config.service';

@Injectable()
export class WorkerServiceImpl implements WorkerService {
  private _worker = null;
  private _onResponse = new Subject<any>();
  private _appConfigService: AppConfigService

  constructor(appConfigService: AppConfigService) {
    this._appConfigService = appConfigService;
  }

  onResponse(): Subject<any> {
    return this._onResponse;
  }

  // TODO Can you add some comments to help clarify what the method does!!
  // Create a Web Workers represents a background task and send a action from UI thread to worker thread
  transferAction(action: ActionWithPayload<any>) {
    // console.log(action.type);
    if (!this._worker) {
      this._worker = new Worker(URL.createObjectURL(this.createWorkerBlob()));
      this._worker.onmessage = (e) => {
        this._onResponse.next(e.data);
      };
    }
    try {
      this._worker.postMessage(action);
    } catch (err) {
      // handle bad clone of storage object
      console.error(err);
    }
  }

  // TODO Can you add some comments to help clarify what the method does!!
  // Build js file urls for the web worker using Blob object
  private createWorkerBlob(): Blob {
    const assetsUrl = this._appConfigService.config.assetsUrl;
    const vendorUrl = environment.production ? '' : `importScripts('${assetsUrl}/js/worker/vendor.js');`;
    const workerScripts = `
      var window = self;
      importScripts('${assetsUrl}/js/worker/runtime.js');
      importScripts('${assetsUrl}/js/worker/polyfills.js');
      ${vendorUrl}
      importScripts('${assetsUrl}/js/worker/main.js');
    `;
    return new Blob([workerScripts], {type: 'application/javascript'});
  }
}
