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
        const { getChromeStorageData } = this.props;
        getChromeStorageData();
    }

    buttonClick(ev) {
        const { pageClick } = this.props;

        pageClick(ev.target.className);
    }

    makeWordsList() {
        const { words } = this.props;

        const wordList = words.map(wordInfo => (
            <AccordionItem>
                <AccordionItemTitle>
                    <h3 className="savedWord">{wordInfo.text}</h3>
                </AccordionItemTitle>
                <AccordionItemBody>
                    <p className="translated"> {wordInfo.translated} </p>
                    <p className="savedDate">
                        {`saved at : ${wordInfo.date.substring(0, 10)}`}
                    </p>
                </AccordionItemBody>
            </AccordionItem>
        ));

        return wordList;
    }

    render() {
        const { words } = this.props;

        return (
            <Fragment>
                <div className="recentWordsContainer">
                    <div className="recentwordsBox">
                        <Accordion>
                            {words
                                ? this.makeWordsList()
                                : "저장된 데이터가 없습니다."
                            }
                        </Accordion>
                    </div>
                </div>
                <button className="wordBook" onClick={this.buttonClick}>wordBook</button>
            </Fragment>
        );
    }
}

export default WordList;
