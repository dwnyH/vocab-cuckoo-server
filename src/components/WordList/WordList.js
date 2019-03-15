/* eslint-disable class-methods-use-this */
import React, { Fragment, Component } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';
import './WordList.scss';

class WordList extends Component {
  constructor(props) {
    super(props);

    this.buttonClick = this.buttonClick.bind(this);
    this.makeWordsList = this.makeWordsList.bind(this);
  }

  componentDidMount() {
    const { getChromeStorageVocabs } = this.props;

    getChromeStorageVocabs();
  }

  buttonClick(ev) {
    const { pageClick } = this.props;

    pageClick(ev.target.className);
  }

  makeWordsList() {
    const { chromeStorageVocabs } = this.props;

    const wordList = chromeStorageVocabs.map(wordInfo => (
      <AccordionItem>
        <AccordionItemTitle>
          <h4 className="savedWord">{wordInfo.text}</h4>
        </AccordionItemTitle>
        <AccordionItemBody>
          <p className="translated">{wordInfo.translated}</p>
          <p className="savedDate">
            {`saved at : ${wordInfo.date.substring(0, 10)}`}
          </p>
        </AccordionItemBody>
      </AccordionItem>
    ));

    return wordList;
  }

  render() {
    const { chromeStorageVocabs } = this.props;

    return (
      <Fragment>
        <div className="recentWordsContainer">
          <div className="recentWordTitle">Recently Added Words</div>
          <div className="recentwordsBox">
            <Accordion>
              {chromeStorageVocabs
                ? this.makeWordsList()
                : "저장된 데이터가 없습니다."
              }
            </Accordion>
          </div>
        </div>
        <button className="wordBook" type="submit" onClick={this.buttonClick}>wordBook</button>
      </Fragment>
    );
  }
}

export default WordList;
