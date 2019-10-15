import React from 'react';
import logo from './logo.svg';
import './App.css';
import { w3cwebsocket as W3CWebSocket } from "websocket";
const apiURL = 'http://192.168.0.4:8080'

class CreateRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {code: ''}
  }

  handleClick = () => {
    fetch(apiURL + '/room')
    .then(response => response.json())
    .then(json => {
      this.setState({code: json.id})
    })
  }

  render () {
    return (
      <div>
        <button onClick={this.handleClick}>
          Create Room
        </button>
        {this.state.code}
      </div>
    );
  }
}

class JoinRoomForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: '', ws: null}
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({})
  }
  
  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    const { value } = this.state;
    this.props.connect(value);
    event.preventDefault();
  }

  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Room:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Join Room" />
      </form>
    );
  }
}

class MessageForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''}
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    const { value } = this.state;
    this.sendMessage(value);
    this.setState({value: ''});
    event.preventDefault();
  }

  sendMessage = (message) => {
    const { ws } = this.props;
    ws.send(message);
    console.log('Sent message', message)
  }

  render () {
    const listItems = this.props.messageLog.map((message) =>
      <li>{message}</li>
    );
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Message:
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Send Message" />
        </form>
        <ul>{listItems}</ul>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {ready: false, ws: null, messageLog: []};
  }

  toggleReady = () => {
    this.setState({ready: !this.state.ready});
    console.log(this.state.ready);
  }

  connect = (id) => {
    var ws = new W3CWebSocket(`ws://192.168.0.4:8080/ws?id=${id}`);

    ws.onopen = () => {
      console.log("Connected");
      this.setState({ ws: ws })
    }

    ws.onmessage = (e) => {
      var messages = e.data.split('\n')
      this.setState({ messageLog : [this.state.messageLog, ...messages]})   
    }

  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <CreateRoom />
          <JoinRoomForm connect={this.connect}/>
          <MessageForm ws={this.state.ws} messageLog={this.state.messageLog}/>
        </header>
      </div>
    );
  }
}

export default App;
