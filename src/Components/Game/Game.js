import React from 'react';
import './Game.css'
import { Button, Container, Grid, TextField, CssBaseline } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';

const CELL_SIZE = 20;
const WIDTH = 800;
const HEIGHT = 800;

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
    fetch(`http://${apiURL}/room/setup?id=${roomId}`, options)
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
    fetch(`http://${apiURL}/room/start?id=${roomId}`, options)
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

  render () {
    const classes = withStyles(styles)
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}> 
          <form className={classes.form} noValidate onSubmit={this.handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="rows"
              label="Rows"
              type="number"
              id="rows"
              onChange={(e)=>{
                this.setState({rows: e.target.value});
              }}
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
              onChange={(e)=>{
                this.setState({cols: e.target.value});
              }}
              value={this.state.cols}
            />
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Setup Game
                </Button>
              </Grid>
            </Grid>
          </form>
          <form className={classes.form} onSubmit={this.startGame}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
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

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.rows = HEIGHT / CELL_SIZE;
    this.cols = WIDTH / CELL_SIZE;
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
    const { classes, players } = this.props
    let v = []
    for (var key in players) {
      v.push(<Player 
        x = {players[key]["x"]} 
        y = {players[key]["y"]} />)
    }
    return (
      <div>
        <div 
          className = "Board" 
          style = {{ width: WIDTH, height: HEIGHT, backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`}}
          tabIndex = "0"
          onKeyDown = {this.keyPressed}
        >
        </div>
        {v}
        <GameController players = {this.props.players} ws = {this.props.ws} roomId = {this.props.roomId}/>
      </div>
    );  
  }
}

export default Game;
