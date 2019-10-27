import React from 'react';
import { Provider } from 'react-redux'
import './index.css';
import Routes from './Routes';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom'
import { render } from 'react-dom';
import { store } from './Redux/Storage'

render(
    <Provider store ={store}>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </Provider>,
    document.querySelector('#root')
  )
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
