export enum PerformanceMeasures {
  ContactsAnswered = 'ContactsAnswered',
  ContactsAbandoned = 'ContactsAbandoned',
  ContactsOffered = 'ContactsOffered'
}

export enum StatusMeasures {
  Available = 'Available',
  NotReady = 'NotReady'
}

export enum AgentMeasures {
  CallsAnswered = 'CallsAnswered',
  CallsAbandoned = 'CallsAbandoned',
  CompletedCalls = 'CompletedCalls',
  LoggedInTime = 'LoggedInTime',
  HoldTime = 'HoldTime',
  NotReadyTime = 'NotReadyTime',
  CreatedDate = 'CreatedDate'
}

export enum AgentKeys {
  Alpha = 'alpha',
  Bravo = 'bravo',
  Charlie = 'charlie',
  Delta = 'delta',
  Echo = 'echo'
}

export enum QueueKeys {
  NewSales = 'New Sales',
  Upgrades = 'Upgrades',
  GeneralQueries = 'General Queries'
}

export enum DataTypes {
  QUEUE_PERFORMANCE = 'Queue Performance',
  QUEUE_STATUS = 'Queue Status',
  AGENT_PERFORMANCE = 'Agent Performance',
  AGENT_STATUS = 'Agent Status'
}
