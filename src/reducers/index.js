import { cloneDeep } from 'lodash';
import moment from 'moment';
import {
  PAGE_TYPE_SEND,
  STORAGE_DATA_SEND,
  ALARM_DATA_SEND,
  BUTTON_STATE_SEND,
  MONTH_LIST_SEND,
  VOCAB_LIST_SEND,
} from '../actions/ActionTypes';

const initialState = {
  page: 'home',
  chromeStorageVocabs: [],
  alarmInfo: {
    hours: null,
    minutes: null,
    frequency: null,
    scheduledTime: null,
  },
  buttonState: 'log in',
  dbVocabLists: {
    months: [],
    vocabs: [],
  },
};

export default (state = initialState, action) => {
  const copiedState = cloneDeep(state);

  switch (action.type) {
    case PAGE_TYPE_SEND:
      copiedState.page = action.pageName;

      return copiedState;

    case STORAGE_DATA_SEND:
      copiedState.chromeStorageVocabs = action.storageWords;

      return copiedState;

    case ALARM_DATA_SEND:
      copiedState.alarmInfo = action.alarmData;

      return copiedState;

    case BUTTON_STATE_SEND:
      copiedState.buttonState = action.buttonState;

      return copiedState;

    case MONTH_LIST_SEND:
      copiedState.dbVocabLists.months = action.monthLists;

      return copiedState;

    case VOCAB_LIST_SEND:
      const { vocabLists } = action;
      const vocabInfo = vocabLists.map(vocab => ({
        savedAt: moment(vocab.savedAt).format('MMM Do'),
        word: vocab.word,
        translated: vocab.translated,
      }));
      copiedState.dbVocabLists.vocabs = vocabInfo;

      return copiedState;

    default:
      return state;
  }
};
