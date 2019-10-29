import React from 'react';
import {Avatar, Button, CssBaseline, TextField,
  Link, Grid, Box, Container, Typography} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import { userActions } from '../../Redux/Actions'
import { connect } from 'react-redux';

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
  customBtn: {
    margin: theme.spacing(1, 0, 2),
  },
});


class Menu extends React.Component {
  constructor(props){
    super(props);
    this.performLogout = this.performLogout.bind(this);
    this.state = { roomid: ''}
  }

  performLogout = (e) => {
    e.preventDefault()
    this.props.logout()
    this.props.history.push('/')
  }

  createRoom = (event) => {
    const options = {
      method : 'POST',
    }
    const apiURL = process.env.REACT_APP_GAME_URL
    console.log("apiURL: " + apiURL)
    fetch(`http://${apiURL}/room`, options)
    .then(response => {
      console.log(response.body)
      return response.json()
    })
    .then(json => {
      const roomid = json.id
      var token
      token = JSON.parse(localStorage.getItem("user")).token
      this.props.connect(roomid, token);
      this.props.history.push("/game")
    })
  }
  
  joinRoom = (event) => {
    event.preventDefault()
    const { roomid } = this.state
    const token = JSON.parse(localStorage.getItem("user")).token
    this.props.connect(roomid, token);
    this.props.history.push("/game")
  }

  handleChange = (event, name) => {
    this.setState({[name] : event.target.value})
  }

  render() {
    const { classes } = this.props;
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography  variant="h2">
            τrus
          </Typography>
          <div className={classes.paper}>
            <form className={classes.form} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="rows"
                label="Room Id"
                type="string"
                id="roomid"
                onChange={(event) => this.handleChange(event, "roomid")}
                value={this.state.roomid}
              />
            </form>
          </div>
          <Button fullWidth variant="contained" color="primary" className={classes.customBtn} onClick={this.joinRoom}>
            Join Room
          </Button>
      <Button fullWidth variant="contained" color="primary" className={classes.customBtn} onClick={this.createRoom}>
      Create Room
          </Button>
          <Button fullWidth variant="contained" color="secondary" className={classes.customBtn} onClick={this.performLogout}>
            Logout
          </Button>
        </div>
      </Container>
    );
  }
}

function mapState(state) {
  const { logginIn } = state.authentication;
  return { logginIn }
}

const menuConnection = connect(mapState, {
  logout: userActions.logout
}) ( withStyles(styles)(Menu))

export default menuConnection
