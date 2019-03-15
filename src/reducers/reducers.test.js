import reducer from './index';

describe('reducer', () => {
  let state = reducer(undefined, {});
  it('should return the initial state', () => {
    expect(state).toHaveProperty('page', 'home');
    expect(state).toHaveProperty('chromeStorageVocabs', []);
    expect(state).toHaveProperty('buttonState', 'log in');
    expect(state).toHaveProperty('alarmInfo', {
      hours: null,
      minutes: null,
      frequency: null,
      scheduledTime: null,
    });
    expect(state).toHaveProperty('dbVocabLists', {
      months: [],
      vocabs: [],
    });
  });

  it('should return modified state', () => {
    expect(reducer(state, { type: 'PAGE_TYPE_SEND', pageName: 'home' })).not.toBe(state);
    expect(reducer(state, { type: 'STORAGE_DATA_SEND', storageWords: [] })).not.toBe(state);
    expect(reducer(state, { type: 'ALARM_DATA_SEND', alarmData: {
      hours: null,
      minutes: null,
      frequency: null,
      scheduledTime: null,
    } })).not.toBe(state);
    expect(reducer(state, { type: 'BUTTON_STATE_SEND', buttonState: 'log in' })).not.toBe(state);
    expect(reducer(state, { type: 'MONTH_LIST_SEND', monthLists: []})).not.toBe(state);
    expect(reducer(state, { type: 'DB_VOCABS_SEND', vocabLists: [] })).not.toBe(state);
  });

  it('should change time input', () => {
    const newState = reducer(state, {
      type: 'DB_VOCABS_SEND',
      vocabLists: [{ word: 'test',
        translated: '시험',
        savedAt: new Date('2019-03-14T01:49:50.908Z').toISOString(),
      }]
    });

    expect(newState.dbVocabLists.vocabs[0].savedAt).toEqual('Mar 14th');
  });
});
