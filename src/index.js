import React from 'react'
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import App from './App.js';
import 'draft-js/dist/Draft.css';

// Require Sass file so webpack can build it
//import 'bootstrap/dist/css/bootstrap.css';
//import'./styles/style.css';

import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';

import rootReducer from './reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middlewares = [thunk, process.env.NODE_ENV !== 'production' && logger].filter(middleware => middleware !== false);

const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(...middlewares))
)

ReactDOM.render(<Provider store = {store}>
    <BrowserRouter>
        <App />
    </BrowserRouter>
</Provider>, document.getElementById('root'));
