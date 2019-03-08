/* global chrome */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../../components/Header/Header';
import WordBook from '../../components/WordBook/WordBook';
import WordList from '../../components/WordList/WordList';
import Options from '../../components/Options/Options';
import * as actions from '../../actions';
import './Popup.scss';

function Popup(props) {
  const { sendPageType, page, getChromeStorageData, words } = props;
  return (
    <div className="App">
      <Header buttonClick={sendPageType} />
      {(page === "home" || !page)
        && <WordList
            pageClick={sendPageType}
            getChromeStorageData={getChromeStorageData}
            words={words}
          />
      }
      {page === "wordBook" && <WordBook />}
      {page === "option" && <Options />}
    </div>
  );
}

const mapStateToProps = (state) => ({
  page: state.page,
  words: state.words
});

const mapDispatchToProps = (dispatch) => ({
  sendPageType(input) {
    dispatch(actions.sendPageType(input));
  },
  getChromeStorageData() {
    chrome.storage.sync.get({
      words: []
    }, (data) => {
      dispatch(actions.sendStoragedData(data.words));
    });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Popup);
