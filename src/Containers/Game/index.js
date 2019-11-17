import React from 'react'
import { connect } from 'react-redux'
import './Game.css'
import { Container } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { wsMessage } from '../../Redux/ducks/websockets'
import WebSocketConnection from '../../Components/WebSocketConnection'
import GameController from './GameController'
import MessageList from './MessageList'
import MessageForm from './MessageForm'

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
    this.gameContainer = React.createRef()
    this.state = {rows, cols, grid, players: {}}
  }

  focusGameContainer = () => {
    this.gameContainer.current.focus()
  }
  
  moveMessage = (direction) => {
    const { dispatch } = this.props;
    dispatch(wsMessage({ type: "move", "direction": direction }))
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
      <WebSocketConnection>
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <GameController focusGameContainer={() => this.focusGameContainer()} classes={classes} history={this.props.history} />
          <MessageList />  
          <MessageForm classes={classes} />
          <div
            ref={this.gameContainer}
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
      </WebSocketConnection>
    );  
  }
}

function mapStateToProps(state) {
  const { gameController } = state
  return { grid: gameController.grid, players: gameController.players }
}

export default connect(mapStateToProps)(withStyles(styles)(Game))
