import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Button, ButtonLink, TextField } from 'Components'
import { Container, Typography, Grid } from '@material-ui/core'
import { batch, useDispatch } from 'react-redux'
import { startLoading, finishLoading } from 'Redux/ducks/loading'
import { invalidateGame } from 'Redux/ducks/gameController'
import { invalidateMessages } from 'Redux/ducks/messageLog'
import { wsConnect } from 'Redux/ducks/websockets'
import { setUnAuthenticated } from 'Redux/ducks/authenticated'
import { useTypedSelector } from 'Redux'
import { useStyles } from '../styles'

import CreateRoom from './CreateRoom'

const Menu = () => {
  const [roomId, setRoomId] = useState('')
  const dispatch = useDispatch()
  const classes = useStyles()
  const connected = useTypedSelector(state => state.websockets.connected)

  const performLogout = (event: any) => {
    event.preventDefault()
    dispatch(startLoading())
    // still need to make request to API and clean Apollo Local Cache
    batch(() => {
      dispatch(setUnAuthenticated())
      dispatch(finishLoading())
    })
  }

  const joinRoom = (event: any) => {
    event.preventDefault()
    batch(() => {
      dispatch(startLoading())
      dispatch(invalidateGame())
      dispatch(invalidateMessages())
      dispatch(wsConnect(roomId))
    })
  }


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
              onSubmit={e => e.preventDefault()}
              noValidate
            >
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <ButtonLink color="primary" to="/profile">Profile</ButtonLink>
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
                      onChange={e => setRoomId(e.target.value)}
                      value={roomId}
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      style={{ height: '100%' }}
                      disabled={roomId === ''}
                      color="primary"
                      size="large"
                      className={'none'}
                      onClick={joinRoom}
                    >
                      Join Game
                    </Button>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Button color="secondary" onClick={performLogout}>
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

export default Menu
