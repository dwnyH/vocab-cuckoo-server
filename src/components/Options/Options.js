/* global chrome */
import React, { Component } from 'react';
import './Options.scss';

class Options extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: null,
      frequency: null,
    };

    this.alarmOff = this.alarmOff.bind(this);
    this.timeChange = this.timeChange.bind(this);
    this.frequencyChange = this.frequencyChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const { getAlarmInfo } = this.props;

    getAlarmInfo();
  }

  alarmOff(ev) {
    const { getAlarmInfo } = this.props;

    if (ev.target.innerText === 'Today alarm off') {
      chrome.runtime.sendMessage({
        type: 'alarmOff',
      }, () => {
        getAlarmInfo();

        if (chrome.runtime.lastError) {
          console.log(chrome.runtime.lastError);
        }
      });
    } else {
      chrome.runtime.sendMessage({
        type: 'alarmOn',
      }, () => {
        getAlarmInfo();

        if (chrome.runtime.lastError) {
          console.log(chrome.runtime.lastError);
        }
      });
    }
  }

  frequencyChange(ev) {
    const frequency = ev.target.value;
    this.setState({
      frequency
    });
  }

  timeChange(ev) {
    const time = ev.target.value;
    this.setState({
      time
    });
  }

  onSubmit() {
    const { getAlarmInfo } = this.props;
    const { time, frequency } = this.state;

    if (!time || !frequency) {
      window.alert('시간과 빈도수를 정확히 입력해주세요!');
    } else {
      const InputFrequency = frequency === 'none' ? null : Number(frequency) * 60;
      const alarmInfo = {
        hours: Number(time.substring(0, time.indexOf(':'))),
        minutes: Number(time.substring(time.indexOf(':') + 1)),
        frequency: InputFrequency,
      };
      chrome.runtime.sendMessage({
        type: 'alarmSet',
        alarmInfo,
      }, () => {
        getAlarmInfo();

        if (chrome.runtime.lastError) {
          console.log(chrome.runtime.lastError);
        }
      });
    }
  }


  render() {
    const { time } = this.state;

    return (
      <div className="optionBox">
        <div className="optionsMenu">Current Alarm</div>
        {this.props.alarmInfo
          ? (
            <div className="currentAlarmInfo">
              <div className="currentTimeInfo">
                Time
                <div className="currentInfoContent">
                  {this.props.alarmInfo.hours} : {this.props.alarmInfo.minutes}
                </div>
              </div>
              <div className="currentFrequencyInfo">
                Frequency
                <div className="currentInfoContent">
                  {this.props.alarmInfo.frequency}
                </div>
              </div>
            </div>
          )
          : (
            <div className="currentAlarmInfo">Set your alarm</div>
          )
        }
        <div className="optionsMenu">Alarm</div>
        <input
          type="time"
          required
          value={time}
          onChange={this.timeChange}
        />
        <div className="optionsMenu">Frequency</div>
        <select className="frequency" onChange={this.frequencyChange}>
          <option>select frequency</option>
          <option value="none">alarm once</option>
          <option value="1">every 1 hours</option>
          <option value="3">every 3 hours</option>
          <option value="5">every 5 hours</option>
        </select>
        <div className="buttonBox">
          <button className="submit" onClick={this.onSubmit} type="submit">set</button>
          <button className="alarmOff" onClick={this.alarmOff} type="submit">
            {this.props.alarmInfo && this.props.alarmInfo.todayAlarm
              ? 'Today alarm off'
              : 'Today alarm on'
            }
          </button>
        </div>
      </div>
    );
  }
}

export default Options;
