import React from 'react';
import Routes from './Routes';
import './App.css';
import { w3cwebsocket as W3CWebSocket } from "websocket";





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

  connect = (roomId, token) => {
    const apiURL = process.env.REACT_APP_API_URL
    var ws = new W3CWebSocket(`ws://${apiURL}/ws/?id=${roomId}`);

    ws.onopen = () => {
      console.log("Connected");
      this.setState({ ws, roomId });
      ws.send(JSON.stringify({type: "connect", "token": token}));
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
        {/*<JoinRoomForm connect={this.connect}/>
        <MessageList messageLog={this.state.messageLog}/>
        <MessageForm ws={this.state.ws}/>
        */}
        <Routes />
      </div>
    );
  }
}

export default App;
