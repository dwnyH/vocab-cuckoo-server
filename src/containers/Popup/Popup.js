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
  constructor(props) {
    super(props);

    // this.onClickSignIn = this.onClickSignIn.bind(this);
  }

  componentDidMount() {
    this.callBackendAPI();
  }

  callBackendAPI = async () => {
    const myInit = {
      method: 'GET',
    };
    const response = await fetch('http://192.168.0.81:5000/api/wordLists', myInit);
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }
    console.log(body);
    return body;
  };

  async getUserInfo(token) {
    try {
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
        method: 'GET',
        headers: new Headers({
          'Authorization': `Bearer ${token}`
        }),
      });
      const userInfoData = await userInfoResponse.json();
      console.log('유저인포', userInfoData);
    } catch (err) {
      console.log(err);
      chrome.identity.removeCachedAuthToken({ token });
    }
  }

  render() {
    const {
      sendPageType,
      page,
      getChromeStorageData,
      words,
      getAlarmInfo,
      alarmInfo
    } = this.props;

    return (
      <div className="App">
        <Header buttonClick={sendPageType} onClickSignIn={this.onClickSignIn} />
        {(page === 'home' || !page)
          && (
          <WordList
            pageClick={sendPageType}
            getChromeStorageData={getChromeStorageData}
            words={words}
          />
          )
        }
        {page === 'wordBook' && <WordBook />}
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

  return {
    page: state.page,
    words: state.words,
    alarmInfo: {
      hours,
      minutes,
      frequency: frequencyMessage,
      todayAlarm,
    },
  };
};

const mapDispatchToProps = dispatch => ({
  sendPageType(input) {
    dispatch(actions.sendPageType(input));
  },
  getChromeStorageData() {
    // chrome.storage.sync.get('words', (data) => {
    //   dispatch(actions.sendStoragedData(data.words));

    //   if (chrome.runtime.lastError) {
    //     console.log(chrome.runtime.lastError);
    //   }
    // });
  },
  getAlarmInfo() {
    // chrome.storage.sync.get('alarmInfo', (data) => {
    //   chrome.alarms.get('cuckooAlarm', (alarm) => {
    //     const copiedData = cloneDeep(data);
    //     if (alarm) {
    //       copiedData.alarmInfo.scheduledTime = alarm.scheduledTime;
    //       dispatch(actions.sendAlarmData(copiedData.alarmInfo));
    //     }

    //     if (chrome.runtime.lastError) {
    //       console.log(chrome.runtime.lastError);
    //     }
    //   });
    // });
  },
  onClickSignIn() {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError);
        alert('현재 시스템에 오류가 있습니다.');
      }
      // console.log(token);
      this.getUserInfo(token);
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Popup);
