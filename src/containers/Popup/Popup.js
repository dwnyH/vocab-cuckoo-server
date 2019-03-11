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
        <Header buttonClick={sendPageType} onClickLogin={this.onClickLogin}/>
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
  const { hours,
    minutes,
    frequency,
    scheduledTime,
  } = state.alarmInfo;
  let today = new Date();
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Popup);
