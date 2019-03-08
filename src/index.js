import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import './index.css';
import Popup from './containers/Popup/Popup';
import reducer from './reducers/index';
import * as serviceWorker from './serviceWorker';

const store = createStore(reducer, applyMiddleware(logger));

ReactDOM.render(
    <Provider store={store}>
        <Popup />
    </Provider>,
    document.getElementById('root')
);

// If you want your Popup to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
