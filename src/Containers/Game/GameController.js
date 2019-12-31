import React from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { startLoading, finishLoading } from 'Redux/ducks/loading'
import { invalidateGame } from 'Redux/ducks/gameController'
import { invalidateMessages } from 'Redux/ducks/messageLog'
import { wsMessage, wsDisconnect } from 'Redux/ducks/websockets'
import { Button as MaterialButton, Grid, Typography, Dialog, DialogActions, DialogContent, DialogContentText } from '@material-ui/core'
import { Button } from 'Components'

import SetupGame from './SetupGame'
import StartGame from './StartGame'

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
    const { connected } = this.props
    return (
      <>
        {connected ? (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  RoomId: {this.props.roomId}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <SetupGame />
              </Grid>
              <Grid item xs={6}>
                <StartGame />
              </Grid>
              <Grid item xs={12}>
                <div>
                  <Button
                    color="secondary"
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
                      <MaterialButton onClick={this.handleCancel} color="primary">
                        Cancel
                      </MaterialButton>
                      <MaterialButton onClick={this.handleAgree} color="primary" autoFocus>
                        Leave
                      </MaterialButton>
                    </DialogActions>
                  </Dialog>
                </div>
              </Grid>
            </Grid>
          </>
        ) : (
          <Redirect to={'/menu'} />
        )}
      </>
    )
  }
}

function mapStateToProps(state) {
  const { gameController, websockets } = state
  return {
    ...gameController,
    ...websockets,
  }
}

export default connect(mapStateToProps)(GameController)
