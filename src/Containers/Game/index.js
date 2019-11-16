import React from 'react'
import './Game.css'
import { Container, TextField,} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

import GameController from './GameController'

const CELL_SIZE = 25;
const WIDTH = 625;
const HEIGHT = 625;

const styles = theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(16),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(1, 0, 2),
  },
});

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
    event.preventDefault();
    this.setState({value: event.target.value});
  }

  handleSubmit = (event) => {
    console.log( "Submitting ")
    event.preventDefault();
    const { value } = this.state;
    this.sendMessage(value);
    this.setState({value: ''});
  }

  sendMessage = (message) => {
    const { ws } = this.props;
    ws.send(JSON.stringify({type : "message", text : message}));
    console.log('Sent message', message);
  }

  render () {
    const { classes } = this.props
    return (
      <form className={classes.form} noValidate onSubmit={this.handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          name="message form"
          label="Send message"
          type="string"
          id="send message"
          onChange={this.handleChange}
          value={this.state.value}
        />
      </form>
    );
  }
}

var lastPressed = new Date().getTime()

class Game extends React.Component {
  constructor(props) {
    super(props)
    const rows = HEIGHT / CELL_SIZE, cols = WIDTH / CELL_SIZE;
    const grid = [];
    for (let row = 0; row < rows; ++row) {
      for (let col = 0; col < cols; ++col) {
        const wall = false;
        grid.push({row, col, wall})
      }
    }
    this.state = {rows, cols, grid, players: {}}
  }
  
  moveMessage = (direction) => {
    const { ws } = this.props;
    const obj = {"type": "move", "direction" : direction}
    console.log(direction)
    ws.send(JSON.stringify(obj))
  }
  
  keyPressed = (event) => {
    event.preventDefault()

    while( (new Date().getTime() - lastPressed) < 50 )
    {

    }
    lastPressed = new Date().getTime()
    switch (event.key) {
      case 'a':
      case 'A':
      case 'ArrowLeft':
        this.moveMessage('left');
        break;
      case 's':
      case 'S':
      case 'ArrowDown':
        this.moveMessage('down');
        break;
      case 'w':
      case 'W':
      case 'ArrowUp':
        this.moveMessage('up');
        break;
      case 'd':
      case 'D':
      case 'ArrowRight':
        this.moveMessage('right');
        break;
      default:
        break;
    }
  }

  render() {
    const { players, grid, classes } = this.props;
    const { cols } = this.state;
    var draw = false;
    var gridItems = null;
    if (grid !== null) {
      draw = true;
      const drawGrid = [...grid];
      for (var key in players) {
        var x = players[key]["x"];
        var y = players[key]["y"];
        drawGrid[y * cols + x] = {"occupied": true};
      }
      gridItems = drawGrid.map((cell, index) => {
        const x = Math.floor(index / cols), y = index % cols;
        const key = x.toString() + '-' + y.toString()
        var className;
        if (cell && !cell.occupied) {
          className = "Wall Cell";
        } else if( !cell.occupied ) {
          className = "Cell"
        } else if( x === 0 || x === 24 || y === 0 || y === 24 ){
          className = "Win Cell"
        } else{
          className = "Occupied Cell"
        }

        return <div
            key={key}
            className={className}></div>
      })
    }
    return (
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <GameController startLoading={this.props.startLoading} finishLoading={this.props.finishLoading} classes={classes} history={this.props.history} players={this.props.players} ws={this.props.ws} roomId={this.props.roomId}/>
          <MessageList messageLog={this.props.messageLog}/>  
          <MessageForm classes={classes} ws={this.props.ws}/>
          <div
            className="Container"
            tabIndex="0"
            onKeyDown={this.keyPressed}
          >
            <div className="Board">
              {draw && gridItems}
            </div>
          </div>
        </div>
      </Container>
    );  
  }
}


export default withStyles(styles)(Game)
