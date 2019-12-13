import React, { Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { startLoading, finishLoading } from '../../Redux/ducks/loading'
import { invalidateGame } from '../../Redux/ducks/gameController'
import { invalidateMessages } from '../../Redux/ducks/messageLog'
import { wsMessage, wsDisconnect } from '../../Redux/ducks/websockets'

import { Button, Grid, Typography, Dialog, DialogActions, DialogContent, DialogContentText } from '@material-ui/core'
const CELL_SIZE = 25
const WIDTH = 625
const HEIGHT = 625

class GameController extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      rows: HEIGHT / CELL_SIZE,
      cols: WIDTH / CELL_SIZE,
      open: false
    }
  }

  setupGame = async event => {
    event.preventDefault()

    // Grid endponint from the API
    const apiURL = process.env.REACT_APP_API_URL

    const seed = Math.floor(Math.random() * Math.pow(10, 18))
    const { rows, cols } = this.state

    const mutation = {
      query: `mutation{
        grid(settings:{seed: "${seed}" w:"${cols}" h:"${rows}"}){seed exit{x y} matrix}}`,
    }

    const { dispatch, token } = this.props
    var options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(mutation),
    }
    dispatch(startLoading())
    let response
    try {
      response = await fetch(apiURL, options).then(res => res.json())
    } catch (e) {
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
          let manhattanDistance = Math.abs(x - exit.x) + Math.abs(y - exit.y)
          if (manhattanDistance > currentDistance) {
            currentDistance = manhattanDistance
            currentBegin = { x, y }
          }
        }
      }
    }

    //game setup through the websocket

    const options1 = {
      method: 'PUT',
      body: JSON.stringify({
        rows: parseInt(rows),
        cols: parseInt(cols),
        exit: exit,
        begin: currentBegin,
        grid: mat,
      }),
    }
    const { roomId } = this.props
    const gameURL = process.env.REACT_APP_GAME_URL
    fetch(`http${gameURL}/room/setup/${roomId}`, options1)
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
        console.log(error)
        dispatch(finishLoading())
      })
  }

  startGame = event => {
    event.preventDefault()
    const { dispatch, roomId } = this.props
    const options = {
      method: 'PUT',
    }
    const gameURL = process.env.REACT_APP_GAME_URL
    dispatch(startLoading())
    fetch(`http${gameURL}/room/start/${roomId}`, options)
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
    const { classes, connected, gameSetup } = this.props
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
                <Button
                  fullWidth
                  disabled={this.props.loading || this.props.gameRunning}
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
                  disabled={
                    this.props.loading ||
                    !this.props.gameSetup ||
                    this.props.gameRunning
                  }
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={this.startGame}
                >
                  Start Game
                </Button>
              </Grid>
              <Grid item xs={12}>
                <div>
                  <Button
                    fullWidth
                    disabled={this.props.loading}
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
