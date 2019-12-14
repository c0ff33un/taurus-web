import React from 'react'
import Game from '../Game/Game'

import { Button, CssBaseline, Container} from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';

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
class CreateRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {code: ''}
  }

  handleClick = () => {
    const options = {
      method : 'POST',
    }
    const gameURL = process.env.REACT_APP_GAME_URL
    fetch(`http${gameURL}/room`, options)
    .then(response => {
      console.log(response.body)
      return response.json()
    })
    .then(json => {
      this.setState({code: json.id})
    })
  }

  render () {
    const classes = withStyles(styles)
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
        <Button 
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={this.handleClick}
        >
          Create Room
        </Button>
        {this.state.code !== '' && 
          <p>Code:{this.state.code} </p>
        }
        </div>
      </Container>
    );
  }
}

class JoinRoomForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {"roomId": '', "token": ''}
  }

  handleChange = (event, name) => {
    this.setState({[name] : event.target.value});
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const { roomId } = this.state
    var token
    console.log('NO_AUTH', process.env.NO_AUTH)
    if (process.env.NO_AUTH) {
      token = '1';
    } else {
      token = JSON.parse(localStorage.getItem("user")).token
    }
    
    this.props.connect(roomId, token);
  }

  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Room:
          <input type="text" value={this.state.roomId} 
          onChange={(event) => this.handleChange(event, "roomId")} />
        </label>
        <input type="submit" value="Join Room" />
      </form>
    );
  }
}

class Lobby extends React.Component {
  render() {
    const room = true;
    return (
      <div>
        Lobby:
        <CreateRoom />
        <JoinRoomForm connect={this.props.connect}/>
        {room &&
          <Game 
            ws={this.props.ws} 
            roomId={this.props.roomId} 
            messageLog={this.props.messageLog} 
            players={this.props.players} 
            grid={this.props.grid}
          />
        }
      </div>
    );
  }
}



export default Lobby;
