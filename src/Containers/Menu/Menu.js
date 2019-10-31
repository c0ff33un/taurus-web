import React from 'react';
import { Button, CssBaseline, TextField, Container, Typography, Grid} from '@material-ui/core';
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
    const apiURL = process.env.REACT_APP_API_URL
    const token = JSON.parse(localStorage.getItem("user")).token
    const options = {
      headers : {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${token}`
      },
      method : 'POST',
      body : JSON.stringify({"query": "mutation{room{id}}"})
    }
    fetch(`${apiURL}`, options)
    .then(response => response.json())
    .then(json => {
      const roomid = json.data.room.id
      console.log(json.data.room.id)
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
    event.preventDefault()
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
                name="roomId"
                label="Room Id"
                type="string"
                id="roomid"
                onChange={(event) => this.handleChange(event, "roomid")}
                value={this.state.roomid}
              />
            </form>
          </div>
          <Grid container spacing={1}>
            
            <Grid item xs={6}>
                <Button fullWidth variant="contained" color="primary" className={classes.customBtn} onClick={this.createRoom}>
                  Create Room
                </Button>
            </Grid>
            <Grid item xs={6}>
                <Button fullWidth variant="contained" color="primary" className={classes.customBtn} onClick={this.joinRoom}>
                  Join Room
                </Button>
            </Grid>
            <Button fullWidth variant="contained" color="secondary" className={classes.customBtn} onClick={this.performLogout}>
                  Logout
            </Button>
          </Grid>
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
