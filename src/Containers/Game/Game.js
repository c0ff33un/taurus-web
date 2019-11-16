import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import './Game.css'
import { Button, Container, Grid, TextField, Typography, List, ListItem } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

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

class GameController extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      rows : HEIGHT / CELL_SIZE, 
      cols : WIDTH / CELL_SIZE
    }
  }

  randomGrid = () => {
    const { rows, cols } = this.state
    const n = rows * cols;
    const grid = [];
    for (let i = 0; i < n; ++i) {
      grid.push({wall: Math.random() >= 0.5})
    }
    return grid
  }

  setupGame = async (event) => {
    event.preventDefault();
    
    // Grid endponint from the API
    const apiURL = process.env.REACT_APP_API_URL

    const seed = Math.floor( Math.random() * Math.pow(10,18))
    const { rows, cols } = this.state;

    const mutation = {
      "query" : `mutation{
        grid(settings:{seed: "${seed}" w:"${cols}" h:"${rows}"}){seed exit{x y} matrix}}`
    }

    const { token } = this.props
    var options = {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(mutation),
    }

    let response
    try {
      response = await fetch(apiURL, options).then( res => res.json())
    } catch(e) {
      throw new Error(e)
    }

    let mat = response.data.grid.matrix
    let exit = response.data.grid.exit

    //Temporally beginPosition search from players

    var currentDistance = 0
    var currentBegin = exit

    for (let x = 0; x < rows; ++x) {
      for (let y = 0; y < cols; ++y) {
        let pos = x * cols + y
        if (mat[pos] === false) {
          let manhattanDistance = Math.abs(x - exit.x ) + Math.abs( y - exit.y )
          if (manhattanDistance > currentDistance) {
            currentDistance = manhattanDistance
            currentBegin = { x, y }
          }
        }
      }
    }

    //game setup through the websocket
    
    const options1 = {
      method : 'PUT',
      body : JSON.stringify({rows: parseInt(rows),
        cols: parseInt(cols),
        exit: exit,
        begin: currentBegin,
        grid: mat
      })
    }
    const { roomId } = this.props
    const gameURL = process.env.REACT_APP_GAME_URL;
    fetch(`http://${gameURL}/room/setup/${roomId}`, options1)
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
    const { roomId } = this.props;
    const options = {
      method : 'PUT',
    }
    const apiURL = process.env.REACT_APP_GAME_URL
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

  goToMenu = () => {
    if (this.props.ws !== null) {
     this.props.ws.close() // clears room info
    }
    this.props.history.push("/menu")
  }

  handleChange = (event, name) => {
    this.setState({[name] : event.target.value})
  }

  render () {
    const { classes } = this.props
    return (
      <Fragment>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1">
              RoomId: {this.props.roomId}
            </Typography>
          </Grid>
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
              color="primary"
              className={classes.submit}
              onClick={this.startGame}
            >
              Start Game
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button 
              fullWidth 
              variant="contained" 
              color="primary" 
              className={classes.customBtn} 
              onClick={this.goToMenu} 
            >
              Return to menu
            </Button>  
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

class MessageList extends React.Component {

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }
  
  componentDidMount() {
    this.scrollToBottom();
  }
  
  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {
    const { messageLog } = this.props
    console.log(messageLog)
    return (
      // <div>

      // </div>
      <List component="nav" style={{maxHeight: "150px", overflow: "auto"}}>
          <div style={{ float:"left", clear: "both" }}
            ref={(el) => { this.messagesEnd = el; }}>
          </div> 
        <ListItem>
        <Typography component="div">
          {messageLog.map((item, index) => <p key = {index} > {item} </p>)}
        </Typography>
 
        </ListItem>
      </List>

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
    const { token, players, classes } = this.props;
    const { cols } = this.state;
    const { grid } = this.props;
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
          <GameController token={token} classes={classes} history={this.props.history} players={this.props.players} ws={this.props.ws} roomId={this.props.roomId}/>
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

function mapStateToProps(state) {
  const { user } = state.authentication
  return { token: user.token }
}

export default connect(mapStateToProps)(withStyles(styles)(Game))
