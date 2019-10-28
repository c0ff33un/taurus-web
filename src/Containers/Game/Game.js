import React from 'react';
import './Game.css'
import { Button, Container, Grid, TextField, CssBaseline } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';

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
    marginTop: theme.spacing(8),
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
    margin: theme.spacing(3, 0, 2),
  },
});

class Player extends React.Component {
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
      rows : HEIGHT / CELL_SIZE, 
      cols : WIDTH / CELL_SIZE
    };
  }

  randomGrid = () => {
    const { rows, cols } = this.state
    const n = rows * cols;
    const grid = [];
    for (let i = 0; i < n; ++i) {
      grid.push({wall: Math.random() >= 0.5});
    }
    return grid;
  }

  setupGame = (event) => {
    event.preventDefault();
    const { rows, cols } = this.state;
    const { roomId } = this.props;
    console.log("The Room Id is:" + roomId)
    const options = {
      method : 'PUT',
      body : JSON.stringify({rows: parseInt(rows), cols: parseInt(cols)})
    }
    const apiURL = process.env.REACT_APP_API_URL
    console.log(apiURL + `/room/setup/${roomId}`)
    fetch(`http://${apiURL}/room/setup/${roomId}`, options)
    .then(response => {
      console.log(response.body)
      return response.json()
    })
    .then(json => {
      console.log(json)
      return json
    })
    .catch((error) => {
      console.log(error)
    })
  }

  startGame = (event) => {
    event.preventDefault();
    const { rows, cols } = this.state;
    const { roomId } = this.props;
    const options = {
      method : 'PUT',
    }
    const apiURL = process.env.REACT_APP_API_URL
    fetch(`http://${apiURL}/room/start/${roomId}`, options)
    .then(response => {
      console.log(response.body)
      return response.json()
    })
    .then(json => {
      console.log(json)
      return json
    })
    .catch((error) => {
      console.log(error)
    })
  }

  handleChange = (event, name) => {
    this.setState({[name] : event.target.value});
  }

  render () {
    const classes = withStyles(styles)
    return (
      <Container component="main" maxWidth="xs">
        Game Controller
        <CssBaseline />
        <div className={classes.paper}> 
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="rows"
              label="Rows"
              type="number"
              id="rows"
              onChange={(event) => this.handleChange(event, "rows")}
              value={this.state.rows}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="cols"
              label="Cols"
              type="number"
              id="cols"
              onChange={(event) => this.handleChange(event, "cols")}
              value={this.state.cols}
            />
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={this.setupGame}
                >
                  Setup Game
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  className={classes.submit}
                  onClick={this.startGame}
                >
                  Start Game
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
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

class Game extends React.Component {
  constructor(props) {
    super(props);
    const rows = HEIGHT / CELL_SIZE, cols = WIDTH / CELL_SIZE;
    const grid = [];
    console.log(rows, cols)
    for (let row = 0; row < rows; ++row) {
      for (let col = 0; col < cols; ++col) {
        const wall = Math.random() >= 0.5
        grid.push({row, col, wall});
      }
    }
    this.state = {rows, cols, grid, players: {}};
  }
  
  moveMessage = (direction) => {
    const { ws } = this.props;
    const obj = {"type": "move", "direction" : direction};
    console.log(direction);
    ws.send(JSON.stringify(obj));
  }
  
  keyPressed = (event) => {
    event.preventDefault();
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
    const { players } = this.props;
    const { grid, cols, rows } = this.state;
    //console.log(this.state.grid);
    const drawGrid = [...grid];
    for (var key in players) {
      var x = players[key]["x"];
      var y = players[key]["y"];
      console.log(x, y)
      drawGrid[y * cols + x] = {"row": y, "col": x, "occupied": true};
    }
    console.log(drawGrid);
    const gridItems = drawGrid.map((cell) => {
      const key = cell.row.toString() + '-' + cell.col.toString() + (cell.occupied ? "occ" : "")
      var className;
      if (cell.wall) {
        className = "Wall Cell";
      } else {
        className = cell.occupied ? "Occupied Cell" : "Cell";
      }
      return <div
          key={key}
          className={className}></div>
    })
    return (
      <div>
        <GameController players={this.props.players} ws={this.props.ws} roomId={this.props.roomId}/>
        <MessageList messageLog={this.props.messageLog}/>  
        <MessageForm ws={this.props.ws}/>
        <div
          className="Container"
          tabIndex="0"
          onKeyDown={this.keyPressed}
        >
          <div className="Board">
            {gridItems}
          </div>
        </div>
      </div>
    );  
  }
}

export default Game;
