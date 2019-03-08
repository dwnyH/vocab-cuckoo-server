import { PAGE_TYPE_SEND, STORAGE_DATA_SEND } from './ActionTypes';

export function sendPageType(pageName) {
  return {
    type: PAGE_TYPE_SEND,
    pageName
  };
}

export function sendStoragedData(storageWords) {
    return {
        type: STORAGE_DATA_SEND,
        storageWords
    };
}
