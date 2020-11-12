import {ActionWithPayload} from '../../common/actions';
import {Url, Widget} from '../../widgets/models';

export const INVOKE = '[Urls] Invoke';
export const MANUAL_INVOKE = '[Urls] Manual Invoke';
export const AUTO_INVOKE = '[Urls] Auto Invoke';
export const INVOKE_RESPONSE = '[Urls] Invoke Response';
export const INVOKE_COMPLETED_RESPONSE = '[Urls] Invoke Completed Response';

export class Invoke implements ActionWithPayload<Url> {
  readonly type = INVOKE;

  constructor(public payload: Url) {
  }
}

export class ManualInvoke implements ActionWithPayload<Widget> {
  readonly type = MANUAL_INVOKE;

  constructor(public payload: Widget) {
  }
}

export class AutoInvoke implements ActionWithPayload<{ widget: Widget; event: any }> {
  readonly type = AUTO_INVOKE;

  constructor(public payload: any) {
  }
}

export class InvokeSuccess implements ActionWithPayload<{ url: Url; data: any }> {
  readonly type = INVOKE_RESPONSE;

  constructor(public payload: { url: Url; data: any }) {
  }
}

export class InvokeFailure implements ActionWithPayload<{ url: Url; data: string }> {
  readonly type = INVOKE_RESPONSE;
  error = true;
  payload: { url: Url; data: string };

  constructor(url: Url, error: Error) {
    this.payload = {url, data: error.message};
  }
}

export class InvokeCompleted implements ActionWithPayload<void> {
  readonly type = INVOKE_COMPLETED_RESPONSE;
}
