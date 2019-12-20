import React from 'react'
import { connect } from 'react-redux'
import './Game.scss'
import { Container } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import WebSocketConnection from '../../Components/WebSocketConnection'
import GameController from './GameController'
import MessageList from './MessageList'
import MessageForm from './MessageForm'
import Board from './Board'

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
 
  render() {
    const { players, grid, classes, user_id } = this.props;
    const colors = ['Red', 'Coffee', 'Blue', 'Green']
    const { cols } = this.state;
    var draw = grid !== null;
    var gridItems = null;
    if (draw) {
      const drawGrid = [...grid];
      let me_id = null
      let i = 0
      for (var key in players) {
        const { x, y } = players[key]
        drawGrid[y * cols + x] = { "occupied": true, "me": key === user_id, "color":i++ };
        if (key === user_id) me_id = y * cols + x
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
        } else if ( (cell.occupied && cell.me) || index === me_id ) {
          className = "Me Cell"
        } else {
          className = `${colors[cell.color%4]} Cell`;
        }

        return <div
            key={key}
            className={className}
            ></div>
      })
    }
    return (
      <WebSocketConnection>
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <GameController classes={classes} history={this.props.history} />
          <MessageList />  
          <MessageForm classes={classes} />
          {draw && 
            <Board
              gridItems={gridItems}
            />
          }
        </div>
      </Container>
      </WebSocketConnection>
    );  
  }
}

function mapStateToProps(state) {
  const { gameController, authentication } = state
  return { grid: gameController.grid, players: gameController.players, user_id: authentication.user.id}
}

export default connect(mapStateToProps)(withStyles(styles)(Game))
