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

import { ApolloProvider } from '@apollo/react-hooks'
import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'

console.log(`using api ${process.env.REACT_APP_API_URL}`)
console.log('cookies', document.cookie)

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          ),
        );
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    new HttpLink({
      uri: process.env.REACT_APP_API_URL,
      credentials: 'include' // include for development (until ingress is added to develop environment) same-origin for production (same-origin checks schema, domain and port)
    }),
  ]),
  cache: new InMemoryCache()
})

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
serviceWorker.unregister()
