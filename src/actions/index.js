import {
  PAGE_TYPE_SEND,
  STORAGE_DATA_SEND,
  ALARM_DATA_SEND,
  BUTTON_STATE_SEND,
} from './ActionTypes';

export function sendPageType(pageName) {
  return {
    type: PAGE_TYPE_SEND,
    pageName,
  };
}

export function sendStoragedData(storageWords) {
  return {
    type: STORAGE_DATA_SEND,
    storageWords,
  };
}

export function sendAlarmData(alarmData) {
  return {
    type: ALARM_DATA_SEND,
    alarmData,
  };
}

export function sendButtonState(buttonState) {
  return {
    type: BUTTON_STATE_SEND,
    buttonState,
  };
}
