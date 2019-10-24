import React from 'react';
import { Route, Switch } from 'react-router-dom'
import logo from './logo.svg';
import Game from './Game';
import './App.css';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import Login from './Components/Auth/Login';
const apiURL = 'http://localhost:8080'

class CreateRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {code: ''}
  }

  handleClick = () => {
    console.log('try get room')
    const options = {
      method : 'POST',
    }
    fetch(apiURL + '/room', options)
    .then(response => {
      console.log(response.body)
      return response.json()
    })
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
      {this.state.code !== '' && 
        <p>Code:{this.state.code} </p>
      }
      </div>
    );
  }
}

class JoinRoomForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {"roomId": '', "userId": ''}
  }

  handleChange = (event, name) => {
    console.log(event.target.value, name)
    console.log(this.state)
    this.setState({[name]: event.target.value});
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { roomId, userId } = this.state;
    this.props.connect(roomId, userId);
  }

  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Room:
          <input type="text" value={this.state.roomId} 
          onChange={(event) => this.handleChange(event, "roomId")} />
        </label>
        <label>
          User:
          <input type="text" value={this.state.userId}
          onChange={(event) => this.handleChange(event, "userId")} />
        </label>
        <input type="submit" value="Join Room" />
      </form>
    );
  }
}

class MessageList extends React.Component {
  render() {
    const { messageLog } = this.props
    console.log(messageLog)
    return (
      <ul>
        {messageLog.map((item, index) => <p key = {index} > {item} </p>)}
      </ul>
    );
  }
}

class MessageForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''}
  }

  handleChange = (event) => {
    this.setState({value: event.target.value});
  }

  handleSubmit = (event) => {
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
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Message:
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Send Message" />
        </form>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {ready: false, ws: null, messageLog: [], roomId: null};
  }

  toggleReady = () => {
    this.setState({ready: !this.state.ready});
    console.log(this.state.ready);
  }

  connect = (roomId, userId) => {
    console.log('try connect')
    console.log(roomId)
    var ws = new W3CWebSocket(`ws://localhost:8080/ws?id=${roomId}`);

    ws.onopen = () => {
      console.log("Connected");
      this.setState({ ws, roomId })
      ws.send(JSON.stringify({"id": userId}));
    }

    ws.onmessage = (e) => {
      var messages = e.data.split('\n')
      this.setState({ messageLog : [...this.state.messageLog, ...messages]})   
    }

  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          {<img src={logo} className="App-logo" alt="logo" />}
        </header>
        <CreateRoom />
        <JoinRoomForm connect={this.connect}/>
        <MessageList messageLog={this.state.messageLog}/>
        <MessageForm ws={this.state.ws}/>
        <Game ws={this.state.ws} roomId={this.state.roomId}/>
      </div>
    );
  }
}

export default function AppRoutes () {
  return (
    <Switch>
      <Route path="/game" component={Game}/>
      <Route path="/login" component={Login}/>
    </Switch>
    
  )
}