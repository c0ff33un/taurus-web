import React from 'react';
import './Game.css'

const CELL_SIZE = 20;

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = { width: 0, height: 0 };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }
  
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  
  updateWindowDimensions() {
    this.setState({ width: window.innerthis.state.width, height: window.innerHeight });
  }
  // Assumes safe moves
  move = (direction) => {
    const { x, y } = this.state;
    switch (direction) {
      case 'l':
        this.setState({ 'x' : x - 1 });
        break
      case 'd':
        this.setState({ 'y' : y + 1 });
        break;
      case 'u':
        this.setState({ 'y' : y - 1 });
        break;
      case 'r':
        this.setState({ 'x' : x + 1 });
        break;
      default:
        break;
    }
  }
  
  render() {
    const { x, y } = this.props
    return (
      <div
        className = "Cell" 
        style = {{ left: `${CELL_SIZE * x + 1}px`, top: `${CELL_SIZE * y + 1}px`, width: `${CELL_SIZE - 1}px`, height: `${CELL_SIZE - 1}px`,      }}
      />
    );
  }
}


class GameController extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      rows : this.state.height / CELL_SIZE, 
      cols : this.state.this.state.width / CELL_SIZE
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { rows, cols } = this.state;
    const { roomId } = this.props;
    const options = {
      method : 'PUT',
      body : JSON.stringify({rows, cols})
    }
    const apiURL = process.env.REACT_APP_API_URL
    console.log(apiURL + `/room/setup?id=${roomId}`)
    fetch(apiURL + `/room/setup?id=${roomId}`, options)
    .then(response => {
      console.log(response.body)
      return response.json()
    })
    .then(json => {
    })
    .catch((error) => {
      console.log(error)
    })
  }

  render () {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Rows:
            <input type="text" value={this.state.rows} readOnly />
          </label>
          <label>
            Cols:
            <input type="text" value={this.state.cols} readOnly/>
          </label>
          <input type="submit" value="Setup Game" />
        </form>
      </div>
    );
  }

}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.rows = this.state.height / CELL_SIZE;
    this.cols = this.state.width / CELL_SIZE;
    this.status = {players: {}};
  }
  
  moveMessage = (direction) => {
    const { ws } = this.props;
    const obj = {"type": "move", "direction" : direction};
    console.log(direction);
    ws.send(JSON.stringify(obj));
  }
  
  keyPressed = (event) => {
    switch (event.key) {
      case 'a':
      case 'A':
      case 'ArrowLeft':
        this.moveMessage('l');
        break;
      case 's':
      case 'S':
      case 'ArrowDown':
        this.moveMessage('d');
        break;
      case 'w':
      case 'W':
      case 'ArrowUp':
        this.moveMessage('u');
        break;
      case 'd':
      case 'D':
      case 'ArrowRight':
        this.moveMessage('r');
        break;
      default:
        break;
    }
  }

  render() {
    const { players } = this.status
    let v = []
    for (var key in players) {
      v.push(<Player 
        x = {players[key]["x"]} 
        y = {players[key]["y"]} />)
    }
    return (
      <div>
        <GameController ws = {this.props.ws} roomId = {this.props.roomId}/>
        <div 
          className = "Board" 
          style = {{ width: this.state.width, height: this.state.height, backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`}}
          tabIndex = "0"
          onKeyDown = {this.keyPressed}
        >
        </div>
        {v}
      </div>
    );  
  }
}

export default Game;
