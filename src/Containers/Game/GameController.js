import React, { Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import { connect, useDispatch, useSelector } from 'react-redux'
import { startLoading, finishLoading } from '../../Redux/ducks/loading'
import { invalidateGame } from '../../Redux/ducks/gameController'
import { invalidateMessages } from '../../Redux/ducks/messageLog'
import { wsMessage, wsDisconnect } from '../../Redux/ducks/websockets'

import { Button, Grid, Typography, Dialog, DialogActions, DialogContent, DialogContentText } from '@material-ui/core'
import { gql } from 'apollo-boost'
import { useMutation } from '@apollo/react-hooks';
const CELL_SIZE = 25
const WIDTH = 625
const HEIGHT = 625


function SetupGame(props) {
  const { classes } = props
  const { room, loading, gameRunning } = useSelector((state) => { 
    return { room: state.websockets.roomId, loading: state.loading, gameRunning: state.gameController.gameRunning } 
  })
  const seed = Math.floor(Math.random() * Math.pow(10, 9)) 
  const rows = HEIGHT / CELL_SIZE
  const cols = WIDTH / CELL_SIZE

  const SETUP_GAME = gql`
    mutation {
      roomSetup(room: "${room}", seed: ${seed}, rows: ${rows}, cols: ${cols}) {
        id
      }
    }
  `
  const [ setupGame, { loading : loadingMutation, data } ] = useMutation(SETUP_GAME)
  const dispatch = useDispatch()
  if (loading && data) {
    dispatch(finishLoading())
  }
  return (
    <Button
      fullWidth
      disabled={loading || gameRunning}
      variant="contained"
      color="primary"
      className={classes.submit}
      onClick={() => {
        dispatch(startLoading())
        setupGame()
      }}
    >
      Setup Game
    </Button>
  )
}


function StartGame(props) {
  const { classes } = props
  const { room, loading, gameRunning } = useSelector((state) => { 
    return { room: state.websockets.roomId, loading: state.loading, gameRunning: state.gameController.gameRunning } 
  })

  const START_GAME = gql`
    mutation {
      roomStart(room: "${room}") {
        id
      }
    }
  `
  const [ startGame, { loading : loadingMutation, data } ] = useMutation(START_GAME)
  const dispatch = useDispatch()
  if (loading && data) {
    dispatch(finishLoading())
  }
  return (
    <Button
      fullWidth
      disabled={loading || gameRunning}
      variant="contained"
      color="primary"
      className={classes.submit}
      onClick={() => {
        dispatch(startLoading())
        startGame()
      }}
    >
      Start Game
    </Button>
  )
}

class GameController extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
  }

  startGame = event => {
    event.preventDefault()
    const { dispatch, roomId } = this.props
    const options = {
      method: 'PUT',
    }
    const gameAPIURL = process.env.REACT_APP_GAME_API_URL
    dispatch(startLoading())
    fetch(`${gameAPIURL}/room/start/${roomId}`, options)
      .then(response => {
        console.log(response.body)
        return response.json()
      })
      .then(json => {
        console.log(json)
        dispatch(finishLoading())
        return json
      })
      .catch(error => {
        dispatch(finishLoading())
        console.log(error)
      })
  }


  goToMenu = () => {
    const { dispatch } = this.props
    dispatch(wsMessage({ type: "leave" }))
    dispatch(wsDisconnect())
    dispatch(invalidateGame())
    dispatch(invalidateMessages())
  }

  goToMenuDialog = () => {
    const { length } = this.props
    if (length === 1) {
      this.setState({ open: true })
      return
    }
    this.goToMenu()
  }

  handleAgree = () => {
    this.goToMenu()
    this.setState({ open: false })
  }

  handleCancel = () => {
    this.setState({ open: false })
  }

  handleChange = (event, name) => {
    this.setState({ [name]: event.target.value })
  }

  render() {
    const { loading, classes, connected, gameRunning, gameSetup } = this.props
    return (
      <Fragment>
        {connected ? (
          <Fragment>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  RoomId: {this.props.roomId}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <SetupGame classes={classes} />
              </Grid>
              <Grid item xs={6}>
                <StartGame classes={classes} />
              </Grid>
              <Grid item xs={12}>
                <div>
                  <Button
                    fullWidth
                    disabled={loading}
                    variant="contained"
                    color="secondary"
                    className={classes.customBtn}
                    onClick={this.goToMenuDialog}
                  >
                    Return to menu
                  </Button>
                  <Dialog
                    open={this.state.open}
                    onClose={this.handleCancel}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        You are the last player in the room. If you leave, the room will be destroyed.
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={this.handleCancel} color="primary">
                        Cancel
                      </Button>
                      <Button onClick={this.handleAgree} color="primary" autoFocus>
                        Leave
                      </Button>
                    </DialogActions>
                  </Dialog>
                </div>
              </Grid>
            </Grid>
          </Fragment>
        ) : (
          <Redirect to={'/menu'} />
        )}
      </Fragment>
    )
  }
}

function mapStateToProps(state) {
  const { loading, authentication, gameController, websockets } = state
  return {
    token: authentication.user.token,
    loading,
    ...gameController,
    ...websockets,
  }
}

export default connect(mapStateToProps)(GameController)
