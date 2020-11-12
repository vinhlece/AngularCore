const Websocket = {
  Agent_Performance: {
    REST: 'http://132.145.235.222:2021/agentperformance/subscriptions',
    WS: 'http://132.145.235.222:2021/agentperformance/ws'
  },
  Agent_Status: {
    REST: 'http://132.145.235.222:2021/agentstatus/subscriptions',
    WS: 'http://132.145.235.222:2021/agentstatus/ws'
  },
  Queue_Performance: {
    REST: 'http://132.145.235.222:2021/queueperformance/subscriptions',
    WS: 'http://132.145.235.222:2021/queueperformance/ws'
  },
  Queue_Status: {
    REST: 'http://132.145.235.222:2021/queuestatus/subscriptions',
    WS: 'http://132.145.235.222:2021/queuestatus/ws'
  }
};

export const ReconnectDelayTime: number = 30 * 1000;
