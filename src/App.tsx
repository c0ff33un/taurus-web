import React from 'react'
import Routes from './Routes'
import './App.css'

import { BrowserRouter as Router } from 'react-router-dom'
//import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { persistor, store } from './Redux'
import { PersistGate } from 'redux-persist/lib/integration/react'

import Loading from './Containers/Loading'
import CssBaseline from '@material-ui/core/CssBaseline'

import { ApolloProvider } from '@apollo/react-hooks'
import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'

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
      credentials: 'same-origin'
    }),
  ]),
  cache: new InMemoryCache()
})


const App = () => {
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <Router>
          <CssBaseline />
          <PersistGate loading={<Loading />} persistor={persistor}>
            <div className="App">
              <Routes />
            </div>
          </PersistGate>
        </Router>
      </ApolloProvider>
    </Provider>
  )
}

export default App
