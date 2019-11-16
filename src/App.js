import React from 'react'
import { connect } from 'react-redux'
import { loadingActions } from './Redux/Actions'
import { gameServerActions } from './Redux/ducks/gameServer'
import { withRouter } from 'react-router-dom'
import Routes from './Routes'
import './App.css'
import { w3cwebsocket as W3CWebSocket } from "websocket"

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
  }

  connect = (roomId, token) => {
    const apiURL = process.env.REACT_APP_GAME_URL
    console.log(apiURL)
    var ws = new W3CWebSocket(`ws://${apiURL}/ws/${roomId}?token=${token}`);

    ws.onopen = () => {
      console.log("Connected")
      this.setState({ ws, roomId })
      ws.send(JSON.stringify({ "type" : "connect" }))
      this.props.history.push("/game")
      this.props.finishLoading();
    }
    
    ws.onerror = (event) => {
      alert('Error connecting to room')
      this.props.finishLoading();
    }

    ws.onclose = () => {
      console.log("WS Connection closed")
      this.setState({ grid: null, ws: null, roomId: null, messageLog: [], players: {}})
    }

    ws.onmessage = (e) => {
      const messages = e.data.split("\n")
      for (var i = 0; i < messages.length - 1; ++i) {
        const message = JSON.parse(messages[i])
        console.log("message", message)
        this.props.addGameServerMessage(message)
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
    return (
      <div className="App">
        <Routes appProps={{ws, roomId, players, messageLog, connect, grid}}/>
      </div>
    );
  }
}

export default connect(null, {
  finishLoading: loadingActions.finishLoading,
  addGameServerMessage: gameServerActions.addGameServerMessage,
})(withRouter(App))
