import React from 'react'
import Routes from './Routes'
import './App.css'
import { loadReCaptcha } from 'react-recaptcha-google'

class App extends React.Component {
  componentDidMount() {
    loadReCaptcha()
  }

  render() {
    return (
      <div className="App">
        <Routes />
      </div>
    )
  }
}

export default App
