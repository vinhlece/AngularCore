export const PERFORMANCE = 'Performance';
export const STATUS = 'Status';
export const AGENT = 'Agent';

export const AGENT_DATA_TYPE = [AGENT];
export const QUEUE_DATA_TYPE = [PERFORMANCE, STATUS];

export const CONTACTS_ANSWERED_OPTION = {name: 'contactsAnswered', text: 'Contacts Answered'};
export const CONTACTS_ABANDONED_OPTION = {name: 'contactsAbandoned', text: 'Contacts Abandoned'};
export const AVAILABLE_OPTION = {name: 'available', text: 'Available'};
export const NOT_READY_OPTION = {name: 'notReady', text: 'Not Ready'};

export const AGENT_ID_OPTION = {name: 'id', text: 'ID'};
export const FIRST_NAME_OPTION = {name: 'firstName', text: 'First Name'};
export const LAST_NAME_OPTION = {name: 'lastName', text: 'Last Name'};
export const AGENT_STATUS_OPTION = {name: 'status', text: 'Status'};
export const TIME_IN_STATE_OPTION = {name: 'timeInState', text: 'Time In State'};
export const REASON_CODE_OPTION = {name: 'reasonCode', text: 'Reason Code'};
export const ANSWERING_SKILLSET_OPTION = {name: 'answeringSkillset', text: 'Answering Skillset'};
export const CALLS_ANSWERED_OPTION = {name: 'callsAnswered', text: 'Calls Answered'};
export const CALLS_ABANDONED_OPTION = {name: 'callsAbandoned', text: 'Calls Abandoned'};
export const COMPLETED_CALLS_OPTION = {name: 'completedCalls', text: 'Completed Calls'};
export const LOGGED_IN_TIME_OPTION = {name: 'loggedInTime', text: 'Logged In Time'};
export const HOLD_TIME_OPTION = {name: 'holdTime', text: 'Hold Time'};
export const NOT_READY_TIME_OPTION = {name: 'notReadyTime', text: 'Not Ready Time'};

export const AGENT_OPTIONS = [AGENT_ID_OPTION, FIRST_NAME_OPTION, LAST_NAME_OPTION,
                              AGENT_STATUS_OPTION, TIME_IN_STATE_OPTION, REASON_CODE_OPTION,
                              ANSWERING_SKILLSET_OPTION, CALLS_ANSWERED_OPTION, CALLS_ABANDONED_OPTION,
                              COMPLETED_CALLS_OPTION, LOGGED_IN_TIME_OPTION, HOLD_TIME_OPTION, NOT_READY_TIME_OPTION];
export const PERFORMANCE_OPTIONS = [CONTACTS_ANSWERED_OPTION, CONTACTS_ABANDONED_OPTION];
export const STATUS_OPTIONS = [AVAILABLE_OPTION, NOT_READY_OPTION];

export interface BarXAxisColumn {
  name: string;
  text: string;
}
