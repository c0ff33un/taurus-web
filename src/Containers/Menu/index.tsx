import React from 'react'
import { Redirect } from 'react-router-dom'
import { Button, TextField } from 'Components'
import { Container, Typography, Grid } from '@material-ui/core'
import { WithStyles, withStyles } from '@material-ui/core/styles'
import { connect, batch, useSelector, useDispatch } from 'react-redux'
import { Dispatch } from 'redux'
import { startLoading, finishLoading } from 'Redux/ducks/loading'
import { invalidateGame } from 'Redux/ducks/gameController'
import { invalidateMessages } from 'Redux/ducks/messageLog'
import { wsConnect } from 'Redux/ducks/websockets'
import { setUnAuthenticated } from 'Redux/ducks/authenticated'

import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import styles from '../styles'

function CreateRoom() {
  const CREATE_ROOM = gql`
    mutation {
      room {
        id
      }
    }
  `
  const [createRoom, { data }] = useMutation(CREATE_ROOM)

  const dispatch = useDispatch()
  const loading = useSelector((state: any) => {
    return state.loading
  })
  if (loading && data) {
    dispatch(finishLoading())
    console.log(data)
    const roomId = data.room.id
    dispatch(wsConnect(roomId))
  }
  return (
    <Button
      color="primary"
      onClick={() => {
        dispatch(startLoading())
        dispatch(invalidateGame())
        dispatch(invalidateMessages())
        createRoom()
      }}
    >
      Create Game
    </Button>
  )
}

interface Props extends WithStyles<typeof styles> {
  dispatch: Dispatch
  connected: boolean
}
interface State { roomId: string }
class Menu extends React.Component<Props, State> {
  readonly state: State = {
    roomId: ''
  }

  performLogout = (event: any) => {
    event.preventDefault()
    const { dispatch } = this.props
    dispatch(startLoading())
    // still need to make request to API and clean Apollo Local Cache
    batch(() => {
      dispatch(setUnAuthenticated())
      dispatch(finishLoading())
    })
  }

  joinRoom = (event: any) => {
    event.preventDefault()
    const { roomId } = this.state
    const { dispatch } = this.props
    batch(() => {
      dispatch(startLoading())
      dispatch(invalidateGame())
      dispatch(invalidateMessages())
      dispatch(wsConnect(roomId))
    })
  }

  handleSubmit = (event: any) => {
    event.preventDefault()
  }

  render() {
    const { classes, connected } = this.props
    return (
      <>
        {connected ? (
          <Redirect to={'/game'} />
        ) : (
          <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
              <Typography variant="h2">τrus</Typography>
              <form
                className={classes.form}
                onSubmit={this.handleSubmit}
                noValidate
              >
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Button color="primary">Profile</Button>
                  </Grid>
                  <Grid item xs={12}>
                    <CreateRoom />
                  </Grid>
                  <Grid item container direction="row" justify="space-between">
                    <Grid item>
                      <TextField
                        name="roomId"
                        label="Room Id"
                        type="string"
                        id="roomid"
                        onChange={event => this.setState({roomId: event.target.value})}
                        value={this.state.roomId}
                      />
                    </Grid>
                    <Grid item>
                      <Button
                        style={{ height: '100%' }}
                        disabled={this.state.roomId === ''}
                        color="primary"
                        size="large"
                        className={'none'}
                        onClick={this.joinRoom}
                      >
                        Join Game
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Button color="secondary" onClick={this.performLogout}>
                      Logout
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </div>
          </Container>
        )}
      </>
    )
  }
}

const mapStateToProps = (state: any) => {
  return { connected: state.websockets.connected }
}

export default connect(mapStateToProps)(withStyles(styles)(Menu))
