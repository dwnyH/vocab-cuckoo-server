/* eslint-disable camelcase */
/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
/* global chrome */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash';
import Header from '../../components/Header/Header';
import WordBook from '../../components/WordBook/WordBook';
import WordList from '../../components/WordList/WordList';
import Options from '../../components/Options/Options';
import * as actions from '../../actions';
import './Popup.scss';

class Popup extends Component {
  componentDidMount() {
    const { keepLoginState } = this.props;
    keepLoginState();
  }

  render() {
    const {
      sendPageType,
      page,
      getChromeStorageVocabs,
      chromeStorageVocabs,
      getAlarmInfo,
      alarmInfo,
      buttonState,
      logInOrOut,
      monthLists,
      getSavedMonthLists,
      dbVocabLists,
      getDbVocabs,
    } = this.props;

    return (
      <div className="App">
        <Header
          buttonClick={sendPageType}
          logInOrOut={logInOrOut}
          buttonState={buttonState}
        />
        {(page === 'home' || !page)
          && (
          <WordList
            pageClick={sendPageType}
            getChromeStorageVocabs={getChromeStorageVocabs}
            chromeStorageVocabs={chromeStorageVocabs}
          />
          )
        }
        {page === 'wordBook' && (
          <WordBook
            monthLists={monthLists}
            getSavedMonthLists={getSavedMonthLists}
            dbVocabLists={dbVocabLists}
            getDbVocabs={getDbVocabs}
          />
        )}
        {page === 'option'
          && (
          <Options
            getAlarmInfo={getAlarmInfo}
            alarmInfo={alarmInfo}
          />
          )
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    hours,
    minutes,
    frequency,
    scheduledTime,
  } = state.alarmInfo;
  const today = new Date();
  let frequencyMessage;
  let todayAlarm;

  if (!frequency) {
    frequencyMessage = 'alarm once';
  } else {
    frequencyMessage = `alarm on every ${frequency / 60} hours`;
  }

  if (scheduledTime) {
    today.setHours(24);
    today.setMinutes(0);
    today.setSeconds(0);

    if (today.getTime() < scheduledTime) {
      todayAlarm = false;
    } else {
      todayAlarm = true;
    }
  }

  const sortedVocabs = {};
  state.dbVocabLists.vocabs.forEach((vocab) => {
    const { savedAt, word, translated } = vocab;

    if (sortedVocabs.hasOwnProperty(savedAt)) {
      sortedVocabs[savedAt].push({
        word,
        translated,
      });
    } else {
      sortedVocabs[savedAt] = [{
        word,
        translated,
      }];
    }
  });

  return {
    page: state.page,
    chromeStorageVocabs: state.chromeStorageVocabs,
    alarmInfo: {
      hours,
      minutes,
      frequency: frequencyMessage,
      todayAlarm,
    },
    buttonState: state.buttonState,
    monthLists: state.dbVocabLists.months,
    dbVocabLists: sortedVocabs,
  };
};

const mapDispatchToProps = dispatch => ({
  sendPageType(input) {
    dispatch(actions.sendPageType(input));
  },
  getChromeStorageVocabs() {
    chrome.storage.sync.get('words', (data) => {
      dispatch(actions.sendStoragedData(data.words));

      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError);
      }
    });
  },
  getAlarmInfo() {
    chrome.storage.sync.get('alarmInfo', (data) => {
      chrome.alarms.get('cuckooAlarm', (alarm) => {
        const copiedData = cloneDeep(data);
        if (alarm) {
          copiedData.alarmInfo.scheduledTime = alarm.scheduledTime;
          dispatch(actions.sendAlarmData(copiedData.alarmInfo));
        }

        if (chrome.runtime.lastError) {
          console.log(chrome.runtime.lastError);
        }
      });
    });
  },
  logInOrOut(btn) {
    if (btn === 'log in') {
      chrome.identity.getAuthToken({ interactive: true }, (token) => {
        const getUserInfo = async (chromeToken) => {
          try {
            const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
              method: 'GET',
              headers: new Headers({
                Authorization: `Bearer ${chromeToken}`,
              }),
            });
            const userInfo = await userInfoResponse.json();
            const {
              id,
              email,
              name,
              verified_email,
            } = userInfo;

            if (verified_email) {
              const jwtTokenResponse = await fetch('http://192.168.0.81:5000/auth', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify({
                  id,
                  email,
                  name,
                }),
              });
              const jwtToken = await jwtTokenResponse.json();

              if (jwtToken) {
                localStorage.setItem('userToken', jwtToken.token);
                localStorage.setItem('userId', jwtToken.id);
                console.log('토큰', jwtToken);
                dispatch(actions.sendButtonState('log out'));
              }
            }
          } catch (err) {
            chrome.identity.removeCachedAuthToken({ token: chromeToken });
            console.log(err);
          }
        };

        if (chrome.runtime.lastError) {
          console.log(chrome.runtime.lastError);
          alert('현재 시스템에 오류가 있습니다.');
        } else {
          getUserInfo(token);
        }
      });
    } else {
      chrome.identity.getAuthToken({ interactive: false }, (currentToken) => {
        if (chrome.runtime.lastError) {
          console.log(chrome.runtime.lastError);
          alert('현재 시스템에 오류가 있습니다.');
        } else {
          chrome.identity.removeCachedAuthToken({ token: currentToken }, async () => {
            try {
              await fetch(`https://accounts.google.com/o/oauth2/revoke?token=${currentToken}`, {
                method: 'GET',
              });
            } catch (err) {
              console.log(err);
            }

            localStorage.removeItem('userToken');
            localStorage.removeItem('userId');
            dispatch(actions.sendButtonState('log in'));
          });
        }
      });
    }
  },
  keepLoginState() {
    const token = localStorage.getItem('userToken');
    const userId = localStorage.getItem('userId');
    if (token && userId) {
      dispatch(actions.sendButtonState('log out'));
    } else {
      dispatch(actions.sendButtonState('log in'));
    }
  },
  async getSavedMonthLists() {
    const token = localStorage.getItem('userToken');
    const id = localStorage.getItem('userId');
    let getMonthResponse;

    if (token && id) {
      try {
        getMonthResponse = await fetch(`http://192.168.0.81:5000/users/${id}/months`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'x-auth': token,
          },
        });
      } catch (err) {
        console.log(err);
      }
      const monthListsData = await getMonthResponse.json();
      dispatch(actions.sendMonthList(monthListsData.monthLists));
    }
  },
  async getDbVocabs(month) {
    const token = localStorage.getItem('userToken');
    const id = localStorage.getItem('userId');
    let getVocabsResponse;

    if (token && id) {
      try {
        getVocabsResponse = await fetch(`http://192.168.0.81:5000/users/${id}/${month}/vocabularies`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'x-auth': token,
          },
        });
      } catch (err) {
        console.log(err);
      }
      const vocabsResponseData = await getVocabsResponse.json();
      console.log(vocabsResponseData);
      dispatch(actions.sendVocabs(month, vocabsResponseData.vocabularies));
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Popup);
