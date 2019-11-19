import React, { Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import {Button, TextField, Container, Typography, Grid} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { logout } from '../../Redux/ducks/authentication'
import { loadingActions } from '../../Redux/ducks/loading'
import { wsConnect } from '../../Redux/ducks/websockets'
import { connect } from 'react-redux'

const styles = theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  paper: {
    marginTop: theme.spacing(16),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
});

class Menu extends React.Component {
  constructor(props){
    super(props)
    this.performLogout = this.performLogout.bind(this)
    this.state = { roomId: '' }
  }

  performLogout = (e) => {
    e.preventDefault()
    this.props.startLoading()
    this.props.logout()
  }

  createRoom = (event) => {
    const apiURL = process.env.REACT_APP_API_URL
    const token = this.props.token
    const options = {
      headers : {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${token}`
      },
      method : 'POST',
      body : JSON.stringify({"query": "mutation{room{id}}"})
    }
    this.props.startLoading()
    fetch(`${apiURL}`, options)
    .then(response => response.json())
    .then(json => {
      const roomId = json.data.room.id
      this.props.wsConnect({ token, roomId })
    })
    .catch(error => {
      this.props.finishLoading()
    })
  }
  
  joinRoom = (event) => {
    event.preventDefault()
    const { roomId } = this.state
    const token = this.props.token
    this.props.startLoading()
    console.log(roomId)
    this.props.wsConnect({ token, roomId })
 }

  handleChange = (event, name) => {
    event.preventDefault()
    this.setState({[name] : event.target.value})
  }

  handleSubmit = (event) => {
    event.preventDefault()
  }

  render() {
    const { classes, connected } = this.props
    if (connected) {
      console.log('redirecting to game')
    }
    return (
      <Fragment>
        {connected? (
          <Redirect to={'/game'} />
        ) : (
          <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
              <Typography  variant="h2">
                τrus
              </Typography>
              <form className={classes.form} onSubmit={this.handleSubmit} noValidate>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                      <Button 
                        fullWidth 
                        disabled={this.props.loading}
                        variant="contained" 
                        color="primary" 
                        className={classes.customBtn} 
                        onClick={this.createRoom}>
                        Create Room
                      </Button>
                  </Grid>
                  <Grid item container direction='row' justify='space-between'>
                    <Grid item>
                      <TextField
                        disabled={this.props.loading}
                        variant="outlined"
                        required
                        name="roomId"
                        label="Room Id"
                        type="string"
                        id="roomid"
                        onChange={(event) => this.handleChange(event, "roomId")}
                        value={this.state.roomId}
                      />
                    </Grid>
                    <Grid item>
                        <Button
                          style={{height: "100%"}}
                          disabled={this.props.loading || this.state.roomId === ""}
                          fullWidth 
                          variant="contained" 
                          color="primary" 
                          size="large"
                          onClick={this.joinRoom}>
                          Join Room
                        </Button>
                    </Grid>  
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      color="secondary" 
                      className={classes.customBtn} 
                      onClick={this.performLogout}>
                          Logout
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </div>
          </Container>
        )}
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  const { logginIn, user } = state.authentication
  const { loading, websockets } = state
  return { logginIn, token: user.token, loading, connected: websockets.connected }
}

export default connect(mapStateToProps, {
  logout,
  startLoading: loadingActions.startLoading,
  finishLoading: loadingActions.finishLoading,
  wsConnect
}) ( withStyles(styles)(Menu))
