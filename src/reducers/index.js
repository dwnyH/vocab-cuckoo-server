import { cloneDeep } from 'lodash';
import { PAGE_TYPE_SEND, STORAGE_DATA_SEND, ALARM_DATA_SEND } from '../actions/ActionTypes';

const initialState = {
  page: 'home',
  words: [],
  alarmInfo: {
    hours: null,
    minutes: null,
    frequency: null,
    scheduledTime: null,
  },
};

export default (state = initialState, action) => {
  const copiedState = cloneDeep(state);

  switch (action.type) {
    case PAGE_TYPE_SEND:
      copiedState.page = action.pageName;

      return copiedState;

    case STORAGE_DATA_SEND:
      copiedState.words = action.storageWords;

      return copiedState;

    case ALARM_DATA_SEND:
      copiedState.page = 'option';
      copiedState.alarmInfo = action.alarmData;

      return copiedState;

    default:
      return state;
  }
};
