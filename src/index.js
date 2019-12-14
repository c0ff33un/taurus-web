import React from 'react'
import './index.css'
import * as serviceWorker from './serviceWorker'
import { BrowserRouter as Router } from 'react-router-dom'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { persistor, store } from './Redux'
import { PersistGate } from 'redux-persist/lib/integration/react'

import App from './App'
import Loading from './Containers/Loading'
import CssBaseline from '@material-ui/core/CssBaseline'

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { onError } from 'apollo-link-error'

const client = new ApolloClient({
  uri: process.env.REACT_APP_API_URL,
});

render(
    <Provider store={store}>
      <ApolloProvider client={client}>
        <Router>
          <CssBaseline />
          <PersistGate loading={<Loading />} persistor={persistor}>
            <App />
          </PersistGate>
        </Router>
      </ApolloProvider>
    </Provider>,
    document.querySelector('#root')
  )
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
