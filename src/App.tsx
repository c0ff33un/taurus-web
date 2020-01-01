import React from 'react'
import Routes from './Routes'
import './App.css'

import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { persistor, store } from './Redux'
import { PersistGate } from 'redux-persist/lib/integration/react'

import Loading from './Containers/Loading'
import CssBaseline from '@material-ui/core/CssBaseline'

import { ApolloProvider } from '@apollo/react-hooks'
import client from './Apollo'

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
