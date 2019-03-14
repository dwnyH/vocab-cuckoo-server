import React, { Component, Fragment } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';
import './WordBook.scss';

class WordBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      btnClass: 'hidden',
    };

    this.getVocabLists = this.getVocabLists.bind(this);
    this.makeMonthList = this.makeMonthList.bind(this);
    this.makeVocabLists = this.makeVocabLists.bind(this);
  }

  componentDidMount() {
    const { getSavedMonthLists } = this.props;
    getSavedMonthLists();
  }

  getVocabLists(ev) {
    const { getDbVocabs } = this.props;
    const { btnClass } = this.state;
    const month = ev.target.innerText;

    getDbVocabs(month);

    this.setState({
      btnClass: btnClass === 'hidden' ? 'vocabList' : 'hidden',
    });
  }

  makeMonthList() {
    const { monthLists, dbVocabLists } = this.props;
    const monthList = monthLists.map(month => (
      <AccordionItem>
        <AccordionItemTitle>
          <div onClick={this.getVocabLists}>
            {month}
          </div>
        </AccordionItemTitle>
        <AccordionItemBody>
          <Accordion accordion={false}>
            {Object.keys(dbVocabLists).length
              ? this.makeVocabLists()
              : null
            }
          </Accordion>
        </AccordionItemBody>
      </AccordionItem>
    ));

    return monthList;
  }

  makeVocabLists() {
    const { dbVocabLists } = this.props;
    const vocabs = Object.keys(dbVocabLists).map(date => (
      <AccordionItem>
        <AccordionItemTitle>
          <h3 className="savedWord">{date}</h3>
        </AccordionItemTitle>
        <AccordionItemBody>
          <table>
            <thread>
              <tr>
                <th>vocabulary</th>
                <th>definition</th>
              </tr>
            </thread>
            <tbody>
              {dbVocabLists[date].map(vocabInfo => (
                <tr>
                  <td>{vocabInfo.word}</td>
                  <td>{vocabInfo.translated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </AccordionItemBody>
      </AccordionItem>
    ));

    return vocabs;
  }

  render() {
    console.log(this.props);
    return (
      <Accordion>
        {this.props.monthLists
          ? this.makeMonthList()
          : '저장된 데이터가 없습니다.'
        }
      </Accordion>
    );
  }
}

export default WordBook;
