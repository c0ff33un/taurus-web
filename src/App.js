import React from 'react';
import Routes from './Routes';
import './App.css';
import { w3cwebsocket as W3CWebSocket } from "websocket";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {ready: false, grid: null, ws: null, messageLog: [], roomId: null, players: {}};
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
    const apiURL = process.env.REACT_APP_GAME_URL
    var ws = new W3CWebSocket(`ws://${apiURL}/ws/${roomId}?token=${token}`);

    ws.onopen = () => {
      console.log("Connected")
      this.setState({ ws, roomId })
      ws.send(JSON.stringify({ "type" : "connect" }))
    }

    ws.onclose = () => {
      console.log("WS Connection closed")
      this.setState({ grid: null, ws: null, roomId: null, messageLog: [], players: {}})
    }

    ws.onmessage = (e) => {
      console.log('e.data', e.data)
      const messages = e.data.split("\n")
      console.log("messages", messages)
      for (var i = 0; i < messages.length - 1; ++i) {
        const message = JSON.parse(messages[i])
        console.log("message", message)
        switch (message.type) {
          case "connect":
            const id = message.id
            const handle = message.handle
            console.log("User " + id + " Connected");
            this.setState(prevState => ({...prevState,
              players : {...prevState.players,
                [id] : {}
              },
              messageLog : [...prevState.messageLog, ("User " + handle + " Connected")]
            }));
            break;
          case "message":
            this.setState(prevState => ({...prevState,
              messageLog : [...prevState.messageLog, message.text]}
            ))
            break;
          case "move":
            this.updatePlayers(message);
            break;
          case "grid":
            const { grid } = message;
            this.setState({ grid });
            break;
          default:
            console.log("Unhandled Message:")
            console.log(message);
            break;
        }
      }
    }
  }

  render() {
    const connect = this.connect;
    const { ws, messageLog, roomId, players, grid } = this.state;
    console.log(this.state)
    return (
      <div className="App">
        <Routes appProps={{ws, roomId, players, messageLog, connect, grid}}/>
      </div>
    );
  }
}

export default App;
