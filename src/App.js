import React from 'react';
import Routes from './Routes';
import logo from './logo.svg';
import Game from './Components/Game/Game';
import './App.css';
import { w3cwebsocket as W3CWebSocket } from "websocket";

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
    const apiURL = process.env.REACT_APP_API_URL
    console.log("apiURL: " + apiURL)
    fetch(`http://${apiURL}/room`, options)
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
    this.setState({[name] : event.target.value});
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
    ws.send(JSON.stringify({type : "message", text : message}));
    console.log('Sent message', message);
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
    this.state = {ready: false, ws: null, messageLog: [], roomId: null, players: {}};
  }

  updatePlayers = (message) => {
    var id = message.id;
    this.setState(prevState => ({...prevState, 
      players : {...prevState.players, 
        [id] : {x : message.x, y : message.y}
      }
    }));
  }

  toggleReady = () => {
    this.setState({ready: !this.state.ready});
    console.log(this.state.ready);
  }

  connect = (roomId, userId) => {
    const apiURL = process.env.REACT_APP_API_URL
    var ws = new W3CWebSocket(`ws://${apiURL}/ws?id=${roomId}`);

    ws.onopen = () => {
      console.log("Connected");
      this.setState({ ws, roomId });
      ws.send(JSON.stringify({type: "connect", "id": userId}));
    }

    ws.onmessage = (e) => {
      var message = JSON.parse(e.data);
      switch (message.type) {
        case "connect":
          var id = message.id;
          console.log("User " + id + " Connected");
          this.setState(prevState => ({...prevState,
            players : {...prevState.players,
              [id] : {}
            }
          }));
          break;
        case "message":
          this.setState({ messageLog : [...this.state.messageLog, message.text]})
          break;
        case "move":
          console.log(message);
          this.updatePlayers(message);
          break;
        default:
          break;
      }
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
        <Game players={this.state.players} ws={this.state.ws} userId={this.state.userId} roomId={this.state.roomId}/>
      </div>
    );
  }
}

export default App;
