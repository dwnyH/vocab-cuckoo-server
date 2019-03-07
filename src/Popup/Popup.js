/* global chrome */
import React, { Component } from 'react';
import WordBook from '../WordBook/WordBook';
import './Popup.css';

class Popup extends Component {
  render() {

    return (
      <div className="App">
        <WordBook />
        <div className="options">options</div>
        <div className="alarmOff">today alarm off</div>
      </div>
    );
  }
}

export default Popup;
