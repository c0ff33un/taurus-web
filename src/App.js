import React from 'react'
import Routes from './Routes'
import './App.css'

class App extends React.Component {

  render() {
    const connect = this.connect;
    return (
      <div className="App">
        <Routes />
      </div>
    );
  }
}

export default App
