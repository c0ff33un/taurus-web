import React, { Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import {Button, TextField, Container, Typography, Grid} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { logout } from '../../Redux/ducks/authentication'
import { startLoading, finishLoading } from '../../Redux/ducks/loading'
import { invalidateGame } from '../../Redux/ducks/gameController'
import { invalidateMessages } from '../../Redux/ducks/messageLog'
import { wsConnect } from '../../Redux/ducks/websockets'
import { connect, batch, useSelector, useDispatch } from 'react-redux'

import { gql } from 'apollo-boost'
import { useMutation } from '@apollo/react-hooks';

const styles = theme => ({
  body: {
      backgroundColor: theme.palette.common.white,
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

function CreateRoom(props) {
  const { classes } = props
  const CREATE_ROOM = gql`
    mutation {
      room {
        id
      }
    }
  `
  const [ createRoom, { data } ] = useMutation(CREATE_ROOM)

  const dispatch = useDispatch()
  const loading = useSelector(state => state.loading)

  if (loading && data) {
    dispatch(finishLoading())
  }
  return (
    <Button 
      fullWidth 
      disabled={loading}
      variant="contained" 
      color="primary" 
      className={classes.customBtn} 
      onClick={() => { 
        dispatch(startLoading())
        createRoom()
      }}>
      Create Room
    </Button>
  )
}

class Menu extends React.Component {
  constructor(props){
    super(props)
    this.performLogout = this.performLogout.bind(this)
    this.state = { roomId: '' }
  }

  performLogout = (e) => {
    e.preventDefault()
    const { dispatch } = this.props
    dispatch(startLoading())
    dispatch(logout())
  }

  createRoom = (event) => {
    const { token, dispatch } = this.props
    dispatch(startLoading())
    dispatch(invalidateGame())
    dispatch(invalidateMessages())
    // useful for developing without deploying local API
    const apiURL = process.env.REACT_APP_API_URL
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
      const roomId = json.data.room.id
      dispatch(wsConnect({ token, roomId }))
    })
    .catch(error => {
      alert('Error communicating with game server.')
      dispatch(finishLoading())
    })
  }
  
  joinRoom = (event) => {
    event.preventDefault()
    const { roomId } = this.state
    const { token, dispatch } = this.props
    batch(() => {
      dispatch(startLoading())
      dispatch(invalidateGame())
      dispatch(invalidateMessages())
      dispatch(wsConnect({ token, roomId }))
    })
  }

  goToStatistics = (event) => {
    event.preventDefault()
    this.props.history.push('/stats') 
  }

  handleChange = (event, name) => {
    event.preventDefault()
    this.setState({[name] : event.target.value})
  }

  handleSubmit = (event) => {
    event.preventDefault()
  }

  render() {
    const { classes, connected, loading } = this.props
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
                        style={{height: "100%"}}
                        disabled={loading || this.props.guest }
                        fullWidth 
                        variant="contained" 
                        color="primary" 
                        size="large"
                        onClick={this.goToStatistics}>
                        My Statistics 
                      </Button>
                  </Grid>  
                  <Grid item xs={12}>
                      <Button 
                        fullWidth 
                        disabled={loading}
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
                        disabled={loading}
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
                          disabled={loading || this.state.roomId === ""}
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
                      disabled={loading}
                      variant="contained" 
                      color="secondary" 
                      className={classes.customBtn} 
                      onClick={this.performLogout}
                    >
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
  const { logginIn, jwt } = state.authentication
  const { loading, websockets } = state
  console.log(state.authentication)
  return { logginIn, token: jwt, loading, connected: websockets.connected }
}

export default connect(mapStateToProps) ( withStyles(styles)(Menu))
